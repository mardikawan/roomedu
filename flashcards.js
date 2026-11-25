/* =========================================================================
   MODUL FLASHCARDS ANKI-GRADE: ACTIVE RECALL + SPACED REPETITION (SM-2)
   Basic, Cloze Deletion, Image Occlusion, Micro-Learning Sesuai Kelas Akun,
   & History Aktivitas Siswa (Sync Firebase + Cadangan Lokal)
   ========================================================================= */

window.adminFlashcardsData = window.adminFlashcardsData || {};
window._fcServerLoaded = false;
window._fcSrsMap = window._fcSrsMap || {};
window._fcSrsLoadedUser = '';
window._fcSrsSaveTimer = null;
window._fcHistoryList = window._fcHistoryList || [];
window._fcHistoryLoadedUser = '';
window._fcAdminViewUser = '';
window._fcAdminHistoryCache = window._fcAdminHistoryCache || {};

window._fcState = {
    viewMode: 'picker', // 'picker' | 'study' | 'history' | 'admin'
    filterKelas: 'Semua',
    filterMapel: 'Semua',
    kelasInitDoneForUser: '',
    openTopicCards: {},
    pickedTopicsByBab: {},
    openHistoryDetailIds: {},
    cards: [],
    queue: [],
    cursorPos: 0,
    isFlipped: false,
    isReverse: false,
    typeRecallMode: false,
    userTypedRecall: '',
    deckTitle: '',
    deckKelas: '',
    isMicroSession: false,
    reviewedThisSession: 0,
    goodOrEasyCount: 0,
    gradeCounts: { 1: 0, 2: 0, 3: 0, 4: 0 },
    sessionLog: [],
    historySaved: false,
    sessionStartMs: 0,
    rewarded: false,
    // State Studio Admin (Basic / Cloze / Image Occlusion)
    editingDeckId: '',
    adminCardType: 'basic',
    occImageData: '',
    occHideMode: 'hide_all',
    occBoxes: [],
    occDrawing: false,
    occStartPt: null,
    occPreviewBox: null
};

window.fcEsc = function(s) {
    return String(s === undefined || s === null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

window.fcGuruAktif = function() {
    return (window.guruAktif || sessionStorage.getItem('guruTarget') || 'mahardika').trim().toLowerCase();
};

window.fcUserKeyAktif = function() {
    let stat = sessionStorage.getItem('statusLogin');
    let rawU = String(sessionStorage.getItem('username') || '').trim().toLowerCase();
    if (stat === 'siswa' && rawU && rawU !== 'tamu') {
        return rawU.replace(/[^a-z0-9_-]/g, '_');
    }
    if (stat === 'admin') return 'admin_' + window.fcGuruAktif();
    return 'tamu_lokal';
};

window.fcCacheKeyDecks = function() {
    return 'cache_admin_flashcards_' + window.fcGuruAktif();
};

window.fcCacheKeySRS = function() {
    return 'cache_fc_srs_' + window.fcGuruAktif() + '_' + window.fcUserKeyAktif();
};

window.fcCacheKeyHistory = function() {
    return 'cache_fc_history_' + window.fcGuruAktif() + '_' + window.fcUserKeyAktif();
};

window.fcNormTopik = function(t) {
    if (typeof window.normalisasiTopikLatihan === 'function') {
        return window.normalisasiTopikLatihan(t);
    }
    let s = String(t || '').trim();
    return s ? s : 'Umum';
};

// =========================================================================
// 1. DETEKSI KELAS AKUN SISWA -> PEMETAAN KE TINGKAT BANK SOAL (KELAS 10/11/12)
// =========================================================================
window.petakanTingkatKelasFC = function(rawKelas) {
    let s = String(rawKelas || '').trim();
    if (!s) return '';
    let low = s.toLowerCase();
    if (low === 'umum' || low === 'tamu') return '';

    if (/^(?:kelas\s*)?(?:xii\b|12\b)/i.test(s) || low.indexOf('kelas 12') !== -1) return 'Kelas 12';
    if (/^(?:kelas\s*)?(?:xi\b|11\b)/i.test(s) || low.indexOf('kelas 11') !== -1) return 'Kelas 11';
    if (/^(?:kelas\s*)?(?:x\b|10\b)/i.test(s) || low.indexOf('kelas 10') !== -1) return 'Kelas 10';
    if (/^(?:kelas\s*)?(?:smp\b|[789]\b)/i.test(s) || low.indexOf('smp') !== -1) return 'SMP';
    if (/^(?:kelas\s*)?(?:sd\b|[1-6]\b)/i.test(s) || low.indexOf('sd') !== -1) return 'SD';
    return s;
};

window.ambilKelasAkunSiswaFC = function() {
    let stat = sessionStorage.getItem('statusLogin');
    let rawU = String(sessionStorage.getItem('username') || '').trim();
    let uLow = rawU.toLowerCase();
    if (stat !== 'siswa' || !uLow || uLow === 'tamu' || uLow === 'sbd') return null;

    let akun = null;
    if (typeof window.ambilAkunSiswaAktifUjian === 'function') {
        akun = window.ambilAkunSiswaAktifUjian();
    }
    if (!akun && window.akunSiswaData) {
        akun = window.akunSiswaData[uLow] || window.akunSiswaData[rawU] || null;
        if (!akun) {
            let kFound = Object.keys(window.akunSiswaData).find(function(k) {
                return k.toLowerCase() === uLow;
            });
            if (kFound) akun = window.akunSiswaData[kFound];
        }
    }
    if (!akun && window.leaderboardSiswaData) {
        akun = window.leaderboardSiswaData[uLow] || window.leaderboardSiswaData[rawU] || null;
        if (!akun) {
            let kFoundLB = Object.keys(window.leaderboardSiswaData).find(function(k) {
                return k.toLowerCase() === uLow;
            });
            if (kFoundLB) akun = window.leaderboardSiswaData[kFoundLB];
        }
    }

    if (!akun || !akun.kelas) return null;
    let rawKelas = String(akun.kelas || '').trim();
    let mappedKelas = window.petakanTingkatKelasFC(rawKelas);
    if (!mappedKelas) return null;

    return {
        username: uLow,
        namaLengkap: akun.namaLengkap || rawU,
        rawKelas: rawKelas,
        mappedKelas: mappedKelas
    };
};

window.apakahKartuSesuaiKelasAkunFC = function(card, kelasInfo) {
    if (!card || !kelasInfo || !kelasInfo.mappedKelas) return true;
    let cardKlsRaw = String(card.kelas || '').trim();
    let cardKlsLow = cardKlsRaw.toLowerCase();
    let rawLow = String(kelasInfo.rawKelas || '').trim().toLowerCase();
    let mapLow = String(kelasInfo.mappedKelas || '').trim().toLowerCase();

    if (cardKlsLow === mapLow || cardKlsLow === rawLow) return true;
    let cardMapped = window.petakanTingkatKelasFC(cardKlsRaw).toLowerCase();
    return Boolean(cardMapped && cardMapped === mapLow);
};

// =========================================================================
// 2. PENYIMPANAN DECK (ADMIN), SRS SM-2, & HISTORY SESI SISWA
// =========================================================================
window.pastikanDataFlashcardsSiap = function() {
    if (!window.adminFlashcardsData || typeof window.adminFlashcardsData !== 'object') {
        window.adminFlashcardsData = {};
    }
    if (Object.keys(window.adminFlashcardsData).length === 0) {
        try {
            let raw = localStorage.getItem(window.fcCacheKeyDecks());
            if (raw) {
                let parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') window.adminFlashcardsData = parsed;
            }
        } catch (e) {}
    }

    let uKey = window.fcUserKeyAktif();
    if (window._fcSrsLoadedUser !== uKey) {
        window._fcSrsMap = {};
        try {
            let rawSrs = localStorage.getItem(window.fcCacheKeySRS());
            if (rawSrs) {
                let pSrs = JSON.parse(rawSrs);
                if (pSrs && typeof pSrs === 'object') window._fcSrsMap = pSrs;
            }
        } catch (e) {}
        window._fcSrsLoadedUser = uKey;
    }

    if (window._fcHistoryLoadedUser !== uKey) {
        window._fcHistoryList = [];
        try {
            let rawHist = localStorage.getItem(window.fcCacheKeyHistory());
            if (rawHist) {
                let pHist = JSON.parse(rawHist);
                if (Array.isArray(pHist)) window._fcHistoryList = pHist;
            }
        } catch (e) {}
        window._fcHistoryLoadedUser = uKey;
    }
};

window.gabungkanHistoryFlashcardsUnik = function(arrA, arrB) {
    let map = {};
    (arrA || []).concat(arrB || []).forEach(function(item) {
        if (!item || !item.judul) return;
        let k = item.id || (String(item.timestamp || 0) + '_' + item.judul);
        map[k] = item;
    });
    return Object.values(map).sort(function(a, b) {
        return (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0);
    }).slice(0, 120);
};

window.muatDataFlashcardsDariServer = function(forceRefresh, onDone) {
    window.pastikanDataFlashcardsSiap();
    let guru = window.fcGuruAktif();
    let pathDecks = 'data_guru/' + guru + '/admin_flashcards';
    let stat = sessionStorage.getItem('statusLogin');
    let uKey = window.fcUserKeyAktif();
    let perluSyncUser = (stat === 'siswa' && uKey && uKey !== 'tamu_lokal');

    if (typeof window.bacaDataRestFirebase !== 'function') {
        if (onDone) onDone();
        return;
    }

    let tasks = [];
    tasks.push(new Promise(function(resolve) {
        window.bacaDataRestFirebase(pathDecks, function(val) {
            if (val && typeof val === 'object') {
                window.adminFlashcardsData = val;
                try { localStorage.setItem(window.fcCacheKeyDecks(), JSON.stringify(val)); } catch (e) {}
            }
            window._fcServerLoaded = true;
            resolve();
        }, function() {
            window._fcServerLoaded = true;
            resolve();
        }, { forceRefresh: Boolean(forceRefresh), ttlMs: 120000 });
    }));

    if (perluSyncUser) {
        let pathSrs = 'data_guru/' + guru + '/fc_srs/' + uKey;
        tasks.push(new Promise(function(resolve) {
            window.bacaDataRestFirebase(pathSrs, function(val) {
                if (val && typeof val === 'object') {
                    let merged = Object.assign({}, window._fcSrsMap);
                    Object.keys(val).forEach(function(cid) {
                        let srv = val[cid];
                        let loc = merged[cid];
                        if (!loc || (Number(srv && srv.last) || 0) > (Number(loc && loc.last) || 0)) {
                            merged[cid] = srv;
                        }
                    });
                    window._fcSrsMap = merged;
                    try { localStorage.setItem(window.fcCacheKeySRS(), JSON.stringify(merged)); } catch (e) {}
                }
                resolve();
            }, function() { resolve(); }, { forceRefresh: Boolean(forceRefresh), ttlMs: 60000 });
        }));

        let pathHist = 'data_guru/' + guru + '/fc_history/' + uKey;
        tasks.push(new Promise(function(resolve) {
            window.bacaDataRestFirebase(pathHist, function(val) {
                if (val && typeof val === 'object') {
                    let arrSrv = Array.isArray(val) ? val : Object.values(val);
                    window._fcHistoryList = window.gabungkanHistoryFlashcardsUnik(arrSrv, window._fcHistoryList);
                    try { localStorage.setItem(window.fcCacheKeyHistory(), JSON.stringify(window._fcHistoryList)); } catch (e) {}
                }
                resolve();
            }, function() { resolve(); }, { forceRefresh: Boolean(forceRefresh), ttlMs: 60000 });
        }));
    }

    Promise.all(tasks).then(function() {
        if (onDone) onDone();
    });
};

window.simpanDataFlashcardsKeServer = function() {
    try { localStorage.setItem(window.fcCacheKeyDecks(), JSON.stringify(window.adminFlashcardsData || {})); } catch (e) {}
    let pathDB = 'data_guru/' + window.fcGuruAktif() + '/admin_flashcards';
    if (typeof window.tulisDataRestFirebase === 'function') {
        window.tulisDataRestFirebase(pathDB, window.adminFlashcardsData || {}, 'PUT');
    }
};

window.simpanSRSFlashcards = function(segera) {
    try { localStorage.setItem(window.fcCacheKeySRS(), JSON.stringify(window._fcSrsMap || {})); } catch (e) {}

    let stat = sessionStorage.getItem('statusLogin');
    let uKey = window.fcUserKeyAktif();
    if (stat !== 'siswa' || !uKey || uKey === 'tamu_lokal') return;
    if (typeof window.tulisDataRestFirebase !== 'function') return;

    let kirim = function() {
        let pathSrs = 'data_guru/' + window.fcGuruAktif() + '/fc_srs/' + uKey;
        window.tulisDataRestFirebase(pathSrs, window._fcSrsMap || {}, 'PUT');
    };

    clearTimeout(window._fcSrsSaveTimer);
    if (segera) kirim();
    else window._fcSrsSaveTimer = setTimeout(kirim, 1200);
};

window.simpanHistorySesiJikaPerlu = function(isTuntas) {
    let st = window._fcState;
    if (!st || st.historySaved || st.reviewedThisSession <= 0) return;

    st.historySaved = true;
    window.pastikanDataFlashcardsSiap();

    let now = new Date();
    let waktuStr = String(now.getDate()).padStart(2, '0') + '/' +
                   String(now.getMonth() + 1).padStart(2, '0') + '/' +
                   now.getFullYear() + ' ' +
                   String(now.getHours()).padStart(2, '0') + ':' +
                   String(now.getMinutes()).padStart(2, '0');

    let durasiDetik = Math.max(1, Math.round((Date.now() - (st.sessionStartMs || Date.now())) / 1000));
    let akurasi = Math.round((st.goodOrEasyCount / Math.max(1, st.reviewedThisSession)) * 100);
    let infoKls = window.ambilKelasAkunSiswaFC();
    let entryId = 'fch_' + Date.now() + '_' + Math.floor(100 + Math.random() * 900);

    let record = {
        id: entryId,
        judul: st.deckTitle || 'Flashcards',
        kelas: st.deckKelas || (infoKls ? infoKls.mappedKelas : (st.filterKelas || 'Umum')),
        kelasAkun: infoKls ? infoKls.rawKelas : '',
        isMicro: Boolean(st.isMicroSession),
        tuntas: Boolean(isTuntas),
        totalReview: st.reviewedThisSession,
        akurasi: akurasi,
        durasiDetik: durasiDetik,
        grades: {
            again: Number(st.gradeCounts[1]) || 0,
            hard: Number(st.gradeCounts[2]) || 0,
            good: Number(st.gradeCounts[3]) || 0,
            easy: Number(st.gradeCounts[4]) || 0
        },
        kartuLog: (st.sessionLog || []).slice(0, 35),
        waktu: waktuStr,
        timestamp: Date.now()
    };

    window._fcHistoryList = window.gabungkanHistoryFlashcardsUnik([record], window._fcHistoryList);
    try {
        localStorage.setItem(window.fcCacheKeyHistory(), JSON.stringify(window._fcHistoryList));
    } catch (e) {}

    let stat = sessionStorage.getItem('statusLogin');
    let uKey = window.fcUserKeyAktif();
    if (stat === 'siswa' && uKey && uKey !== 'tamu_lokal') {
        let pathHist = 'data_guru/' + window.fcGuruAktif() + '/fc_history/' + uKey + '/' + entryId;
        if (typeof window.tulisDataRestFirebase === 'function') {
            window.tulisDataRestFirebase(pathHist, record, 'PUT');
        }
        // Catat juga ke Riwayat Aktivitas Profil Siswa
        if (typeof window.catatRiwayatAktivitasSiswa === 'function') {
            let detailProfil = 'Review: ' + record.totalReview + ' kartu | Retensi: ' + record.akurasi +
                '% (Good/Easy: ' + (record.grades.good + record.grades.easy) +
                ', Hard: ' + record.grades.hard + ', Again: ' + record.grades.again + ')';
            window.catatRiwayatAktivitasSiswa('flashcards', 'Flashcards: ' + record.judul, detailProfil);
        }
    }
};

// =========================================================================
// 3. MESIN ALGORITMA SPACED REPETITION (SM-2)
// =========================================================================
window.hitungJadwalSM2 = function(prevState, grade) {
    let now = Date.now();
    let reps = prevState ? (Number(prevState.reps) || 0) : 0;
    let interval = prevState ? (Number(prevState.interval) || 0) : 0;
    let ease = prevState ? (Number(prevState.ease) || 2.5) : 2.5;
    let lapses = prevState ? (Number(prevState.lapses) || 0) : 0;

    let nextReps = reps;
    let nextInterval = interval;
    let nextEase = ease;
    let nextLapses = lapses;
    let dueMs = now;

    if (grade === 1) {
        nextReps = 0;
        nextInterval = 0;
        nextLapses = lapses + 1;
        nextEase = Math.max(1.3, Number((ease - 0.2).toFixed(2)));
        dueMs = now + (10 * 60 * 1000);
    } else if (grade === 2) {
        if (reps === 0) {
            nextInterval = 0.5;
            nextReps = 1;
        } else {
            nextInterval = Math.max(1, Math.round(interval * 1.2));
            nextReps = reps + 1;
        }
        nextEase = Math.max(1.3, Number((ease - 0.15).toFixed(2)));
        dueMs = now + Math.round(nextInterval * 86400000);
    } else if (grade === 3) {
        if (reps === 0) {
            nextInterval = 1;
            nextReps = 1;
        } else if (reps === 1) {
            nextInterval = 6;
            nextReps = 2;
        } else {
            nextInterval = Math.max(2, Math.round(interval * ease));
            nextReps = reps + 1;
        }
        dueMs = now + Math.round(nextInterval * 86400000);
    } else {
        if (reps === 0) {
            nextInterval = 4;
            nextReps = 1;
        } else if (reps === 1) {
            nextInterval = 10;
            nextReps = 2;
        } else {
            nextInterval = Math.max(4, Math.round(interval * ease * 1.3) + 1);
            nextReps = reps + 1;
        }
        nextEase = Math.min(3.0, Number((ease + 0.15).toFixed(2)));
        dueMs = now + Math.round(nextInterval * 86400000);
    }

    return {
        reps: nextReps,
        interval: nextInterval,
        ease: nextEase,
        lapses: nextLapses,
        due: dueMs,
        last: now
    };
};

window.formatIntervalSM2 = function(intervalHari, grade) {
    if (grade === 1 || intervalHari <= 0) return '< 10 mnt';
    if (intervalHari < 1) {
        let jam = Math.max(1, Math.round(intervalHari * 24));
        return jam + ' jam';
    }
    if (intervalHari < 14) return Math.round(intervalHari) + ' hari';
    if (intervalHari < 60) return (intervalHari / 7).toFixed(1).replace('.0', '') + ' mgg';
    return (intervalHari / 30).toFixed(1).replace('.0', '') + ' bln';
};

window.statusKartuSM2 = function(cardId) {
    let rec = window._fcSrsMap ? window._fcSrsMap[cardId] : null;
    if (!rec || !rec.last) return 'new';
    let now = Date.now();
    if ((Number(rec.due) || 0) <= now) return 'due';
    if ((Number(rec.interval) || 0) >= 6) return 'mastered';
    return 'learning';
};

// =========================================================================
// 4. PARSER CLOZE DELETION & EKSTRAKSI KARTU DARI SEMUA SUMBER
// =========================================================================
window.parseTeksClozeKeKartu = function(rawText, deckMeta, lineIndex) {
    let text = String(rawText || '').trim();
    if (!text) return [];

    let regex = /\{\{(?:c(\d+)::)?([\s\S]+?)\}\}/g;
    let tokens = [];
    let lastPos = 0;
    let match;
    let autoNum = 1;
    let clozeIndices = new Set();

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastPos) {
            tokens.push({ type: 'text', val: text.slice(lastPos, match.index) });
        }
        let num = match[1] ? parseInt(match[1], 10) : autoNum++;
        let body = match[2];
        let sepIdx = body.indexOf('::');
        let answer = sepIdx !== -1 ? body.slice(0, sepIdx).trim() : body.trim();
        let hint = sepIdx !== -1 ? body.slice(sepIdx + 2).trim() : '';

        clozeIndices.add(num);
        tokens.push({ type: 'cloze', num: num, answer: answer, hint: hint });
        lastPos = regex.lastIndex;
    }

    if (lastPos < text.length) {
        tokens.push({ type: 'text', val: text.slice(lastPos) });
    }

    if (clozeIndices.size === 0) return [];

    let results = [];
    let sortedNums = Array.from(clozeIndices).sort(function(a, b) { return a - b; });
    sortedNums.forEach(function(targetNum) {
        let frontHtml = '';
        let backHtml = '';
        let plainFront = '';
        let targetAnswers = [];

        tokens.forEach(function(tk) {
            if (tk.type === 'text') {
                let safeTxt = window.fcEsc(tk.val).replace(/\n/g, '<br>');
                frontHtml += safeTxt;
                backHtml += safeTxt;
                plainFront += tk.val;
            } else if (tk.num === targetNum) {
                let blankLbl = tk.hint ? ('[ ' + window.fcEsc(tk.hint) + ' ]') : '[ ... ]';
                frontHtml += '<span class="fc-cloze-blank">' + blankLbl + '</span>';
                backHtml += '<span class="fc-cloze-reveal">' + window.fcEsc(tk.answer) + '</span>';
                plainFront += ' [...] ';
                targetAnswers.push(tk.answer);
            } else {
                let plainAns = window.fcEsc(tk.answer);
                frontHtml += plainAns;
                backHtml += plainAns;
                plainFront += tk.answer;
            }
        });

        let tName = window.fcNormTopik(deckMeta.topik);
        results.push({
            id: 'cz_' + deckMeta.id + '_' + lineIndex + '_c' + targetNum,
            format: 'cloze',
            kelas: deckMeta.kelas || 'Umum',
            mapel: deckMeta.mapel || 'Biologi',
            bab: deckMeta.bab || deckMeta.judul || 'Umum',
            topik: tName,
            level: 'CLOZE',
            frontHtml: frontHtml,
            backHtml: backHtml,
            plainFront: plainFront.trim(),
            plainAnswer: targetAnswers.join(', '),
            hint: deckMeta.catatan || '',
            tag: 'Cloze c' + targetNum + (tName !== 'Umum' ? (' • ' + tName) : '')
        });
    });

    return results;
};

