/* =========================================================================
   MODUL MY ARCADE ENGINE — 10 GAME SANTAI DI MY WORLD:
   1. Space Shooter   2. Sudoku (3 Level)   3. Tetris        4. Tic-Tac-Toe
   5. Snake Klasik    6. 2048               7. Brick Breaker 8. Flappy Bee
   9. Minesweeper     10. Connect Four
   - 0 Extra Firebase Reads (High Score tersimpan di profil leaderboard_siswa)
   - Kompatibel Desktop, iPad, Android Landscape, & iPhone Auto-Rotate 90°
   ========================================================================= */

window.MY_ARCADE_GAMES = [
    { id: "tictactoe",     nama: "Tic-Tac-Toe",    ikon: "❌", sub: "VS AI (Mudah, Sedang, Minimax)",     cat: "Strategi", fee: 50  },
    { id: "snake",         nama: "Snake Klasik",   ikon: "🐍", sub: "Kumpulkan apel & hindari tabrakan",  cat: "Klasik",   fee: 65  },
    { id: "flappy_bee",    nama: "Flappy Bee",     ikon: "🐝", sub: "Ketuk terbang lewati celah pipa",    cat: "Refleks",  fee: 80  },
    { id: "connect4",      nama: "Connect Four",   ikon: "🔴", sub: "4 keping berderet lawan AI",         cat: "Strategi", fee: 95  },
    { id: "minesweeper",   nama: "Minesweeper",    ikon: "💣", sub: "3 Level ranjau + mode Bendera 🚩",   cat: "Logika",   fee: 110 },
    { id: "brick_breaker", nama: "Brick Breaker",  ikon: "🏓", sub: "Pantulkan bola & pecahkan bata",     cat: "Aksi",     fee: 125 },
    { id: "game2048",      nama: "2048",           ikon: "🟦", sub: "Gabungkan ubin angka hingga 2048",   cat: "Puzzle",   fee: 145 },
    { id: "sudoku",        nama: "Sudoku",         ikon: "🔢", sub: "3 Level: 4×4, 6×6, & 9×9",           cat: "Logika",   fee: 165 },
    { id: "tetris",        nama: "Tetris",         ikon: "🧱", sub: "Susun 7 balok tetromino klasik",     cat: "Puzzle",   fee: 185 },
    { id: "space_shooter", nama: "Space Shooter",  ikon: "🚀", sub: "Pesawat tembak-tembak 60fps",        cat: "Aksi",     fee: 200 }
];

window.isMyArcadeModalOpen = false;
window.modeKunjunganArcade = null;
window.activeArcadeGameId = "lobby";
window._arcRafId = null;
window._arcIntervalId = null;
window._arcHold = { left: false, right: false };
window._arcState = null;

window.hentikanSemuaLoopArcade = function() {
    if (window._arcRafId) {
        cancelAnimationFrame(window._arcRafId);
        window._arcRafId = null;
    }
    if (window._arcIntervalId) {
        clearInterval(window._arcIntervalId);
        window._arcIntervalId = null;
    }
    window._arcHold = { left: false, right: false };
};

window.apakahAdminSandboxArcade = function() {
    let rawU = String(sessionStorage.getItem("username") || "").trim().toLowerCase();
    return (typeof window.isAdminSession === "function" && window.isAdminSession()) ||
           sessionStorage.getItem("statusLogin") === "admin" ||
           rawU === "mahardika";
};

window.pastikanStrukturMyArcade = function(uName) {
    let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(uName)
        : null;
    if (!lb) return null;

    if (!lb.myArcadeData || typeof lb.myArcadeData !== "object") {
        lb.myArcadeData = { highScores: {}, totalPlays: 0 };
    } else {
        if (!lb.myArcadeData.highScores || typeof lb.myArcadeData.highScores !== "object") {
            lb.myArcadeData.highScores = {};
        }
        if (typeof lb.myArcadeData.totalPlays !== "number") lb.myArcadeData.totalPlays = 0;
    }
    return lb;
};

window.simpanSkorDanHadiahArcade = function(gameId, scoreVal, coinGain, xpGain) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyArcade(uName);
    if (!lb || !lb.myArcadeData) return { isNewRecord: false, best: scoreVal };

    let sc = Math.max(0, Math.round(Number(scoreVal) || 0));
    let oldBest = Number(lb.myArcadeData.highScores[gameId]) || 0;
    let isNewRecord = sc > oldBest;
    if (isNewRecord) lb.myArcadeData.highScores[gameId] = sc;
    lb.myArcadeData.totalPlays = (Number(lb.myArcadeData.totalPlays) || 0) + 1;

    let cAdd = Math.max(0, Math.min(60, Math.round(Number(coinGain) || 0)));
    let xAdd = Math.max(0, Math.min(30, Math.round(Number(xpGain) || 0)));

    if (cAdd > 0) {
        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + cAdd;
        lb.xpTersedia = lb.coin;
    }
    if (xAdd > 0) {
        lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + xAdd;
        lb.xp = lb.xpTotal;
    }

    if (!window.apakahAdminSandboxArcade()) {
        let cleanKey = (typeof window.normalisasiKeySiswaPet === "function")
            ? window.normalisasiKeySiswaPet(uName)
            : String(uName || "").trim().toLowerCase();
        if (cleanKey && typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(cleanKey, lb);
        }
    }

    window.perbaruiSaldoHUDArcade();
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    return { isNewRecord: isNewRecord, best: Math.max(oldBest, sc), coin: cAdd, xp: xAdd };
};

window.pastikanUIMyArcadeAda = function() {
    if (document.getElementById("modal-my-arcade")) return;
    let modal = document.createElement("div");
    modal.id = "modal-my-arcade";
    modal.className = "modal-overlay";
    modal.onclick = function(e) {
        if (e.target === modal) window.tutupModalMyArcade();
    };

    modal.innerHTML =
        '<div class="modal-box myarcade-modal-box">' +
            '<div class="myarcade-hud">' +
                '<div class="myarcade-hud-left">' +
                    '<div class="myarcade-wood-sign" onclick="window.kembaliKeLobiArcade()" title="Kembali ke Daftar Game">' +
                        '<span style="font-size:20px;">🕹️</span>' +
                        '<div>' +
                            '<div class="arc-sign-top">Zona Santai</div>' +
                            '<div class="arc-sign-main">My Arcade</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="mypet-hud-currencies">' +
                        '<div class="mypet-hud-pill coin-pill"><span class="hud-orb coin-orb">🪙</span><strong id="myarcade-hud-coin">0</strong></div>' +
                        '<div class="mypet-hud-pill xp-pill"><span class="hud-orb xp-orb">⭐</span><strong id="myarcade-hud-xp">0</strong></div>' +
                    '</div>' +
                '</div>' +
                '<div class="myarcade-hud-right">' +
                    '<button type="button" id="btn-arcade-lobby" class="myarcade-hud-btn active" onclick="window.kembaliKeLobiArcade()">' +
                        '<span class="hud-ico">🎮</span><span class="hud-lbl">10 Game</span>' +
                    '</button>' +
                    '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupModalMyArcade()" title="Keluar ke My World">✕</button>' +
                '</div>' +
            '</div>' +
            '<div class="modal-body myarcade-body" id="myarcade-main-body"></div>' +
        '</div>';

    document.body.appendChild(modal);
};

window.perbaruiSaldoHUDArcade = function() {
    let lb = window.pastikanStrukturMyArcade(sessionStorage.getItem("username"));
    let elC = document.getElementById("myarcade-hud-coin");
    let elX = document.getElementById("myarcade-hud-xp");
    let cVal = lb ? Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia || 0) : 0;
    let xVal = lb ? Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp || 0) : 0;
    if (elC) elC.innerText = cVal.toLocaleString("id-ID");
    if (elX) elX.innerText = xVal.toLocaleString("id-ID");
};

window.bukaModalMyArcade = function() {
    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        alert("🔒 Silakan login menggunakan akun Siswa terlebih dahulu untuk masuk ke My Arcade!");
        return;
    }
    window.modeKunjunganArcade = null;
    window.pastikanUIMyArcadeAda();
    window.pastikanStrukturMyArcade(sessionStorage.getItem("username"));
    window.hentikanSemuaLoopArcade();
    window.activeArcadeGameId = "lobby";
    window.isMyArcadeModalOpen = true;
    window.perbaruiSaldoHUDArcade();
    window.renderMyArcadeUI();
    if (typeof window.bukaModal === "function") window.bukaModal("modal-my-arcade");
    else document.getElementById("modal-my-arcade").style.display = "flex";
};

