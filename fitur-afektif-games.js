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
    let uName = (sessionStorage.getItem("username") || "admin").trim();
    let cleanKey = (typeof window.normalisasiUsernameSiswa === "function")
        ? window.normalisasiUsernameSiswa(uName)
        : uName.toLowerCase();
    let keyHariIni = window.dapatkanKunciHariCheckin();

    let namaLengkap = uName;
    let kelasSiswa = "Umum";

    let akunObj = null;
    if (window.akunSiswaData) {
        akunObj = window.akunSiswaData[uName] || window.akunSiswaData[cleanKey] || null;
        if (!akunObj) {
            let kFound = Object.keys(window.akunSiswaData).find(function(k) {
                return k.toLowerCase() === cleanKey;
            });
            if (kFound) akunObj = window.akunSiswaData[kFound];
        }
    }
    let lbObj = null;
    if (window.leaderboardSiswaData) {
        lbObj = window.leaderboardSiswaData[uName] || window.leaderboardSiswaData[cleanKey] || null;
    }

    if (akunObj) {
        namaLengkap = akunObj.namaLengkap || uName;
        kelasSiswa = akunObj.kelas || "Umum";
    } else if (lbObj) {
        namaLengkap = lbObj.namaLengkap || uName;
        kelasSiswa = lbObj.kelas || "Umum";
    }

    let now = new Date();
    let waktuStr = String(now.getDate()).padStart(2, '0') + '/' +
                   String(now.getMonth() + 1).padStart(2, '0') + '/' +
                   now.getFullYear() + ' ' +
                   String(now.getHours()).padStart(2, '0') + ':' +
                   String(now.getMinutes()).padStart(2, '0');

    let safeUserId = String(cleanKey || "siswa").replace(/[^a-zA-Z0-9_-]/g, "_");
    let safeRecordId = "af_" + Date.now() + "_" + safeUserId;

    let recordAfektif = {
        id: safeRecordId,
        username: cleanKey || uName,
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

    if (!Array.isArray(window.adminAfektifData)) {
        window.adminAfektifData = (typeof window.normalisasiArrayDataFirebase === "function")
            ? window.normalisasiArrayDataFirebase(window.adminAfektifData)
            : [];
    }
    window.adminAfektifData.push(recordAfektif);

    // Kirim HANYA 1 entri unik ini ke node resmi admin_afektif_siswa agar 100% aman dan tidak menimpa siswa lain
    let guru = String(window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika").trim().toLowerCase();
    let pathAfektif = "data_guru/" + guru + "/admin_afektif_siswa/" + safeRecordId;

    let kirimCheckinKeServer = function() {
        if (typeof window.tulisDataRestFirebase === "function") {
            window.tulisDataRestFirebase(pathAfektif, recordAfektif, "PUT");
        } else if (typeof window.simpanDataAfektifKeDB === "function") {
            window.simpanDataAfektifKeDB();
        }
    };

    if (stat === "siswa" && typeof window.pastikanAuthFirebaseSiswaAktif === "function") {
        window.pastikanAuthFirebaseSiswaAktif(kirimCheckinKeServer);
    } else {
        kirimCheckinKeServer();
    }

    if (stat === "siswa") {
        let cleanKey = (typeof window.normalisasiUsernameSiswa === "function") ? window.normalisasiUsernameSiswa(uName) : uName.toLowerCase();
        localStorage.setItem("checkin_done_" + (window.guruAktif || "mahardika") + "_" + uName, keyHariIni);
        localStorage.setItem("checkin_done_" + (window.guruAktif || "mahardika") + "_" + cleanKey, keyHariIni);

        let lbSiswa = (typeof window.sinkronkanObjekDualXPDanCoin === "function") ? window.sinkronkanObjekDualXPDanCoin(cleanKey) : null;
        if (lbSiswa) {
            lbSiswa.checkinTerakhir = keyHariIni;
        }
        if (typeof window.tambahXPSiswa === "function") {
            window.tambahXPSiswa(100, "checkin_harian");
        }
        if (typeof window.catatRiwayatAktivitasSiswa === "function") {
            let labelEm = (window.checkinState.ikon || "😊") + " " + (window.checkinState.labelEmosi || "Check-in");
            window.catatRiwayatAktivitasSiswa("checkin", "Check-in Harian (" + labelEm + ")", "Hadiah: +100 Coin & +100 XP");
        }
    }

    window.tutupModal("modal-checkin-siswa");
    window.perbaruiTombolCheckinUI();
    alert("🎉 Check-in Berhasil! Kamu mendapatkan +100 Coin dan +100 XP!");
};

// =========================================================================
// 4. DASBOR PERKEMBANGAN SISWA (KOGNITIF & AFEKTIF ANTI-MACET & AUTO-SYNC)
// =========================================================================
window._activeTabPerkembangan = "kognitif";
window._lastSyncPerkembanganMs = 0;

window.normalisasiArrayDataFirebase = function(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(function(item) { return item !== null && item !== undefined; });
    if (typeof raw === "object") {
        return Object.values(raw).filter(function(item) { return item !== null && item !== undefined; });
    }
    return [];
};

window.normalisasiDaftarNamaSiswaKelas = function(rawList) {
    let arr = window.normalisasiArrayDataFirebase(rawList);
    let hasil = [];
    arr.forEach(function(item) {
        let nama = (typeof item === "object" && item !== null) ? (item.nama || item.namaLengkap || "") : String(item || "");
        nama = nama.trim();
        if (nama) hasil.push(nama);
    });
    return hasil;
};

window.bukaModalPerkembanganSiswa = function() {
    window.bukaModal("modal-perkembangan-siswa");
    window.pastikanTombolRefreshPerkembanganAda();
    window.gantiTabPerkembanganSiswa(window._activeTabPerkembangan || "kognitif");
    window.sinkronkanDataPerkembanganDariServer(false);
};

window.pastikanTombolRefreshPerkembanganAda = function() {
    let btnExpKog = document.querySelector('#view-perkembangan-kognitif button[onclick*="exportExcelKognitifSiswa"]');
    if (btnExpKog && !document.getElementById("btn-sync-kognitif-srv")) {
        let btnSync = document.createElement("button");
        btnSync.id = "btn-sync-kognitif-srv";
        btnSync.type = "button";
        btnSync.className = "btn-action";
        btnSync.style.cssText = "background:#2980b9; width:auto; padding:8px 14px; font-size:12px; margin-right:6px;";
        btnSync.innerText = "🔄 Segarkan Data";
        btnSync.onclick = function() { window.sinkronkanDataPerkembanganDariServer(true); };
        btnExpKog.parentNode.insertBefore(btnSync, btnExpKog);
    }

    let btnExpAfe = document.querySelector('#view-perkembangan-afektif button[onclick*="exportExcelAfektifSiswa"]');
    if (btnExpAfe && !document.getElementById("btn-sync-afektif-srv")) {
        let btnSyncA = document.createElement("button");
        btnSyncA.id = "btn-sync-afektif-srv";
        btnSyncA.type = "button";
        btnSyncA.className = "btn-action";
        btnSyncA.style.cssText = "background:#2980b9; width:auto; padding:8px 14px; font-size:12px; margin-right:6px;";
        btnSyncA.innerText = "🔄 Segarkan Data";
        btnSyncA.onclick = function() { window.sinkronkanDataPerkembanganDariServer(true); };
        btnExpAfe.parentNode.insertBefore(btnSyncA, btnExpAfe);
    }
};

window.sinkronkanDataPerkembanganDariServer = function(forceRefresh) {
    let guru = String(window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika").trim().toLowerCase();
    let basePath = "data_guru/" + guru;
    let btnK = document.getElementById("btn-sync-kognitif-srv");
    let btnA = document.getElementById("btn-sync-afektif-srv");

    if (btnK) { btnK.disabled = true; btnK.innerText = "⏳ Memuat..."; }
    if (btnA) { btnA.disabled = true; btnA.innerText = "⏳ Memuat..."; }

    let tasks = [];
    let bacaAman = function(subPath, ttlCustom) {
        return new Promise(function(resolve) {
            if (typeof window.bacaDataRestFirebase !== "function") return resolve(null);
            window.bacaDataRestFirebase(basePath + "/" + subPath, function(val) {
                resolve(val);
            }, function() {
                resolve(null);
            }, { forceRefresh: Boolean(forceRefresh), ttlMs: forceRefresh ? 0 : (ttlCustom !== undefined ? ttlCustom : 60000) });
        });
    };

    // 1. Daftar Kelas & Siswa (admin_data)
    if (forceRefresh || !window.adminData || Object.keys(window.adminData).length === 0) {
        tasks.push(bacaAman("admin_data", 120000).then(function(val) {
            if (val && typeof val === "object") window.adminData = val;
        }));
    }

    // 2. Rekap Nilai Ujian & Meta Kolom Ledger (admin_rekap_nilai & admin_ledger_meta)
    if (forceRefresh || !window.adminRekapNilaiData || Object.keys(window.adminRekapNilaiData).length === 0) {
        tasks.push(bacaAman("admin_rekap_nilai", 60000).then(function(val) {
            if (val && typeof val === "object" && Object.keys(val).length > 0) {
                window.adminRekapNilaiData = val;
            }
        }));
    }
    if (forceRefresh || !window.adminLedgerMetaData || Object.keys(window.adminLedgerMetaData).length === 0) {
        tasks.push(bacaAman("admin_ledger_meta", 120000).then(function(val) {
            if (val && typeof val === "object") window.adminLedgerMetaData = val;
        }));
    }

    // 3. Data Check-in Afektif (NODE RESMI: admin_afektif_siswa — selalu segarkan agar check-in terbaru langsung tampil)
    tasks.push(bacaAman("admin_afektif_siswa", 15000).then(function(val) {
        let arr = window.normalisasiArrayDataFirebase(val);
        if (arr.length > 0 || forceRefresh) {
            window.adminAfektifData = arr;
        }
    }));

    // 4. Leaderboard Penuh (untuk XP & jumlah soal latihan mandiri)
    if (typeof window.muatLeaderboardPenuhSekali === "function" && (forceRefresh || !window._lastFullLBFetchTime)) {
        tasks.push(new Promise(function(resolve) {
            window.muatLeaderboardPenuhSekali(function() { resolve(); }, Boolean(forceRefresh));
        }));
    }

    Promise.all(tasks).then(function() {
        window._lastSyncPerkembanganMs = Date.now();
        if (btnK) { btnK.disabled = false; btnK.innerText = "🔄 Segarkan Data"; }
        if (btnA) { btnA.disabled = false; btnA.innerText = "🔄 Segarkan Data"; }

        if (window._activeTabPerkembangan === "afektif") {
            window.muatFilterKelasAfektif();
            window.renderTabelAfektifAdmin();
        } else {
            window.muatFilterKognitifAdmin();
            window.renderTabelKognitifAdmin();
        }
    });
};

window.gantiTabPerkembanganSiswa = function(tab) {
    window._activeTabPerkembangan = tab || "kognitif";
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
        if (Date.now() - (window._lastSyncPerkembanganMs || 0) > 15000) {
            window.sinkronkanDataPerkembanganDariServer(false);
        }
    }
};

window.gantiTabPerkembanganSiswa = function(tab) {
    window._activeTabPerkembangan = tab || "kognitif";
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

// Gabungkan daftar kelas dari seluruh sumber (adminData, adminRekapNilaiData, & leaderboardSiswaData)
window.kumpulkanSemuaKelasKognitif = function() {
    let kelasSet = new Set();
    Object.keys(window.adminData || {}).forEach(function(k) {
        if (k && String(k).trim()) kelasSet.add(String(k).trim());
    });
    Object.keys(window.adminRekapNilaiData || {}).forEach(function(k) {
        if (k && String(k).trim()) kelasSet.add(String(k).trim());
    });
    Object.values(window.leaderboardSiswaData || {}).forEach(function(item) {
        if (item && item.kelas && typeof window.apakahKelasSMALeaderboard === "function" && window.apakahKelasSMALeaderboard(item.kelas)) {
            kelasSet.add(String(item.kelas).trim());
        }
    });
    return Array.from(kelasSet).sort();
};

// --- MESIN ANALITIK PERKEMBANGAN KOGNITIF SISWA ---
window.muatFilterKognitifAdmin = function() {
    let selKls = document.getElementById("filter-kognitif-kelas");
    if (!selKls) return;
    let prevKls = selKls.value || "Semua";
    let semuaKelas = window.kumpulkanSemuaKelasKognitif();

    let htmlKls = '<option value="Semua">🏫 Semua Kelas</option>';
    semuaKelas.forEach(function(k) {
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

    let daftarKelas = filterKelas === "Semua" ? window.kumpulkanSemuaKelasKognitif() : [filterKelas];

    daftarKelas.forEach(function(kls) {
        try {
            if (typeof window.ambilKolomLedgerKelas === "function") {
                (window.ambilKolomLedgerKelas(kls) || []).forEach(function(u) { if (u) ujianSet.add(u); });
            }
            let objRekap = (typeof window.ambilObjekRekapKelas === "function")
                ? (window.ambilObjekRekapKelas(kls) || {})
                : ((window.adminRekapNilaiData && window.adminRekapNilaiData[kls]) || {});
            Object.keys(objRekap || {}).forEach(function(u) { if (u) ujianSet.add(u); });
        } catch (err) {}
    });

    let htmlUjian = '<option value="Semua">📚 Semua Evaluasi (Ledger NA)</option>';
    Array.from(ujianSet).forEach(function(u) {
        let sel = (u === prevUjian) ? "selected" : "";
        htmlUjian += '<option value="' + u + '" ' + sel + '>📝 ' + u + '</option>';
    });
    selUjian.innerHTML = htmlUjian;
};

// Kumpulkan profil kognitif lengkap satu siswa dari seluruh sumber nilai (aman dari null/undefined)
window.hitungProfilKognitifSatuSiswa = function(kls, namaSiswa) {
    let namaBersih = String(namaSiswa || "").trim();
    let kolomUjian = [];
    try {
        if (typeof window.ambilKolomLedgerKelas === "function") {
            kolomUjian = (window.ambilKolomLedgerKelas(kls) || []).slice();
        }
    } catch (e) {}

    let rekapKelas = {};
    try {
        rekapKelas = (typeof window.ambilObjekRekapKelas === "function")
            ? (window.ambilObjekRekapKelas(kls) || {})
            : ((window.adminRekapNilaiData && window.adminRekapNilaiData[kls]) || {});
    } catch (e) {}

    Object.keys(rekapKelas || {}).forEach(function(pkt) {
        let safePkt = (typeof window.sanitasiKeyRekapFirebase === "function") ? window.sanitasiKeyRekapFirebase(pkt).toLowerCase() : pkt.toLowerCase();
        let sudah = kolomUjian.some(function(x) {
            let sx = (typeof window.sanitasiKeyRekapFirebase === "function") ? window.sanitasiKeyRekapFirebase(x).toLowerCase() : String(x || "").toLowerCase();
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
        let objPaket = {};
        try {
            objPaket = (typeof window.ambilObjekRekapPaket === "function")
                ? (window.ambilObjekRekapPaket(kls, namaPaket) || {})
                : (rekapKelas[namaPaket] || {});
        } catch (e) {}

        let rec = null;
        try {
            rec = (typeof window.ambilDataSiswaDiObjekRekap === "function")
                ? window.ambilDataSiswaDiObjekRekap(objPaket, namaBersih)
                : objPaket[namaBersih];
        } catch (e) {}

        let rawNilai = rec ? (rec.nilaiAkhir !== undefined ? rec.nilaiAkhir : rec.nilai) : undefined;
        if (rec && rawNilai !== undefined && rawNilai !== null && rawNilai !== "") {
            let nilai = parseFloat(rawNilai);
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

    let hasilNA = { adaNilai: riwayatUjian.length > 0, nilaiAkhir: riwayatUjian.length > 0 ? (riwayatUjian.reduce(function(a, b) { return a + b.nilai; }, 0) / riwayatUjian.length) : 0 };
    try {
        if (typeof window.hitungNilaiAkhirRumusLedger === "function") {
            let calc = window.hitungNilaiAkhirRumusLedger(kls, namaBersih, kolomUjian);
            if (calc && typeof calc.adaNilai === "boolean") hasilNA = calc;
        }
    } catch (e) {}

    let lbSiswa = null;
    let trimTarget = namaBersih.toLowerCase();
    let klsNorm = String(kls || "").trim().toLowerCase();
    Object.values(window.leaderboardSiswaData || {}).forEach(function(item) {
        if (!item) return;
        let itemNama = String(item.namaLengkap || "").trim().toLowerCase();
        let itemKls = String(item.kelas || "").trim().toLowerCase();
        if (itemNama === trimTarget && itemKls === klsNorm) {
            lbSiswa = item;
        }
    });

    let statLatihan = (lbSiswa && lbSiswa.statSoal) ? lbSiswa.statSoal : { PG: 0, PGK: 0, IS: 0, Essay: 0 };
    let totalLatihan = (Number(statLatihan.PG) || 0) + (Number(statLatihan.PGK) || 0) + (Number(statLatihan.IS) || 0) + (Number(statLatihan.Essay) || 0);
    let xpSiswa = lbSiswa ? (Number(lbSiswa.xpTotal !== undefined ? lbSiswa.xpTotal : lbSiswa.xp) || 0) : 0;

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
        nama: namaBersih,
        kelas: String(kls || ""),
        riwayatUjian: riwayatUjian,
        jmlUjian: riwayatUjian.length,
        avgKuis: cntKuis > 0 ? (sumKuis / cntKuis) : null,
        avgPH: cntPH > 0 ? (sumPH / cntPH) : null,
        avgSAS: cntSAS > 0 ? (sumSAS / cntSAS) : null,
        adaNilai: hasilNA.adaNilai,
        nilaiAkhir: Number(hasilNA.nilaiAkhir) || 0,
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

    let semuaKelas = filterKelas === "Semua" ? window.kumpulkanSemuaKelasKognitif() : [filterKelas];
    let daftarProfil = [];

    semuaKelas.forEach(function(kls) {
        let siswaKelas = (window.adminData && window.adminData[kls])
            ? window.normalisasiDaftarNamaSiswaKelas(window.adminData[kls]).sort()
            : [];

        // Tambahkan siswa yang ada di rekap nilai meskipun belum masuk adminData
        let rekapKls = {};
        try {
            rekapKls = (typeof window.ambilObjekRekapKelas === "function")
                ? (window.ambilObjekRekapKelas(kls) || {})
                : ((window.adminRekapNilaiData && window.adminRekapNilaiData[kls]) || {});
        } catch (e) {}

        Object.values(rekapKls || {}).forEach(function(paketMap) {
            if (!paketMap || typeof paketMap !== "object") return;
            Object.keys(paketMap).forEach(function(nKey) {
                let rec = paketMap[nKey];
                let namaAsli = String((rec && rec.namaAsli) ? rec.namaAsli : nKey || "").trim();
                if (!namaAsli) return;
                let sudahAda = siswaKelas.some(function(s) { return s.toLowerCase() === namaAsli.toLowerCase(); });
                if (!sudahAda) siswaKelas.push(namaAsli);
            });
        });

        // Tambahkan siswa yang aktif di leaderboard kelas tersebut
        let klsLow = String(kls || "").trim().toLowerCase();
        Object.values(window.leaderboardSiswaData || {}).forEach(function(lbItem) {
            if (!lbItem || !lbItem.namaLengkap || String(lbItem.kelas || "").trim().toLowerCase() !== klsLow) return;
            let nLb = String(lbItem.namaLengkap).trim();
            if (!nLb) return;
            let sudahAda = siswaKelas.some(function(s) { return s.toLowerCase() === nLb.toLowerCase(); });
            if (!sudahAda) siswaKelas.push(nLb);
        });

        siswaKelas.sort();

        siswaKelas.forEach(function(nama) {
            try {
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
            } catch (errSiswa) {
                console.warn("Lewati data kognitif rusak:", kls, nama, errSiswa);
            }
        });
    });

    let terfilter = daftarProfil.filter(function(p) {
        if (kataCari && String(p.nama || "").toLowerCase().indexOf(kataCari) === -1) return false;
        if (filterStatus === "Tuntas" && (!p.adaSkorTampil || !p.isTuntas)) return false;
        if (filterStatus === "Remedial" && (!p.adaSkorTampil || p.isTuntas)) return false;
        if (filterStatus === "Naik" && p.statusTren !== "Naik") return false;
        if (filterStatus === "Turun" && p.statusTren !== "Turun") return false;
        return true;
    });

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
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:25px; color:#7f8c8d; font-weight:bold;">Belum ada data kognitif siswa untuk filter ini. Tekan <b>🔄 Segarkan Data</b> jika baru masuk.</td></tr>';
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

        let safeKls = String(p.kelas || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeNama = String(p.nama || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");

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
    window.normalisasiArrayDataFirebase(window.adminAfektifData).forEach(function(item) {
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

    let list = window.normalisasiArrayDataFirebase(window.adminAfektifData);

    let filtered = list.filter(function(item) {
        if (!item || typeof item !== "object") return false;
        if (filterKelas !== "Semua" && item.kelas !== filterKelas) return false;
        if (filterEmosi !== "Semua" && item.emosi !== filterEmosi) return false;
        let tglSaja = String(item.tanggalKey || "").split('_')[0];
        if (filterTgl && tglSaja !== filterTgl) return false;
        return true;
    });

    filtered.sort(function(a, b) {
        let ta = new Date(a.timestamp || a.tanggalKey || 0).getTime() || 0;
        let tb = new Date(b.timestamp || b.tanggalKey || 0).getTime() || 0;
        return tb - ta;
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
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:25px; color:#7f8c8d; font-weight:bold;">Belum ada data rekaman Check-in Afektif siswa untuk filter ini. Tekan <b>🔄 Segarkan Data</b> jika baru masuk.</td></tr>';
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
// 6. PENGATURAN LINE SPACING PARAGRAF DINAMIS
// =========================================================================
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
    let cleanKey = (typeof window.normalisasiUsernameSiswa === "function")
        ? window.normalisasiUsernameSiswa(uName)
        : String(uName || "").trim().toLowerCase();
    let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(cleanKey)
        : (window.leaderboardSiswaData ? (window.leaderboardSiswaData[cleanKey] || window.leaderboardSiswaData[uName]) : null);
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
        ? window.ambilCoinSiswa(cleanKey)
        : (Number(lb.coin !== undefined ? lb.coin : (lb.xpTersedia !== undefined ? lb.xpTersedia : lb.xp)) || 0);

    if (saldoCoin < item.harga) {
        let kurang = (item.harga - saldoCoin).toLocaleString('id-ID');
        return alert("⚠️ Saldo Coin kamu belum cukup untuk membeli bingkai " + item.nama + "!\n\nHarga: " + item.harga.toLocaleString('id-ID') + " Coin\nCoin kamu: " + saldoCoin.toLocaleString('id-ID') + " Coin\n(Kurang " + kurang + " Coin lagi)");
    }

    if (!confirm("Beli bingkai \"" + item.nama + "\" (" + item.tier + ") seharga " + item.harga.toLocaleString('id-ID') + " Coin?\n\nHanya Coin yang berkurang, sedangkan XP kamu di Leaderboard tetap utuh!")) {
        return;
    }

    // Potong Coin di memori dulu (skipSave = true) agar Coin & Border terkirim dalam 1 paket PUT yang sama
    if (typeof window.gunakanCoinSiswa === "function") {
        if (!window.gunakanCoinSiswa(item.harga, "beli_border_" + borderId, true)) return;
    } else {
        lb.coin = Math.max(0, saldoCoin - item.harga);
        lb.xpTersedia = lb.coin;
    }

    // Pastikan mengambil referensi objek terbaru setelah pemotongan Coin
    lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(cleanKey)
        : lb;
    if (!Array.isArray(lb.ownedBorders)) {
        lb.ownedBorders = lb.ownedBorders ? Object.values(lb.ownedBorders) : [];
    }
    if (!lb.ownedBorders.includes(borderId)) {
        lb.ownedBorders.push(borderId);
    }
    lb.equippedBorder = borderId;

    // 1x Simpan Atomic ke Firebase (Coin terpotong + Border dimiliki tersimpan serentak)
    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(cleanKey, lb);
    }

    // Catat bukti pembelian ke History siswa
    if (typeof window.catatRiwayatAktivitasSiswa === "function") {
        let sisaCoin = Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0;
        window.catatRiwayatAktivitasSiswa(
            "border",
            "Beli Border: " + item.nama + " (" + item.tier + ")",
            "Harga: -" + item.harga.toLocaleString("id-ID") + " Coin | Sisa Coin: " + sisaCoin.toLocaleString("id-ID")
        );
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
    if (typeof window.pastikanAreaHistoryDiProfilAda === "function") {
        window.pastikanAreaHistoryDiProfilAda();
    }

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

// --- FUNGSI ADMIN TOOLS LEADERBOARD ---
window.adminTambahXPSiswa = function(uKey) {
    let inp = document.getElementById('inp-add-xp-' + uKey);
    if (!inp) return;
    let val = parseInt(inp.value, 10);
    if (isNaN(val) || val <= 0) return alert("⚠️ Masukkan angka XP/Coin yang valid!");
    
    if (confirm("Tambahkan +" + val + " XP & Coin ke siswa ini?")) {
        let lb = window.leaderboardSiswaData[uKey];
        if (lb) {
            let curTotal = Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0;
            let curCoin = Number(lb.coin !== undefined ? lb.coin : (lb.xpTersedia !== undefined ? lb.xpTersedia : lb.xp)) || 0;
            
            lb.xpTotal = curTotal + val;
            lb.xp = lb.xpTotal;
            lb.coin = curCoin + val;
            lb.xpTersedia = lb.coin;

            if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
                window.simpanLeaderboardSiswaKeDB(uKey, lb);
            }
            inp.value = "";
            window.renderTabelLeaderboard();
            alert("✅ Berhasil menambahkan +" + val + " XP & Coin!");
        }
    }
};

window.adminHapusFotoSiswa = function(uKey) {
    if (confirm("🗑️ Yakin ingin menghapus foto profil siswa ini? Foto akan diganti ke avatar bawaan.")) {
        let lb = window.leaderboardSiswaData[uKey];
        if (lb) {
            lb.foto = ""; 
            if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
                window.simpanLeaderboardSiswaKeDB(uKey, lb);
            }
            window.renderTabelLeaderboard();
        }
    }
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
        let isAdminViewer = (sessionStorage.getItem("statusLogin") === "admin") || (typeof window.isAdminSession === "function" && window.isAdminSession());

        // Deteksi apakah siswa sedang aktif di web (Online jika isSelf, atau isOnline=true & aktif dalam 3 menit terakhir)
        let lastActMs = Number(siswa.lastActive) || 0;
        let isCurrentlyOnline = isSelf || (Boolean(siswa.isOnline) && (Date.now() - lastActMs < 180000));

        // 1. Indikator Online / Offline untuk SELURUH SISWA
        let badgeOnlinePublicHtml = isCurrentlyOnline
            ? '<span style="display:inline-flex; align-items:center; gap:4px; background:#dcfce7; color:#15803d; border:1px solid #86efac; padding:1px 8px; border-radius:12px; font-size:10px; font-weight:800;">🟢 Online</span>'
            : '<span style="display:inline-flex; align-items:center; gap:4px; background:#f1f5f9; color:#64748b; border:1px solid #cbd5e1; padding:1px 8px; border-radius:12px; font-size:10px; font-weight:700;">⚪ Offline</span>';

        // 2. Tulisan di atas tombol Visit KHUSUS ADMIN (Muncul "Login" jika sedang aktif, atau kapan terakhir login, lengkap dengan jam & menit)
        let infoLoginAdminHtml = '';
        let adminToolsHtml = '';
        
        if (isAdminViewer) {
            let waktuTerakhir = siswa.waktuLoginTerakhir || siswa.loginTerakhir || "Belum tercatat";
            if (lastActMs > 0) {
                let d = new Date(lastActMs);
                waktuTerakhir = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth()+1).padStart(2, '0') + '/' + d.getFullYear() + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
            }

            if (isCurrentlyOnline) {
                infoLoginAdminHtml = '<div style="font-size:10px; font-weight:800; color:#16a34a; background:#f0fdf4; border:1px solid #bbf7d0; padding:2px 8px; border-radius:8px; white-space:nowrap;">🟢 Sedang Aktif di Web</div>';
            } else {
                infoLoginAdminHtml = '<div style="font-size:10px; font-weight:700; color:#475569; background:rgba(255,255,255,0.85); border:1px solid #cbd5e1; padding:2px 8px; border-radius:8px; white-space:nowrap;">🕒 Login: ' + waktuTerakhir + '</div>';
            }

            // Alat Tambah XP & Hapus Foto Profil (Khusus Admin) - Diposisikan Kanan Atas
            adminToolsHtml = 
                '<div style="position:absolute; top:12px; right:12px; display:flex; gap:6px; align-items:center; z-index:10; background:rgba(255,255,255,0.9); padding:4px; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">' +
                    '<input type="number" id="inp-add-xp-' + uKeySafe + '" placeholder="+XP/Coin" style="width:75px; font-size:10px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px; font-family:\'Poppins\', sans-serif; font-weight:bold; outline:none;">' +
                    '<button type="button" onclick="window.adminTambahXPSiswa(\'' + uKeySafe + '\')" style="background:#27ae60; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:10px; font-weight:bold; cursor:pointer; transition:0.2s;" onmouseover="this.style.background=\'#219653\'" onmouseout="this.style.background=\'#27ae60\'">➕ Tambah</button>' +
                    '<button type="button" onclick="window.adminHapusFotoSiswa(\'' + uKeySafe + '\')" style="background:#e74c3c; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:10px; font-weight:bold; cursor:pointer; transition:0.2s;" onmouseover="this.style.background=\'#c0392b\'" onmouseout="this.style.background=\'#e74c3c\'">🗑️ Foto</button>' +
                '</div>';
        }

        let btnVisitHtml = (!isSelf && uKeySafe)
            ? '<button type="button" class="lb-visit-btn" onclick="window.tutupModal(\'modal-leaderboard\'); window.kunjungiHabitatSiswaLain(\'' + uKeySafe + '\');" title="Kunjungi Habitat ' + namaUtama + '">🏡 Visit</button>'
            : '';

        html +=
        '<div class="' + classBorder + '" style="display:flex; align-items:flex-start; gap:12px; ' + styleDefault + ' padding:14px 15px; border-radius:12px; position:relative;">' +
            adminToolsHtml +
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
                    badgeOnlinePublicHtml +
                '</div>' +
                '<!-- Jumlah XP, Soal Selesai, Info Login Admin, & Tombol Visit -->' +
                '<div style="display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-top:4px; padding-top:6px; border-top:1px dashed rgba(100,116,139,0.25);">' +
                    '<div style="display:flex; align-items:baseline; gap:8px; flex-wrap:wrap;">' +
                        '<span style="font-size:20px; font-weight:900; color:#0b3954; font-family:\'Bebas Neue\', sans-serif; letter-spacing:0.5px;">' + xpTotalSiswa.toLocaleString('id-ID') + ' XP</span>' +
                        '<span style="font-size:11px; color:#475569; font-weight:bold;">🔥 ' + totalDikerjakan + ' Soal Selesai</span>' +
                    '</div>' +
                    '<div style="display:flex; flex-direction:column; align-items:flex-end; gap:5px;">' +
                        infoLoginAdminHtml +
                        btnVisitHtml +
                    '</div>' +
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
// A. JEMBATAN SINKRONISASI DUAL-XP, COIN BELANJA, & MY PET (ANTI-TIMPA)
// -------------------------------------------------------------------------
window.normalisasiUsernameSiswa = function(rawUsername) {
    let u = String(rawUsername || sessionStorage.getItem("username") || "").trim();
    if (!u) return "";
    return (typeof window.sanitasiKeyRekapFirebase === "function")
        ? window.sanitasiKeyRekapFirebase(u).toLowerCase()
        : u.toLowerCase();
};

window.sinkronkanObjekDualXPDanCoin = function(uName, izinkanBuatSementara) {
    let rawU = String(uName || sessionStorage.getItem("username") || "").trim();
    let cleanKey = window.normalisasiUsernameSiswa(rawU);
    if (!cleanKey) return null;

    if (!window.leaderboardSiswaData) window.leaderboardSiswaData = {};
    let lb = window.leaderboardSiswaData[cleanKey] || window.leaderboardSiswaData[rawU] || window.leaderboardSiswaData[rawU.toLowerCase()];

    if (!lb) {
        if (!window.leaderboardLoaded && !izinkanBuatSementara) return null;
        let akun = (window.akunSiswaData && (window.akunSiswaData[cleanKey] || window.akunSiswaData[rawU] || window.akunSiswaData[rawU.toLowerCase()])) || {};
        lb = {
            kelas: akun.kelas || "Umum",
            namaLengkap: akun.namaLengkap || rawU || cleanKey,
            xp: 0,
            xpTotal: 0,
            coin: 0,
            xpTersedia: 0,
            coinInitialized: true,
            _createdBeforeLoad: !window.leaderboardLoaded,
            statSoal: { PG: 0, PGK: 0, IS: 0, Essay: 0 }
        };
    }

    // 1. Kunci XP Leaderboard (xpTotal & xp selalu bernilai sama dan terbesar)
    let totalXP = Math.max(Number(lb.xpTotal) || 0, Number(lb.xp) || 0);
    lb.xpTotal = totalXP;
    lb.xp = totalXP;

    // 2. Kunci Saldo Coin (Untuk beli pakan Pet & Border Shop tanpa mengurangi xpTotal)
    if (lb.coin !== undefined && lb.coin !== null && !isNaN(Number(lb.coin))) {
        lb.coin = Math.max(0, Number(lb.coin));
    } else if (lb.xpTersedia !== undefined && lb.xpTersedia !== null && !isNaN(Number(lb.xpTersedia))) {
        lb.coin = Math.max(0, Number(lb.xpTersedia));
    } else if (!lb.coinInitialized) {
        lb.coin = totalXP;
    } else {
        lb.coin = 0;
    }
    lb.xpTersedia = lb.coin;
    lb.coinInitialized = true;

    if (!lb.statSoal) lb.statSoal = { PG: 0, PGK: 0, IS: 0, Essay: 0 };

    window.leaderboardSiswaData[cleanKey] = lb;
    if (rawU) window.leaderboardSiswaData[rawU] = lb;
    if (rawU.toLowerCase()) window.leaderboardSiswaData[rawU.toLowerCase()] = lb;

    return lb;
};

window.ambilCoinSiswa = function(uName) {
    let lb = window.sinkronkanObjekDualXPDanCoin(uName);
    return lb ? lb.coin : 0;
};

window.gunakanCoinSiswa = function(hargaCoin, keperluan, skipSave) {
    let rawU = sessionStorage.getItem("username") || "";
    let cleanKey = window.normalisasiUsernameSiswa(rawU);
    if (!cleanKey) return false;

    let biaya = Math.max(0, Number(hargaCoin) || 0);
    let lb = window.sinkronkanObjekDualXPDanCoin(cleanKey);
    if (!lb) return false;

    if (lb.coin < biaya) return false;

    // Hanya kurangi Coin (xpTersedia), JANGAN PERNAH mengurangi xpTotal / xp Leaderboard!
    lb.coin = Math.max(0, lb.coin - biaya);
    lb.xpTersedia = lb.coin;

    if (!skipSave && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(cleanKey, lb);
    }
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") {
        window.perbaruiTampilanSaldoXPPet();
    }
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") {
        window.perbaruiUIHeaderProfilSiswa();
    }
    return true;
};

window.masterTambahXPSiswa = function(jumlahPoin, sumber, rincianSoalArr) {
    let stat = sessionStorage.getItem("statusLogin");
    let rawU = sessionStorage.getItem("username") || "";
    let cleanKey = window.normalisasiUsernameSiswa(rawU);

    if (stat !== "siswa" || !cleanKey || cleanKey === "sbd" || cleanKey === "tamu" || cleanKey === "mahardika") return;

    let poin = Math.max(0, Number(jumlahPoin) || 0);

    if (sumber === "latihan" && Array.isArray(rincianSoalArr) && rincianSoalArr.length > 0) {
        let hitungSoal = 0;
        rincianSoalArr.forEach(function(item) {
            if (item && item.sudahBenar) {
                hitungSoal += (typeof window.dapatkanPoinXPPerSoal === "function") ? window.dapatkanPoinXPPerSoal(item.type) : 10;
            }
        });
        if (hitungSoal > 0) poin = hitungSoal;
    }

    if (poin <= 0) return;

    let lb = window.sinkronkanObjekDualXPDanCoin(cleanKey, true);
    if (!lb) return;

    if (!window.leaderboardLoaded || lb._createdBeforeLoad) {
        lb._pendingXPDelta = (Number(lb._pendingXPDelta) || 0) + poin;
        lb._pendingCoinDelta = (Number(lb._pendingCoinDelta) || 0) + poin;
    }

    lb.xpTotal = (Number(lb.xpTotal) || 0) + poin;
    lb.xp = lb.xpTotal;
    lb.coin = (Number(lb.coin) || 0) + poin;
    lb.xpTersedia = lb.coin;

    let jmlSoalBenarBaru = 0;
    if (Array.isArray(rincianSoalArr)) {
        rincianSoalArr.forEach(function(item) {
            if (!item || !item.sudahBenar) return;
            jmlSoalBenarBaru++;
            let t = String(item.type || "PG").toUpperCase();
            if (t === "MC" || t === "PG") lb.statSoal.PG = (Number(lb.statSoal.PG) || 0) + 1;
            else if (t === "PGK") lb.statSoal.PGK = (Number(lb.statSoal.PGK) || 0) + 1;
            else if (t === "IS" || t === "SHORT_ANSWER" || t === "ISIAN") lb.statSoal.IS = (Number(lb.statSoal.IS) || 0) + 1;
            else if (t === "ESSAY" || t === "ESAI") lb.statSoal.Essay = (Number(lb.statSoal.Essay) || 0) + 1;
        });
    }

    // Otomatis catat progres Misi Harian menumpang pada satu kali simpan DB yang sama
    if (typeof window.catatProgresMisiHarian === "function") {
        if (sumber === "checkin_harian") {
            window.catatProgresMisiHarian("checkin", 1, true);
        }
        if (jmlSoalBenarBaru > 0 && String(sumber || "").indexOf("misi_harian") === -1) {
            window.catatProgresMisiHarian("soal", jmlSoalBenarBaru, true);
        }
    }

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(cleanKey, lb);
    }
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") {
        window.perbaruiUIHeaderProfilSiswa();
    }
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") {
        window.perbaruiTampilanSaldoXPPet();
    }
    if (typeof window.perbaruiBadgeTombolMisiHarian === "function") {
        window.perbaruiBadgeTombolMisiHarian();
    }
};

window.tambahXPSiswa = window.masterTambahXPSiswa;

// Bungkus fungsi pastikanStrukturDualXPDanPet dari my-pet-engine.js setelah semua script selesai dimuat
window.pasangKunciSinkronisasiPet = function() {
    window.tambahXPSiswa = window.masterTambahXPSiswa;
    if (typeof window.pastikanStrukturDualXPDanPet === "function" && !window.pastikanStrukturDualXPDanPet._isWrappedSafe) {
        let origPetStruct = window.pastikanStrukturDualXPDanPet;
        let wrappedFn = function(uName) {
            let lbAwal = window.sinkronkanObjekDualXPDanCoin(uName);
            let backupXP = lbAwal ? lbAwal.xpTotal : 0;
            let backupCoin = lbAwal ? lbAwal.coin : 0;

            let res = origPetStruct(window.normalisasiUsernameSiswa(uName) || uName);
            let lbAkhir = window.sinkronkanObjekDualXPDanCoin(uName) || res;

            // Pastikan inisialisasi Pet tidak pernah mengecilkan XP atau Coin yang sudah ada
            if (lbAkhir) {
                if (backupXP > lbAkhir.xpTotal) {
                    lbAkhir.xpTotal = backupXP;
                    lbAkhir.xp = backupXP;
                }
                if (backupCoin > lbAkhir.coin) {
                    lbAkhir.coin = backupCoin;
                    lbAkhir.xpTersedia = backupCoin;
                }
            }
            return lbAkhir;
        };
        wrappedFn._isWrappedSafe = true;
        window.pastikanStrukturDualXPDanPet = wrappedFn;
    } else if (typeof window.pastikanStrukturDualXPDanPet !== "function") {
        window.pastikanStrukturDualXPDanPet = window.sinkronkanObjekDualXPDanCoin;
    }
};

document.addEventListener("DOMContentLoaded", window.pasangKunciSinkronisasiPet);
window.addEventListener("load", window.pasangKunciSinkronisasiPet);

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
    // MATIKAN ANTI-MACRO DI RUANG UJIAN CBT
    if (window.isStrictUjianActive) return true;
    if (evt && evt.target && evt.target.closest && evt.target.closest("#ujian-strict-room")) {
        if (!window.sesiLatihanSiswa) return true;
    }

    let batasMin = Math.max(2000, Number(minBacaMs) || 2000);
    let now = Date.now();
    let guard = window.antiMacroGuard;

    if (guard.isLockedChallenge) return false;

    if (evt && evt.isTrusted === false) {
        guard.macroFlagged = true;
        window.munculkanChallengeAntiMacro("Terdeteksi eksekusi script/macro otomatis pada browser!");
        return false;
    }

    let selisih = guard.lastClickTime ? (now - guard.lastClickTime) : 99999;

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

// Pencegat Global Fase Capture: Hanya Aktif di Latihan & Kuis Materi (MATI Saat Ujian CBT)
document.addEventListener("click", function(e) {
    if (sessionStorage.getItem("statusLogin") === "admin") return;
    if (window.isStrictUjianActive) return; // Bebaskan klik sepenuhnya saat Ujian CBT berlangsung

    let btnOpsi = e.target.closest(".quiz-option-btn");
    if (!btnOpsi || btnOpsi.disabled) return;

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

setInterval(function() {
    window.perbaruiSinarTombolNotifikasi();
}, 3000);

// =========================================================================
// 9. MODUL MISI HARIAN & LOGIN STREAK SISWA (0 EXTRA FIREBASE READS)
// =========================================================================
window.KONFIG_MISI_HARIAN = [
    {
        id: "checkin",
        ikon: "😊",
        judul: "Check-in Perasaan Hari Ini",
        deskripsi: "Ceritakan kabarmu lewat tombol Check-in di header.",
        target: 1,
        hadiah: 30,
        aksiTeks: "Check-in",
        aksiFn: "window.tutupModal('modal-misi-harian'); window.bukaModalCheckinSiswa();"
    },
    {
        id: "soal",
        ikon: "🧠",
        judul: "Jawab Benar 10 Soal",
        deskripsi: "Kerjakan Latihan Mandiri, Kuis Materi, atau Ujian.",
        target: 10,
        hadiah: 80,
        aksiTeks: "Latihan",
        aksiFn: "window.tutupModal('modal-misi-harian'); window.bukaModal('modal-enter-latihan');"
    },
    {
        id: "feed_pet",
        ikon: "🍖",
        judul: "Beri Makan Pet 1x",
        deskripsi: "Rawat peliharaanmu di My Pet Sanctuary.",
        target: 1,
        hadiah: 40,
        aksiTeks: "My Pet",
        aksiFn: "window.tutupModal('modal-misi-harian'); window.bukaModalMyPet();"
    }
];

window.dapatkanTanggalLokalYYYYMMDD = function(offsetHari) {
    let d = new Date();
    if (offsetHari) d.setDate(d.getDate() + offsetHari);
    let yyyy = d.getFullYear();
    let mm = String(d.getMonth() + 1).padStart(2, "0");
    let dd = String(d.getDate()).padStart(2, "0");
    return yyyy + "-" + mm + "-" + dd;
};

window.ambilAtauInisialisasiMisiSiswa = function(simpanJikaBerubah) {
    let stat = sessionStorage.getItem("statusLogin");
    let rawU = sessionStorage.getItem("username") || "";
    let cleanKey = window.normalisasiUsernameSiswa ? window.normalisasiUsernameSiswa(rawU) : rawU.trim().toLowerCase();

    let hariIni = window.dapatkanTanggalLokalYYYYMMDD(0);
    let kemarin = window.dapatkanTanggalLokalYYYYMMDD(-1);

    // Pratinjau aman jika dibuka oleh Admin
    if (stat === "admin") {
        return {
            isPreviewAdmin: true,
            tanggal: hariIni,
            streak: 7,
            bestStreak: 14,
            lastStreakDate: hariIni,
            progres: { checkin: 1, soal: 6, feed_pet: 0 },
            claimed: { checkin: false, soal: false, feed_pet: false, all: false }
        };
    }

    if (stat !== "siswa" || !cleanKey || cleanKey === "sbd" || cleanKey === "tamu") return null;

    let lb = (typeof window.sinkronkanObjekDualXPDanCoin === "function")
        ? window.sinkronkanObjekDualXPDanCoin(cleanKey, false)
        : (window.leaderboardSiswaData ? window.leaderboardSiswaData[cleanKey] : null);
    if (!lb) return null;

    let adaPerubahan = false;
    let streakNaikBaru = false;

    if (!lb.misiHarian || typeof lb.misiHarian !== "object") {
        lb.misiHarian = {
            tanggal: hariIni,
            streak: 0,
            bestStreak: 0,
            lastStreakDate: "",
            progres: { checkin: 0, soal: 0, feed_pet: 0 },
            claimed: { checkin: false, soal: false, feed_pet: false, all: false }
        };
        adaPerubahan = true;
    }

    let m = lb.misiHarian;
    if (!m.progres) m.progres = { checkin: 0, soal: 0, feed_pet: 0 };
    if (!m.claimed) m.claimed = { checkin: false, soal: false, feed_pet: false, all: false };

    // 1. Reset misi otomatis setiap berganti hari baru
    if (m.tanggal !== hariIni) {
        m.tanggal = hariIni;
        m.progres = { checkin: 0, soal: 0, feed_pet: 0 };
        m.claimed = { checkin: false, soal: false, feed_pet: false, all: false };
        adaPerubahan = true;
    }

    // 2. Hitung Login Streak Beruntun
    if (m.lastStreakDate !== hariIni) {
        if (m.lastStreakDate === kemarin) {
            m.streak = (Number(m.streak) || 0) + 1;
        } else {
            m.streak = 1;
        }
        m.lastStreakDate = hariIni;
        m.bestStreak = Math.max(Number(m.bestStreak) || 0, m.streak);
        adaPerubahan = true;
        streakNaikBaru = true;
    }

    // 3. Sinkronkan otomatis jika hari ini siswa sudah sempat Check-in
    if (typeof window.apakahSudahCheckinHariIni === "function" && window.apakahSudahCheckinHariIni() && (Number(m.progres.checkin) || 0) < 1) {
        m.progres.checkin = 1;
        adaPerubahan = true;
    }

    if (adaPerubahan && simpanJikaBerubah && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(cleanKey, lb);
    }

    if (streakNaikBaru && !window._streakToastShownToday && typeof window.tampilkanBadgeHadiahKuis === "function") {
        window._streakToastShownToday = true;
        setTimeout(function() {
            window.tampilkanBadgeHadiahKuis(null, "🔥 Login Streak Hari ke-" + m.streak + "! Cek Misi Harianmu!");
        }, 1400);
    }

    return m;
};

window.catatProgresMisiHarian = function(idMisi, tambahJumlah, skipSave) {
    let m = window.ambilAtauInisialisasiMisiSiswa(false);
    if (!m || m.isPreviewAdmin) return;

    let cfg = window.KONFIG_MISI_HARIAN.find(function(x) { return x.id === idMisi; });
    if (!cfg) return;

    let lama = Number(m.progres[idMisi]) || 0;
    let baru = Math.min(cfg.target, lama + (Number(tambahJumlah) || 1));
    if (baru === lama) return;

    m.progres[idMisi] = baru;

    if (!skipSave) {
        let rawU = sessionStorage.getItem("username") || "";
        let cleanKey = window.normalisasiUsernameSiswa ? window.normalisasiUsernameSiswa(rawU) : rawU.trim().toLowerCase();
        let lb = window.leaderboardSiswaData ? window.leaderboardSiswaData[cleanKey] : null;
        if (lb && typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(cleanKey, lb);
        }
    }

    window.perbaruiBadgeTombolMisiHarian();
    if (lama < cfg.target && baru >= cfg.target && typeof window.tampilkanBadgeHadiahKuis === "function") {
        window.tampilkanBadgeHadiahKuis(null, "🎯 Misi '" + cfg.judul + "' selesai! Klaim +" + cfg.hadiah + " XP & Coin di menu Misi!");
    }

    let modal = document.getElementById("modal-misi-harian");
    if (modal && modal.style.display === "flex") {
        window.renderIsiModalMisiHarian();
    }
};

window.hitungJumlahHadiahMisiSiapKlaim = function(m) {
    if (!m) return 0;
    let siap = 0;
    let selesaiSemua = true;

    window.KONFIG_MISI_HARIAN.forEach(function(cfg) {
        let cur = Math.min(cfg.target, Number(m.progres[cfg.id]) || 0);
        let done = cur >= cfg.target;
        if (!done) selesaiSemua = false;
        if (done && !m.claimed[cfg.id]) siap++;
    });

    if (selesaiSemua && !m.claimed.all) siap++;
    return siap;
};

window.perbaruiBadgeTombolMisiHarian = function() {
    let lbl = document.getElementById("header-misi-label");
    let badge = document.getElementById("badge-header-misi");
    if (!lbl || !badge) return;

    let m = window.ambilAtauInisialisasiMisiSiswa(false);
    if (!m) {
        lbl.innerText = "Misi";
        badge.style.display = "none";
        return;
    }

    let streakVal = Number(m.streak) || 1;
    lbl.innerText = streakVal + " Hari";

    let jmlSiap = window.hitungJumlahHadiahMisiSiapKlaim(m);
    if (jmlSiap > 0) {
        badge.innerText = String(jmlSiap);
        badge.style.display = "inline-block";
    } else {
        badge.style.display = "none";
    }
};

window.pastikanModalMisiHarianAda = function() {
    let modal = document.getElementById("modal-misi-harian");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "modal-misi-harian";
    modal.className = "modal-overlay";
    modal.onclick = function(e) {
        if (e.target === modal) window.tutupModal("modal-misi-harian");
    };

    modal.innerHTML =
        '<div class="modal-box" style="width:520px; max-height:88dvh;">' +
            '<div class="modal-header" style="background:linear-gradient(135deg, #0b3954, #c2410c); color:#ffffff;">' +
                '<div>' +
                    '<h3 style="margin:0;">🔥 Misi Harian & Login Streak</h3>' +
                    '<div style="font-size:11px; color:#fef08a; margin-top:2px;">Bangun kebiasaan belajar setiap hari & kumpulkan bonus XP + Coin!</div>' +
                '</div>' +
                '<button type="button" class="close-btn" style="color:#ffffff;" onclick="window.tutupModal(\'modal-misi-harian\')">✕</button>' +
            '</div>' +
            '<div class="modal-body" id="misi-harian-modal-body" style="background:#f8fafc; padding:16px;"></div>' +
        '</div>';

    document.body.appendChild(modal);
    return modal;
};

window.bukaModalMisiHarian = function() {
    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        alert("🔒 Silakan LOGIN menggunakan akun Siswa terlebih dahulu untuk menjalankan Misi Harian & mencatat Login Streak!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    window.pastikanModalMisiHarianAda();
    window.ambilAtauInisialisasiMisiSiswa(true);
    window.renderIsiModalMisiHarian();
    window.bukaModal("modal-misi-harian");
};

window.renderIsiModalMisiHarian = function() {
    let body = document.getElementById("misi-harian-modal-body");
    if (!body) return;

    let m = window.ambilAtauInisialisasiMisiSiswa(false);
    if (!m) {
        body.innerHTML = '<div style="text-align:center; padding:30px; color:#64748b; font-weight:700;">⏳ Menyinkronkan data profil siswa... Coba buka lagi dalam 2 detik.</div>';
        return;
    }

    let streak = Number(m.streak) || 1;
    let best = Math.max(streak, Number(m.bestStreak) || 1);
    let gelarStreak = streak >= 30 ? "👑 Legenda Konsisten" : (streak >= 14 ? "🏆 Pejuang Tangguh" : (streak >= 7 ? "⚡ Semangat Membara" : (streak >= 3 ? "🔥 Mulai Terbiasa" : "🌱 Langkah Pertama")));

    // 7 lingkaran hari minggu ini (visual progres 7 hari beruntun)
    let siklus7 = ((streak - 1) % 7) + 1;
    let dotsHtml = "";
    for (let i = 1; i <= 7; i++) {
        let aktif = i <= siklus7;
        dotsHtml +=
            '<div class="misi-streak-day ' + (aktif ? 'done' : '') + '">' +
                '<span>' + (aktif ? '🔥' : i) + '</span>' +
                '<small>H-' + i + '</small>' +
            '</div>';
    }

    let jmlSelesai = 0;
    let daftarMisiHtml = "";

    window.KONFIG_MISI_HARIAN.forEach(function(cfg) {
        let cur = Math.min(cfg.target, Number(m.progres[cfg.id]) || 0);
        let pct = Math.round((cur / cfg.target) * 100);
        let selesai = cur >= cfg.target;
        let sudahKlaim = Boolean(m.claimed[cfg.id]);
        if (selesai) jmlSelesai++;

        let tombolHtml = "";
        if (sudahKlaim) {
            tombolHtml = '<button type="button" class="misi-btn-claimed" disabled>✓ Diklaim</button>';
        } else if (selesai) {
            tombolHtml = '<button type="button" class="misi-btn-claim" onclick="window.klaimHadiahMisiHarian(\'' + cfg.id + '\')">🎁 Klaim +' + cfg.hadiah + '</button>';
        } else {
            tombolHtml = '<button type="button" class="misi-btn-go" onclick="' + cfg.aksiFn + '">' + cfg.aksiTeks + ' ➔</button>';
        }

        daftarMisiHtml +=
            '<div class="misi-item-card ' + (selesai && !sudahKlaim ? 'ready-claim' : '') + '">' +
                '<div class="misi-item-icon">' + cfg.ikon + '</div>' +
                '<div class="misi-item-main">' +
                    '<div class="misi-item-title">' + cfg.judul + '</div>' +
                    '<div class="misi-item-desc">' + cfg.deskripsi + '</div>' +
                    '<div class="misi-progress-row">' +
                        '<div class="misi-progress-track"><div class="misi-progress-fill" style="width:' + pct + '%;"></div></div>' +
                        '<span class="misi-progress-num">' + cur + '/' + cfg.target + '</span>' +
                    '</div>' +
                    '<div class="misi-reward-tag">Hadiah: <b>+' + cfg.hadiah + ' XP & +' + cfg.hadiah + ' Coin</b></div>' +
                '</div>' +
                '<div class="misi-item-action">' + tombolHtml + '</div>' +
            '</div>';
    });

    let semuaSelesai = (jmlSelesai >= window.KONFIG_MISI_HARIAN.length);
    let sudahKlaimAll = Boolean(m.claimed.all);
    let bonusAllBtn = sudahKlaimAll
        ? '<button type="button" class="misi-btn-claimed" style="width:100%; padding:10px;" disabled>✅ Bonus Sapu Bersih Hari Ini Sudah Diklaim!</button>'
        : (semuaSelesai
            ? '<button type="button" class="misi-btn-claim-grand" onclick="window.klaimHadiahMisiHarian(\'all\')">🎁 Klaim Bonus Sapu Bersih (+100 XP & +100 Coin)</button>'
            : '<div style="font-size:11.5px; color:#64748b; font-weight:700; text-align:center;">Selesaikan <b>' + jmlSelesai + '/3</b> misi hari ini untuk membuka <b>Bonus +100 XP & +100 Coin</b>!</div>');

    let infoPreview = m.isPreviewAdmin
        ? '<div style="background:#fef3c7; border:1px solid #f59e0b; color:#92400e; padding:8px 12px; border-radius:8px; font-size:11px; font-weight:700; margin-bottom:12px;">👁️ Mode Pratinjau Admin (Klaim hadiah hanya berlaku pada akun Siswa).</div>'
        : '';

    body.innerHTML =
        infoPreview +
        '<div class="misi-streak-hero">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">' +
                '<div>' +
                    '<div style="font-size:11px; font-weight:800; color:#fed7aa; text-transform:uppercase; letter-spacing:0.6px;">Login Streak Aktif</div>' +
                    '<div style="font-size:28px; font-weight:900; color:#ffffff; line-height:1.15;">🔥 ' + streak + ' Hari Beruntun</div>' +
                    '<div style="font-size:11.5px; color:#fef08a; font-weight:700; margin-top:2px;">' + gelarStreak + ' • Rekor Terbaik: ' + best + ' Hari</div>' +
                '</div>' +
                '<div class="misi-date-chip">📅 ' + m.tanggal + '</div>' +
            '</div>' +
            '<div class="misi-streak-days-row">' + dotsHtml + '</div>' +
        '</div>' +
        '<div style="display:flex; flex-direction:column; gap:10px; margin-bottom:14px;">' + daftarMisiHtml + '</div>' +
        '<div class="misi-grand-bonus-box">' + bonusAllBtn + '</div>';
};

window.klaimHadiahMisiHarian = function(idMisi) {
    let m = window.ambilAtauInisialisasiMisiSiswa(false);
    if (!m) return;
    if (m.isPreviewAdmin) {
        return alert("ℹ️ Mode Pratinjau Admin: Klaim hadiah hanya berfungsi untuk akun Siswa.");
    }

    let hadiahPoin = 0;
    let labelHadiah = "";

    if (idMisi === "all") {
        let semuaSelesai = window.KONFIG_MISI_HARIAN.every(function(cfg) {
            return (Number(m.progres[cfg.id]) || 0) >= cfg.target;
        });
        if (!semuaSelesai || m.claimed.all) return;
        m.claimed.all = true;
        hadiahPoin = 100;
        labelHadiah = "Bonus Sapu Bersih Harian";
    } else {
        let cfg = window.KONFIG_MISI_HARIAN.find(function(x) { return x.id === idMisi; });
        if (!cfg) return;
        if ((Number(m.progres[idMisi]) || 0) < cfg.target || m.claimed[idMisi]) return;
        m.claimed[idMisi] = true;
        hadiahPoin = cfg.hadiah;
        labelHadiah = cfg.judul;
    }

    if (typeof window.tambahXPSiswa === "function") {
        window.tambahXPSiswa(hadiahPoin, "misi_harian_" + idMisi);
    }

    window.renderIsiModalMisiHarian();
    window.perbaruiBadgeTombolMisiHarian();
    if (typeof window.tampilkanBadgeHadiahKuis === "function") {
        window.tampilkanBadgeHadiahKuis(null, "🎉 " + labelHadiah + ": +" + hadiahPoin + " XP & +" + hadiahPoin + " Coin!");
    }
};

// Otomatis cek Login Streak begitu data profil siswa selesai dimuat dari server
window._streakInitTimer = setInterval(function() {
    if (sessionStorage.getItem("statusLogin") === "siswa" && window.leaderboardLoaded) {
        clearInterval(window._streakInitTimer);
        window.ambilAtauInisialisasiMisiSiswa(true);
        window.perbaruiBadgeTombolMisiHarian();
    } else if (sessionStorage.getItem("statusLogin") === "admin") {
        clearInterval(window._streakInitTimer);
        window.perbaruiBadgeTombolMisiHarian();
    }
}, 1200);

// =========================================================================
// 10. MODUL HISTORY AKTIVITAS & TRANSAKSI SISWA (ON-DEMAND & 0 BEBAN SERVER)
// =========================================================================
window._cacheRiwayatSiswa = window._cacheRiwayatSiswa || {};
window._cacheRiwayatFetchTime = window._cacheRiwayatFetchTime || {};

window.formatWaktuSpesifikHistory = function(dateObj) {
    let d = dateObj || new Date();
    return String(d.getDate()).padStart(2, "0") + "/" +
           String(d.getMonth() + 1).padStart(2, "0") + "/" +
           d.getFullYear() + " " +
           String(d.getHours()).padStart(2, "0") + ":" +
           String(d.getMinutes()).padStart(2, "0") + ":" +
           String(d.getSeconds()).padStart(2, "0");
};

window.catatRiwayatAktivitasSiswa = function(kategori, judul, detail) {
    let stat = sessionStorage.getItem("statusLogin");
    let rawU = (sessionStorage.getItem("username") || "").trim();
    let cleanKey = (typeof window.normalisasiUsernameSiswa === "function")
        ? window.normalisasiUsernameSiswa(rawU)
        : rawU.toLowerCase();

    // Khusus akun siswa resmi (Admin/Tamu tidak perlu mencatat history)
    if (stat !== "siswa" || !cleanKey || cleanKey === "mahardika" || cleanKey === "sbd" || cleanKey === "tamu") {
        return;
    }

    let nowMs = Date.now();
    let entryId = "h_" + nowMs + "_" + Math.floor(100 + Math.random() * 900);
    let item = {
        k: String(kategori || "umum"),
        j: String(judul || "Aktivitas"),
        d: String(detail || ""),
        w: window.formatWaktuSpesifikHistory(new Date(nowMs)),
        t: nowMs
    };

    // Simpan ke RAM cache lokal agar langsung terlihat tanpa unduh ulang
    if (!Array.isArray(window._cacheRiwayatSiswa[cleanKey])) {
        window._cacheRiwayatSiswa[cleanKey] = [];
    }
    window._cacheRiwayatSiswa[cleanKey].unshift(item);

    // Tulis 1 baris ringan via REST PUT (0 Koneksi WebSocket & 0 Read sebelum menulis)
    let guru = (window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika").toLowerCase();
    let pathRiwayat = "data_guru/" + guru + "/riwayat_siswa/" + cleanKey + "/" + entryId;
    if (typeof window.tulisDataRestFirebase === "function") {
        window.tulisDataRestFirebase(pathRiwayat, item, "PUT");
    }

    // Perbarui daftar jika drawer History sedang terbuka
    let drawer = document.getElementById("profil-history-drawer");
    if (drawer && drawer.style.display !== "none") {
        window.renderDaftarHistoryProfil();
    }
};

window.pastikanAreaHistoryDiProfilAda = function() {
    let modalProfil = document.getElementById("modal-profil-siswa");
    if (!modalProfil) return;
    let body = modalProfil.querySelector(".modal-body");
    if (!body) return;

    let stat = sessionStorage.getItem("statusLogin");
    let existing = document.getElementById("profil-history-section");

    // Sembunyikan/hapus jika bukan siswa (Admin tidak perlu)
    if (stat !== "siswa") {
        if (existing) existing.remove();
        return;
    }
    if (existing) return;

    let sec = document.createElement("div");
    sec.id = "profil-history-section";
    sec.style.cssText = "background:white; padding:14px; border-radius:10px; border:2px solid #3498db; margin-bottom:15px; box-shadow:0 4px 12px rgba(52,152,219,0.1);";
    sec.innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
            '<div>' +
                '<div style="font-size:14px; font-weight:800; color:#0b3954;">📜 Riwayat Aktivitas & Bukti Transaksi</div>' +
                '<div style="font-size:11px; color:#64748b;">Catatan soal dikerjakan, check-in, beli border, & item My Pet.</div>' +
            '</div>' +
            '<button type="button" id="btn-toggle-history-profil" class="btn-action" style="background:linear-gradient(135deg, #0b3954, #2980b9); width:auto; padding:7px 14px; font-size:12px; border-radius:20px;" onclick="window.toggleBukaTutupHistoryProfil()">📂 Buka History</button>' +
        '</div>' +
        '<div id="profil-history-drawer" style="display:none; margin-top:12px; border-top:1px dashed #cbd5e1; padding-top:12px;">' +
            '<div style="display:flex; gap:8px; align-items:center; margin-bottom:10px; flex-wrap:wrap;">' +
                '<select id="filter-history-profil" class="input-box" style="margin:0; flex:1; min-width:180px; padding:7px 10px; font-size:12px; font-weight:700; cursor:pointer;" onchange="window.renderDaftarHistoryProfil()">' +
                    '<option value="semua">📋 Semua Aktivitas (Keseluruhan)</option>' +
                    '<option value="soal">📝 Soal Dikerjakan (Latihan & Ujian)</option>' +
                    '<option value="checkin">😊 Check-in Harian</option>' +
                    '<option value="border">🖼️ Pembelian Border Shop</option>' +
                    '<option value="pet">🐾 Pembelian Barang My Pet</option>' +
                '</select>' +
                '<button type="button" class="btn-action" style="background:#64748b; width:auto; padding:7px 12px; font-size:11px; border-radius:8px;" onclick="window.muatDanRenderHistoryProfil(true)" title="Segarkan dari Server">🔄 Segarkan</button>' +
            '</div>' +
            '<div id="profil-history-list" style="display:flex; flex-direction:column; gap:8px; max-height:290px; overflow-y:auto; padding-right:2px;"></div>' +
        '</div>';

    let shopSection = document.getElementById("profil-shop-section");
    if (shopSection && shopSection.nextSibling) {
        body.insertBefore(sec, shopSection.nextSibling);
    } else if (shopSection) {
        body.appendChild(sec);
    } else {
        body.appendChild(sec);
    }
};

window.toggleBukaTutupHistoryProfil = function() {
    let drawer = document.getElementById("profil-history-drawer");
    let btn = document.getElementById("btn-toggle-history-profil");
    if (!drawer) return;

    if (drawer.style.display === "none") {
        drawer.style.display = "block";
        if (btn) btn.innerHTML = "🔼 Tutup History";
        window.muatDanRenderHistoryProfil(false);
    } else {
        drawer.style.display = "none";
        if (btn) btn.innerHTML = "📂 Buka History";
    }
};

window.muatDanRenderHistoryProfil = function(forceRefresh) {
    let listEl = document.getElementById("profil-history-list");
    let rawU = (sessionStorage.getItem("username") || "").trim();
    let cleanKey = (typeof window.normalisasiUsernameSiswa === "function")
        ? window.normalisasiUsernameSiswa(rawU)
        : rawU.toLowerCase();
    if (!cleanKey || !listEl) return;

    let lastFetch = window._cacheRiwayatFetchTime[cleanKey] || 0;
    let cacheSegar = !forceRefresh && lastFetch > 0 && (Date.now() - lastFetch < 180000);

    if (cacheSegar && Array.isArray(window._cacheRiwayatSiswa[cleanKey])) {
        window.renderDaftarHistoryProfil();
        return;
    }

    listEl.innerHTML = '<div style="text-align:center; padding:18px; font-size:12px; color:#64748b; font-weight:700;">⏳ Memuat riwayat aktivitas...</div>';

    let guru = (window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika").toLowerCase();
    let pathRiwayat = "data_guru/" + guru + "/riwayat_siswa/" + cleanKey;

    if (typeof window.bacaDataRestFirebase === "function") {
        window.bacaDataRestFirebase(pathRiwayat, function(val) {
            let arrServer = val ? (Array.isArray(val) ? val : Object.values(val)) : [];
            let lokal = Array.isArray(window._cacheRiwayatSiswa[cleanKey]) ? window._cacheRiwayatSiswa[cleanKey] : [];

            // Gabungkan unik berdasarkan timestamp + judul agar tidak duplikat
            let unikMap = {};
            arrServer.concat(lokal).forEach(function(it) {
                if (!it || !it.j) return;
                let kUnik = String(it.t || it.w || "") + "_" + it.j;
                unikMap[kUnik] = it;
            });

            let hasil = Object.values(unikMap).sort(function(a, b) {
                return (Number(b.t) || 0) - (Number(a.t) || 0);
            });

            window._cacheRiwayatSiswa[cleanKey] = hasil;
            window._cacheRiwayatFetchTime[cleanKey] = Date.now();
            window.renderDaftarHistoryProfil();
        }, function() {
            window.renderDaftarHistoryProfil();
        }, { ttlMs: 180000, forceRefresh: Boolean(forceRefresh) });
    } else {
        window.renderDaftarHistoryProfil();
    }
};

window.renderDaftarHistoryProfil = function() {
    let listEl = document.getElementById("profil-history-list");
    let selFilter = document.getElementById("filter-history-profil");
    if (!listEl) return;

    let rawU = (sessionStorage.getItem("username") || "").trim();
    let cleanKey = (typeof window.normalisasiUsernameSiswa === "function")
        ? window.normalisasiUsernameSiswa(rawU)
        : rawU.toLowerCase();

    let filterVal = selFilter ? selFilter.value : "semua";
    let semua = Array.isArray(window._cacheRiwayatSiswa[cleanKey]) ? window._cacheRiwayatSiswa[cleanKey] : [];

    let terfilter = semua.filter(function(item) {
        if (!item) return false;
        if (filterVal === "semua") return true;
        return item.k === filterVal;
    });

    if (terfilter.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; padding:20px 10px; font-size:12px; color:#94a3b8; font-weight:700; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px;">Belum ada riwayat tercatat untuk kategori ini.</div>';
        return;
    }

    let gayaKat = {
        soal:    { ikon: "📝", bg: "#ebf5fb", border: "#3498db", label: "Soal", warna: "#1d4ed8" },
        checkin: { ikon: "😊", bg: "#fef9e7", border: "#f1c40f", label: "Check-in", warna: "#b45309" },
        border:  { ikon: "🖼️", bg: "#f5eef8", border: "#8e44ad", label: "Border", warna: "#7e22ce" },
        pet:     { ikon: "🐾", bg: "#e8f8f5", border: "#16a085", label: "My Pet", warna: "#0f766e" }
    };

    let esc = function(s) {
        return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    let html = "";
    terfilter.slice(0, 100).forEach(function(it) {
        let g = gayaKat[it.k] || { ikon: "📌", bg: "#f8fafc", border: "#64748b", label: "Aktivitas", warna: "#334155" };
        html +=
            '<div style="background:#ffffff; border:1px solid #e2e8f0; border-left:4px solid ' + g.border + '; border-radius:8px; padding:9px 11px; display:flex; align-items:flex-start; gap:10px;">' +
                '<div style="width:32px; height:32px; border-radius:8px; background:' + g.bg + '; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0;">' + g.ikon + '</div>' +
                '<div style="flex:1; min-width:0;">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:2px;">' +
                        '<span style="background:' + g.bg + '; color:' + g.warna + '; font-size:9.5px; font-weight:800; padding:1px 7px; border-radius:10px;">' + g.label + '</span>' +
                        '<span style="font-size:10px; color:#64748b; font-weight:700;">🕒 ' + esc(it.w || "-") + '</span>' +
                    '</div>' +
                    '<div style="font-size:12px; font-weight:800; color:#0f172a; line-height:1.35; word-break:break-word;">' + esc(it.j) + '</div>' +
                    (it.d ? '<div style="font-size:11px; color:#475569; margin-top:2px; line-height:1.35; word-break:break-word;">' + esc(it.d) + '</div>' : '') +
                '</div>' +
            '</div>';
    });

    listEl.innerHTML = html;
};