window.ekstrakJawabanTeksUntukFlashcard = function(q) {
    let rawKunci = Array.isArray(q.correct) ? q.correct : (q.correct ? [q.correct] : []);
    let opts = Array.isArray(q.options) ? q.options : [];
    let tipe = String(q.type || 'PG').toUpperCase();

    if ((tipe === 'PG' || tipe === 'PGK') && opts.length > 0 && rawKunci.length > 0) {
        let cocok = [];
        rawKunci.forEach(function(k) {
            let kUp = String(k || '').trim().toUpperCase();
            let found = opts.find(function(o, idx) {
                let lbl = (o && o.label) ? String(o.label).toUpperCase() : String.fromCharCode(65 + idx);
                return lbl === kUp;
            });
            if (found) {
                let txt = (found.text !== undefined) ? found.text : String(found);
                cocok.push(txt);
            } else if (kUp) {
                cocok.push(String(k));
            }
        });
        if (cocok.length > 0) return cocok.join(' • ');
    }
    return rawKunci.join(' / ') || '-';
};

window.kumpulkanSemuaKartuFlashcards = function() {
    window.pastikanDataFlashcardsSiap();
    let allCards = [];

    Object.keys(window.adminFlashcardsData || {}).sort().forEach(function(dkId) {
        let dk = window.adminFlashcardsData[dkId];
        if (!dk) return;
        let tipeDk = dk.tipe || 'basic';
        let kls = dk.kelas || 'Umum';
        let mpl = dk.mapel || 'Biologi';
        let bab = dk.bab || dk.judul || 'Umum';
        let topik = window.fcNormTopik(dk.topik);

        if (tipeDk === 'occlusion') {
            let boxes = Array.isArray(dk.boxes) ? dk.boxes : Object.values(dk.boxes || {});
            if (!dk.imageData || boxes.length === 0) return;
            boxes.forEach(function(bx, bIdx) {
                if (!bx) return;
                allCards.push({
                    id: 'io_' + dkId + '_' + (bx.id || bIdx),
                    format: 'occlusion',
                    kelas: kls,
                    mapel: mpl,
                    bab: bab,
                    topik: topik,
                    level: 'VISUAL',
                    imageData: dk.imageData,
                    hideMode: dk.hideMode || 'hide_all',
                    allBoxes: boxes,
                    targetBoxIdx: bIdx,
                    plainFront: 'Diagram ' + bab + ' (Label #' + (bIdx + 1) + ')',
                    plainAnswer: bx.label || ('Label #' + (bIdx + 1)),
                    hint: bx.label ? ('Label target: ' + bx.label) : '',
                    tag: 'Visual #' + (bIdx + 1) + (topik !== 'Umum' ? (' • ' + topik) : '')
                });
            });
        } else if (tipeDk === 'cloze') {
            let arr = Array.isArray(dk.kartu) ? dk.kartu : Object.values(dk.kartu || {});
            arr.forEach(function(item, idx) {
                let rawTeks = (typeof item === 'string') ? item : (item && (item.clozeText || item.front) ? (item.clozeText || item.front) : '');
                let metaObj = { id: dkId, kelas: kls, mapel: mpl, bab: bab, topik: topik, catatan: (item && item.hint) ? item.hint : '' };
                let generated = window.parseTeksClozeKeKartu(rawTeks, metaObj, idx);
                allCards = allCards.concat(generated);
            });
        } else {
            let arr = Array.isArray(dk.kartu) ? dk.kartu : Object.values(dk.kartu || {});
            arr.forEach(function(c, idx) {
                if (!c || !c.front) return;
                allCards.push({
                    id: 'cb_' + dkId + '_' + idx,
                    format: 'basic',
                    kelas: kls,
                    mapel: mpl,
                    bab: bab,
                    topik: topik,
                    level: 'KONSEP',
                    front: String(c.front),
                    back: String(c.back || '-'),
                    plainFront: String(c.front),
                    plainAnswer: String(c.back || ''),
                    hint: String(c.hint || ''),
                    tag: 'Konsep' + (topik !== 'Umum' ? (' • ' + topik) : '')
                });
            });
        }
    });

    let bank = window.adminBankLatihanData || {};
    Object.keys(bank).sort().forEach(function(bKey) {
        let item = bank[bKey];
        if (!item || !item.bab) return;
        let arr = Array.isArray(item.soal) ? item.soal : Object.values(item.soal || {});
        let kls = item.kelas || 'Umum';
        let mpl = item.mapel || 'Biologi';
        let bab = item.bab;
        let topik = window.fcNormTopik(item.topik);
        let lvl = String(item.kesulitan || 'C1').toUpperCase();

        arr.forEach(function(q, qIdx) {
            if (!q || !q.question) return;
            let ansText = window.ekstrakJawabanTeksUntukFlashcard(q);
            let qClean = String(q.question).replace(/<br\s*\/?>/gi, '\n');
            allCards.push({
                id: 'bl_' + bKey + '_' + qIdx,
                format: 'basic',
                kelas: kls,
                mapel: mpl,
                bab: bab,
                topik: topik,
                level: lvl,
                front: qClean,
                back: ansText,
                plainFront: qClean,
                plainAnswer: ansText,
                hint: String(q.explanation || ''),
                tag: lvl + (topik !== 'Umum' ? (' • ' + topik) : '')
            });
        });
    });

    return allCards;
};