window.bukaModalMyArcadeKunjungan = function(targetUsername) {
    if (!targetUsername || !window.leaderboardSiswaData || !window.leaderboardSiswaData[targetUsername]) return;
    window.modeKunjunganArcade = targetUsername;
    window.pastikanUIMyArcadeAda();
    window.hentikanSemuaLoopArcade();
    window.activeArcadeGameId = "lobby";
    window.isMyArcadeModalOpen = true;
    window.perbaruiSaldoHUDArcade();
    window.renderMyArcadeUI();
    if (typeof window.bukaModal === "function") window.bukaModal("modal-my-arcade");
    else document.getElementById("modal-my-arcade").style.display = "flex";
};

window.tutupModalMyArcade = function() {
    window.hentikanSemuaLoopArcade();
    window.isMyArcadeModalOpen = false;
    window.activeArcadeGameId = "lobby";
    window._arcState = null;
    if (typeof window.tutupModal === "function") window.tutupModal("modal-my-arcade");
    else {
        let m = document.getElementById("modal-my-arcade");
        if (m) m.style.display = "none";
    }
};

window.kembaliKeLobiArcade = function() {
    window.hentikanSemuaLoopArcade();
    window.activeArcadeGameId = "lobby";
    window._arcState = null;
    window.renderMyArcadeUI();
};

window.tampilkanToastArcade = function(pesan) {
    let t = document.getElementById("myarcade-toast-box");
    if (!t) return;
    t.innerHTML = pesan;
    t.style.display = "block";
    clearTimeout(window._arcToastTimer);
    window._arcToastTimer = setTimeout(function() {
        if (t) t.style.display = "none";
    }, 2600);
};

window.renderMyArcadeUI = function() {
    let body = document.getElementById("myarcade-main-body");
    if (!body) return;
    window.perbaruiSaldoHUDArcade();

    let btnLobby = document.getElementById("btn-arcade-lobby");
    if (btnLobby) btnLobby.classList.toggle("active", window.activeArcadeGameId === "lobby");

    if (window.activeArcadeGameId === "lobby") {
        window.renderLobiArcade(body);
        return;
    }

    let fnMap = {
        space_shooter: window.renderGameSpaceShooter,
        sudoku:        window.renderGameSudoku,
        tetris:        window.renderGameTetris,
        tictactoe:     window.renderGameTicTacToe,
        snake:         window.renderGameSnake,
        game2048:      window.renderGame2048,
        brick_breaker: window.renderGameBrickBreaker,
        flappy_bee:    window.renderGameFlappyBee,
        minesweeper:   window.renderGameMinesweeper,
        connect4:      window.renderGameConnect4
    };
    let fn = fnMap[window.activeArcadeGameId];
    if (typeof fn === "function") fn(body);
};

window.renderLobiArcade = function(bodyEl) {
    let isVisit = Boolean(window.modeKunjunganArcade);
    let lb = isVisit
        ? window.leaderboardSiswaData[window.modeKunjunganArcade]
        : window.pastikanStrukturMyArcade(sessionStorage.getItem("username"));
    let ad = (lb && lb.myArcadeData) ? lb.myArcadeData : { highScores: {}, totalPlays: 0 };
    let hs = ad.highScores || {};
    let hostNama = isVisit ? (lb.namaPanggilan || lb.namaLengkap || window.modeKunjunganArcade) : "";

    let bannerHtml = isVisit
        ? '<div class="arc-lobby-banner"><div><h3>🏆 Papan Rekor My Arcade: ' + hostNama + '</h3><p>Total sesi bermain: <b>' + (ad.totalPlays || 0) + 'x</b></p></div><button type="button" class="mypet-amber-cta sm" style="width:auto; padding:7px 14px;" onclick="window.tutupModalMyArcade()">🚪 Kembali</button></div>'
        : '<div class="arc-lobby-banner"><div><h3>🕹️ Balai Permainan Santai — My Arcade (10 Game)</h3><p>Istirahat sejenak sambil melatih refleks &amp; logika. Setiap permainan selesai memberikan bonus Coin &amp; XP!</p></div><div class="arc-plays-pill">🎮 ' + (ad.totalPlays || 0) + ' Sesi</div></div>';

    let cardsHtml = window.MY_ARCADE_GAMES.map(function(g) {
        let best = Number(hs[g.id]) || 0;
        let fee = Number(g.fee) || 50;
        return '<div class="arc-game-card">' +
            '<div class="arc-card-top">' +
                '<div class="arc-game-ico">' + g.ikon + '</div>' +
                '<div style="flex:1; min-width:0;">' +
                    '<div class="arc-game-name">' + g.nama + '</div>' +
                    '<div class="arc-game-sub">' + g.sub + '</div>' +
                '</div>' +
                '<span class="arc-cat-pill">' + g.cat + '</span>' +
            '</div>' +
            '<div class="arc-best-row"><span>🏆 Rekor: <b>' + best.toLocaleString("id-ID") + '</b></span><span class="arc-fee-chip">🎟️ 🪙 ' + fee + '</span></div>' +
            (!isVisit ? '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiGameArcade(\'' + g.id + '\')">▶ Main (🪙 ' + fee + ' Coin)</button>' : '') +
        '</div>';
    }).join('');

    bodyEl.innerHTML =
        '<div class="arc-lobby-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            bannerHtml +
            '<div class="arc-games-grid">' + cardsHtml + '</div>' +
        '</div>';
};

window.mulaiGameArcade = function(gameId) {
    let gCfg = window.MY_ARCADE_GAMES.find(function(x) { return x.id === gameId; });
    let fee = gCfg ? (Number(gCfg.fee) || 50) : 50;
    let uName = sessionStorage.getItem("username");
    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;

    if (saldo < fee) {
        window.tampilkanToastArcade("⚠️ Saldo Coin tidak mencukupi untuk bermain " + (gCfg ? gCfg.nama : "game ini") + " (Tiket: 🪙 " + fee + " Coin, Saldo: " + saldo.toLocaleString("id-ID") + " Coin).");
        return;
    }

    if (typeof window.gunakanCoinSiswa === "function") {
        let ok = window.gunakanCoinSiswa(fee, "tiket_arcade_" + gameId, false);
        if (!ok) return;
    }

    if (typeof window.mainkanSuaraWorld === "function") window.mainkanSuaraWorld("coin");
    window.hentikanSemuaLoopArcade();
    window.activeArcadeGameId = gameId;
    window._arcState = null;
    window.perbaruiSaldoHUDArcade();
    window.renderMyArcadeUI();
    window.tampilkanToastArcade("🎟️ Tiket masuk −🪙 " + fee + " Coin. Selamat bermain!");
};