// =========================================================================
// 5. MODAL UTAMA FLASHCARDS & NAVIGASI PEMILIH BAB / HISTORY / ADMIN
// =========================================================================
window.pastikanModalFlashcardsAda = function() {
    let modal = document.getElementById('modal-flashcards');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'modal-flashcards';
    modal.className = 'modal-overlay';
    modal.onclick = function(e) {
        if (e.target === modal) window.tutupModalFlashcards();
    };

    modal.innerHTML =
        '<div class="modal-box fc-modal-box">' +
            '<div class="modal-header fc-modal-header">' +
                '<div>' +
                    '<h3 style="margin:0;">🃏 Flashcards Active Recall (SM-2)</h3>' +
                    '<div class="fc-subtitle">Spaced Repetition otomatis • Basic, Cloze Rumpang, &amp; Image Occlusion Visual</div>' +
                '</div>' +
                '<div style="display:flex; align-items:center; gap:7px; flex-wrap:wrap;">' +
                    '<button type="button" id="btn-fc-history" class="fc-hdr-hist-btn" onclick="window.toggleModeHistoryFlashcards()">📜 History</button>' +
                    '<button type="button" id="btn-fc-admin-kelola" class="fc-hdr-admin-btn" style="display:none;" onclick="window.toggleModeKelolaFlashcardsAdmin()">➕ Studio Kartu</button>' +
                    '<button type="button" class="fc-close-btn" onclick="window.tutupModalFlashcards()">✕</button>' +
                '</div>' +
            '</div>' +
            '<div class="modal-body fc-modal-body">' +
                '<div id="fc-view-picker" class="fc-view-picker"></div>' +
                '<div id="fc-view-study" class="fc-view-study" style="display:none;"></div>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);
    return modal;
};

window.tutupModalFlashcards = function() {
    if (window._fcState.viewMode === 'study') {
        window.simpanHistorySesiJikaPerlu(false);
    }
    window.tutupModal('modal-flashcards');
};

window.sinkronkanTombolHeaderFC = function() {
    let btnHist = document.getElementById('btn-fc-history');
    let btnAdmin = document.getElementById('btn-fc-admin-kelola');
    let mode = window._fcState.viewMode;

    if (btnHist) {
        btnHist.classList.toggle('is-active', mode === 'history');
        btnHist.innerText = (mode === 'history') ? '← Daftar Bab' : '📜 History';
    }
    if (btnAdmin) {
        btnAdmin.classList.toggle('is-active', mode === 'admin');
        btnAdmin.innerText = (mode === 'admin') ? '← Daftar Bab' : '➕ Studio Kartu';
    }
};

window.bukaModalFlashcards = function() {
    window.pastikanModalFlashcardsAda();
    window.pastikanDataFlashcardsSiap();

    let isAdmin = (sessionStorage.getItem('statusLogin') === 'admin') ||
                  (typeof window.isAdminSession === 'function' && window.isAdminSession());
    let btnAdmin = document.getElementById('btn-fc-admin-kelola');
    if (btnAdmin) btnAdmin.style.display = isAdmin ? 'inline-flex' : 'none';

    if (typeof window.pastikanListenerBankLatihanAktif === 'function') {
        window.pastikanListenerBankLatihanAktif();
    }

    // Set filter kelas awal otomatis mengikuti kelas akun siswa
    let uKey = window.fcUserKeyAktif();
    let infoKls = window.ambilKelasAkunSiswaFC();
    if (infoKls && infoKls.mappedKelas && window._fcState.kelasInitDoneForUser !== uKey) {
        window._fcState.filterKelas = infoKls.mappedKelas;
        window._fcState.kelasInitDoneForUser = uKey;
    }

    window._fcState.viewMode = 'picker';
    window.sinkronkanTombolHeaderFC();
    window.bukaModal('modal-flashcards');
    window.kembaliKePemilihFlashcards();

    window.muatDataFlashcardsDariServer(false, function() {
        let infoBaru = window.ambilKelasAkunSiswaFC();
        if (infoBaru && infoBaru.mappedKelas && window._fcState.kelasInitDoneForUser !== window.fcUserKeyAktif()) {
            window._fcState.filterKelas = infoBaru.mappedKelas;
            window._fcState.kelasInitDoneForUser = window.fcUserKeyAktif();
        }
        if (window._fcState.viewMode === 'picker' || window._fcState.viewMode === 'history') {
            window.renderPemilihFlashcards();
        }
    });
};

window.toggleModeHistoryFlashcards = function() {
    if (window._fcState.viewMode === 'study') {
        window.simpanHistorySesiJikaPerlu(false);
    }
    window._fcState.viewMode = (window._fcState.viewMode === 'history') ? 'picker' : 'history';
    window.sinkronkanTombolHeaderFC();
    window.kembaliKePemilihFlashcards();
};

window.toggleModeKelolaFlashcardsAdmin = function() {
    if (window._fcState.viewMode === 'study') {
        window.simpanHistorySesiJikaPerlu(false);
    }
    window._fcState.viewMode = (window._fcState.viewMode === 'admin') ? 'picker' : 'admin';
    window.sinkronkanTombolHeaderFC();
    window.kembaliKePemilihFlashcards();
};

window.kembaliKePemilihFlashcards = function() {
    if (window._fcState.viewMode === 'study') {
        window.simpanHistorySesiJikaPerlu(false);
        window._fcState.viewMode = 'picker';
    }
    let vPick = document.getElementById('fc-view-picker');
    let vStudy = document.getElementById('fc-view-study');
    if (vPick) vPick.style.display = 'flex';
    if (vStudy) vStudy.style.display = 'none';
    window.sinkronkanTombolHeaderFC();
    window.renderPemilihFlashcards();
};

window.togglePanelTopikKartuFC = function(gKey) {
    window._fcState.openTopicCards[gKey] = !window._fcState.openTopicCards[gKey];
    window.renderPemilihFlashcards();
};

window.toggleTopikDiKartuFC = function(gKey, topikNama) {
    let map = window._fcState.pickedTopicsByBab;
    if (!Array.isArray(map[gKey])) map[gKey] = [];
    let idx = map[gKey].indexOf(topikNama);
    if (idx === -1) map[gKey].push(topikNama);
    else map[gKey].splice(idx, 1);
    window.renderPemilihFlashcards();
};