// =========================================================================
// 1. SPACE SHOOTER (PESAWAT TEMBAK-TEMBAK 60FPS)
// =========================================================================
window.renderGameSpaceShooter = function(bodyEl) {
    window.hentikanSemuaLoopArcade();
    bodyEl.innerHTML =
        '<div class="arc-stage-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            '<div class="arc-game-topbar">' +
                '<strong>🚀 Space Shooter</strong>' +
                '<div class="arc-hud-stats"><span>Skor: <b id="ss-score">0</b></span><span>Gelombang: <b id="ss-wave">1</b></span><span id="ss-lives">❤️❤️❤️</span></div>' +
                '<button type="button" class="arc-mini-btn" onclick="window.mulaiGameArcade(\'space_shooter\')">🔄 Ulang</button>' +
            '</div>' +
            '<canvas id="arc-ss-canvas" width="380" height="260" class="arc-canvas"></canvas>' +
            '<div class="arc-touch-bar">' +
                '<button type="button" class="arc-ctrl-btn wide" onpointerdown="window._arcHold.left=true" onpointerup="window._arcHold.left=false" onpointerleave="window._arcHold.left=false" onpointercancel="window._arcHold.left=false">◀ KIRI</button>' +
                '<button type="button" class="arc-ctrl-btn wide" onpointerdown="window._arcHold.right=true" onpointerup="window._arcHold.right=false" onpointerleave="window._arcHold.right=false" onpointercancel="window._arcHold.right=false">KANAN ▶</button>' +
            '</div>' +
        '</div>';

    let canvas = document.getElementById("arc-ss-canvas");
    let ctx = canvas.getContext("2d");
    let st = {
        px: 190, py: 232, lives: 3, score: 0, wave: 1, over: false,
        bullets: [], enemies: [], stars: [], lastShot: 0, lastSpawn: 0
    };
    for (let i = 0; i < 36; i++) {
        st.stars.push({ x: Math.random() * 380, y: Math.random() * 260, s: 1 + Math.random() * 1.8 });
    }
    window._arcState = st;

    function loop(now) {
        if (!window.isMyArcadeModalOpen || window.activeArcadeGameId !== "space_shooter") return;
        if (st.over) return;

        if (window._arcHold.left) st.px = Math.max(20, st.px - 4.6);
        if (window._arcHold.right) st.px = Math.min(360, st.px + 4.6);

        if (now - st.lastShot > 240) {
            st.lastShot = now;
            if (st.wave >= 3) {
                st.bullets.push({ x: st.px - 9, y: st.py - 12 }, { x: st.px + 9, y: st.py - 12 });
            } else {
                st.bullets.push({ x: st.px, y: st.py - 14 });
            }
        }

        let spawnInt = Math.max(420, 1050 - st.wave * 95);
        if (now - st.lastSpawn > spawnInt) {
            st.lastSpawn = now;
            let tough = Math.random() < (0.15 + st.wave * 0.05);
            st.enemies.push({
                x: 22 + Math.random() * 336,
                y: -16,
                hp: tough ? 2 : 1,
                vy: 1.15 + st.wave * 0.22 + Math.random() * 0.6,
                vx: (Math.random() - 0.5) * 1.1,
                r: tough ? 15 : 12,
                col: tough ? "#f59e0b" : "#ef4444"
            });
        }

        // Update bullets
        for (let i = st.bullets.length - 1; i >= 0; i--) {
            st.bullets[i].y -= 6.5;
            if (st.bullets[i].y < -10) st.bullets.splice(i, 1);
        }

        // Update enemies & collisions
        for (let i = st.enemies.length - 1; i >= 0; i--) {
            let en = st.enemies[i];
            en.y += en.vy;
            en.x += en.vx;
            if (en.x < 16 || en.x > 364) en.vx *= -1;

            let hitShip = Math.hypot(en.x - st.px, en.y - st.py) < (en.r + 13);
            if (hitShip || en.y > 270) {
                st.enemies.splice(i, 1);
                st.lives--;
                let lEl = document.getElementById("ss-lives");
                if (lEl) lEl.textContent = "❤️".repeat(Math.max(0, st.lives)) + "🖤".repeat(Math.max(0, 3 - st.lives));
                if (st.lives <= 0) {
                    st.over = true;
                    let coinG = Math.min(45, Math.floor(st.score / 12));
                    let xpG = Math.min(20, Math.floor(st.score / 25));
                    let r = window.simpanSkorDanHadiahArcade("space_shooter", st.score, coinG, xpG);
                    window.tampilkanToastArcade("💥 Permainan Selesai! Skor: <b>" + st.score + "</b>" + (r.isNewRecord ? " (🏆 Rekor Baru!)" : "") + " • +🪙 " + r.coin + " &amp; +⭐ " + r.xp + " XP");
                }
                continue;
            }

            for (let j = st.bullets.length - 1; j >= 0; j--) {
                let b = st.bullets[j];
                if (Math.hypot(en.x - b.x, en.y - b.y) < en.r + 5) {
                    st.bullets.splice(j, 1);
                    en.hp--;
                    if (en.hp <= 0) {
                        st.enemies.splice(i, 1);
                        st.score += 10;
                        st.wave = 1 + Math.floor(st.score / 100);
                        let sEl = document.getElementById("ss-score");
                        let wEl = document.getElementById("ss-wave");
                        if (sEl) sEl.textContent = st.score;
                        if (wEl) wEl.textContent = st.wave;
                    }
                    break;
                }
            }
        }

        // Draw
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, 380, 260);
        ctx.fillStyle = "#e2e8f0";
        st.stars.forEach(function(star) {
            star.y += 0.6;
            if (star.y > 260) { star.y = 0; star.x = Math.random() * 380; }
            ctx.fillRect(star.x, star.y, star.s, star.s);
        });

        // Player ship
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(st.px, st.py - 16);
        ctx.lineTo(st.px - 15, st.py + 12);
        ctx.lineTo(st.px, st.py + 6);
        ctx.lineTo(st.px + 15, st.py + 12);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(st.px - 3, st.py - 4, 6, 8);

        // Bullets
        ctx.fillStyle = "#4ade80";
        st.bullets.forEach(function(b) { ctx.fillRect(b.x - 2, b.y - 6, 4, 11); });

        // Enemies
        st.enemies.forEach(function(en) {
            ctx.fillStyle = en.col;
            ctx.beginPath();
            ctx.arc(en.x, en.y, en.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(en.x - 5, en.y - 3, 3, 3);
            ctx.fillRect(en.x + 2, en.y - 3, 3, 3);
        });

        if (st.over) {
            ctx.fillStyle = "rgba(15,23,42,0.72)";
            ctx.fillRect(0, 0, 380, 260);
            ctx.fillStyle = "#fef08a";
            ctx.font = "bold 22px Poppins, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER — SKOR: " + st.score, 190, 134);
            return;
        }

        window._arcRafId = requestAnimationFrame(loop);
    }

    window._arcRafId = requestAnimationFrame(loop);
};

// =========================================================================
// 2. SUDOKU (3 LEVEL: MUDAH 4x4, SEDANG 6x6, SULIT 9x9)
// =========================================================================
window.MY_ARCADE_SUDOKU_BASES = {
    easy: {
        size: 4, boxR: 2, boxC: 2, remove: 7, coin: 20, xp: 10, label: "Mudah (4×4)",
        grid: [
            [1,2,3,4],
            [3,4,1,2],
            [2,1,4,3],
            [4,3,2,1]
        ]
    },
    medium: {
        size: 6, boxR: 2, boxC: 3, remove: 16, coin: 35, xp: 18, label: "Sedang (6×6)",
        grid: [
            [1,2,3,4,5,6],
            [4,5,6,1,2,3],
            [2,3,1,5,6,4],
            [5,6,4,2,3,1],
            [3,1,2,6,4,5],
            [6,4,5,3,1,2]
        ]
    },
    hard: {
        size: 9, boxR: 3, boxC: 3, remove: 40, coin: 60, xp: 30, label: "Sulit (9×9)",
        grid: [
            [5,3,4,6,7,8,9,1,2],
            [6,7,2,1,9,5,3,4,8],
            [1,9,8,3,4,2,5,6,7],
            [8,5,9,7,6,1,4,2,3],
            [4,2,6,8,5,3,7,9,1],
            [7,1,3,9,2,4,8,5,6],
            [9,6,1,5,3,7,2,8,4],
            [2,8,7,4,1,9,6,3,5],
            [3,4,5,2,8,6,1,7,9]
        ]
    }
};

window.buatPapanSudokuAcak = function(lvlKey) {
    let cfg = window.MY_ARCADE_SUDOKU_BASES[lvlKey] || window.MY_ARCADE_SUDOKU_BASES.easy;
    let N = cfg.size;
    let nums = [];
    for (let i = 1; i <= N; i++) nums.push(i);
    nums.sort(function() { return Math.random() - 0.5; });

    let sol = cfg.grid.map(function(row) {
        return row.map(function(v) { return nums[v - 1]; });
    });

    let board = sol.map(function(r) { return r.slice(); });
    let fixed = sol.map(function(r) { return r.map(function() { return true; }); });

    let coords = [];
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) coords.push([r, c]);
    }
    coords.sort(function() { return Math.random() - 0.5; });

    for (let k = 0; k < Math.min(cfg.remove, coords.length); k++) {
        let rr = coords[k][0], cc = coords[k][1];
        board[rr][cc] = 0;
        fixed[rr][cc] = false;
    }

    return { level: lvlKey, cfg: cfg, sol: sol, board: board, fixed: fixed, selR: -1, selC: -1, won: false };
};

window.renderGameSudoku = function(bodyEl, forceLvl) {
    if (forceLvl || !window._arcState || !window._arcState.sol) {
        window._arcState = window.buatPapanSudokuAcak(forceLvl || "easy");
    }
    let st = window._arcState;
    let N = st.cfg.size;

    let levelTabs = ["easy", "medium", "hard"].map(function(lk) {
        let lbl = window.MY_ARCADE_SUDOKU_BASES[lk].label;
        return '<button type="button" class="arc-mini-btn' + (st.level === lk ? ' active' : '') + '" onclick="window.renderGameSudoku(document.getElementById(\'myarcade-main-body\'), \'' + lk + '\')">' + lbl + '</button>';
    }).join('');

    let cellsHtml = '';
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            let v = st.board[r][c];
            let isFix = st.fixed[r][c];
            let isSel = (r === st.selR && c === st.selC);
            let isWrong = (!isFix && v !== 0 && v !== st.sol[r][c]);
            let bRight = ((c + 1) % st.cfg.boxC === 0 && c < N - 1) ? " box-r" : "";
            let bBot = ((r + 1) % st.cfg.boxR === 0 && r < N - 1) ? " box-b" : "";
            cellsHtml += '<button type="button" class="arc-sud-cell' + (isFix ? ' is-fixed' : '') + (isSel ? ' is-sel' : '') + (isWrong ? ' is-err' : '') + bRight + bBot + '" onclick="window.pilihSelSudoku(' + r + ',' + c + ')">' + (v || '') + '</button>';
        }
    }

    let numpadHtml = '';
    for (let n = 1; n <= N; n++) {
        numpadHtml += '<button type="button" class="arc-num-btn" onclick="window.isiAngkaSudoku(' + n + ')">' + n + '</button>';
    }
    numpadHtml += '<button type="button" class="arc-num-btn is-del" onclick="window.isiAngkaSudoku(0)">⌫</button>';

    bodyEl.innerHTML =
        '<div class="arc-stage-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            '<div class="arc-game-topbar">' +
                '<strong>🔢 Sudoku</strong>' +
                '<div style="display:flex; gap:5px; flex-wrap:wrap;">' + levelTabs + '</div>' +
            '</div>' +
            '<div class="arc-sud-layout">' +
                '<div class="arc-sud-grid size-' + N + '" style="grid-template-columns:repeat(' + N + ', 1fr);">' + cellsHtml + '</div>' +
                '<div class="arc-sud-pad">' + numpadHtml + '</div>' +
            '</div>' +
        '</div>';
};

window.pilihSelSudoku = function(r, c) {
    let st = window._arcState;
    if (!st || st.won) return;
    st.selR = r; st.selC = c;
    window.renderGameSudoku(document.getElementById("myarcade-main-body"));
};

window.isiAngkaSudoku = function(num) {
    let st = window._arcState;
    if (!st || st.won || st.selR < 0 || st.selC < 0) return;
    if (st.fixed[st.selR][st.selC]) return;
    st.board[st.selR][st.selC] = num;

    let selesai = true;
    for (let r = 0; r < st.cfg.size; r++) {
        for (let c = 0; c < st.cfg.size; c++) {
            if (st.board[r][c] !== st.sol[r][c]) { selesai = false; break; }
        }
    }

    window.renderGameSudoku(document.getElementById("myarcade-main-body"));
    if (selesai) {
        st.won = true;
        let pts = st.level === "hard" ? 300 : (st.level === "medium" ? 200 : 100);
        let res = window.simpanSkorDanHadiahArcade("sudoku", pts, st.cfg.coin, st.cfg.xp);
        window.tampilkanToastArcade("🎉 Sudoku " + st.cfg.label + " Selesai! +🪙 " + res.coin + " Coin &amp; +⭐ " + res.xp + " XP!");
    }
};

// =========================================================================
// 3. TETRIS (SUSUN BALOK KLASIK)
// =========================================================================
window.MY_ARCADE_TETROMINOES = [
    { m: [[1,1,1,1]],       c: "#38bdf8" },
    { m: [[1,1],[1,1]],     c: "#facc15" },
    { m: [[0,1,0],[1,1,1]], c: "#a855f7" },
    { m: [[0,1,1],[1,1,0]], c: "#22c55e" },
    { m: [[1,1,0],[0,1,1]], c: "#ef4444" },
    { m: [[1,0,0],[1,1,1]], c: "#2563eb" },
    { m: [[0,0,1],[1,1,1]], c: "#f97316" }
];

window.renderGameTetris = function(bodyEl) {
    window.hentikanSemuaLoopArcade();
    bodyEl.innerHTML =
        '<div class="arc-stage-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            '<div class="arc-game-topbar">' +
                '<strong>🧱 Tetris</strong>' +
                '<div class="arc-hud-stats"><span>Skor: <b id="tet-score">0</b></span><span>Baris: <b id="tet-lines">0</b></span></div>' +
                '<button type="button" class="arc-mini-btn" onclick="window.mulaiGameArcade(\'tetris\')">🔄 Ulang</button>' +
            '</div>' +
            '<div class="arc-tet-wrap">' +
                '<canvas id="arc-tet-canvas" width="200" height="320" class="arc-canvas"></canvas>' +
                '<div class="arc-tet-controls">' +
                    '<button type="button" class="arc-ctrl-btn" onclick="window.aksiTetris(\'rot\')">↻ Putar</button>' +
                    '<div style="display:flex; gap:6px;">' +
                        '<button type="button" class="arc-ctrl-btn" onclick="window.aksiTetris(\'left\')">◀</button>' +
                        '<button type="button" class="arc-ctrl-btn" onclick="window.aksiTetris(\'down\')">▼</button>' +
                        '<button type="button" class="arc-ctrl-btn" onclick="window.aksiTetris(\'right\')">▶</button>' +
                    '</div>' +
                    '<button type="button" class="arc-ctrl-btn is-accent" onclick="window.aksiTetris(\'drop\')">⬇ Jatuh Cepat</button>' +
                '</div>' +
            '</div>' +
        '</div>';

    let cols = 10, rows = 16;
    let board = [];
    for (let r = 0; r < rows; r++) board.push(new Array(cols).fill(""));

    let st = { cols: cols, rows: rows, board: board, cur: null, score: 0, lines: 0, over: false };
    window._arcState = st;

    function spawn() {
        let p = window.MY_ARCADE_TETROMINOES[Math.floor(Math.random() * window.MY_ARCADE_TETROMINOES.length)];
        st.cur = { m: p.m.map(function(r) { return r.slice(); }), c: p.c, x: Math.floor((cols - p.m[0].length) / 2), y: 0 };
        if (window.cekTabrakTetris(st, st.cur.m, st.cur.x, st.cur.y)) {
            st.over = true;
            window.hentikanSemuaLoopArcade();
            let r = window.simpanSkorDanHadiahArcade("tetris", st.score, Math.min(50, Math.floor(st.score / 25)), Math.min(25, Math.floor(st.score / 50)));
            window.tampilkanToastArcade("🧱 Permainan Selesai! Skor: <b>" + st.score + "</b> • +🪙 " + r.coin + " &amp; +⭐ " + r.xp + " XP");
        }
    }
    st.spawn = spawn;
    spawn();
    window.gambarCanvasTetris();

    window._arcIntervalId = setInterval(function() {
        if (!window.isMyArcadeModalOpen || window.activeArcadeGameId !== "tetris" || st.over) return;
        window.aksiTetris("down");
    }, 520);
};

window.cekTabrakTetris = function(st, mat, nx, ny) {
    for (let r = 0; r < mat.length; r++) {
        for (let c = 0; c < mat[r].length; c++) {
            if (!mat[r][c]) continue;
            let bx = nx + c, by = ny + r;
            if (bx < 0 || bx >= st.cols || by >= st.rows) return true;
            if (by >= 0 && st.board[by][bx]) return true;
        }
    }
    return false;
};

window.aksiTetris = function(cmd) {
    let st = window._arcState;
    if (!st || st.over || !st.cur) return;

    if (cmd === "left" && !window.cekTabrakTetris(st, st.cur.m, st.cur.x - 1, st.cur.y)) st.cur.x--;
    else if (cmd === "right" && !window.cekTabrakTetris(st, st.cur.m, st.cur.x + 1, st.cur.y)) st.cur.x++;
    else if (cmd === "rot") {
        let m = st.cur.m;
        let rot = m[0].map(function(_, i) { return m.map(function(r) { return r[i]; }).reverse(); });
        if (!window.cekTabrakTetris(st, rot, st.cur.x, st.cur.y)) st.cur.m = rot;
        else if (!window.cekTabrakTetris(st, rot, st.cur.x - 1, st.cur.y)) { st.cur.x--; st.cur.m = rot; }
        else if (!window.cekTabrakTetris(st, rot, st.cur.x + 1, st.cur.y)) { st.cur.x++; st.cur.m = rot; }
    } else if (cmd === "drop") {
        while (!window.cekTabrakTetris(st, st.cur.m, st.cur.x, st.cur.y + 1)) st.cur.y++;
        window.kunciBalokTetris();
    } else if (cmd === "down") {
        if (!window.cekTabrakTetris(st, st.cur.m, st.cur.x, st.cur.y + 1)) st.cur.y++;
        else window.kunciBalokTetris();
    }
    window.gambarCanvasTetris();
};

window.kunciBalokTetris = function() {
    let st = window._arcState;
    if (!st || !st.cur) return;
    let m = st.cur.m;
    for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[r].length; c++) {
            if (m[r][c] && st.cur.y + r >= 0) st.board[st.cur.y + r][st.cur.x + c] = st.cur.c;
        }
    }
    let cleared = 0;
    for (let r = st.rows - 1; r >= 0; r--) {
        if (st.board[r].every(Boolean)) {
            st.board.splice(r, 1);
            st.board.unshift(new Array(st.cols).fill(""));
            cleared++;
            r++;
        }
    }
    if (cleared > 0) {
        st.lines += cleared;
        st.score += [0, 100, 250, 500, 800][cleared] || (cleared * 200);
    } else {
        st.score += 10;
    }
    let sEl = document.getElementById("tet-score");
    let lEl = document.getElementById("tet-lines");
    if (sEl) sEl.textContent = st.score;
    if (lEl) lEl.textContent = st.lines;
    st.spawn();
};