window.renderPemilihFlashcards = function() {
    let cont = document.getElementById('fc-view-picker');
    if (!cont) return;

    if (window._fcState.viewMode === 'admin') {
        window.renderStudioAdminFlashcards(cont);
        return;
    }
    if (window._fcState.viewMode === 'history') {
        window.renderHistoryFlashcards(cont);
        return;
    }

    let allCards = window.kumpulkanSemuaKartuFlashcards();
    let infoKlsSiswa = window.ambilKelasAkunSiswaFC();
    let fKls = window._fcState.filterKelas || 'Semua';
    let fMpl = window._fcState.filterMapel || 'Semua';

    // Statistik Banner Sesi Cepat: jika login sebagai siswa, khusus menghitung kartu sesuai kelas akun siswa!
    let microStats = { due: 0, newCnt: 0, mastered: 0, total: 0 };
    let grouped = {};
    let kelasSet = new Set();
    let mapelSet = new Set();

    allCards.forEach(function(c) {
        kelasSet.add(c.kelas);
        mapelSet.add(c.mapel);
        let stCard = window.statusKartuSM2(c.id);

        let masukMicro = infoKlsSiswa
            ? window.apakahKartuSesuaiKelasAkunFC(c, infoKlsSiswa)
            : ((fKls === 'Semua' || c.kelas === fKls) && (fMpl === 'Semua' || c.mapel === fMpl));

        if (masukMicro) {
            microStats.total++;
            if (stCard === 'due') microStats.due++;
            else if (stCard === 'new') microStats.newCnt++;
            else if (stCard === 'mastered') microStats.mastered++;
        }

        if (fKls !== 'Semua' && c.kelas !== fKls) return;
        if (fMpl !== 'Semua' && c.mapel !== fMpl) return;

        let gKey = c.kelas + '||' + c.mapel + '||' + c.bab;
        if (!grouped[gKey]) {
            grouped[gKey] = {
                key: gKey,
                kelas: c.kelas,
                mapel: c.mapel,
                bab: c.bab,
                topics: {},
                formats: { basic: 0, cloze: 0, occlusion: 0 },
                levels: { C1: 0, C2: 0, HOTS: 0 },
                due: 0,
                newCnt: 0,
                mastered: 0,
                total: 0
            };
        }
        let g = grouped[gKey];
        g.total++;
        g.topics[c.topik] = (g.topics[c.topik] || 0) + 1;
        if (g.formats[c.format] !== undefined) g.formats[c.format]++;
        if (g.levels[c.level] !== undefined) g.levels[c.level]++;
        if (stCard === 'due') g.due++;
        else if (stCard === 'new') g.newCnt++;
        else if (stCard === 'mastered') g.mastered++;
    });

    // Pastikan kelas akun siswa tetap ada di dropdown walaupun stok sedang 0
    if (infoKlsSiswa && infoKlsSiswa.mappedKelas) {
        kelasSet.add(infoKlsSiswa.mappedKelas);
    }

    let daftarBab = Object.values(grouped).sort(function(a, b) {
        if (a.due !== b.due) return b.due - a.due;
        let cmpK = a.kelas.localeCompare(b.kelas);
        return cmpK !== 0 ? cmpK : a.bab.localeCompare(b.bab);
    });

    let optKls = '<option value="Semua">🏫 Semua Kelas</option>';
    Array.from(kelasSet).sort().forEach(function(k) {
        optKls += '<option value="' + window.fcEsc(k) + '"' + (fKls === k ? ' selected' : '') + '>' + window.fcEsc(k) + '</option>';
    });
    let optMpl = '<option value="Semua">📚 Semua Mapel</option>';
    Array.from(mapelSet).sort().forEach(function(m) {
        optMpl += '<option value="' + window.fcEsc(m) + '"' + (fMpl === m ? ' selected' : '') + '>' + window.fcEsc(m) + '</option>';
    });

    let labelKelasMicro = infoKlsSiswa
        ? ('Khusus ' + infoKlsSiswa.mappedKelas + ' (' + infoKlsSiswa.rawKelas + ')')
        : (fKls !== 'Semua' ? ('Filter: ' + fKls) : 'Semua Kelas');
    let tagKelasBtn = infoKlsSiswa ? (' • ' + infoKlsSiswa.mappedKelas) : '';

    let microBannerHtml =
        '<div class="fc-micro-banner">' +
            '<div class="fc-micro-left">' +
                '<div class="fc-micro-title">⚡ Micro-Learning &amp; Jadwal Ulang (SM-2) <span class="fc-micro-kls-tag">🏫 ' + window.fcEsc(labelKelasMicro) + '</span></div>' +
                '<div class="fc-micro-stats">' +
                    '<span class="fc-stat-pill is-due">🔴 ' + microStats.due + ' Jatuh Tempo</span>' +
                    '<span class="fc-stat-pill is-new">🔵 ' + microStats.newCnt + ' Baru</span>' +
                    '<span class="fc-stat-pill is-master">🟢 ' + microStats.mastered + ' Dikuasai</span>' +
                '</div>' +
            '</div>' +
            '<div class="fc-micro-actions">' +
                (microStats.due > 0
                    ? '<button type="button" class="fc-micro-btn is-due-go" onclick="window.mulaiSesiMicroLearning(\'due\')">🔔 Review Jatuh Tempo (' + Math.min(20, microStats.due) + ')</button>'
                    : '') +
                '<button type="button" class="fc-micro-btn is-quick-go" onclick="window.mulaiSesiMicroLearning(\'micro10\')">⚡ Sesi Cepat 5 Menit (10 Kartu' + window.fcEsc(tagKelasBtn) + ')</button>' +
            '</div>' +
        '</div>';

    let cardsHtml = '';
    if (daftarBab.length === 0) {
        cardsHtml = '<div class="fc-empty-state">🃏 Belum ada kartu untuk filter ini. Soal di <b>Manajer Latihan</b> maupun kartu <b>Basic / Cloze / Image Occlusion</b> dari Studio Admin otomatis muncul di sini.</div>';
    } else {
        daftarBab.forEach(function(d) {
            let topikList = Object.keys(d.topics).sort(function(a, b) {
                if (a === 'Umum') return 1;
                if (b === 'Umum') return -1;
                return a.localeCompare(b);
            });
            let adaSubTopik = topikList.length > 1 || (topikList.length === 1 && topikList[0] !== 'Umum');
            let isOpen = Boolean(window._fcState.openTopicCards[d.key]);
            let picked = window._fcState.pickedTopicsByBab[d.key] || [];

            let sKey = window.fcEsc(d.key).replace(/'/g, "\\'");
            let sK = window.fcEsc(d.kelas).replace(/'/g, "\\'");
            let sM = window.fcEsc(d.mapel).replace(/'/g, "\\'");
            let sB = window.fcEsc(d.bab).replace(/'/g, "\\'");

            let fmtBadges = '';
            if (d.formats.cloze > 0) fmtBadges += '<span class="fc-fmt-tag is-cloze">🧩 ' + d.formats.cloze + ' Cloze</span>';
            if (d.formats.occlusion > 0) fmtBadges += '<span class="fc-fmt-tag is-occ">🖼️ ' + d.formats.occlusion + ' Visual</span>';

            let topikHtml = '';
            if (adaSubTopik) {
                let chipsHtml = '';
                if (isOpen) {
                    chipsHtml = '<div class="fc-card-topic-chips">' + topikList.map(function(tNama) {
                        let isP = picked.indexOf(tNama) !== -1;
                        let sT = window.fcEsc(tNama).replace(/'/g, "\\'");
                        return '<button type="button" class="lat-topik-chip' + (isP ? ' is-picked' : '') + '" onclick="window.toggleTopikDiKartuFC(\'' + sKey + '\', \'' + sT + '\')">' +
                            (isP ? '✓ ' : '') + window.fcEsc(tNama) + ' <span>(' + d.topics[tNama] + ')</span>' +
                        '</button>';
                    }).join('') + '</div>';
                }
                topikHtml =
                    '<div class="fc-card-topic-strip">' +
                        '<button type="button" class="fc-topic-opt-btn' + (picked.length > 0 ? ' is-filtered' : '') + '" onclick="window.togglePanelTopikKartuFC(\'' + sKey + '\')">' +
                            (picked.length > 0 ? ('🎯 Fokus ' + picked.length + ' Topik (Ubah)') : ('🎯 Pilih Topik Spesifik (' + topikList.length + ' Topik)')) +
                        '</button>' +
                        chipsHtml +
                    '</div>';
            }

            let labelMulai = picked.length > 0
                ? ('▶ Belajar ' + picked.length + ' Topik')
                : (d.due > 0 ? ('▶ Review (' + d.due + ' Due)') : ('▶ Mulai (' + Math.min(20, d.total) + ')'));

            cardsHtml +=
                '<div class="fc-deck-card">' +
                    '<div class="fc-deck-top">' +
                        '<span class="fc-deck-kls">' + window.fcEsc(d.kelas) + ' • ' + window.fcEsc(d.mapel) + '</span>' +
                        '<span class="fc-deck-cnt">' + d.total + ' Kartu</span>' +
                    '</div>' +
                    '<div class="fc-deck-title">🃏 ' + window.fcEsc(d.bab) + '</div>' +
                    '<div class="fc-deck-srs-row">' +
                        '<span class="fc-srs-mini is-due" title="Jatuh tempo ulang">🔴 ' + d.due + '</span>' +
                        '<span class="fc-srs-mini is-new" title="Kartu baru">🔵 ' + d.newCnt + '</span>' +
                        '<span class="fc-srs-mini is-master" title="Sudah dikuasai">🟢 ' + d.mastered + '</span>' +
                        fmtBadges +
                    '</div>' +
                    topikHtml +
                    '<div class="fc-deck-level-row">' +
                        '<button type="button" class="fc-play-btn is-all" onclick="window.mulaiFlashcardBabSM2(\'' + sKey + '\', \'' + sK + '\', \'' + sM + '\', \'' + sB + '\', \'SEMUA\')">' + labelMulai + '</button>' +
                        (d.levels.C1 > 0 ? '<button type="button" class="fc-play-btn is-c1" onclick="window.mulaiFlashcardBabSM2(\'' + sKey + '\', \'' + sK + '\', \'' + sM + '\', \'' + sB + '\', \'C1\')">C1</button>' : '') +
                        (d.levels.C2 > 0 ? '<button type="button" class="fc-play-btn is-c2" onclick="window.mulaiFlashcardBabSM2(\'' + sKey + '\', \'' + sK + '\', \'' + sM + '\', \'' + sB + '\', \'C2\')">C2</button>' : '') +
                        (d.levels.HOTS > 0 ? '<button type="button" class="fc-play-btn is-hots" onclick="window.mulaiFlashcardBabSM2(\'' + sKey + '\', \'' + sK + '\', \'' + sM + '\', \'' + sB + '\', \'HOTS\')">HOTS</button>' : '') +
                    '</div>' +
                '</div>';
        });
    }

    cont.innerHTML =
        microBannerHtml +
        '<div class="fc-filter-bar">' +
            '<div style="font-size:11.5px; color:#2c4356; font-weight:700;">💡 Kartu <b>Jatuh Tempo (🔴)</b> otomatis diprioritaskan paling depan. Klik <b>📜 History</b> di kanan atas untuk melihat riwayat belajar.</div>' +
            '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
                '<select class="input-box fc-select-sm" style="width:155px !important;" onchange="window._fcState.filterKelas=this.value; window.renderPemilihFlashcards();">' + optKls + '</select>' +
                '<select class="input-box fc-select-sm" style="width:155px !important;" onchange="window._fcState.filterMapel=this.value; window.renderPemilihFlashcards();">' + optMpl + '</select>' +
            '</div>' +
        '</div>' +
        '<div class="fc-deck-grid">' + cardsHtml + '</div>';
};

// =========================================================================
// 6. HALAMAN HISTORY FLASHCARDS (UNTUK SISWA & PANTAUAN ADMIN PER SISWA)
// =========================================================================
window.muatHistorySiswaUntukAdminFC = function(targetUserKey) {
    window._fcAdminViewUser = targetUserKey || '';
    if (!targetUserKey) {
        window.renderPemilihFlashcards();
        return;
    }

    if (window._fcAdminHistoryCache[targetUserKey]) {
        window.renderPemilihFlashcards();
        return;
    }

    let pathHist = 'data_guru/' + window.fcGuruAktif() + '/fc_history/' + targetUserKey;
    if (typeof window.bacaDataRestFirebase === 'function') {
        window.bacaDataRestFirebase(pathHist, function(val) {
            let arr = val ? (Array.isArray(val) ? val : Object.values(val)) : [];
            arr.sort(function(a, b) { return (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0); });
            window._fcAdminHistoryCache[targetUserKey] = arr;
            if (window._fcState.viewMode === 'history') window.renderPemilihFlashcards();
        }, function() {
            window._fcAdminHistoryCache[targetUserKey] = [];
            if (window._fcState.viewMode === 'history') window.renderPemilihFlashcards();
        }, { forceRefresh: true, ttlMs: 0 });
    }
};

window.toggleDetailKartuHistoryFC = function(entryId) {
    window._fcState.openHistoryDetailIds[entryId] = !window._fcState.openHistoryDetailIds[entryId];
    window.renderPemilihFlashcards();
};

window.renderHistoryFlashcards = function(cont) {
    window.pastikanDataFlashcardsSiap();
    let isAdmin = (sessionStorage.getItem('statusLogin') === 'admin') ||
                  (typeof window.isAdminSession === 'function' && window.isAdminSession());

    let daftarRiwayat = window._fcHistoryList || [];
    let labelPemilik = 'Riwayat Belajar Saya';
    let adminBarHtml = '';

    if (isAdmin) {
        let siswaMap = {};
        Object.keys(window.akunSiswaData || {}).forEach(function(u) {
            let ak = window.akunSiswaData[u];
            if (ak && ak.namaLengkap) {
                let cleanK = u.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
                siswaMap[cleanK] = { key: cleanK, nama: ak.namaLengkap, kelas: ak.kelas || '-' };
            }
        });
        Object.keys(window.leaderboardSiswaData || {}).forEach(function(u) {
            let lb = window.leaderboardSiswaData[u];
            if (lb && lb.namaLengkap) {
                let cleanK = u.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
                if (!siswaMap[cleanK]) siswaMap[cleanK] = { key: cleanK, nama: lb.namaLengkap, kelas: lb.kelas || '-' };
            }
        });

        let daftarSiswa = Object.values(siswaMap).sort(function(a, b) {
            let ck = String(a.kelas).localeCompare(String(b.kelas));
            return ck !== 0 ? ck : String(a.nama).localeCompare(String(b.nama));
        });

        let optSiswa = '<option value="">👤 History Sesi Saya (Admin)</option>';
        daftarSiswa.forEach(function(s) {
            let sel = (window._fcAdminViewUser === s.key) ? ' selected' : '';
            optSiswa += '<option value="' + window.fcEsc(s.key) + '"' + sel + '>' + window.fcEsc(s.kelas) + ' — ' + window.fcEsc(s.nama) + '</option>';
        });

        if (window._fcAdminViewUser) {
            let found = siswaMap[window._fcAdminViewUser];
            labelPemilik = found ? ('Riwayat Siswa: ' + found.nama + ' (' + found.kelas + ')') : ('Riwayat Siswa: ' + window._fcAdminViewUser);
            daftarRiwayat = window._fcAdminHistoryCache[window._fcAdminViewUser] || [];
        }

        adminBarHtml =
            '<div class="fc-filter-bar">' +
                '<div style="font-size:12px; font-weight:800; color:#060608;">👁️ Pantau History Flashcards Siswa:</div>' +
                '<div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">' +
                    '<select class="input-box fc-select-sm" style="width:260px !important;" onchange="window.muatHistorySiswaUntukAdminFC(this.value)">' + optSiswa + '</select>' +
                    (window._fcAdminViewUser ? '<button type="button" class="aws-quick-btn" onclick="delete window._fcAdminHistoryCache[window._fcAdminViewUser]; window.muatHistorySiswaUntukAdminFC(window._fcAdminViewUser);">🔄 Segarkan</button>' : '') +
                '</div>' +
            '</div>';
    }

    let totalSesi = daftarRiwayat.length;
    let totalKartuReview = 0;
    let sumAkurasi = 0;
    daftarRiwayat.forEach(function(r) {
        totalKartuReview += Number(r.totalReview) || 0;
        sumAkurasi += Number(r.akurasi) || 0;
    });
    let rataRetensi = totalSesi > 0 ? Math.round(sumAkurasi / totalSesi) : 0;

    let totalDikuasai = 0;
    if (!window._fcAdminViewUser) {
        Object.keys(window._fcSrsMap || {}).forEach(function(cid) {
            if (window.statusKartuSM2(cid) === 'mastered') totalDikuasai++;
        });
    }

    let summaryHtml =
        '<div class="fc-hist-summary-grid">' +
            '<div class="fc-hist-stat"><span>Total Sesi</span><b>' + totalSesi + '</b></div>' +
            '<div class="fc-hist-stat"><span>Kartu Di-review</span><b>' + totalKartuReview + '</b></div>' +
            '<div class="fc-hist-stat is-ok"><span>Rata-rata Retensi</span><b>' + rataRetensi + '%</b></div>' +
            (!window._fcAdminViewUser ? '<div class="fc-hist-stat is-master"><span>Dikuasai (SM-2)</span><b>' + totalDikuasai + '</b></div>' : '<div class="fc-hist-stat is-master"><span>Status</span><b>Pantauan</b></div>') +
        '</div>';

    let listHtml = '';
    if (daftarRiwayat.length === 0) {
        listHtml =
            '<div class="fc-empty-state">' +
                '<div style="font-size:36px; margin-bottom:6px;">📜</div>' +
                '<strong>Belum Ada History Flashcards</strong>' +
                '<div style="margin-top:4px; font-size:12px;">Mulai 1 sesi Flashcards atau Sesi Cepat 5 Menit agar progres, retensi, dan rincian kartumu tercatat di sini.</div>' +
            '</div>';
    } else {
        let gradeBadge = {
            1: { lbl: 'Again', cls: 'is-again' },
            2: { lbl: 'Hard',  cls: 'is-hard' },
            3: { lbl: 'Good',  cls: 'is-good' },
            4: { lbl: 'Easy',  cls: 'is-easy' }
        };

        daftarRiwayat.forEach(function(r) {
            let g = r.grades || { again: 0, hard: 0, good: 0, easy: 0 };
            let durasiTxt = (Number(r.durasiDetik) || 0) >= 60
                ? (Math.floor(r.durasiDetik / 60) + 'm ' + (r.durasiDetik % 60) + 'd')
                : ((Number(r.durasiDetik) || 0) + ' dtk');
            let isOpen = Boolean(window._fcState.openHistoryDetailIds[r.id]);
            let kartuLog = Array.isArray(r.kartuLog) ? r.kartuLog : [];
            let safeId = window.fcEsc(r.id || '').replace(/'/g, "\\'");

            let detailKartuHtml = '';
            if (isOpen && kartuLog.length > 0) {
                let rowsLog = kartuLog.map(function(it, idx) {
                    let gb = gradeBadge[it.grade] || gradeBadge[3];
                    return '<div class="fc-hist-card-row">' +
                        '<span class="fc-hist-card-no">' + (idx + 1) + '.</span>' +
                        '<div class="fc-hist-card-txt">' +
                            '<strong>' + window.fcEsc(it.front || '-') + '</strong>' +
                            '<span>➔ ' + window.fcEsc(it.answer || '-') + '</span>' +
                        '</div>' +
                        '<span class="fc-hist-grade-pill ' + gb.cls + '">' + gb.lbl + ' (' + window.fcEsc(it.next || '') + ')</span>' +
                    '</div>';
                }).join('');
                detailKartuHtml = '<div class="fc-hist-detail-box">' + rowsLog + '</div>';
            }

            listHtml +=
                '<div class="fc-hist-item">' +
                    '<div class="fc-hist-item-top">' +
                        '<div style="min-width:0;">' +
                            '<div class="fc-hist-badges">' +
                                '<span class="fc-hist-type-tag ' + (r.isMicro ? 'is-micro' : 'is-bab') + '">' + (r.isMicro ? '⚡ Sesi Cepat' : '🃏 Per Bab') + '</span>' +
                                (r.kelas ? '<span class="fc-hist-kls-tag">' + window.fcEsc(r.kelas) + '</span>' : '') +
                                '<span class="fc-hist-time">🕒 ' + window.fcEsc(r.waktu || '-') + ' • ⏱️ ' + durasiTxt + '</span>' +
                            '</div>' +
                            '<div class="fc-hist-title">' + window.fcEsc(r.judul || 'Flashcards') + '</div>' +
                        '</div>' +
                        '<div class="fc-hist-retensi ' + ((Number(r.akurasi) || 0) >= 75 ? 'is-high' : 'is-mid') + '">' +
                            '<b>' + (Number(r.akurasi) || 0) + '%</b><span>Retensi</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="fc-hist-item-foot">' +
                        '<div class="fc-hist-grade-summary">' +
                            '<span>Review: <b>' + (Number(r.totalReview) || 0) + '</b></span>' +
                            '<span class="g-again">Again: ' + g.again + '</span>' +
                            '<span class="g-hard">Hard: ' + g.hard + '</span>' +
                            '<span class="g-good">Good: ' + g.good + '</span>' +
                            '<span class="g-easy">Easy: ' + g.easy + '</span>' +
                        '</div>' +
                        (kartuLog.length > 0
                            ? '<button type="button" class="fc-hist-expand-btn" onclick="window.toggleDetailKartuHistoryFC(\'' + safeId + '\')">' + (isOpen ? '▲ Sembunyikan Kartu' : '▼ Lihat ' + kartuLog.length + ' Kartu') + '</button>'
                            : '') +
                    '</div>' +
                    detailKartuHtml +
                '</div>';
        });
    }

    cont.innerHTML =
        adminBarHtml +
        '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">' +
            '<strong style="font-size:13.5px; color:#060608;">📜 ' + window.fcEsc(labelPemilik) + '</strong>' +
            (!window._fcAdminViewUser ? '<button type="button" class="aws-quick-btn" onclick="window.muatDataFlashcardsDariServer(true, function(){ window.renderPemilihFlashcards(); });">🔄 Segarkan</button>' : '') +
        '</div>' +
        summaryHtml +
        '<div class="fc-hist-list">' + listHtml + '</div>';
};

// =========================================================================
// 7. ANTREAN PRIORITAS SM-2 & SESI CEPAT SESUAI KELAS AKUN
// =========================================================================
window.urutkanKartuPrioritasSM2 = function(cardsArr, limitMax, hanyaDue) {
    let dueList = [];
    let newList = [];
    let otherList = [];

    cardsArr.forEach(function(c) {
        let st = window.statusKartuSM2(c.id);
        let rec = window._fcSrsMap[c.id];
        if (st === 'due') {
            dueList.push({ card: c, due: Number(rec && rec.due) || 0 });
        } else if (st === 'new') {
            newList.push(c);
        } else {
            otherList.push({ card: c, due: Number(rec && rec.due) || 0 });
        }
    });

    dueList.sort(function(a, b) { return a.due - b.due; });
    newList.sort(function() { return Math.random() - 0.5; });
    otherList.sort(function(a, b) { return a.due - b.due; });

    let combined = dueList.map(function(x) { return x.card; });
    if (!hanyaDue) {
        combined = combined.concat(newList);
        if (combined.length < limitMax) {
            combined = combined.concat(otherList.map(function(x) { return x.card; }));
        }
    }
    return combined.slice(0, limitMax);
};

window.mulaiSesiMicroLearning = function(mode) {
    let allCards = window.kumpulkanSemuaKartuFlashcards();
    let infoKlsSiswa = window.ambilKelasAkunSiswaFC();
    let fKls = window._fcState.filterKelas || 'Semua';
    let fMpl = window._fcState.filterMapel || 'Semua';

    // Jika login sebagai Siswa: kunci Sesi Cepat & Review Jatuh Tempo khusus ke kelas akun siswa tersebut
    let pool = [];
    let kelasLabel = '';

    if (infoKlsSiswa && infoKlsSiswa.mappedKelas) {
        kelasLabel = infoKlsSiswa.mappedKelas;
        pool = allCards.filter(function(c) {
            return window.apakahKartuSesuaiKelasAkunFC(c, infoKlsSiswa);
        });
        if (pool.length === 0) {
            return alert('⚠️ Belum ada kartu Flashcards untuk kelas akunmu (' + infoKlsSiswa.mappedKelas + ' / ' + infoKlsSiswa.rawKelas + ').');
        }
    } else {
        kelasLabel = (fKls !== 'Semua') ? fKls : 'Semua Kelas';
        pool = allCards.filter(function(c) {
            if (fKls !== 'Semua' && c.kelas !== fKls) return false;
            if (fMpl !== 'Semua' && c.mapel !== fMpl) return false;
            return true;
        });
        if (pool.length === 0) {
            return alert('⚠️ Belum ada kartu Flashcards tersedia untuk filter saat ini.');
        }
    }

    let isDueOnly = (mode === 'due');
    let chosen = window.urutkanKartuPrioritasSM2(pool, isDueOnly ? 20 : 10, isDueOnly);
    if (chosen.length === 0) {
        return alert('🎉 Tidak ada kartu yang jatuh tempo untuk ' + kelasLabel + '! Semua ingatanmu masih segar.');
    }

    let judul = isDueOnly
        ? ('🔔 Review Jatuh Tempo (' + kelasLabel + ')')
        : ('⚡ Sesi Cepat 5 Menit (' + kelasLabel + ')');
    window.mulaiSesiBelajarFlashcards(judul, chosen, true, kelasLabel);
};

window.mulaiFlashcardBabSM2 = function(gKey, kelas, mapel, bab, levelFilter) {
    let pickedTopics = window._fcState.pickedTopicsByBab[gKey] || [];
    let pakaiFilter = pickedTopics.length > 0;
    let allCards = window.kumpulkanSemuaKartuFlashcards();

    let pool = allCards.filter(function(c) {
        if (c.kelas !== kelas || c.mapel !== mapel || c.bab !== bab) return false;
        if (pakaiFilter && pickedTopics.indexOf(c.topik) === -1) return false;
        if (levelFilter !== 'SEMUA' && c.level !== levelFilter) return false;
        return true;
    });

    if (pool.length === 0) {
        return alert('⚠️ Tidak ada kartu untuk kombinasi topik dan level ini.');
    }

    let chosen = window.urutkanKartuPrioritasSM2(pool, 20, false);
    let subLabel = (pakaiFilter ? (' — ' + pickedTopics.join(', ')) : '') + (levelFilter !== 'SEMUA' ? (' (' + levelFilter + ')') : '');
    window.mulaiSesiBelajarFlashcards(bab + subLabel, chosen, false, kelas);
};

// =========================================================================
// 8. STUDIO PEMBUAT KARTU ADMIN (BASIC, CLOZE DELETION, & IMAGE OCCLUSION)
// =========================================================================
window.pilihTipeStudioAdminFC = function(tipeBaru) {
    window._fcState.adminCardType = tipeBaru || 'basic';
    window.renderPemilihFlashcards();
};

window.sisipkanBungkusClozeAdmin = function() {
    let ta = document.getElementById('fc-in-cloze');
    if (!ta) return;
    let start = ta.selectionStart;
    let end = ta.selectionEnd;
    let val = ta.value;

    let lineStart = val.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = val.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = val.length;
    let curLine = val.slice(lineStart, lineEnd);
    let maxNum = 0;
    let re = /\{\{c(\d+)::/g;
    let m;
    while ((m = re.exec(curLine)) !== null) {
        let n = parseInt(m[1], 10);
        if (n > maxNum) maxNum = n;
    }
    let nextNum = maxNum + 1;

    let selected = val.slice(start, end);
    let wrapped = '{{c' + nextNum + '::' + (selected || 'istilah_penting') + '}}';
    ta.value = val.slice(0, start) + wrapped + val.slice(end);
    ta.focus();
    let newPos = start + wrapped.length;
    ta.setSelectionRange(newPos, newPos);
    window.perbaruiInfoJumlahCloze();
};

window.perbaruiInfoJumlahCloze = function() {
    let ta = document.getElementById('fc-in-cloze');
    let info = document.getElementById('fc-cloze-preview-cnt');
    if (!ta || !info) return;
    let total = 0;
    ta.value.split('\n').forEach(function(line, i) {
        total += window.parseTeksClozeKeKartu(line, { id: 'prev' }, i).length;
    });
    info.innerText = '✨ Terdeteksi ' + total + ' kartu Cloze siap dibuat';
};

window.renderStudioAdminFlashcards = function(cont) {
    window.pastikanDataFlashcardsSiap();
    let st = window._fcState;
    let decks = Object.values(window.adminFlashcardsData || {}).filter(Boolean);
    let editObj = (st.editingDeckId && window.adminFlashcardsData[st.editingDeckId])
        ? window.adminFlashcardsData[st.editingDeckId]
        : null;

    let tipeAktif = st.adminCardType || 'basic';

    let formIsiHtml = '';
    if (tipeAktif === 'basic') {
        let teksEdit = '';
        if (editObj && (editObj.tipe || 'basic') === 'basic') {
            let arr = Array.isArray(editObj.kartu) ? editObj.kartu : Object.values(editObj.kartu || {});
            teksEdit = arr.map(function(c) {
                return (c.front || '') + ' | ' + (c.back || '') + (c.hint ? (' | ' + c.hint) : '');
            }).join('\n');
        }
        formIsiHtml =
            '<label class="fc-admin-lbl">Daftar Kartu Basic (1 baris = 1 kartu, pisahkan Depan | Belakang | Catatan Opsional):</label>' +
            '<textarea id="fc-in-kartu" class="input-box" rows="7" style="margin-bottom:8px; font-size:12px; font-family:monospace;" placeholder="Mitokondria | Organel tempat respirasi seluler penghasil ATP | Bermembran ganda\nAorta | Pembuluh nadi terbesar dari bilik kiri ke seluruh tubuh">' + window.fcEsc(teksEdit) + '</textarea>';
    } else if (tipeAktif === 'cloze') {
        let teksCloze = '';
        if (editObj && editObj.tipe === 'cloze') {
            let arr = Array.isArray(editObj.kartu) ? editObj.kartu : Object.values(editObj.kartu || {});
            teksCloze = arr.map(function(c) { return (typeof c === 'string') ? c : (c.clozeText || c.front || ''); }).join('\n');
        }
        formIsiHtml =
            '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">' +
                '<label class="fc-admin-lbl" style="margin:0;">Kalimat Rumpang Cloze (1 baris = 1 kalimat, bungkus kata kunci dengan {{c1::...}}):</label>' +
                '<button type="button" class="fc-cloze-wrap-btn" onclick="window.sisipkanBungkusClozeAdmin()">🧩 Bungkus Teks Terpilih</button>' +
            '</div>' +
            '<textarea id="fc-in-cloze" class="input-box" rows="7" style="margin-bottom:6px; font-size:12px; font-family:monospace;" oninput="window.perbaruiInfoJumlahCloze()" placeholder="Glikolisis berlangsung di {{c1::sitoplasma::tempat}} dan menghasilkan {{c2::2 asam piruvat}}, {{c2::2 ATP}}, serta {{c2::2 NADH}}.\nEnzim {{c1::amilase}} memecah amilum menjadi {{c2::maltosa}}.">' + window.fcEsc(teksCloze) + '</textarea>' +
            '<div id="fc-cloze-preview-cnt" style="font-size:11px; font-weight:700; color:#0f766e; margin-bottom:8px;">💡 Tips: Gunakan c1 &amp; c2 pada satu kalimat untuk menghasilkan 2 kartu terpisah, atau {{c1::jawaban::petunjuk}} untuk memberi petunjuk.</div>';
    } else {
        let hasImg = Boolean(st.occImageData);
        let boxesListHtml = st.occBoxes.map(function(bx, idx) {
            return '<div class="fc-occ-box-item">' +
                '<span class="fc-occ-num">#' + (idx + 1) + '</span>' +
                '<input type="text" class="input-box" style="margin:0; padding:4px 8px; font-size:11.5px; flex:1;" placeholder="Nama label / catatan opsional..." value="' + window.fcEsc(bx.label || '') + '" oninput="window.ubahLabelBoxOcclusion(' + idx + ', this.value)">' +
                '<button type="button" class="fc-occ-del-btn" onclick="window.hapusSatuBoxOcclusion(' + idx + ')" title="Hapus Kotak">✕</button>' +
            '</div>';
        }).join('');

        formIsiHtml =
            '<div class="fc-occ-toolbar">' +
                '<input type="file" id="fc-occ-file-input" accept="image/*" style="display:none;" onchange="window.uploadGambarOcclusion(this)">' +
                '<button type="button" class="aws-quick-btn is-primary" onclick="document.getElementById(\'fc-occ-file-input\').click()">🖼️ Upload Diagram</button>' +
                '<select id="fc-occ-hide-mode" class="input-box" style="margin:0; width:auto; padding:5px 8px; font-size:11.5px; font-weight:700;" onchange="window._fcState.occHideMode=this.value">' +
                    '<option value="hide_all"' + (st.occHideMode === 'hide_all' ? ' selected' : '') + '>Hide All, Guess One (Semua Tertutup)</option>' +
                    '<option value="hide_one"' + (st.occHideMode === 'hide_one' ? ' selected' : '') + '>Hide One, Guess One (Hanya Target Tertutup)</option>' +
                '</select>' +
                (st.occBoxes.length > 0 ? '<button type="button" class="aws-quick-btn is-danger-soft" onclick="window.bersihkanSemuaBoxOcclusion()">🧹 Hapus Semua Kotak (' + st.occBoxes.length + ')</button>' : '') +
            '</div>' +
            '<div class="fc-occ-stage-wrap" id="fc-occ-stage-wrap">' +
                (hasImg
                    ? '<div style="font-size:11px; color:#cbd5e1; margin-bottom:6px;">✏️ Seret mouse / Apple Pencil di atas gambar untuk menutup label. Setiap kotak otomatis menjadi 1 kartu visual!</div>' +
                      '<canvas id="fc-occ-editor-canvas" class="fc-occ-editor-canvas"></canvas>'
                    : '<div class="fc-occ-empty">🖼️ Unggah diagram (misal: Anatomi Jantung, Struktur Sel, Nefron) atau tekan <b>Cmd+V / Ctrl+V</b> langsung untuk menempel gambar.</div>') +
            '</div>' +
            (st.occBoxes.length > 0
                ? '<div class="fc-occ-boxes-list">' + boxesListHtml + '</div>'
                : '');
    }

    let listHtml = '';
    if (decks.length === 0) {
        listHtml = '<div style="text-align:center; padding:18px; color:#64748b; font-size:12px;">Belum ada deck kustom. Soal di Bank Latihan tetap otomatis hadir sebagai kartu Basic.</div>';
    } else {
        decks.forEach(function(dk) {
            let tipeDk = dk.tipe || 'basic';
            let jml = tipeDk === 'occlusion'
                ? (Array.isArray(dk.boxes) ? dk.boxes.length : Object.keys(dk.boxes || {}).length)
                : (Array.isArray(dk.kartu) ? dk.kartu.length : Object.keys(dk.kartu || {}).length);
            let badgeTipe = tipeDk === 'occlusion' ? '🖼️ Visual' : (tipeDk === 'cloze' ? '🧩 Cloze' : '📝 Basic');
            let sId = window.fcEsc(dk.id).replace(/'/g, "\\'");
            listHtml +=
                '<div class="fc-admin-deck-row">' +
                    '<div style="min-width:0;">' +
                        '<strong style="color:#060608; font-size:12.5px;">' + badgeTipe + ' • ' + window.fcEsc(dk.bab || dk.judul) + (dk.topik && dk.topik !== 'Umum' ? (' (' + window.fcEsc(dk.topik) + ')') : '') + '</strong>' +
                        '<div style="font-size:11px; color:#526a7d;">' + window.fcEsc(dk.kelas || 'Umum') + ' • ' + window.fcEsc(dk.mapel || 'Biologi') + ' • <b>' + jml + ' item</b></div>' +
                    '</div>' +
                    '<div style="display:flex; gap:5px; flex-shrink:0;">' +
                        '<button type="button" class="aws-quick-btn" style="padding:4px 9px; font-size:11px;" onclick="window.mulaiEditDeckAdminFC(\'' + sId + '\')">✏️</button>' +
                        '<button type="button" class="aws-quick-btn is-danger-soft" style="padding:4px 9px; font-size:11px;" onclick="window.hapusDeckFlashcardAdmin(\'' + sId + '\')">🗑️</button>' +
                    '</div>' +
                '</div>';
        });
    }

    cont.innerHTML =
        '<div class="fc-admin-split">' +
            '<div class="fc-admin-form">' +
                '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">' +
                    '<strong style="font-size:13.5px; color:#060608;">' + (editObj ? '✏️ Edit Deck Kartu' : '➕ Buat Deck Flashcard Baru') + '</strong>' +
                    '<div class="fc-type-switcher">' +
                        '<button type="button" class="fc-type-pill' + (tipeAktif === 'basic' ? ' active' : '') + '" onclick="window.pilihTipeStudioAdminFC(\'basic\')">📝 Basic</button>' +
                        '<button type="button" class="fc-type-pill' + (tipeAktif === 'cloze' ? ' active' : '') + '" onclick="window.pilihTipeStudioAdminFC(\'cloze\')">🧩 Cloze</button>' +
                        '<button type="button" class="fc-type-pill' + (tipeAktif === 'occlusion' ? ' active' : '') + '" onclick="window.pilihTipeStudioAdminFC(\'occlusion\')">🖼️ Image Occlusion</button>' +
                    '</div>' +
                '</div>' +

                '<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">' +
                    '<input type="text" id="fc-in-kelas" class="input-box" style="margin:0;" placeholder="Kelas (mis: Kelas 11)" value="' + window.fcEsc(editObj ? editObj.kelas : 'Kelas 11') + '">' +
                    '<input type="text" id="fc-in-mapel" class="input-box" style="margin:0;" placeholder="Mapel (mis: Biologi)" value="' + window.fcEsc(editObj ? editObj.mapel : 'Biologi') + '">' +
                '</div>' +
                '<div style="display:grid; grid-template-columns:1.25fr 1fr; gap:8px; margin-bottom:10px;">' +
                    '<input type="text" id="fc-in-bab" class="input-box" style="margin:0;" placeholder="Nama Bab (mis: Sistem Peredaran Darah)" value="' + window.fcEsc(editObj ? (editObj.bab || editObj.judul) : '') + '">' +
                    '<input type="text" id="fc-in-topik" class="input-box" style="margin:0;" placeholder="Topik Opsional (mis: Jantung)" value="' + window.fcEsc(editObj && editObj.topik !== 'Umum' ? editObj.topik : '') + '">' +
                '</div>' +

                formIsiHtml +

                '<div style="display:flex; gap:8px; margin-top:8px;">' +
                    '<button type="button" class="aws-quick-btn is-primary" style="flex:1; justify-content:center;" onclick="window.simpanDeckFlashcardAdmin()">💾 Simpan Deck Kartu</button>' +
                    (editObj ? '<button type="button" class="aws-quick-btn" onclick="window.batalEditDeckAdminFC()">Batal</button>' : '') +
                '</div>' +
            '</div>' +

            '<div class="fc-admin-list-box">' +
                '<div style="font-size:13px; font-weight:800; color:#060608; margin-bottom:8px;">📦 Deck Kustom Tersimpan (' + decks.length + ')</div>' +
                '<div style="display:flex; flex-direction:column; gap:8px;">' + listHtml + '</div>' +
            '</div>' +
        '</div>';

    if (tipeAktif === 'cloze') {
        window.perbaruiInfoJumlahCloze();
    } else if (tipeAktif === 'occlusion' && st.occImageData) {
        window.inisialisasiKanvasOcclusionEditor();
    }
};

window.mulaiEditDeckAdminFC = function(id) {
    let dk = window.adminFlashcardsData ? window.adminFlashcardsData[id] : null;
    if (!dk) return;
    let st = window._fcState;
    st.editingDeckId = id;
    st.adminCardType = dk.tipe || 'basic';
    if (st.adminCardType === 'occlusion') {
        st.occImageData = dk.imageData || '';
        st.occHideMode = dk.hideMode || 'hide_all';
        st.occBoxes = (Array.isArray(dk.boxes) ? dk.boxes : Object.values(dk.boxes || {})).map(function(b) {
            return Object.assign({}, b);
        });
    } else {
        st.occImageData = '';
        st.occBoxes = [];
    }
    window.renderPemilihFlashcards();
};

window.batalEditDeckAdminFC = function() {
    window._fcState.editingDeckId = '';
    window._fcState.occImageData = '';
    window._fcState.occBoxes = [];
    window.renderPemilihFlashcards();
};

window.muatFileKeOcclusionData = function(file) {
    if (!file || !file.type || file.type.indexOf('image/') !== 0) return;
    let reader = new FileReader();
    reader.onload = function(ev) {
        let img = new Image();
        img.onload = function() {
            let maxW = 920;
            let scale = img.naturalWidth > maxW ? (maxW / img.naturalWidth) : 1;
            let cw = Math.max(200, Math.round(img.naturalWidth * scale));
            let ch = Math.max(150, Math.round(img.naturalHeight * scale));
            let c = document.createElement('canvas');
            c.width = cw;
            c.height = ch;
            let ctx = c.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, cw, ch);
            ctx.drawImage(img, 0, 0, cw, ch);
            window._fcState.occImageData = c.toDataURL('image/jpeg', 0.82);
            window._fcState.occBoxes = [];
            window.renderPemilihFlashcards();
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
};

window.uploadGambarOcclusion = function(inp) {
    let f = inp && inp.files ? inp.files[0] : null;
    if (inp) inp.value = '';
    if (f) window.muatFileKeOcclusionData(f);
};

window.ubahLabelBoxOcclusion = function(idx, val) {
    if (window._fcState.occBoxes[idx]) {
        window._fcState.occBoxes[idx].label = val;
    }
};

window.hapusSatuBoxOcclusion = function(idx) {
    window._fcState.occBoxes.splice(idx, 1);
    window.renderPemilihFlashcards();
};

window.bersihkanSemuaBoxOcclusion = function() {
    window._fcState.occBoxes = [];
    window.renderPemilihFlashcards();
};

window.inisialisasiKanvasOcclusionEditor = function() {
    let canv = document.getElementById('fc-occ-editor-canvas');
    let st = window._fcState;
    if (!canv || !st.occImageData) return;

    let img = new Image();
    img.onload = function() {
        canv.width = img.naturalWidth;
        canv.height = img.naturalHeight;
        canv._bgImg = img;
        window.gambarKanvasOcclusionEditor();
        window.pasangEventDrawOcclusion(canv);
    };
    img.src = st.occImageData;
};

window.gambarKanvasOcclusionEditor = function() {
    let canv = document.getElementById('fc-occ-editor-canvas');
    let st = window._fcState;
    if (!canv || !canv._bgImg) return;

    let w = canv.width;
    let h = canv.height;
    let ctx = canv.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(canv._bgImg, 0, 0, w, h);

    let gambarSatuKotak = function(bx, labelNo, isPreview) {
        let rx = bx.x * w;
        let ry = bx.y * h;
        let rw = bx.w * w;
        let rh = bx.h * h;

        ctx.fillStyle = isPreview ? 'rgba(0, 225, 255, 0.35)' : 'rgba(249, 115, 22, 0.85)';
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeStyle = isPreview ? '#00E1FF' : '#ffffff';
        ctx.lineWidth = Math.max(2, w * 0.003);
        ctx.strokeRect(rx, ry, rw, rh);

        if (!isPreview) {
            let fSz = Math.max(14, Math.min(26, Math.round(rh * 0.6)));
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold ' + fSz + 'px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('#' + labelNo, rx + (rw / 2), ry + (rh / 2));
        }
    };

    st.occBoxes.forEach(function(bx, idx) {
        gambarSatuKotak(bx, idx + 1, false);
    });
    if (st.occPreviewBox) {
        gambarSatuKotak(st.occPreviewBox, 0, true);
    }
};

window.pasangEventDrawOcclusion = function(canv) {
    if (!canv || canv.getAttribute('data-occ-bound') === '1') return;
    canv.setAttribute('data-occ-bound', '1');

    let getNorm = function(ev) {
        let rect = canv.getBoundingClientRect();
        return {
            x: Math.max(0, Math.min(1, (ev.clientX - rect.left) / Math.max(1, rect.width))),
            y: Math.max(0, Math.min(1, (ev.clientY - rect.top) / Math.max(1, rect.height)))
        };
    };

    canv.addEventListener('pointerdown', function(ev) {
        ev.preventDefault();
        let st = window._fcState;
        st.occDrawing = true;
        st.occStartPt = getNorm(ev);
        st.occPreviewBox = { x: st.occStartPt.x, y: st.occStartPt.y, w: 0, h: 0 };
        try { canv.setPointerCapture(ev.pointerId); } catch (e) {}
    });

    canv.addEventListener('pointermove', function(ev) {
        let st = window._fcState;
        if (!st.occDrawing || !st.occStartPt) return;
        ev.preventDefault();
        let cur = getNorm(ev);
        st.occPreviewBox = {
            x: Math.min(st.occStartPt.x, cur.x),
            y: Math.min(st.occStartPt.y, cur.y),
            w: Math.abs(cur.x - st.occStartPt.x),
            h: Math.abs(cur.y - st.occStartPt.y)
        };
        window.gambarKanvasOcclusionEditor();
    });

    let finishDraw = function(ev) {
        let st = window._fcState;
        if (!st.occDrawing) return;
        st.occDrawing = false;
        try { canv.releasePointerCapture(ev.pointerId); } catch (e) {}
        let bx = st.occPreviewBox;
        st.occPreviewBox = null;
        if (bx && bx.w >= 0.025 && bx.h >= 0.02) {
            st.occBoxes.push({
                id: 'm_' + Date.now() + '_' + st.occBoxes.length,
                x: Number(bx.x.toFixed(4)),
                y: Number(bx.y.toFixed(4)),
                w: Number(bx.w.toFixed(4)),
                h: Number(bx.h.toFixed(4)),
                label: ''
            });
            window.renderPemilihFlashcards();
        } else {
            window.gambarKanvasOcclusionEditor();
        }
    };

    canv.addEventListener('pointerup', finishDraw);
    canv.addEventListener('pointercancel', finishDraw);
};

document.addEventListener('paste', function(e) {
    let modal = document.getElementById('modal-flashcards');
    if (!modal || modal.style.display !== 'flex') return;
    if (window._fcState.viewMode !== 'admin' || window._fcState.adminCardType !== 'occlusion') return;
    let items = (e.clipboardData && e.clipboardData.items) ? e.clipboardData.items : [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.indexOf('image/') === 0) {
            let f = items[i].getAsFile();
            if (f) {
                e.preventDefault();
                window.muatFileKeOcclusionData(f);
                return;
            }
        }
    }
});

window.simpanDeckFlashcardAdmin = function() {
    let st = window._fcState;
    let kelas = document.getElementById('fc-in-kelas') ? document.getElementById('fc-in-kelas').value.trim() : 'Umum';
    let mapel = document.getElementById('fc-in-mapel') ? document.getElementById('fc-in-mapel').value.trim() : 'Biologi';
    let bab = document.getElementById('fc-in-bab') ? document.getElementById('fc-in-bab').value.trim() : '';
    let topikRaw = document.getElementById('fc-in-topik') ? document.getElementById('fc-in-topik').value.trim() : '';
    let topik = topikRaw || 'Umum';
    let tipe = st.adminCardType || 'basic';

    if (!bab) return alert('⚠️ Nama Bab wajib diisi!');

    let id = st.editingDeckId || ('fc_' + Date.now());
    let payload = {
        id: id,
        tipe: tipe,
        judul: bab,
        bab: bab,
        topik: topik,
        kelas: kelas || 'Umum',
        mapel: mapel || 'Biologi',
        updatedAt: new Date().toISOString()
    };

    if (tipe === 'basic') {
        let raw = document.getElementById('fc-in-kartu') ? document.getElementById('fc-in-kartu').value : '';
        let kartuArr = [];
        raw.split('\n').forEach(function(line) {
            let bersih = line.trim();
            if (!bersih || bersih.indexOf('|') === -1) return;
            let parts = bersih.split('|').map(function(p) { return p.trim(); });
            if (parts[0] && parts[1]) {
                kartuArr.push({ front: parts[0], back: parts[1], hint: parts[2] || '' });
            }
        });
        if (kartuArr.length === 0) return alert('⚠️ Masukkan minimal 1 kartu dengan format: Pertanyaan | Jawaban');
        payload.kartu = kartuArr;
    } else if (tipe === 'cloze') {
        let rawCloze = document.getElementById('fc-in-cloze') ? document.getElementById('fc-in-cloze').value : '';
        let lines = [];
        let totalGen = 0;
        rawCloze.split('\n').forEach(function(line, idx) {
            let b = line.trim();
            if (!b) return;
            let gen = window.parseTeksClozeKeKartu(b, { id: id }, idx);
            if (gen.length > 0) {
                lines.push({ clozeText: b });
                totalGen += gen.length;
            }
        });
        if (totalGen === 0) return alert('⚠️ Belum ada tanda Cloze {{c1::jawaban}} yang valid! Blok kata lalu klik tombol Bungkus Teks Terpilih.');
        payload.kartu = lines;
    } else if (tipe === 'occlusion') {
        if (!st.occImageData) return alert('⚠️ Unggah atau Paste gambar diagram terlebih dahulu!');
        if (!st.occBoxes || st.occBoxes.length === 0) return alert('⚠️ Seret minimal 1 kotak penutup label pada gambar diagram!');
        payload.imageData = st.occImageData;
        payload.hideMode = st.occHideMode || 'hide_all';
        payload.boxes = st.occBoxes.slice();
    }

    window.adminFlashcardsData[id] = payload;
    st.editingDeckId = '';
    st.occImageData = '';
    st.occBoxes = [];

    window.simpanDataFlashcardsKeServer();
    window.renderPemilihFlashcards();
    alert('✅ Deck Flashcard (' + tipe.toUpperCase() + ') untuk "' + bab + '" berhasil disimpan!');
};

window.hapusDeckFlashcardAdmin = function(id) {
    if (!window.adminFlashcardsData || !window.adminFlashcardsData[id]) return;
    let judul = window.adminFlashcardsData[id].bab || window.adminFlashcardsData[id].judul || id;
    if (!confirm('Hapus deck "' + judul + '"?')) return;
    delete window.adminFlashcardsData[id];
    if (window._fcState.editingDeckId === id) window._fcState.editingDeckId = '';
    window.simpanDataFlashcardsKeServer();
    window.renderPemilihFlashcards();
};

// =========================================================================
// 9. SESI BELAJAR ACTIVE RECALL + 4 RATING SM-2 (AGAIN, HARD, GOOD, EASY)
// =========================================================================
window.mulaiSesiBelajarFlashcards = function(judul, cardsArr, isMicro, kelasDeck) {
    let st = window._fcState;
    st.viewMode = 'study';
    st.deckTitle = judul;
    st.deckKelas = kelasDeck || '';
    st.isMicroSession = Boolean(isMicro);
    st.cards = cardsArr;
    st.queue = cardsArr.map(function(_, i) { return i; });
    st.cursorPos = 0;
    st.isFlipped = false;
    st.isReverse = false;
    st.userTypedRecall = '';
    st.reviewedThisSession = 0;
    st.goodOrEasyCount = 0;
    st.gradeCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    st.sessionLog = [];
    st.historySaved = false;
    st.sessionStartMs = Date.now();
    st.rewarded = false;

    let vPick = document.getElementById('fc-view-picker');
    let vStudy = document.getElementById('fc-view-study');
    if (vPick) vPick.style.display = 'none';
    if (vStudy) vStudy.style.display = 'flex';

    window.sinkronkanTombolHeaderFC();
    window.renderStageBelajarFlashcards();
};

window.balikKartuFlashcard = function() {
    let inp = document.getElementById('fc-type-recall-input');
    if (inp) window._fcState.userTypedRecall = inp.value.trim();

    window._fcState.isFlipped = !window._fcState.isFlipped;
    window.renderStageBelajarFlashcards();
};

window.toggleModeUjiKetikFC = function() {
    window._fcState.typeRecallMode = !window._fcState.typeRecallMode;
    window._fcState.userTypedRecall = '';
    window.renderStageBelajarFlashcards();
};

window.toggleBalikSisiFlashcard = function() {
    window._fcState.isReverse = !window._fcState.isReverse;
    window._fcState.isFlipped = false;
    window._fcState.userTypedRecall = '';
    window.renderStageBelajarFlashcards();
};

window.acakKartuFlashcard = function() {
    let st = window._fcState;
    let sisa = st.queue.slice(st.cursorPos);
    sisa.sort(function() { return Math.random() - 0.5; });
    st.queue = st.queue.slice(0, st.cursorPos).concat(sisa);
    st.isFlipped = false;
    st.userTypedRecall = '';
    window.renderStageBelajarFlashcards();
};

window.nilaiKartuSM2 = function(grade) {
    let st = window._fcState;
    if (!st.isFlipped) return;
    let cardIdx = st.queue[st.cursorPos];
    let card = st.cards[cardIdx];
    if (!card) return;

    let prev = window._fcSrsMap[card.id] || null;
    let nextRec = window.hitungJadwalSM2(prev, grade);
    window._fcSrsMap[card.id] = nextRec;

    st.reviewedThisSession++;
    if (st.gradeCounts[grade] !== undefined) st.gradeCounts[grade]++;
    if (grade >= 3) st.goodOrEasyCount++;

    let frontRingkas = String(card.plainFront || card.front || '').replace(/\s+/g, ' ').trim();
    if (frontRingkas.length > 90) frontRingkas = frontRingkas.slice(0, 90) + '...';
    let ansRingkas = String(card.plainAnswer || card.back || '').replace(/\s+/g, ' ').trim();
    if (ansRingkas.length > 90) ansRingkas = ansRingkas.slice(0, 90) + '...';

    st.sessionLog.push({
        front: frontRingkas,
        answer: ansRingkas,
        grade: grade,
        next: window.formatIntervalSM2(nextRec.interval, grade)
    });

    if (grade === 1) {
        let insertAt = Math.min(st.queue.length, st.cursorPos + 3);
        st.queue.splice(insertAt, 0, cardIdx);
    }

    window.simpanSRSFlashcards(false);

    st.cursorPos++;
    st.isFlipped = false;
    st.userTypedRecall = '';
    window.renderStageBelajarFlashcards();
};

window.klaimBonusSelesaiFlashcard = function() {
    let st = window._fcState;
    if (st.rewarded) return '';
    window.simpanSRSFlashcards(true);
    window.simpanHistorySesiJikaPerlu(true);

    let stat = sessionStorage.getItem('statusLogin');
    let uName = (sessionStorage.getItem('username') || '').toLowerCase();
    if (stat !== 'siswa' || !uName || st.cards.length < 5) return '';

    let durasiDetik = (Date.now() - st.sessionStartMs) / 1000;
    if (durasiDetik < 12) return '⏱️ Tarik jawaban dari ingatan dengan tenang untuk mendapatkan bonus XP.';

    let todayKey = 'fc_bonus_' + uName + '_' + new Date().toISOString().slice(0, 10);
    let sudahKlaim = parseInt(localStorage.getItem(todayKey) || '0', 10);
    if (sudahKlaim >= 3) return 'ℹ️ Batas bonus harian Flashcards (3/3) sudah tercapai hari ini.';

    st.rewarded = true;
    localStorage.setItem(todayKey, String(sudahKlaim + 1));
    if (typeof window.tambahXPSiswa === 'function') {
        window.tambahXPSiswa(25, 'flashcards_selesai');
    }
    return '🎉 Bonus Active Recall SM-2: +25 XP & +25 Coin (' + (sudahKlaim + 1) + '/3 hari ini)';
};

window.bangunHTMLImageOcclusionFace = function(card, isReveal) {
    let masksHtml = (card.allBoxes || []).map(function(bx, idx) {
        let isTarget = (idx === card.targetBoxIdx);
        let stylePos = 'left:' + (bx.x * 100).toFixed(2) + '%; top:' + (bx.y * 100).toFixed(2) + '%; width:' + (bx.w * 100).toFixed(2) + '%; height:' + (bx.h * 100).toFixed(2) + '%;';

        if (isTarget) {
            if (isReveal) {
                return '<div class="fc-occ-mask is-revealed" style="' + stylePos + '"></div>';
            }
            return '<div class="fc-occ-mask is-target" style="' + stylePos + '">?</div>';
        }
        if (card.hideMode === 'hide_all') {
            return '<div class="fc-occ-mask is-other" style="' + stylePos + '"></div>';
        }
        return '';
    }).join('');

    return '<div class="fc-occ-view-box">' +
        '<div class="fc-occ-img-wrap">' +
            '<img src="' + card.imageData + '" alt="Diagram Visual">' +
            masksHtml +
        '</div>' +
    '</div>';
};

window.renderStageBelajarFlashcards = function() {
    let cont = document.getElementById('fc-view-study');
    if (!cont) return;
    let st = window._fcState;

    let sisa = Math.max(0, st.queue.length - st.cursorPos);
    let pct = st.queue.length > 0 ? Math.min(100, Math.round((st.cursorPos / st.queue.length) * 100)) : 0;

    if (st.cursorPos >= st.queue.length) {
        let infoBonus = window.klaimBonusSelesaiFlashcard();
        let akurasi = st.reviewedThisSession > 0 ? Math.round((st.goodOrEasyCount / st.reviewedThisSession) * 100) : 100;
        let durasiMnt = Math.max(1, Math.round((Date.now() - st.sessionStartMs) / 60000));

        cont.innerHTML =
            '<div class="fc-finish-box">' +
                '<div style="font-size:50px; margin-bottom:6px;">🏆</div>' +
                '<h3 style="margin:0 0 4px 0; color:#060608;">Sesi Active Recall Selesai!</h3>' +
                '<div style="font-size:13px; color:#2370A1; font-weight:700; margin-bottom:12px;">' + window.fcEsc(st.deckTitle) + '</div>' +
                '<div class="fc-finish-stats">' +
                    '<div><span>Total Review</span><b>' + st.reviewedThisSession + 'x</b></div>' +
                    '<div><span>Retensi (Good/Easy)</span><b style="color:#15803d;">' + akurasi + '%</b></div>' +
                    '<div><span>Durasi</span><b>~' + durasiMnt + ' mnt</b></div>' +
                '</div>' +
                '<div style="font-size:11.5px; color:#526a7d; margin-bottom:8px;">📅 Sesi telah dicatat ke <b>📜 History</b> dan jadwal SM-2 diperbarui otomatis.</div>' +
                (infoBonus ? '<div class="fc-bonus-pill">' + infoBonus + '</div>' : '') +
                '<div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-top:16px;">' +
                    '<button type="button" class="aws-quick-btn" onclick="window.kembaliKePemilihFlashcards()">← Daftar Bab</button>' +
                    '<button type="button" class="aws-quick-btn" onclick="window._fcState.viewMode=\'history\'; window.kembaliKePemilihFlashcards();">📜 Lihat History</button>' +
                    '<button type="button" class="aws-quick-btn is-primary" onclick="window.mulaiSesiMicroLearning(\'micro10\')">⚡ Sesi Cepat Lagi</button>' +
                '</div>' +
            '</div>';
        return;
    }

    let cardIdx = st.queue[st.cursorPos];
    let card = st.cards[cardIdx];
    let prevRec = window._fcSrsMap[card.id] || null;

    let p1 = window.formatIntervalSM2(window.hitungJadwalSM2(prevRec, 1).interval, 1);
    let p2 = window.formatIntervalSM2(window.hitungJadwalSM2(prevRec, 2).interval, 2);
    let p3 = window.formatIntervalSM2(window.hitungJadwalSM2(prevRec, 3).interval, 3);
    let p4 = window.formatIntervalSM2(window.hitungJadwalSM2(prevRec, 4).interval, 4);

    let isVisual = (card.format === 'occlusion');
    let isCloze = (card.format === 'cloze');

    let labelDepan = isVisual ? 'TEBAK LABEL BERTANDA (?) PADA DIAGRAM' : (isCloze ? 'LENGKAPI BAGIAN RUMPANG (CLOZE)' : (st.isReverse ? 'JAWABAN / ISTILAH' : 'PERTANYAAN / KONSEP'));
    let labelBelakang = isVisual ? 'LABEL TERBUKA (IMAGE OCCLUSION)' : (isCloze ? 'JAWABAN LENGKAP (CLOZE)' : (st.isReverse ? 'PERTANYAAN / DEFINISI' : 'JAWABAN & PEMBAHASAN'));

    let frontBodyHtml = '';
    let backBodyHtml = '';

    if (isVisual) {
        frontBodyHtml = window.bangunHTMLImageOcclusionFace(card, false);
        backBodyHtml = window.bangunHTMLImageOcclusionFace(card, true) +
            (card.plainAnswer ? '<div class="fc-occ-ans-pill">🎯 ' + window.fcEsc(card.plainAnswer) + '</div>' : '');
    } else if (isCloze) {
        frontBodyHtml = '<div class="fc-face-content">' + card.frontHtml + '</div>';
        backBodyHtml = '<div class="fc-face-content is-answer">' + card.backHtml + '</div>';
    } else {
        let tDepan = st.isReverse ? card.back : card.front;
        let tBelakang = st.isReverse ? card.front : card.back;
        frontBodyHtml = '<div class="fc-face-content">' + window.fcEsc(tDepan).replace(/\n/g, '<br>') + '</div>';
        backBodyHtml = '<div class="fc-face-content is-answer">' + window.fcEsc(tBelakang).replace(/\n/g, '<br>') + '</div>';
    }

    let typeCheckFrontHtml = '';
    let typeCheckBackHtml = '';
    if (st.typeRecallMode && !isVisual) {
        if (!st.isFlipped) {
            typeCheckFrontHtml =
                '<div class="fc-type-box" onclick="event.stopPropagation()">' +
                    '<input type="text" id="fc-type-recall-input" class="input-box" style="margin:0; font-size:12.5px; font-weight:700;" placeholder="Ketik jawaban dari ingatanmu dulu lalu tekan Enter..." value="' + window.fcEsc(st.userTypedRecall) + '" onkeydown="if(event.key===\'Enter\'){event.preventDefault(); window.balikKartuFlashcard();}">' +
                '</div>';
        } else if (st.userTypedRecall) {
            let targetComp = String(st.isReverse && !isCloze ? card.front : card.plainAnswer || '').trim().toLowerCase();
            let typedLow = st.userTypedRecall.trim().toLowerCase();
            let mirip = targetComp && (typedLow === targetComp || targetComp.indexOf(typedLow) !== -1 || typedLow.indexOf(targetComp) !== -1);
            typeCheckBackHtml =
                '<div class="fc-typed-compare ' + (mirip ? 'is-match' : 'is-diff') + '">' +
                    '<span>✍️ Jawaban Ingatanmu: <b>' + window.fcEsc(st.userTypedRecall) + '</b></span>' +
                    '<span>' + (mirip ? '✅ Cocok' : '⚠️ Bandingkan dengan kunci') + '</span>' +
                '</div>';
        }
    }

    let bottomActionHtml = !st.isFlipped
        ? '<div class="fc-reveal-bar">' +
              '<button type="button" class="fc-reveal-big-btn" onclick="window.balikKartuFlashcard()">👁️ Tampilkan Jawaban <span>(Spasi)</span></button>' +
          '</div>'
        : '<div class="fc-sm2-bar">' +
              '<button type="button" class="fc-sm2-btn is-again" onclick="window.nilaiKartuSM2(1)"><b>1 • Again</b><span>' + p1 + '</span></button>' +
              '<button type="button" class="fc-sm2-btn is-hard" onclick="window.nilaiKartuSM2(2)"><b>2 • Hard</b><span>' + p2 + '</span></button>' +
              '<button type="button" class="fc-sm2-btn is-good" onclick="window.nilaiKartuSM2(3)"><b>3 • Good</b><span>' + p3 + '</span></button>' +
              '<button type="button" class="fc-sm2-btn is-easy" onclick="window.nilaiKartuSM2(4)"><b>4 • Easy</b><span>' + p4 + '</span></button>' +
          '</div>';

    cont.innerHTML =
        '<div class="fc-study-topbar">' +
            '<button type="button" class="aws-quick-btn" onclick="window.kembaliKePemilihFlashcards()">← Daftar Bab</button>' +
            '<div class="fc-study-title">' + window.fcEsc(st.deckTitle) + '</div>' +
            '<div style="display:flex; gap:6px; flex-wrap:wrap;">' +
                (!isVisual ? '<button type="button" class="aws-quick-btn ' + (st.typeRecallMode ? 'is-primary' : '') + '" onclick="window.toggleModeUjiKetikFC()" title="Wajib ketik jawaban sebelum membuka kartu">✍️ Uji Ketik</button>' : '') +
                (card.format === 'basic' ? '<button type="button" class="aws-quick-btn ' + (st.isReverse ? 'is-primary' : '') + '" onclick="window.toggleBalikSisiFlashcard()" title="Tukar Sisi Depan & Belakang">🔁 Balik Sisi</button>' : '') +
                '<button type="button" class="aws-quick-btn" onclick="window.acakKartuFlashcard()" title="Acak Sisa Kartu">🔀 Acak</button>' +
            '</div>' +
        '</div>' +

        '<div class="fc-progress-wrap">' +
            '<div class="fc-progress-track"><div class="fc-progress-fill" style="width:' + pct + '%;"></div></div>' +
            '<div class="fc-progress-meta">' +
                '<span>Sisa antrean: <b>' + sisa + '</b> kartu</span>' +
                '<span>Sudah dinilai: <b>' + st.reviewedThisSession + '</b> • ' + (prevRec ? ('Ease ' + Number(prevRec.ease || 2.5).toFixed(2)) : 'Kartu Baru') + '</span>' +
            '</div>' +
        '</div>' +

        '<div class="fc-stage-area">' +
            '<div class="fc-card-scene' + (isVisual ? ' is-visual-scene' : '') + '" onclick="window.balikKartuFlashcard()">' +
                '<div id="fc-card-3d-inner" class="fc-card-3d-inner' + (st.isFlipped ? ' is-flipped' : '') + '">' +
                    '<div class="fc-card-face is-front">' +
                        '<div class="fc-face-top">' +
                            '<span class="fc-face-lbl">' + labelDepan + '</span>' +
                            '<span class="fc-face-tag">' + window.fcEsc(card.tag || '') + '</span>' +
                        '</div>' +
                        frontBodyHtml +
                        typeCheckFrontHtml +
                        '<div class="fc-face-foot">🧠 Tarik jawaban dari ingatanmu dulu sebelum membuka kartu</div>' +
                    '</div>' +
                    '<div class="fc-card-face is-back">' +
                        '<div class="fc-face-top">' +
                            '<span class="fc-face-lbl">' + labelBelakang + '</span>' +
                            '<span class="fc-face-tag">' + window.fcEsc(card.tag || '') + '</span>' +
                        '</div>' +
                        backBodyHtml +
                        typeCheckBackHtml +
                        (card.hint && !isVisual ? '<div class="fc-face-hint">💡 ' + window.fcEsc(card.hint) + '</div>' : '') +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +

        bottomActionHtml;

    if (st.typeRecallMode && !st.isFlipped && !isVisual) {
        let inpEl = document.getElementById('fc-type-recall-input');
        if (inpEl) setTimeout(function() { inpEl.focus(); }, 40);
    }
};

document.addEventListener('keydown', function(e) {
    let modal = document.getElementById('modal-flashcards');
    let study = document.getElementById('fc-view-study');
    if (!modal || modal.style.display !== 'flex' || !study || study.style.display === 'none') return;
    let tag = e.target ? e.target.tagName : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.code === 'Space') {
        e.preventDefault();
        window.balikKartuFlashcard();
    } else if (window._fcState.isFlipped && e.key === '1') {
        window.nilaiKartuSM2(1);
    } else if (window._fcState.isFlipped && e.key === '2') {
        window.nilaiKartuSM2(2);
    } else if (window._fcState.isFlipped && e.key === '3') {
        window.nilaiKartuSM2(3);
    } else if (window._fcState.isFlipped && e.key === '4') {
        window.nilaiKartuSM2(4);
    }
});