window.gambarCanvasTetris = function() {
    let cv = document.getElementById("arc-tet-canvas");
    let st = window._arcState;
    if (!cv || !st) return;
    let ctx = cv.getContext("2d");
    let sz = 20;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = "rgba(148,163,184,0.12)";
    for (let r = 0; r < st.rows; r++) {
        for (let c = 0; c < st.cols; c++) {
            ctx.strokeRect(c * sz, r * sz, sz, sz);
            if (st.board[r][c]) {
                ctx.fillStyle = st.board[r][c];
                ctx.fillRect(c * sz + 1, r * sz + 1, sz - 2, sz - 2);
            }
        }
    }
    if (st.cur) {
        ctx.fillStyle = st.cur.c;
        for (let r = 0; r < st.cur.m.length; r++) {
            for (let c = 0; c < st.cur.m[r].length; c++) {
                if (st.cur.m[r][c]) ctx.fillRect((st.cur.x + c) * sz + 1, (st.cur.y + r) * sz + 1, sz - 2, sz - 2);
            }
        }
    }
};

// =========================================================================
// 4. TIC-TAC-TOE (VS AI: MUDAH, SEDANG, SULIT MINIMAX)
// =========================================================================
window.renderGameTicTacToe = function(bodyEl, forceLvl) {
    if (forceLvl || !window._arcState || !Array.isArray(window._arcState.cells)) {
        window._arcState = { level: forceLvl || "medium", cells: new Array(9).fill(""), over: false, msg: "Giliran Anda (X)" };
    }
    let st = window._arcState;
    let lvls = [{ k: "easy", l: "Mudah" }, { k: "medium", l: "Sedang" }, { k: "hard", l: "Sulit (AI)" }];

    bodyEl.innerHTML =
        '<div class="arc-stage-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            '<div class="arc-game-topbar">' +
                '<strong>❌ Tic-Tac-Toe</strong>' +
                '<div style="display:flex; gap:5px;">' +
                    lvls.map(function(x) { return '<button type="button" class="arc-mini-btn' + (st.level === x.k ? ' active' : '') + '" onclick="window.renderGameTicTacToe(document.getElementById(\'myarcade-main-body\'), \'' + x.k + '\')">' + x.l + '</button>'; }).join('') +
                '</div>' +
            '</div>' +
            '<div class="arc-ttt-msg">' + st.msg + '</div>' +
            '<div class="arc-ttt-grid">' +
                st.cells.map(function(v, i) {
                    return '<button type="button" class="arc-ttt-cell ' + (v === "X" ? "is-x" : (v === "O" ? "is-o" : "")) + '" onclick="window.klikSelTTT(' + i + ')">' + v + '</button>';
                }).join('') +
            '</div>' +
            (st.over ? '<button type="button" class="mypet-green-cta sm" style="max-width:220px; margin:8px auto 0 auto;" onclick="window.mulaiGameArcade(\'tictactoe\')">🔄 Main Lagi (🪙 50)</button>' : '') +
        '</div>';
};

window.cekMenangTTT = function(b) {
    let lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
        let l = lines[i];
        if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return b[l[0]];
    }
    return b.every(Boolean) ? "DRAW" : "";
};

window.minimaxTTT = function(board, isMax) {
    let w = window.cekMenangTTT(board);
    if (w === "O") return 10;
    if (w === "X") return -10;
    if (w === "DRAW") return 0;

    let best = isMax ? -999 : 999;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = isMax ? "O" : "X";
            let val = window.minimaxTTT(board, !isMax);
            board[i] = "";
            best = isMax ? Math.max(best, val) : Math.min(best, val);
        }
    }
    return best;
};

window.klikSelTTT = function(idx) {
    let st = window._arcState;
    if (!st || st.over || st.cells[idx]) return;
    st.cells[idx] = "X";

    let res = window.cekMenangTTT(st.cells);
    if (!res) {
        let empties = [];
        st.cells.forEach(function(v, i) { if (!v) empties.push(i); });
        let pick = empties[Math.floor(Math.random() * empties.length)];
        if (st.level === "hard" || (st.level === "medium" && Math.random() < 0.65)) {
            let bestVal = -999;
            empties.forEach(function(eIdx) {
                st.cells[eIdx] = "O";
                let sc = window.minimaxTTT(st.cells, false);
                st.cells[eIdx] = "";
                if (sc > bestVal) { bestVal = sc; pick = eIdx; }
            });
        }
        if (pick !== undefined) st.cells[pick] = "O";
        res = window.cekMenangTTT(st.cells);
    }

    if (res) {
        st.over = true;
        if (res === "X") {
            let cG = st.level === "hard" ? 40 : (st.level === "medium" ? 20 : 12);
            let r = window.simpanSkorDanHadiahArcade("tictactoe", cG * 5, cG, Math.round(cG / 2));
            st.msg = "🎉 Anda Menang! +🪙 " + r.coin + " Coin & +⭐ " + r.xp + " XP";
        } else if (res === "DRAW") {
            let rD = st.level === "hard" ? window.simpanSkorDanHadiahArcade("tictactoe", 80, 15, 8) : { coin: 5, xp: 2 };
            st.msg = "🤝 Seri!" + (st.level === "hard" ? (" (+🪙 " + rD.coin + " Coin bertahan lawan AI Sulit!)") : "");
        } else {
            st.msg = "🤖 AI Menang! Coba strategi lain.";
        }
    }
    window.renderGameTicTacToe(document.getElementById("myarcade-main-body"));
};

// =========================================================================
// 5. SNAKE KLASIK
// =========================================================================
window.renderGameSnake = function(bodyEl) {
    window.hentikanSemuaLoopArcade();
    bodyEl.innerHTML =
        '<div class="arc-stage-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            '<div class="arc-game-topbar">' +
                '<strong>🐍 Snake Klasik</strong>' +
                '<div class="arc-hud-stats"><span>Skor: <b id="snk-score">0</b></span></div>' +
                '<button type="button" class="arc-mini-btn" onclick="window.mulaiGameArcade(\'snake\')">🔄 Ulang</button>' +
            '</div>' +
            '<div class="arc-tet-wrap">' +
                '<canvas id="arc-snk-canvas" width="320" height="240" class="arc-canvas"></canvas>' +
                '<div class="arc-dpad-pad">' +
                    '<button type="button" class="arc-ctrl-btn" style="grid-column:2;" onclick="window.ubahArahSnake(0,-1)">▲</button>' +
                    '<button type="button" class="arc-ctrl-btn" style="grid-column:1; grid-row:2;" onclick="window.ubahArahSnake(-1,0)">◀</button>' +
                    '<button type="button" class="arc-ctrl-btn" style="grid-column:3; grid-row:2;" onclick="window.ubahArahSnake(1,0)">▶</button>' +
                    '<button type="button" class="arc-ctrl-btn" style="grid-column:2; grid-row:3;" onclick="window.ubahArahSnake(0,1)">▼</button>' +
                '</div>' +
            '</div>' +
        '</div>';

    let cols = 16, rows = 12;
    let st = { cols: cols, rows: rows, body: [{ x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }], dx: 1, dy: 0, nextDx: 1, nextDy: 0, food: { x: 11, y: 6 }, score: 0, over: false };
    window._arcState = st;

    function spawnFood() {
        let free = [];
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (!st.body.some(function(p) { return p.x === x && p.y === y; })) free.push({ x: x, y: y });
            }
        }
        st.food = free[Math.floor(Math.random() * free.length)] || { x: 0, y: 0 };
    }

    function draw() {
        let cv = document.getElementById("arc-snk-canvas");
        if (!cv) return;
        let ctx = cv.getContext("2d");
        ctx.fillStyle = "#14532d";
        ctx.fillRect(0, 0, 320, 240);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(st.food.x * 20 + 10, st.food.y * 20 + 10, 8, 0, Math.PI * 2);
        ctx.fill();
        st.body.forEach(function(seg, i) {
            ctx.fillStyle = i === 0 ? "#fef08a" : "#4ade80";
            ctx.fillRect(seg.x * 20 + 1, seg.y * 20 + 1, 18, 18);
        });
    }
    draw();

    window._arcIntervalId = setInterval(function() {
        if (!window.isMyArcadeModalOpen || window.activeArcadeGameId !== "snake" || st.over) return;
        st.dx = st.nextDx; st.dy = st.nextDy;
        let head = { x: st.body[0].x + st.dx, y: st.body[0].y + st.dy };
        let hitSelf = st.body.some(function(p) { return p.x === head.x && p.y === head.y; });
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || hitSelf) {
            st.over = true;
            window.hentikanSemuaLoopArcade();
            let r = window.simpanSkorDanHadiahArcade("snake", st.score, Math.min(45, Math.floor(st.score / 5)), Math.min(20, Math.floor(st.score / 10)));
            window.tampilkanToastArcade("🐍 Game Over! Skor: <b>" + st.score + "</b> • +🪙 " + r.coin + " &amp; +⭐ " + r.xp + " XP");
            return;
        }
        st.body.unshift(head);
        if (head.x === st.food.x && head.y === st.food.y) {
            st.score += 10;
            let el = document.getElementById("snk-score");
            if (el) el.textContent = st.score;
            spawnFood();
        } else {
            st.body.pop();
        }
        draw();
    }, 155);
};

window.ubahArahSnake = function(nx, ny) {
    let st = window._arcState;
    if (!st || st.over) return;
    if (nx === -st.dx && ny === -st.dy) return;
    st.nextDx = nx; st.nextDy = ny;
};

// =========================================================================
// 6. 2048 (GABUNG UBIN ANGKA)
// =========================================================================
window.renderGame2048 = function(bodyEl) {
    if (!window._arcState || !Array.isArray(window._arcState.grid)) {
        let g = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        window._arcState = { grid: g, score: 0, over: false, rewarded: false };
        window.spawnTile2048();
        window.spawnTile2048();
    }
    let st = window._arcState;
    let tilesHtml = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            let v = st.grid[r][c];
            tilesHtml += '<div class="arc-2048-cell v-' + Math.min(2048, v) + '">' + (v || '') + '</div>';
        }
    }

    bodyEl.innerHTML =
        '<div class="arc-stage-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            '<div class="arc-game-topbar">' +
                '<strong>🟦 2048</strong>' +
                '<div class="arc-hud-stats"><span>Skor: <b>' + st.score + '</b></span></div>' +
                '<button type="button" class="arc-mini-btn" onclick="window.mulaiGameArcade(\'game2048\')">🔄 Ulang</button>' +
            '</div>' +
            '<div class="arc-tet-wrap">' +
                '<div class="arc-2048-grid">' + tilesHtml + '</div>' +
                '<div class="arc-dpad-pad">' +
                    '<button type="button" class="arc-ctrl-btn" style="grid-column:2;" onclick="window.geser2048(\'up\')">▲</button>' +
                    '<button type="button" class="arc-ctrl-btn" style="grid-column:1; grid-row:2;" onclick="window.geser2048(\'left\')">◀</button>' +
                    '<button type="button" class="arc-ctrl-btn" style="grid-column:3; grid-row:2;" onclick="window.geser2048(\'right\')">▶</button>' +
                    '<button type="button" class="arc-ctrl-btn" style="grid-column:2; grid-row:3;" onclick="window.geser2048(\'down\')">▼</button>' +
                '</div>' +
            '</div>' +
        '</div>';
};

window.spawnTile2048 = function() {
    let st = window._arcState;
    if (!st) return;
    let empty = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) if (st.grid[r][c] === 0) empty.push([r, c]);
    }
    if (empty.length > 0) {
        let p = empty[Math.floor(Math.random() * empty.length)];
        st.grid[p[0]][p[1]] = Math.random() < 0.9 ? 2 : 4;
    }
};

window.geser2048 = function(dir) {
    let st = window._arcState;
    if (!st || st.over) return;
    let before = JSON.stringify(st.grid);

    function slideLine(line) {
        let arr = line.filter(Boolean);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                st.score += arr[i];
                arr.splice(i + 1, 1);
            }
        }
        while (arr.length < 4) arr.push(0);
        return arr;
    }

    if (dir === "left") {
        for (let r = 0; r < 4; r++) st.grid[r] = slideLine(st.grid[r]);
    } else if (dir === "right") {
        for (let r = 0; r < 4; r++) st.grid[r] = slideLine(st.grid[r].slice().reverse()).reverse();
    } else if (dir === "up") {
        for (let c = 0; c < 4; c++) {
            let col = slideLine([st.grid[0][c], st.grid[1][c], st.grid[2][c], st.grid[3][c]]);
            for (let r = 0; r < 4; r++) st.grid[r][c] = col[r];
        }
    } else if (dir === "down") {
        for (let c = 0; c < 4; c++) {
            let col = slideLine([st.grid[3][c], st.grid[2][c], st.grid[1][c], st.grid[0][c]]).reverse();
            for (let r = 0; r < 4; r++) st.grid[r][c] = col[r];
        }
    }

    if (JSON.stringify(st.grid) !== before) {
        window.spawnTile2048();
    }

    // Cek apakah masih ada langkah
    let canMove = false;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (st.grid[r][c] === 0) canMove = true;
            if (c < 3 && st.grid[r][c] === st.grid[r][c + 1]) canMove = true;
            if (r < 3 && st.grid[r][c] === st.grid[r + 1][c]) canMove = true;
        }
    }
    window.renderGame2048(document.getElementById("myarcade-main-body"));
    if (!canMove && !st.rewarded) {
        st.over = true;
        st.rewarded = true;
        let r = window.simpanSkorDanHadiahArcade("game2048", st.score, Math.min(50, Math.floor(st.score / 80)), Math.min(25, Math.floor(st.score / 150)));
        window.tampilkanToastArcade("🟦 Tidak ada langkah tersisa! Skor: <b>" + st.score + "</b> • +🪙 " + r.coin + " &amp; +⭐ " + r.xp + " XP");
    }
};

// =========================================================================
// 7. BRICK BREAKER (PECAH BATA)
// =========================================================================
window.renderGameBrickBreaker = function(bodyEl) {
    window.hentikanSemuaLoopArcade();
    bodyEl.innerHTML =
        '<div class="arc-stage-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            '<div class="arc-game-topbar">' +
                '<strong>🏓 Brick Breaker</strong>' +
                '<div class="arc-hud-stats"><span>Skor: <b id="bb-score">0</b></span><span id="bb-lives">❤️❤️❤️</span></div>' +
                '<button type="button" class="arc-mini-btn" onclick="window.mulaiGameArcade(\'brick_breaker\')">🔄 Ulang</button>' +
            '</div>' +
            '<canvas id="arc-bb-canvas" width="360" height="250" class="arc-canvas"></canvas>' +
            '<div class="arc-touch-bar">' +
                '<button type="button" class="arc-ctrl-btn wide" onpointerdown="window._arcHold.left=true" onpointerup="window._arcHold.left=false" onpointerleave="window._arcHold.left=false" onpointercancel="window._arcHold.left=false">◀ KIRI</button>' +
                '<button type="button" class="arc-ctrl-btn wide" onpointerdown="window._arcHold.right=true" onpointerup="window._arcHold.right=false" onpointerleave="window._arcHold.right=false" onpointercancel="window._arcHold.right=false">KANAN ▶</button>' +
            '</div>' +
        '</div>';

    let cv = document.getElementById("arc-bb-canvas");
    let ctx = cv.getContext("2d");
    let colors = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#38bdf8"];

    function buatBata() {
        let arr = [];
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 8; c++) {
                arr.push({ x: 14 + c * 42, y: 24 + r * 18, w: 38, h: 13, alive: true, col: colors[r] });
            }
        }
        return arr;
    }

    let st = { padX: 145, padW: 72, bx: 180, by: 205, vx: 2.5, vy: -3.0, bricks: buatBata(), lives: 3, score: 0, over: false };
    window._arcState = st;

    function loop() {
        if (!window.isMyArcadeModalOpen || window.activeArcadeGameId !== "brick_breaker" || st.over) return;
        if (window._arcHold.left) st.padX = Math.max(4, st.padX - 5.2);
        if (window._arcHold.right) st.padX = Math.min(356 - st.padW, st.padX + 5.2);

        st.bx += st.vx; st.by += st.vy;
        if (st.bx < 7 || st.bx > 353) st.vx *= -1;
        if (st.by < 7) st.vy *= -1;

        if (st.by >= 224 && st.by <= 236 && st.bx >= st.padX - 4 && st.bx <= st.padX + st.padW + 4 && st.vy > 0) {
            let hitPct = ((st.bx - st.padX) / st.padW) - 0.5;
            st.vx = hitPct * 6.4;
            st.vy = -Math.abs(st.vy);
        }

        if (st.by > 258) {
            st.lives--;
            let lEl = document.getElementById("bb-lives");
            if (lEl) lEl.textContent = "❤️".repeat(Math.max(0, st.lives)) + "🖤".repeat(Math.max(0, 3 - st.lives));
            if (st.lives <= 0) {
                st.over = true;
                let r = window.simpanSkorDanHadiahArcade("brick_breaker", st.score, Math.min(45, Math.floor(st.score / 12)), Math.min(20, Math.floor(st.score / 25)));
                window.tampilkanToastArcade("🏓 Game Over! Skor: <b>" + st.score + "</b> • +🪙 " + r.coin + " &amp; +⭐ " + r.xp + " XP");
                return;
            }
            st.bx = st.padX + st.padW / 2; st.by = 205; st.vy = -3.0;
        }

        let sisa = 0;
        st.bricks.forEach(function(b) {
            if (!b.alive) return;
            sisa++;
            if (st.bx + 6 > b.x && st.bx - 6 < b.x + b.w && st.by + 6 > b.y && st.by - 6 < b.y + b.h) {
                b.alive = false;
                st.vy *= -1;
                st.score += 10;
                let sEl = document.getElementById("bb-score");
                if (sEl) sEl.textContent = st.score;
            }
        });
        if (sisa === 0) {
            st.bricks = buatBata();
            st.vy = -Math.min(4.8, Math.abs(st.vy) + 0.45);
            window.tampilkanToastArcade("✨ Semua bata pecah! Naik level berikutnya!");
        }

        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, 360, 250);
        st.bricks.forEach(function(b) {
            if (!b.alive) return;
            ctx.fillStyle = b.col;
            ctx.fillRect(b.x, b.y, b.w, b.h);
        });
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(st.padX, 230, st.padW, 10);
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(st.bx, st.by, 6, 0, Math.PI * 2);
        ctx.fill();

        window._arcRafId = requestAnimationFrame(loop);
    }
    window._arcRafId = requestAnimationFrame(loop);
};

// =========================================================================
// 8. FLAPPY BEE (TERBANG LEWATI CELAH PIPA)
// =========================================================================
window.renderGameFlappyBee = function(bodyEl) {
    window.hentikanSemuaLoopArcade();
    bodyEl.innerHTML =
        '<div class="arc-stage-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            '<div class="arc-game-topbar">' +
                '<strong>🐝 Flappy Bee</strong>' +
                '<div class="arc-hud-stats"><span>Skor: <b id="fb-score">0</b></span></div>' +
                '<button type="button" class="arc-mini-btn" onclick="window.mulaiGameArcade(\'flappy_bee\')">🔄 Ulang</button>' +
            '</div>' +
            '<canvas id="arc-fb-canvas" width="360" height="245" class="arc-canvas" onpointerdown="window.kepakFlappyBee()"></canvas>' +
            '<button type="button" class="mypet-amber-cta sm" style="max-width:240px; margin:4px auto 0 auto;" onpointerdown="window.kepakFlappyBee()">🐝 KEPAKKAN SAYAP (SPASI)</button>' +
        '</div>';

    let cv = document.getElementById("arc-fb-canvas");
    let ctx = cv.getContext("2d");
    let st = { y: 120, vy: 0, pipes: [{ x: 340, topH: 80, passed: false }], score: 0, started: false, over: false };
    window._arcState = st;

    function loop() {
        if (!window.isMyArcadeModalOpen || window.activeArcadeGameId !== "flappy_bee") return;

        if (st.started && !st.over) {
            st.vy += 0.24;
            st.y += st.vy;

            let lastP = st.pipes[st.pipes.length - 1];
            if (lastP.x < 195) {
                st.pipes.push({ x: 375, topH: 36 + Math.random() * 105, passed: false });
            }

            let gap = 82;
            for (let i = st.pipes.length - 1; i >= 0; i--) {
                let p = st.pipes[i];
                p.x -= 2.2;
                if (!p.passed && p.x + 38 < 86) {
                    p.passed = true;
                    st.score++;
                    let sEl = document.getElementById("fb-score");
                    if (sEl) sEl.textContent = st.score;
                }
                if (p.x < -45) st.pipes.splice(i, 1);

                let inX = (86 + 10 > p.x && 86 - 10 < p.x + 38);
                if (inX && (st.y - 10 < p.topH || st.y + 10 > p.topH + gap)) st.over = true;
            }
            if (st.y < 10 || st.y > 235) st.over = true;

            if (st.over) {
                let r = window.simpanSkorDanHadiahArcade("flappy_bee", st.score, Math.min(45, st.score * 3), Math.min(20, st.score * 2));
                window.tampilkanToastArcade("🐝 Terbentur! Skor: <b>" + st.score + "</b> • +🪙 " + r.coin + " &amp; +⭐ " + r.xp + " XP");
            }
        }

        // Draw sky, pipes, bee
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(0, 0, 360, 245);
        ctx.fillStyle = "#22c55e";
        st.pipes.forEach(function(p) {
            ctx.fillRect(p.x, 0, 38, p.topH);
            ctx.fillRect(p.x, p.topH + 82, 38, 245 - (p.topH + 82));
        });
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(86, st.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(80, st.y - 11, 4, 22);
        ctx.fillRect(91, st.y - 4, 3, 3);

        if (!st.started) {
            ctx.fillStyle = "rgba(15,23,42,0.55)";
            ctx.fillRect(55, 98, 250, 40);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px Poppins, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Ketuk / Spasi untuk Mulai Terbang!", 180, 123);
        }
        if (!st.over) window._arcRafId = requestAnimationFrame(loop);
    }
    window._arcRafId = requestAnimationFrame(loop);
};

window.kepakFlappyBee = function() {
    let st = window._arcState;
    if (!st || st.over) return;
    st.started = true;
    st.vy = -4.6;
};

// =========================================================================
// 9. MINESWEEPER (3 LEVEL + MODE BENDERA 🚩)
// =========================================================================
window.renderGameMinesweeper = function(bodyEl, forceLvl) {
    let cfgs = {
        easy:   { n: 6, mines: 5,  coin: 20, xp: 10, lbl: "Mudah 6×6" },
        medium: { n: 8, mines: 10, coin: 35, xp: 18, lbl: "Sedang 8×8" },
        hard:   { n: 9, mines: 15, coin: 55, xp: 28, lbl: "Sulit 9×9" }
    };
    if (forceLvl || !window._arcState || !window._arcState.mineGrid) {
        let lk = forceLvl || "easy";
        let c = cfgs[lk];
        let g = [];
        for (let r = 0; r < c.n; r++) {
            let row = [];
            for (let col = 0; col < c.n; col++) row.push({ mine: false, open: false, flag: false, adj: 0 });
            g.push(row);
        }
        window._arcState = { level: lk, cfg: c, mineGrid: g, generated: false, flagMode: false, over: false, won: false };
    }
    let st = window._arcState;
    let N = st.cfg.n;
    let flagsUsed = 0;
    st.mineGrid.forEach(function(row) { row.forEach(function(cell) { if (cell.flag) flagsUsed++; }); });

    let gridHtml = '';
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            let cell = st.mineGrid[r][c];
            let txt = cell.open ? (cell.mine ? "💣" : (cell.adj || "")) : (cell.flag ? "🚩" : "");
            gridHtml += '<button type="button" class="arc-ms-cell' + (cell.open ? ' is-open' : '') + (cell.open && cell.mine ? ' is-boom' : '') + ' n-' + cell.adj + '" onclick="window.klikSelMinesweeper(' + r + ',' + c + ')">' + txt + '</button>';
        }
    }

    bodyEl.innerHTML =
        '<div class="arc-stage-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            '<div class="arc-game-topbar">' +
                '<strong>💣 Minesweeper</strong>' +
                '<div style="display:flex; gap:4px; flex-wrap:wrap;">' +
                    ["easy", "medium", "hard"].map(function(k) { return '<button type="button" class="arc-mini-btn' + (st.level === k ? ' active' : '') + '" onclick="window.renderGameMinesweeper(document.getElementById(\'myarcade-main-body\'), \'' + k + '\')">' + cfgs[k].lbl + '</button>'; }).join('') +
                '</div>' +
            '</div>' +
            '<div style="display:flex; justify-content:center; gap:8px; align-items:center; margin-bottom:6px;">' +
                '<span class="arc-hud-pill">💣 Ranjau: <b>' + st.cfg.mines + '</b> • 🚩 Bendera: <b>' + flagsUsed + '</b></span>' +
                '<button type="button" class="arc-mini-btn' + (st.flagMode ? ' active' : '') + '" onclick="window._arcState.flagMode=!window._arcState.flagMode; window.renderGameMinesweeper(document.getElementById(\'myarcade-main-body\'))">' + (st.flagMode ? '🚩 Mode Bendera ON' : '⛏️ Mode Buka') + '</button>' +
            '</div>' +
            '<div class="arc-ms-grid" style="grid-template-columns:repeat(' + N + ', 1fr);">' + gridHtml + '</div>' +
        '</div>';
};

window.klikSelMinesweeper = function(r, c) {
    let st = window._arcState;
    if (!st || st.over || st.won) return;
    let N = st.cfg.n;
    let cell = st.mineGrid[r][c];
    if (cell.open) return;

    if (st.flagMode) {
        cell.flag = !cell.flag;
        window.renderGameMinesweeper(document.getElementById("myarcade-main-body"));
        return;
    }
    if (cell.flag) return;

    if (!st.generated) {
        st.generated = true;
        let placed = 0;
        while (placed < st.cfg.mines) {
            let rr = Math.floor(Math.random() * N), cc = Math.floor(Math.random() * N);
            if (!st.mineGrid[rr][cc].mine && (Math.abs(rr - r) > 1 || Math.abs(cc - c) > 1)) {
                st.mineGrid[rr][cc].mine = true;
                placed++;
            }
        }
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                let cnt = 0;
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        let ni = i + di, nj = j + dj;
                        if (ni >= 0 && ni < N && nj >= 0 && nj < N && st.mineGrid[ni][nj].mine) cnt++;
                    }
                }
                st.mineGrid[i][j].adj = cnt;
            }
        }
    }

    if (cell.mine) {
        st.over = true;
        st.mineGrid.forEach(function(row) { row.forEach(function(x) { if (x.mine) x.open = true; }); });
        window.renderGameMinesweeper(document.getElementById("myarcade-main-body"));
        window.tampilkanToastArcade("💥 Ranjau meledak! Klik level di atas untuk mengulang.");
        return;
    }

    function flood(rr, cc) {
        if (rr < 0 || rr >= N || cc < 0 || cc >= N) return;
        let x = st.mineGrid[rr][cc];
        if (x.open || x.mine || x.flag) return;
        x.open = true;
        if (x.adj === 0) {
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) flood(rr + di, cc + dj);
            }
        }
    }
    flood(r, c);

    let safeLeft = 0;
    st.mineGrid.forEach(function(row) { row.forEach(function(x) { if (!x.mine && !x.open) safeLeft++; }); });
    window.renderGameMinesweeper(document.getElementById("myarcade-main-body"));
    if (safeLeft === 0) {
        st.won = true;
        let pts = st.level === "hard" ? 300 : (st.level === "medium" ? 200 : 100);
        let res = window.simpanSkorDanHadiahArcade("minesweeper", pts, st.cfg.coin, st.cfg.xp);
        window.tampilkanToastArcade("🎉 Semua ranjau terhindari! +🪙 " + res.coin + " Coin &amp; +⭐ " + res.xp + " XP!");
    }
};

// =========================================================================
// 10. CONNECT FOUR (4 BERDERET VS AI)
// =========================================================================
window.renderGameConnect4 = function(bodyEl) {
    if (!window._arcState || !window._arcState.c4Grid) {
        let g = [];
        for (let r = 0; r < 6; r++) g.push(new Array(7).fill(0));
        window._arcState = { c4Grid: g, over: false, msg: "Giliran Anda (🔴) — Ketuk kolom untuk menjatuhkan keping!" };
    }
    let st = window._arcState;

    let cellsHtml = '';
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            let v = st.c4Grid[r][c];
            cellsHtml += '<button type="button" class="arc-c4-slot" onclick="window.jatuhkanKepingC4(' + c + ')"><span class="arc-c4-disc ' + (v === 1 ? 'p1' : (v === 2 ? 'p2' : '')) + '"></span></button>';
        }
    }

    bodyEl.innerHTML =
        '<div class="arc-stage-wrap">' +
            '<div id="myarcade-toast-box" class="myarcade-toast-box" style="display:none;"></div>' +
            '<div class="arc-game-topbar">' +
                '<strong>🔴 Connect Four</strong>' +
                '<span style="font-size:11.5px; font-weight:800; color:#0b3954;">' + st.msg + '</span>' +
                '<button type="button" class="arc-mini-btn" onclick="window.mulaiGameArcade(\'connect4\')">🔄 Ulang</button>' +
            '</div>' +
            '<div class="arc-c4-board">' + cellsHtml + '</div>' +
        '</div>';
};

window.cekMenangC4 = function(g, p) {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (g[r][c] !== p) continue;
            if (c <= 3 && g[r][c+1]===p && g[r][c+2]===p && g[r][c+3]===p) return true;
            if (r <= 2 && g[r+1][c]===p && g[r+2][c]===p && g[r+3][c]===p) return true;
            if (r <= 2 && c <= 3 && g[r+1][c+1]===p && g[r+2][c+2]===p && g[r+3][c+3]===p) return true;
            if (r <= 2 && c >= 3 && g[r+1][c-1]===p && g[r+2][c-2]===p && g[r+3][c-3]===p) return true;
        }
    }
    return false;
};

window.barisKosongC4 = function(g, col) {
    for (let r = 5; r >= 0; r--) if (g[r][col] === 0) return r;
    return -1;
};

window.jatuhkanKepingC4 = function(col) {
    let st = window._arcState;
    if (!st || st.over) return;
    let r = window.barisKosongC4(st.c4Grid, col);
    if (r === -1) return;
    st.c4Grid[r][col] = 1;

    if (window.cekMenangC4(st.c4Grid, 1)) {
        st.over = true;
        let res = window.simpanSkorDanHadiahArcade("connect4", 150, 35, 18);
        st.msg = "🎉 Anda Menang! +🪙 " + res.coin + " & +⭐ " + res.xp + " XP";
        window.renderGameConnect4(document.getElementById("myarcade-main-body"));
        return;
    }

    // Giliran AI (Menang -> Blokir -> Tengah)
    let validCols = [3, 2, 4, 1, 5, 0, 6].filter(function(c) { return window.barisKosongC4(st.c4Grid, c) !== -1; });
    if (validCols.length === 0) {
        st.over = true; st.msg = "🤝 Papan penuh — Seri!";
        window.renderGameConnect4(document.getElementById("myarcade-main-body"));
        return;
    }

    let aiCol = validCols[0];
    let foundWin = validCols.find(function(c) {
        let rr = window.barisKosongC4(st.c4Grid, c);
        st.c4Grid[rr][c] = 2; let w = window.cekMenangC4(st.c4Grid, 2); st.c4Grid[rr][c] = 0; return w;
    });
    let foundBlock = validCols.find(function(c) {
        let rr = window.barisKosongC4(st.c4Grid, c);
        st.c4Grid[rr][c] = 1; let w = window.cekMenangC4(st.c4Grid, 1); st.c4Grid[rr][c] = 0; return w;
    });
    if (foundWin !== undefined) aiCol = foundWin;
    else if (foundBlock !== undefined) aiCol = foundBlock;
    else if (Math.random() < 0.35) aiCol = validCols[Math.floor(Math.random() * validCols.length)];

    let aiR = window.barisKosongC4(st.c4Grid, aiCol);
    st.c4Grid[aiR][aiCol] = 2;

    if (window.cekMenangC4(st.c4Grid, 2)) {
        st.over = true;
        st.msg = "🤖 AI (🟡) Menang! Klik Ulang untuk mencoba lagi.";
    }
    window.renderGameConnect4(document.getElementById("myarcade-main-body"));
};

// =========================================================================
// KONTROL KEYBOARD GLOBAL UNTUK MY ARCADE (DESKTOP)
// =========================================================================
document.addEventListener("keydown", function(e) {
    if (!window.isMyArcadeModalOpen || window.activeArcadeGameId === "lobby") return;
    let k = (e.key || "").toLowerCase();
    let g = window.activeArcadeGameId;

    if (g === "space_shooter" || g === "brick_breaker") {
        if (k === "arrowleft" || k === "a") { e.preventDefault(); window._arcHold.left = true; }
        if (k === "arrowright" || k === "d") { e.preventDefault(); window._arcHold.right = true; }
    } else if (g === "tetris") {
        if (k === "arrowleft" || k === "a") { e.preventDefault(); window.aksiTetris("left"); }
        else if (k === "arrowright" || k === "d") { e.preventDefault(); window.aksiTetris("right"); }
        else if (k === "arrowup" || k === "w") { e.preventDefault(); window.aksiTetris("rot"); }
        else if (k === "arrowdown" || k === "s") { e.preventDefault(); window.aksiTetris("down"); }
        else if (k === " ") { e.preventDefault(); window.aksiTetris("drop"); }
    } else if (g === "snake") {
        if (k === "arrowup" || k === "w") { e.preventDefault(); window.ubahArahSnake(0, -1); }
        else if (k === "arrowdown" || k === "s") { e.preventDefault(); window.ubahArahSnake(0, 1); }
        else if (k === "arrowleft" || k === "a") { e.preventDefault(); window.ubahArahSnake(-1, 0); }
        else if (k === "arrowright" || k === "d") { e.preventDefault(); window.ubahArahSnake(1, 0); }
    } else if (g === "game2048") {
        if (k === "arrowup" || k === "w") { e.preventDefault(); window.geser2048("up"); }
        else if (k === "arrowdown" || k === "s") { e.preventDefault(); window.geser2048("down"); }
        else if (k === "arrowleft" || k === "a") { e.preventDefault(); window.geser2048("left"); }
        else if (k === "arrowright" || k === "d") { e.preventDefault(); window.geser2048("right"); }
    } else if (g === "flappy_bee") {
        if (k === " " || k === "arrowup" || k === "w") { e.preventDefault(); window.kepakFlappyBee(); }
    } else if (g === "sudoku" && /^[1-9]$/.test(k)) {
        window.isiAngkaSudoku(parseInt(k, 10));
    } else if (g === "sudoku" && (k === "backspace" || k === "delete")) {
        window.isiAngkaSudoku(0);
    }
});

document.addEventListener("keyup", function(e) {
    if (!window.isMyArcadeModalOpen) return;
    let k = (e.key || "").toLowerCase();
    if (k === "arrowleft" || k === "a") window._arcHold.left = false;
    if (k === "arrowright" || k === "d") window._arcHold.right = false;
});

document.addEventListener("DOMContentLoaded", function() {
    window.pastikanUIMyArcadeAda();
});