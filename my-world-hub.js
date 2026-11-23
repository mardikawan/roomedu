/* =========================================================================
   MODUL MY WORLD HUB V2 — LAHAN UTAMA + MODE VISIT TERPADU + KUIS 20 SOAL:
   - 1 Tombol Tunggal "🏡 My World" (Rumah Pet, Kebun Garden, Kandang Farm)
   - Klik "🏡 Visit" di Leaderboard -> Avatar Kita Masuk ke My World Milik Teman
   - Minta Hasil Kebun / Ternak Teman: Maks. 3 Produk per 8 Jam
   - Syarat Wajib: Jawab Min. 10 dari 20 Soal Biologi (Gagal = -100 Coin)
   ========================================================================= */

window.MY_WORLD_ZONES = [
    { id: "pet",    nama: "Rumah Sanctuary (My Pet)",    labelSingkat: "🏡 My Pet",    doorX: 23, doorY: 43, exitX: 23, exitY: 53 },
    { id: "lab",    nama: "Laboratorium Sains (My Lab)", labelSingkat: "🧪 My Lab",    doorX: 50, doorY: 35, exitX: 50, exitY: 45 },
    { id: "farm",   nama: "Peternakan (My Farm)",        labelSingkat: "🐄 My Farm",   doorX: 77, doorY: 43, exitX: 77, exitY: 53 },
    { id: "garden", nama: "Kebun Sains (My Garden)",     labelSingkat: "🌱 My Garden", doorX: 50, doorY: 66, exitX: 50, exitY: 56 },
    { id: "shop",   nama: "Toko Lahan (World Shop)",     labelSingkat: "🏪 Shop",      doorX: 74.5, doorY: 66, exitX: 69, exitY: 62 },
    { id: "river",  nama: "Dermaga Sungai (Memancing)",  labelSingkat: "🎣 Memancing", doorX: 25,   doorY: 74, exitX: 31, exitY: 66 }
];

window.MY_WORLD_VISIT_CONFIG = {
    maxProdukPer8Jam: 3,
    totalSoalKuis: 20,
    minBenarKuis: 10,
    dendaGagalCoin: 100
};

window.modeKunjunganWorld = null; // null = World sendiri, string = username teman yang dikunjungi
window._visitQuizState = null;

window.myWorldState = {
    isOpen: false,
    openedFromHub: false,
    x: 50,
    y: 52,
    facingRight: true,
    targetX: null,
    targetY: null,
    autoEnterZone: "",
    nearZoneId: "",
    keys: { up: false, down: false, left: false, right: false },
    exitCooldownUntil: 0,
    rafId: null,
    lastFrameMs: 0
};

// =========================================================================
// 1. INJEKSI 1 TOMBOL MELAYANG "🏡 My World", MODAL WORLD, & MODAL KUIS 20 SOAL
// =========================================================================
window.pastikanUIMyWorldAda = function() {
    if (!document.getElementById("btn-floating-myworld")) {
        let btn = document.createElement("button");
        btn.id = "btn-floating-myworld";
        btn.className = "myworld-floating-btn";
        btn.onclick = function() { window.bukaModalMyWorld(true); };
        btn.title = "Buka Lahan Utama (My Pet • My Garden • My Farm)";
        btn.innerHTML =
            '<span class="myworld-float-icon">🏡</span>' +
            '<span class="myworld-float-text">My World</span>' +
            '<span id="myworld-alert-dot" class="myworld-alert-badge" style="display:none;">!</span>';
        document.body.appendChild(btn);
    }

    if (!document.getElementById("modal-my-world")) {
        let modal = document.createElement("div");
        modal.id = "modal-my-world";
        modal.className = "modal-overlay";
        modal.onclick = function(e) {
            if (e.target === modal) window.tutupModalMyWorld(true);
        };

        modal.innerHTML =
            '<div class="modal-box myworld-modal-box">' +
                '<div class="myworld-hud">' +
                    '<div class="myworld-hud-left">' +
                        '<div class="myworld-wood-sign">' +
                            '<span style="font-size:20px;">🏡</span>' +
                            '<div>' +
                                '<div id="myworld-sign-top" class="world-sign-top">Lahan Utama</div>' +
                                '<div id="myworld-sign-main" class="world-sign-main">My World</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="mypet-hud-currencies">' +
                            '<div class="mypet-hud-pill coin-pill" title="Saldo Coin Kamu">' +
                                '<span class="hud-orb coin-orb">🪙</span>' +
                                '<strong id="myworld-hud-coin">0</strong>' +
                            '</div>' +
                            '<div class="mypet-hud-pill xp-pill" title="Total XP Leaderboard Kamu">' +
                                '<span class="hud-orb xp-orb">⭐</span>' +
                                '<strong id="myworld-hud-xp">0</strong>' +
                            '</div>' +
                        '</div>' +
                        '<span id="myworld-visit-quota-pill" class="world-visit-quota-pill" style="display:none;">🎁 Minta: 0/3</span>' +
                    '</div>' +

                    '<div class="myworld-hud-right">' +
                        '<button type="button" id="btn-myworld-pulang" class="world-pulang-btn" style="display:none;" onclick="window.akhiriKunjunganWorld()">🚪 Pulang</button>' +
                        '<button type="button" id="btn-myworld-fs" class="world-fs-btn" onclick="window.aktifkanLandscapeFullscreenMyWorld()" title="Mode Fullscreen Landscape">⛶</button>' +
                        '<span class="myworld-ctrl-hint">🕹️ WASD / Panah / Klik Peta</span>' +
                        '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupModalMyWorld(true)" title="Keluar ke Halaman Materi">✕</button>' +
                    '</div>' +
                '</div>' +

                '<div class="myworld-map-wrap">' +
                    '<div id="myworld-stage" class="myworld-stage" onclick="window.klikPetaMyWorld(event)">' +
                        window.bangunSVGPetaLahanUtama() +

                        '<button type="button" id="world-zone-pet" class="world-zone-btn zone-pet" onclick="event.stopPropagation(); window.arahkanAvatarKeZona(\'pet\')" title="Arahkan avatar ke Rumah (My Pet)">' +
                            '<span id="world-badge-pet" class="world-zone-alert" style="display:none;">!</span>' +
                            '<div class="world-zone-tag">🏡 Rumah • My Pet</div>' +
                            '<div class="world-door-glow"></div>' +
                        '</button>' +

                        '<button type="button" id="world-zone-farm" class="world-zone-btn zone-farm" onclick="event.stopPropagation(); window.arahkanAvatarKeZona(\'farm\')" title="Arahkan avatar ke Peternakan (My Farm)">' +
                            '<span id="world-badge-farm" class="world-zone-alert" style="display:none;">!</span>' +
                            '<div class="world-zone-tag">🐄 Kandang • My Farm</div>' +
                            '<div class="world-door-glow"></div>' +
                        '</button>' +

                        '<button type="button" id="world-zone-lab" class="world-zone-btn zone-lab" onclick="event.stopPropagation(); window.arahkanAvatarKeZona(\'lab\')" title="Arahkan avatar ke Laboratorium (My Lab)">' +
                            '<div class="world-zone-tag">🧪 Lab • My Lab</div>' +
                            '<div class="world-door-glow"></div>' +
                        '</button>' +

                        '<button type="button" id="world-zone-garden" class="world-zone-btn zone-garden" onclick="event.stopPropagation(); window.arahkanAvatarKeZona(\'garden\')" title="Arahkan avatar ke Kebun (My Garden)">' +
                            '<span id="world-badge-garden" class="world-zone-alert" style="display:none;">!</span>' +
                            '<div class="world-zone-tag">🌱 Kebun • My Garden</div>' +
                            '<div class="world-door-glow"></div>' +
                        '</button>' +

                        '<button type="button" id="world-zone-shop" class="world-zone-btn zone-shop" onclick="event.stopPropagation(); window.arahkanAvatarKeZona(\'shop\')" title="Arahkan avatar ke Toko Lahan (World Shop)">' +
                            '<div class="world-zone-tag">🏪 Shop</div>' +
                            '<div class="world-door-glow"></div>' +
                        '</button>' +

                        '<button type="button" id="world-zone-river" class="world-zone-btn zone-river" onclick="event.stopPropagation(); window.arahkanAvatarKeZona(\'river\')" title="Arahkan avatar ke Sungai untuk Memancing">' +
                            '<div class="world-zone-tag">🎣 Sungai</div>' +
                            '<div class="world-door-glow"></div>' +
                        '</button>' +

                        '<div id="myworld-click-ripple" class="myworld-click-ripple" style="display:none;"></div>' +

                        '<div id="myworld-avatar" class="myworld-avatar" style="left:50%; top:52%;">' +
                            '<div id="myworld-avatar-name" class="myworld-avatar-name">Siswa</div>' +
                            '<div id="myworld-avatar-flip" class="myworld-avatar-flip">' +
                                window.bangunSVGAvatarStardew() +
                            '</div>' +
                        '</div>' +

                        '<div class="myworld-dpad" onclick="event.stopPropagation();">' +
                            '<button type="button" class="dpad-btn up" onpointerdown="window.setDpadMyWorld(\'up\',true)" onpointerup="window.setDpadMyWorld(\'up\',false)" onpointerleave="window.setDpadMyWorld(\'up\',false)" onpointercancel="window.setDpadMyWorld(\'up\',false)">▲</button>' +
                            '<button type="button" class="dpad-btn left" onpointerdown="window.setDpadMyWorld(\'left\',true)" onpointerup="window.setDpadMyWorld(\'left\',false)" onpointerleave="window.setDpadMyWorld(\'left\',false)" onpointercancel="window.setDpadMyWorld(\'left\',false)">◀</button>' +
                            '<button type="button" class="dpad-btn right" onpointerdown="window.setDpadMyWorld(\'right\',true)" onpointerup="window.setDpadMyWorld(\'right\',false)" onpointerleave="window.setDpadMyWorld(\'right\',false)" onpointercancel="window.setDpadMyWorld(\'right\',false)">▶</button>' +
                            '<button type="button" class="dpad-btn down" onpointerdown="window.setDpadMyWorld(\'down\',true)" onpointerup="window.setDpadMyWorld(\'down\',false)" onpointerleave="window.setDpadMyWorld(\'down\',false)" onpointercancel="window.setDpadMyWorld(\'down\',false)">▼</button>' +
                        '</div>' +

                        '<div id="myworld-enter-bar" class="myworld-enter-bar" onclick="event.stopPropagation();">' +
                            '<span id="myworld-enter-hint">🚶 Arahkan avatar ke <b>Rumah (My Pet)</b>, <b>Kebun (My Garden)</b>, atau <b>Kandang (My Farm)</b></span>' +
                            '<button type="button" id="btn-myworld-enter-now" class="myworld-enter-btn" style="display:none;" onclick="window.masukZonaTerdekatMyWorld()">🚪 Masuk</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div id="myworld-shop-overlay" class="myworld-inner-overlay" style="display:none;" onclick="if(event.target===this) window.tutupWorldShop()"></div>' +
                '<div id="myworld-fishing-overlay" class="myworld-inner-overlay" style="display:none;" onclick="if(event.target===this) window.tutupMiniGameMancing()"></div>' +
            '</div>';

        document.body.appendChild(modal);
    }

    if (!document.getElementById("modal-visit-quiz-20")) {
        let qModal = document.createElement("div");
        qModal.id = "modal-visit-quiz-20";
        qModal.className = "modal-overlay visit-quiz-overlay";
        qModal.innerHTML = '<div id="visit-quiz-card-host" class="visit-quiz-card-box"></div>';
        document.body.appendChild(qModal);
    }
};

// =========================================================================
// 2. ILUSTRASI PETA TOP-DOWN COZY (STARDEW VALLEY) & AVATAR CHIBI
// =========================================================================
window.bangunSVGPetaLahanUtama = function() {
    return '<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" class="myworld-bg-svg">' +
        '<defs>' +
            '<linearGradient id="mwGrassG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#89cf5e"/><stop offset="55%" stop-color="#76bf4e"/><stop offset="100%" stop-color="#5ea63c"/></linearGradient>' +
            '<linearGradient id="mwWaterG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#0284c7"/></linearGradient>' +
        '</defs>' +
        '<rect width="1000" height="560" fill="url(#mwGrassG)"/>' +
        '<ellipse cx="140" cy="490" rx="150" ry="60" fill="#84cc16" opacity="0.32"/>' +
        '<ellipse cx="870" cy="470" rx="150" ry="65" fill="#84cc16" opacity="0.32"/>' +
        '<ellipse cx="500" cy="110" rx="180" ry="50" fill="#a3e635" opacity="0.25"/>' +
        '<path d="M0,445 Q125,418 220,475 Q275,512 295,560 L0,560 Z" fill="#fde68a"/>' +
        '<path d="M0,455 Q120,432 210,485 Q255,518 275,560 L0,560 Z" fill="url(#mwWaterG)"/>' +
        '<path d="M35,495 Q85,485 135,500 M120,530 Q165,522 205,535" stroke="#e0f2fe" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.75"/>' +
        '<path d="M230,245 Q360,285 500,295 Q640,285 770,245" fill="none" stroke="#c89254" stroke-width="54" stroke-linecap="round"/>' +
        '<path d="M230,245 Q360,285 500,295 Q640,285 770,245" fill="none" stroke="#eac28a" stroke-width="40" stroke-linecap="round"/>' +
        '<path d="M500,192 L500,380" fill="none" stroke="#c89254" stroke-width="52" stroke-linecap="round"/>' +
        '<path d="M500,192 L500,380" fill="none" stroke="#eac28a" stroke-width="38" stroke-linecap="round"/>' +
        '<ellipse cx="500" cy="292" rx="68" ry="38" fill="#d9a86c" stroke="#b07b3f" stroke-width="4"/>' +
        '<ellipse cx="500" cy="292" rx="52" ry="26" fill="#f3d6a7"/>' +
        '<g transform="translate(118, 42)">' +
            '<ellipse cx="112" cy="186" rx="108" ry="22" fill="rgba(25,55,15,0.22)"/>' +
            '<rect x="30" y="90" width="164" height="94" rx="6" fill="#fff3d6" stroke="#7c4a1d" stroke-width="5"/>' +
            '<line x1="30" y1="120" x2="194" y2="120" stroke="#e4c391" stroke-width="3"/>' +
            '<line x1="30" y1="150" x2="194" y2="150" stroke="#e4c391" stroke-width="3"/>' +
            '<rect x="150" y="16" width="24" height="44" rx="3" fill="#b45309" stroke="#5c2606" stroke-width="4"/>' +
            '<polygon points="8,98 112,22 216,98" fill="#dc5a38" stroke="#7c2d12" stroke-width="5" stroke-linejoin="round"/>' +
            '<polygon points="28,92 112,34 196,92" fill="#ef6f4b"/>' +
            '<path d="M90,184 L90,136 A22,22 0 0,1 134,136 L134,184 Z" fill="#8b4d22" stroke="#4e270c" stroke-width="4"/>' +
            '<circle cx="123" cy="160" r="3.5" fill="#fde047"/>' +
            '<rect x="46" y="122" width="30" height="28" rx="4" fill="#bae6fd" stroke="#7c4a1d" stroke-width="3.5"/>' +
            '<line x1="61" y1="122" x2="61" y2="150" stroke="#7c4a1d" stroke-width="2.5"/><line x1="46" y1="136" x2="76" y2="136" stroke="#7c4a1d" stroke-width="2.5"/>' +
            '<rect x="148" y="122" width="30" height="28" rx="4" fill="#bae6fd" stroke="#7c4a1d" stroke-width="3.5"/>' +
            '<line x1="163" y1="122" x2="163" y2="150" stroke="#7c4a1d" stroke-width="2.5"/><line x1="148" y1="136" x2="178" y2="136" stroke="#7c4a1d" stroke-width="2.5"/>' +
            '<rect x="86" y="185" width="52" height="14" rx="5" fill="#f59e0b" stroke="#78350f" stroke-width="2.5"/>' +
        '</g>' +
        '<g transform="translate(658, 38)">' +
            '<ellipse cx="112" cy="190" rx="116" ry="24" fill="rgba(25,55,15,0.22)"/>' +
            '<rect x="14" y="148" width="196" height="44" rx="10" fill="#c99352" stroke="#ffffff" stroke-width="5" stroke-dasharray="14,7"/>' +
            '<path d="M36,92 L62,42 L162,42 L188,92 L188,162 L36,162 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="5" stroke-linejoin="round"/>' +
            '<path d="M24,96 L60,34 L164,34 L200,96" fill="none" stroke="#fef3c7" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M24,96 L60,34 L164,34 L200,96" fill="none" stroke="#991b1b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<rect x="82" y="102" width="60" height="60" fill="#991b1b" stroke="#fef3c7" stroke-width="4"/>' +
            '<line x1="82" y1="102" x2="142" y2="162" stroke="#fef3c7" stroke-width="3.5"/>' +
            '<line x1="142" y1="102" x2="82" y2="162" stroke="#fef3c7" stroke-width="3.5"/>' +
            '<rect x="97" y="54" width="30" height="24" rx="4" fill="#450a0a" stroke="#fef3c7" stroke-width="3"/>' +
        '</g>' +
        '<g transform="translate(342, 366)">' +
            '<rect x="0" y="12" width="316" height="148" rx="18" fill="#65a30d" stroke="#8c5a2b" stroke-width="6"/>' +
            '<rect x="14" y="24" width="288" height="124" rx="12" fill="#8b5a2b" stroke="#5c3210" stroke-width="3"/>' +
            '<g fill="#71431b" stroke="#5c3210" stroke-width="2">' +
                '<rect x="28" y="38" width="56" height="42" rx="6"/><rect x="96" y="38" width="56" height="42" rx="6"/><rect x="164" y="38" width="56" height="42" rx="6"/><rect x="232" y="38" width="56" height="42" rx="6"/>' +
                '<rect x="28" y="92" width="56" height="42" rx="6"/><rect x="96" y="92" width="56" height="42" rx="6"/><rect x="164" y="92" width="56" height="42" rx="6"/><rect x="232" y="92" width="56" height="42" rx="6"/>' +
            '</g>' +
            '<circle cx="56" cy="58" r="9" fill="#facc15"/><circle cx="56" cy="58" r="4" fill="#78350f"/>' +
            '<circle cx="124" cy="58" r="8" fill="#4ade80"/><circle cx="192" cy="58" r="9" fill="#f43f5e"/>' +
            '<circle cx="260" cy="58" r="8" fill="#38bdf8"/><circle cx="124" cy="112" r="9" fill="#f97316"/>' +
            '<circle cx="192" cy="112" r="9" fill="#a855f7"/><circle cx="260" cy="112" r="8" fill="#4ade80"/>' +
            '<rect x="128" y="2" width="60" height="18" rx="5" fill="#f5deb3" stroke="#7c4a1d" stroke-width="3"/>' +
        '</g>' +
        '<g>' +
            '<circle cx="54" cy="74" r="36" fill="#2e7d32" stroke="#1b5e20" stroke-width="4"/><circle cx="54" cy="56" r="24" fill="#43a047"/>' +
            '<circle cx="58" cy="272" r="34" fill="#2e7d32" stroke="#1b5e20" stroke-width="4"/><circle cx="58" cy="256" r="22" fill="#43a047"/>' +
            '<circle cx="944" cy="78" r="36" fill="#2e7d32" stroke="#1b5e20" stroke-width="4"/><circle cx="944" cy="60" r="24" fill="#43a047"/>' +
            '<circle cx="938" cy="312" r="38" fill="#2e7d32" stroke="#1b5e20" stroke-width="4"/><circle cx="938" cy="294" r="25" fill="#43a047"/>' +
            '<circle cx="888" cy="485" r="36" fill="#2e7d32" stroke="#1b5e20" stroke-width="4"/><circle cx="888" cy="468" r="24" fill="#43a047"/>' +
            '<!-- ZONA 4 (TENGAH UTARA): GEDUNG LABORATORIUM SAINS (MY LAB) -->' +
        '<g transform="translate(410, 26)">' +
            '<ellipse cx="90" cy="148" rx="88" ry="18" fill="rgba(15,45,35,0.22)"/>' +
            '<path d="M26,56 C26,14 154,14 154,56 Z" fill="#38bdf8" stroke="#0369a1" stroke-width="4.5"/>' +
            '<path d="M44,54 C48,26 132,26 136,54" fill="#bae6fd" opacity="0.65"/>' +
            '<rect x="16" y="54" width="148" height="90" rx="8" fill="#f8fafc" stroke="#0f766e" stroke-width="4.5"/>' +
            '<rect x="16" y="54" width="148" height="16" rx="4" fill="#14b8a6"/>' +
            '<rect x="28" y="82" width="32" height="32" rx="5" fill="#ccfbf1" stroke="#0f766e" stroke-width="3"/>' +
            '<rect x="120" y="82" width="32" height="32" rx="5" fill="#ccfbf1" stroke="#0f766e" stroke-width="3"/>' +
            '<path d="M70,144 L70,92 A20,20 0 0,1 110,92 L110,144 Z" fill="#0ea5e9" stroke="#0c4a6e" stroke-width="4"/>' +
            '<line x1="90" y1="90" x2="90" y2="144" stroke="#e0f2fe" stroke-width="2.5"/>' +
            '<polygon points="90,22 80,44 100,44" fill="#fef08a" stroke="#0c4a6e" stroke-width="2.5" stroke-linejoin="round"/>' +
            '<rect x="66" y="145" width="48" height="12" rx="4" fill="#14b8a6" stroke="#0f766e" stroke-width="2.5"/>' +
        '</g>' +
            '<circle cx="348" cy="204" r="6" fill="#f43f5e"/><circle cx="364" cy="212" r="5" fill="#facc15"/>' +
            '<circle cx="645" cy="206" r="6" fill="#ffffff"/><circle cx="660" cy="198" r="5" fill="#facc15"/>' +
            '<circle cx="745" cy="442" r="6" fill="#fb923c"/><circle cx="762" cy="452" r="5" fill="#fef08a"/>' +
            '<!-- DERMAGA KAYU MEMANCING DI TEPI SUNGAI -->' +
            '<g transform="translate(150, 412)">' +
                '<rect x="18" y="14" width="66" height="24" rx="5" fill="#b45309" stroke="#5c2606" stroke-width="3.5"/>' +
                '<line x1="34" y1="14" x2="34" y2="38" stroke="#78350f" stroke-width="2.5"/>' +
                '<line x1="52" y1="14" x2="52" y2="38" stroke="#78350f" stroke-width="2.5"/>' +
                '<line x1="70" y1="14" x2="70" y2="38" stroke="#78350f" stroke-width="2.5"/>' +
                '<circle cx="22" cy="14" r="5" fill="#78350f"/><circle cx="80" cy="14" r="5" fill="#78350f"/>' +
            '</g>' +
            '<!-- KIOS TOKO LAHAN (WORLD SHOP) -->' +
            '<g transform="translate(765, 302)">' +
                '<ellipse cx="56" cy="96" rx="54" ry="12" fill="rgba(20,50,15,0.22)"/>' +
                '<rect x="12" y="40" width="88" height="54" rx="6" fill="#fef3c7" stroke="#78350f" stroke-width="4"/>' +
                '<rect x="20" y="54" width="72" height="26" rx="4" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>' +
                '<rect x="18" y="76" width="76" height="9" rx="3" fill="#d97706" stroke="#78350f" stroke-width="2"/>' +
                '<path d="M4,42 L16,16 L96,16 L108,42 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="4" stroke-linejoin="round"/>' +
                '<path d="M22,42 L29,16 L46,16 L42,42 Z" fill="#ffffff"/>' +
                '<path d="M62,42 L65,16 L82,16 L88,42 Z" fill="#ffffff"/>' +
                '<rect x="34" y="96" width="44" height="10" rx="4" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>' +
            '</g>' +
        '</g>' +
    '</svg>';
};

window.bangunSVGAvatarStardew = function() {
    return '<svg viewBox="0 0 80 96" width="46" height="56" class="myworld-avatar-svg">' +
        '<ellipse cx="40" cy="88" rx="18" ry="6" fill="rgba(15,23,42,0.28)"/>' +
        '<rect class="av-leg-l" x="28" y="68" width="9" height="17" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2"/>' +
        '<rect class="av-leg-r" x="43" y="68" width="9" height="17" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2"/>' +
        '<rect x="23" y="45" width="34" height="27" rx="10" fill="#38bdf8" stroke="#0369a1" stroke-width="2.5"/>' +
        '<path d="M26,56 L54,56 L53,72 L27,72 Z" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="2"/>' +
        '<circle cx="31" cy="59" r="2.2" fill="#fde047"/><circle cx="49" cy="59" r="2.2" fill="#fde047"/>' +
        '<ellipse cx="19" cy="57" rx="5" ry="9" fill="#fed7aa" stroke="#9a3412" stroke-width="2"/>' +
        '<ellipse cx="61" cy="57" rx="5" ry="9" fill="#fed7aa" stroke="#9a3412" stroke-width="2"/>' +
        '<circle cx="40" cy="30" r="18" fill="#fed7aa" stroke="#9a3412" stroke-width="2.5"/>' +
        '<circle cx="33" cy="30" r="2.7" fill="#0f172a"/><circle cx="47" cy="30" r="2.7" fill="#0f172a"/>' +
        '<ellipse cx="28" cy="34" rx="3.2" ry="1.8" fill="#fb7185" opacity="0.7"/>' +
        '<ellipse cx="52" cy="34" rx="3.2" ry="1.8" fill="#fb7185" opacity="0.7"/>' +
        '<path d="M36,36 Q40,40 44,36" fill="none" stroke="#7c2d12" stroke-width="2.2" stroke-linecap="round"/>' +
        '<ellipse cx="40" cy="17" rx="26" ry="7" fill="#facc15" stroke="#a16207" stroke-width="2.5"/>' +
        '<path d="M23,16 C25,4 55,4 57,16 Z" fill="#fde047" stroke="#a16207" stroke-width="2.5"/>' +
        '<path d="M24,14 Q40,18 56,14" fill="none" stroke="#dc2626" stroke-width="3.5"/>' +
    '</svg>';
};

// =========================================================================
// 3. SISTEM KUOTA MINTA PRODUK (MAKS. 3 PRODUK / 8 JAM) & KUIS 20 SOAL
// =========================================================================
window.dapatkanSlot8JamVisit = function() {
    let now = new Date();
    let yyyy = now.getFullYear();
    let mm = String(now.getMonth() + 1).padStart(2, "0");
    let dd = String(now.getDate()).padStart(2, "0");
    let slot = Math.floor(now.getHours() / 8); // 00:00, 08:00, 16:00
    return yyyy + "-" + mm + "-" + dd + "_S" + slot;
};

window.ambilStatusKuotaVisitSaya = function() {
    let uName = sessionStorage.getItem("username") || "";
    let cleanKey = (typeof window.normalisasiKeySiswaPet === "function") ? window.normalisasiKeySiswaPet(uName) : uName.trim().toLowerCase();
    let lbSaya = (typeof window.pastikanStrukturDualXPDanPet === "function") ? window.pastikanStrukturDualXPDanPet(cleanKey) : null;
    let slotNow = window.dapatkanSlot8JamVisit();

    let defState = { slotKey: slotNow, quizPassed: false, usedCount: 0, claimedTargets: [] };
    if (!lbSaya) return defState;

    let lsKey = "visit_quota8h_" + (window.guruAktif || "mahardika") + "_" + cleanKey;
    let saved = lbSaya.visitQuota8h;
    if (!saved || saved.slotKey !== slotNow) {
        try {
            let localRaw = localStorage.getItem(lsKey);
            if (localRaw) {
                let parsed = JSON.parse(localRaw);
                if (parsed && parsed.slotKey === slotNow) saved = parsed;
            }
        } catch (e) {}
    }

    if (!saved || saved.slotKey !== slotNow) {
        saved = defState;
    } else {
        if (!Array.isArray(saved.claimedTargets)) {
            saved.claimedTargets = saved.claimedTargets ? Object.values(saved.claimedTargets) : [];
        }
        saved.usedCount = Number(saved.usedCount) || 0;
        saved.quizPassed = Boolean(saved.quizPassed);
    }

    lbSaya.visitQuota8h = saved;
    return saved;
};

window.simpanKuotaVisitSaya = function(lbSaya) {
    if (!lbSaya) return;
    let rawU = sessionStorage.getItem("username") || "";
    let cleanKey = (typeof window.normalisasiKeySiswaPet === "function") ? window.normalisasiKeySiswaPet(rawU) : rawU.trim().toLowerCase();
    let lsKey = "visit_quota8h_" + (window.guruAktif || "mahardika") + "_" + cleanKey;
    try { localStorage.setItem(lsKey, JSON.stringify(lbSaya.visitQuota8h)); } catch (e) {}

    let isAdmin = (typeof window.isAdminSession === "function" && window.isAdminSession()) || sessionStorage.getItem("statusLogin") === "admin" || cleanKey === "mahardika";
    if (!isAdmin && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(cleanKey, lbSaya);
    }
};

window.apakahItemSudahDiminta = function(claimKey) {
    let q = window.ambilStatusKuotaVisitSaya();
    return Array.isArray(q.claimedTargets) && q.claimedTargets.indexOf(claimKey) !== -1;
};

window.kumpulkan20SoalKuisVisit = function() {
    let pool = [];
    if (window.MY_GARDEN_PLANT_QUIZ) {
        Object.keys(window.MY_GARDEN_PLANT_QUIZ).forEach(function(k) {
            let pCfg = (typeof window.cariInfoTanaman === "function") ? window.cariInfoTanaman(k) : null;
            let lbl = "🌱 " + (pCfg ? pCfg.nama : k);
            (window.MY_GARDEN_PLANT_QUIZ[k] || []).forEach(function(it) {
                if (it && it.q && Array.isArray(it.opts)) {
                    pool.push({ q: it.q, opts: it.opts, ans: it.ans, info: it.info || "", topik: lbl });
                }
            });
        });
    }
    if (window.MY_FARM_QUIZ_BANK) {
        Object.keys(window.MY_FARM_QUIZ_BANK).forEach(function(k) {
            let aCfg = (typeof window.cariInfoTernak === "function") ? window.cariInfoTernak(k) : null;
            let lbl = "🐄 " + (aCfg ? aCfg.nama : k.replace(/_/g, " "));
            (window.MY_FARM_QUIZ_BANK[k] || []).forEach(function(it) {
                if (it && it.q && Array.isArray(it.opts)) {
                    pool.push({ q: it.q, opts: it.opts, ans: it.ans, info: it.info || "", topik: lbl });
                }
            });
        });
    }

    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = pool[i];
        pool[i] = pool[j];
        pool[j] = tmp;
    }

    let targetJml = window.MY_WORLD_VISIT_CONFIG.totalSoalKuis;
    return pool.slice(0, Math.min(targetJml, pool.length));
};

// Pintu Utama Saat Pengunjung Menekan Tombol "🎁 Minta Hasil Kebun / Ternak"
window.prosesMintaProdukTeman = function(reqInfo) {
    // reqInfo: { sumber: 'garden'|'farm', hostUser, claimKey, namaProduk, ikon, coin, xp, onDone }
    if (!reqInfo || !reqInfo.claimKey) return;

    let maxReq = window.MY_WORLD_VISIT_CONFIG.maxProdukPer8Jam;
    let kuota = window.ambilStatusKuotaVisitSaya();

    if (kuota.usedCount >= maxReq) {
        return window.tampilkanCustomDialog("alert", "⏳ Kuota meminta produkmu sudah habis (" + kuota.usedCount + "/" + maxReq + " per 8 jam).\nTunggu reset periode 8 jam berikutnya ya!", null, null);
    }

    if (window.apakahItemSudahDiminta(reqInfo.claimKey)) {
        return window.tampilkanCustomDialog("alert", "✓ Kamu sudah meminta hasil dari item ini pada periode 8 jam ini. Coba minta dari tanaman/ternak lain!", null, null);
    }

    // Jika sudah lulus Tantangan 20 Soal di periode 8 jam ini -> langsung terima produk!
    if (kuota.quizPassed) {
        window.eksekusiTerimaProdukTeman(reqInfo);
        return;
    }

    // Jika belum lulus -> wajib selesaikan 20 soal Biologi (min. 10 benar, gagal = -100 Coin)
    window.mulaiTantangan20SoalVisit(reqInfo);
};

window.eksekusiTerimaProdukTeman = function(reqInfo) {
    let rawU = sessionStorage.getItem("username") || "";
    let cleanKey = (typeof window.normalisasiKeySiswaPet === "function") ? window.normalisasiKeySiswaPet(rawU) : rawU.trim().toLowerCase();
    let lbSaya = (typeof window.pastikanStrukturDualXPDanPet === "function") ? window.pastikanStrukturDualXPDanPet(cleanKey) : null;
    if (!lbSaya) return;

    let kuota = window.ambilStatusKuotaVisitSaya();
    let maxReq = window.MY_WORLD_VISIT_CONFIG.maxProdukPer8Jam;
    if (kuota.usedCount >= maxReq) return;
    if (kuota.claimedTargets.indexOf(reqInfo.claimKey) !== -1) return;

    kuota.usedCount++;
    kuota.claimedTargets.push(reqInfo.claimKey);
    lbSaya.visitQuota8h = kuota;

    let gainCoin = Number(reqInfo.coin) || 0;
    let gainXp = Number(reqInfo.xp) || 0;
    lbSaya.coin = (Number(lbSaya.coin !== undefined ? lbSaya.coin : lbSaya.xpTersedia) || 0) + gainCoin;
    lbSaya.xpTersedia = lbSaya.coin;
    lbSaya.xpTotal = (Number(lbSaya.xpTotal !== undefined ? lbSaya.xpTotal : lbSaya.xp) || 0) + gainXp;
    lbSaya.xp = lbSaya.xpTotal;

    window.simpanKuotaVisitSaya(lbSaya);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiSaldoHUDGarden === "function") window.perbaruiSaldoHUDGarden();
    if (typeof window.perbaruiSaldoHUDFarm === "function") window.perbaruiSaldoHUDFarm();
    if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();

    let sisa = maxReq - kuota.usedCount;
    let pesan = "🎁 Berhasil meminta <b>" + (reqInfo.ikon || "🎁") + " " + reqInfo.namaProduk + "</b>! +🪙 " + gainCoin.toLocaleString("id-ID") + " Coin & +⭐ " + gainXp + " XP (Sisa kuota 8 jam: " + sisa + "/" + maxReq + ")";

    if (reqInfo.sumber === "garden" && typeof window.renderMyGardenUI === "function") {
        window.renderMyGardenUI();
        if (typeof window.tampilkanToastGarden === "function") window.tampilkanToastGarden(pesan);
    } else if (reqInfo.sumber === "farm" && typeof window.renderMyFarmUI === "function") {
        window.renderMyFarmUI();
        if (typeof window.tampilkanToastFarm === "function") window.tampilkanToastFarm(pesan);
    }
    if (typeof reqInfo.onDone === "function") reqInfo.onDone();
};

window.mulaiTantangan20SoalVisit = function(pendingReq) {
    let soalList = window.kumpulkan20SoalKuisVisit();
    if (soalList.length === 0) {
        return window.tampilkanCustomDialog("alert", "⚠️ Bank soal biologi belum siap.", null, null);
    }

    window.pastikanUIMyWorldAda();
    window._visitQuizState = {
        soalList: soalList,
        idx: 0,
        benar: 0,
        salah: 0,
        answeredThis: false,
        pickedIdx: -1,
        finished: false,
        pendingReq: pendingReq
    };

    window.renderModalKuis20Visit();
    let qModal = document.getElementById("modal-visit-quiz-20");
    if (qModal) {
        if (typeof window.angkatKeLapisanTeratas === "function") window.angkatKeLapisanTeratas(qModal);
        else qModal.style.zIndex = "10050";
        qModal.style.display = "flex";
    }
};

window.renderModalKuis20Visit = function() {
    let host = document.getElementById("visit-quiz-card-host");
    let st = window._visitQuizState;
    if (!host || !st) return;

    let total = st.soalList.length;
    let minBenar = Math.min(window.MY_WORLD_VISIT_CONFIG.minBenarKuis, total);
    let denda = window.MY_WORLD_VISIT_CONFIG.dendaGagalCoin;

    // Tampilan Hasil Akhir Setelah 20 Soal Selesai
    if (st.finished) {
        let lulus = st.benar >= minBenar;
        let req = st.pendingReq;
        host.innerHTML =
            '<div class="vq-result-wrap">' +
                '<div style="font-size:52px; margin-bottom:6px;">' + (lulus ? '🎉🏆' : '😢💸') + '</div>' +
                '<h3 style="margin:0 0 6px 0; color:' + (lulus ? '#15803d' : '#b91c1c') + '; font-size:20px;">' +
                    (lulus ? 'LULUS TANTANGAN KUIS!' : 'GAGAL MEMENUHI TARGET!') +
                '</h3>' +
                '<div class="vq-score-box">' +
                    '<span>✅ Benar: <b style="color:#15803d;">' + st.benar + '</b></span>' +
                    '<span>❌ Salah: <b style="color:#dc2626;">' + st.salah + '</b></span>' +
                    '<span>🎯 Minimal: <b>' + minBenar + '/' + total + '</b></span>' +
                '</div>' +
                (lulus
                    ? '<div class="garden-quiz-feedback ok" style="margin:12px 0; text-align:left;">' +
                          '<b>🔓 Izin Meminta Produk Terbuka (8 Jam)!</b><br>' +
                          'Kamu bisa meminta maksimal <b>' + window.MY_WORLD_VISIT_CONFIG.maxProdukPer8Jam + ' produk</b> kebun/ternak teman pada periode 8 jam ini.<br>' +
                          '🎁 <b>' + (req.ikon || '') + ' ' + req.namaProduk + '</b> (+🪙 ' + Number(req.coin).toLocaleString("id-ID") + ' & +⭐ ' + req.xp + ' XP) langsung masuk ke akunmu!' +
                      '</div>'
                    : '<div class="garden-quiz-feedback err" style="margin:12px 0; text-align:left;">' +
                          '<b>💸 Penalti -' + denda + ' Coin Diterapkan!</b><br>' +
                          'Skor kamu belum mencapai minimal ' + minBenar + ' benar dari ' + total + ' soal. Baca kembali materi Biologi lalu coba lagi ya!' +
                      '</div>') +
                '<button type="button" class="mypet-green-cta" onclick="window.tutupModalKuis20Visit(true)">' + (lulus ? '🎉 Lanjutkan Kunjungan' : 'Tutup') + '</button>' +
            '</div>';
        return;
    }

    let soal = st.soalList[st.idx];
    let letters = ["A", "B", "C", "D"];
    let pct = Math.round(((st.idx + (st.answeredThis ? 1 : 0)) / total) * 100);

    let optsHtml = '';
    soal.opts.forEach(function(optText, oIdx) {
        let cls = "garden-quiz-opt";
        let dis = st.answeredThis ? " disabled" : "";
        if (st.answeredThis) {
            if (oIdx === soal.ans) cls += " is-correct";
            else if (oIdx === st.pickedIdx && oIdx !== soal.ans) cls += " is-wrong";
        }
        optsHtml +=
            '<button type="button" class="' + cls + '"' + dis + ' onclick="window.jawabSatuSoalKuisVisit(' + oIdx + ')">' +
                '<b>' + letters[oIdx] + '.</b> <span>' + optText + '</span>' +
            '</button>';
    });

    let infoBawah = '';
    if (st.answeredThis) {
        let isOk = (st.pickedIdx === soal.ans);
        let isLast = (st.idx >= total - 1);
        infoBawah =
            '<div class="garden-quiz-feedback ' + (isOk ? 'ok' : 'err') + '" style="margin-top:10px;">' +
                '<b>' + (isOk ? '✅ Tepat!' : '❌ Kurang Tepat! Kunci: ' + letters[soal.ans]) + '</b> — ' + (soal.info || '') +
            '</div>' +
            '<button type="button" class="mypet-green-cta sm" style="margin-top:10px;" onclick="window.lanjutSoalBerikutnyaVisit()">' +
                (isLast ? '🏁 Lihat Hasil Akhir' : 'Soal Berikutnya (' + (st.idx + 2) + '/' + total + ') ➔') +
            '</button>';
    }

    host.innerHTML =
        '<div class="garden-quiz-head">' +
            '<div>' +
                '<div style="font-size:14.5px; font-weight:900; color:#4a2e14;">🧠 Syarat Minta Hasil: Kuis Biologi (' + (st.idx + 1) + '/' + total + ')</div>' +
                '<div style="font-size:11px; color:#785a3a;">Target Min. <b>' + minBenar + ' Benar</b> • Gagal: <b style="color:#dc2626;">-' + denda + ' Coin</b></div>' +
            '</div>' +
            '<button type="button" class="garden-quiz-close" onclick="window.batalTengahJalanKuisVisit()" title="Batalkan">✕</button>' +
        '</div>' +
        '<div class="vq-progress-strip">' +
            '<div class="vq-stat-pills">' +
                '<span class="cozy-tag green">✅ Benar: ' + st.benar + '/' + minBenar + '</span>' +
                '<span class="cozy-tag amber">❌ Salah: ' + st.salah + '</span>' +
                '<span class="cozy-tag neutral">' + soal.topik + '</span>' +
            '</div>' +
            '<div class="garden-prog-track" style="margin-top:6px;"><div class="garden-prog-fill" style="width:' + pct + '%;"></div></div>' +
        '</div>' +
        '<div class="garden-quiz-question" style="margin-top:10px;">' + (st.idx + 1) + '. ' + soal.q + '</div>' +
        '<div class="garden-quiz-opts">' + optsHtml + '</div>' +
        infoBawah;
};

window.jawabSatuSoalKuisVisit = function(oIdx) {
    let st = window._visitQuizState;
    if (!st || st.answeredThis || st.finished) return;
    st.answeredThis = true;
    st.pickedIdx = oIdx;
    if (oIdx === st.soalList[st.idx].ans) st.benar++;
    else st.salah++;
    window.renderModalKuis20Visit();
};

window.lanjutSoalBerikutnyaVisit = function() {
    let st = window._visitQuizState;
    if (!st || !st.answeredThis) return;

    if (st.idx < st.soalList.length - 1) {
        st.idx++;
        st.answeredThis = false;
        st.pickedIdx = -1;
        window.renderModalKuis20Visit();
        return;
    }

    // Selesai 20 soal -> Evaluasi Lulus / Gagal
    st.finished = true;
    let minBenar = Math.min(window.MY_WORLD_VISIT_CONFIG.minBenarKuis, st.soalList.length);
    let rawU = sessionStorage.getItem("username") || "";
    let cleanKey = (typeof window.normalisasiKeySiswaPet === "function") ? window.normalisasiKeySiswaPet(rawU) : rawU.trim().toLowerCase();
    let lbSaya = (typeof window.pastikanStrukturDualXPDanPet === "function") ? window.pastikanStrukturDualXPDanPet(cleanKey) : null;

    if (st.benar >= minBenar) {
        if (lbSaya) {
            let kuota = window.ambilStatusKuotaVisitSaya();
            kuota.quizPassed = true;
            lbSaya.visitQuota8h = kuota;
            window.simpanKuotaVisitSaya(lbSaya);
        }
        if (st.pendingReq) {
            window.eksekusiTerimaProdukTeman(st.pendingReq);
        }
    } else {
        // Gagal memenuhi minimal 10 benar -> Penalti -100 Coin
        if (lbSaya) {
            let denda = window.MY_WORLD_VISIT_CONFIG.dendaGagalCoin;
            let curCoin = Number(lbSaya.coin !== undefined ? lbSaya.coin : lbSaya.xpTersedia) || 0;
            lbSaya.coin = Math.max(0, curCoin - denda);
            lbSaya.xpTersedia = lbSaya.coin;
            lbSaya.xp = lbSaya.xpTotal;
            window.simpanKuotaVisitSaya(lbSaya);
            if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
            if (typeof window.perbaruiSaldoHUDGarden === "function") window.perbaruiSaldoHUDGarden();
            if (typeof window.perbaruiSaldoHUDFarm === "function") window.perbaruiSaldoHUDFarm();
            if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
            if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
        }
    }

    window.renderModalKuis20Visit();
};

window.batalTengahJalanKuisVisit = function() {
    let st = window._visitQuizState;
    if (!st || st.finished || (st.idx === 0 && !st.answeredThis)) {
        window.tutupModalKuis20Visit(true);
        return;
    }
    let denda = window.MY_WORLD_VISIT_CONFIG.dendaGagalCoin;
    window.tampilkanCustomDialog(
        "confirm",
        "Keluar di tengah kuis akan dianggap gagal dan dikenakan penalti -" + denda + " Coin. Yakin menyerah?",
        null,
        function(isYes) {
            if (!isYes) return;
            let rawU = sessionStorage.getItem("username") || "";
            let cleanKey = (typeof window.normalisasiKeySiswaPet === "function") ? window.normalisasiKeySiswaPet(rawU) : rawU.trim().toLowerCase();
            let lbSaya = (typeof window.pastikanStrukturDualXPDanPet === "function") ? window.pastikanStrukturDualXPDanPet(cleanKey) : null;
            if (lbSaya) {
                let curCoin = Number(lbSaya.coin !== undefined ? lbSaya.coin : lbSaya.xpTersedia) || 0;
                lbSaya.coin = Math.max(0, curCoin - denda);
                lbSaya.xpTersedia = lbSaya.coin;
                window.simpanKuotaVisitSaya(lbSaya);
                if (typeof window.perbaruiSaldoHUDGarden === "function") window.perbaruiSaldoHUDGarden();
                if (typeof window.perbaruiSaldoHUDFarm === "function") window.perbaruiSaldoHUDFarm();
                if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
            }
            window.tutupModalKuis20Visit(true);
        }
    );
};

window.tutupModalKuis20Visit = function(forceClose) {
    if (!forceClose) return;
    window._visitQuizState = null;
    let qModal = document.getElementById("modal-visit-quiz-20");
    if (qModal) qModal.style.display = "none";
};

// =========================================================================
// 4. BUKA / TUTUP LAHAN UTAMA (SENDIRI & MODE VISIT TEMAN)
// =========================================================================
window.perbaruiBadgeMyWorld = function() {
    let myUser = sessionStorage.getItem("username") || "";
    let lbSaya = (typeof window.pastikanStrukturDualXPDanPet === "function") ? window.pastikanStrukturDualXPDanPet(myUser) : null;

    let isVisit = Boolean(window.modeKunjunganWorld);
    let worldLb = isVisit
        ? (window.leaderboardSiswaData ? window.leaderboardSiswaData[window.modeKunjunganWorld] : null)
        : lbSaya;

    let elCoin = document.getElementById("myworld-hud-coin");
    let elXp = document.getElementById("myworld-hud-xp");
    let elNamaAv = document.getElementById("myworld-avatar-name");
    let elSignTop = document.getElementById("myworld-sign-top");
    let elSignMain = document.getElementById("myworld-sign-main");
    let btnPulang = document.getElementById("btn-myworld-pulang");
    let quotaPill = document.getElementById("myworld-visit-quota-pill");
    let dotGlobal = document.getElementById("myworld-alert-dot");
    let bPet = document.getElementById("world-badge-pet");
    let bGarden = document.getElementById("world-badge-garden");
    let bFarm = document.getElementById("world-badge-farm");

    let coinVal = lbSaya ? Number(lbSaya.coin !== undefined ? lbSaya.coin : lbSaya.xpTersedia || 0) : 0;
    let xpVal = lbSaya ? Number(lbSaya.xpTotal !== undefined ? lbSaya.xpTotal : lbSaya.xp || 0) : 0;
    if (elCoin) elCoin.innerText = coinVal.toLocaleString("id-ID");
    if (elXp) elXp.innerText = xpVal.toLocaleString("id-ID");

    if (elNamaAv) {
        let namaSaya = (lbSaya && (lbSaya.namaPanggilan || lbSaya.namaLengkap)) ? String(lbSaya.namaPanggilan || lbSaya.namaLengkap).split(" ")[0] : (myUser || "Siswa");
        elNamaAv.innerText = namaSaya;
    }

    if (isVisit) {
        let namaHost = (worldLb && (worldLb.namaPanggilan || worldLb.namaLengkap)) ? String(worldLb.namaPanggilan || worldLb.namaLengkap) : window.modeKunjunganWorld;
        if (elSignTop) elSignTop.innerText = "Berkunjung ke";
        if (elSignMain) elSignMain.innerText = namaHost.slice(0, 16);
        if (btnPulang) btnPulang.style.display = "inline-flex";
        if (quotaPill) {
            let q = window.ambilStatusKuotaVisitSaya();
            let maxR = window.MY_WORLD_VISIT_CONFIG.maxProdukPer8Jam;
            quotaPill.style.display = "inline-flex";
            quotaPill.innerHTML = (q.quizPassed ? "🔓" : "🔒") + " Minta: <b>" + q.usedCount + "/" + maxR + "</b> (8j)";
        }
    } else {
        if (elSignTop) elSignTop.innerText = "Lahan Utama";
        if (elSignMain) elSignMain.innerText = "My World";
        if (btnPulang) btnPulang.style.display = "none";
        if (quotaPill) quotaPill.style.display = "none";
    }

    let petAlert = false, gardenAlert = false, farmAlert = false;

    if (worldLb && worldLb.myPetData && worldLb.myPetData.ownedPets) {
        petAlert = Object.values(worldLb.myPetData.ownedPets).some(function(p) {
            return p && Number(p.hunger) < 30;
        });
    }
    if (worldLb && worldLb.myGardenData && worldLb.myGardenData.plots && typeof window.hitungStatusPetakKebun === "function") {
        gardenAlert = Object.values(worldLb.myGardenData.plots).some(function(pl) {
            let st = window.hitungStatusPetakKebun(pl);
            return isVisit ? (st.status === "ready") : (st.status === "ready" || st.status === "wilted");
        });
    }
    if (worldLb && worldLb.myFarmData && typeof window.hitungStatusHewanFarm === "function") {
        let anMap = worldLb.myFarmData.animals || worldLb.myFarmData.slots || {};
        farmAlert = Object.values(anMap).some(function(an) {
            let st = window.hitungStatusHewanFarm(an);
            return st && (isVisit ? st.prodReady : (st.prodReady || st.isSick || st.hasWaste));
        });
    }

    if (bPet) bPet.style.display = petAlert ? "flex" : "none";
    if (bGarden) bGarden.style.display = gardenAlert ? "flex" : "none";
    if (bFarm) bFarm.style.display = farmAlert ? "flex" : "none";

    // Badge tombol melayang selalu memantau milik sendiri
    if (dotGlobal && !isVisit) {
        dotGlobal.style.display = (petAlert || gardenAlert || farmAlert) ? "flex" : "none";
    }
};

window.bukaModalMyWorld = function(resetToCenter, keepVisitMode) {
    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        alert("🔒 Silakan login menggunakan akun Siswa terlebih dahulu untuk masuk ke My World!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    if (!keepVisitMode) {
        window.modeKunjunganWorld = null;
        window.modeKunjunganPet = null;
        window.modeKunjunganGarden = null;
        window.modeKunjunganFarm = null;
    }

    window.pastikanUIMyWorldAda();
    let uName = sessionStorage.getItem("username");
    if (typeof window.pastikanStrukturDualXPDanPet === "function") window.pastikanStrukturDualXPDanPet(uName);
    if (typeof window.pastikanStrukturMyGarden === "function") window.pastikanStrukturMyGarden(uName);
    if (typeof window.pastikanStrukturMyFarm === "function") window.pastikanStrukturMyFarm(uName);

    let ws = window.myWorldState;
    if (resetToCenter) {
        ws.x = 50;
        ws.y = 52;
    }
    ws.targetX = null;
    ws.targetY = null;
    ws.autoEnterZone = "";
    ws.keys = { up: false, down: false, left: false, right: false };
    ws.isOpen = true;
    ws.openedFromHub = false;
    document.body.classList.remove("from-myworld-hub");

    window.perbaruiBadgeMyWorld();
    window.renderPosisiAvatarMyWorld(false);

    if (typeof window.bukaModal === "function") window.bukaModal("modal-my-world");
    else {
        let m = document.getElementById("modal-my-world");
        if (m) m.style.display = "flex";
    }

    window.aktifkanLandscapeFullscreenMyWorld();
    window.mulaiLoopGerakMyWorld();
};

// Pintu Masuk Mode Visit World dari Leaderboard
window.kunjungiWorldSiswaLain = function(targetUsername) {
    let myUser = (sessionStorage.getItem("username") || "").trim().toLowerCase();
    if (!targetUsername || targetUsername.toLowerCase() === myUser) {
        window.bukaModalMyWorld(true, false);
        return;
    }
    if (!window.leaderboardSiswaData || !window.leaderboardSiswaData[targetUsername]) {
        return alert("⚠️ Data world teman belum ditemukan. Segarkan Leaderboard lalu coba lagi.");
    }

    window.modeKunjunganWorld = targetUsername;
    window.bukaModalMyWorld(true, true);
};

window.akhiriKunjunganWorld = function() {
    window.modeKunjunganWorld = null;
    window.modeKunjunganPet = null;
    window.modeKunjunganGarden = null;
    window.modeKunjunganFarm = null;
    window.tutupModalMyWorld(true);
};

window.tutupModalMyWorld = function(fullExit) {
    let ws = window.myWorldState;
    ws.isOpen = false;
    ws.keys = { up: false, down: false, left: false, right: false };
    ws.targetX = null;
    ws.targetY = null;
    ws.autoEnterZone = "";
    if (fullExit) {
        ws.openedFromHub = false;
        window.modeKunjunganWorld = null;
        window.modeKunjunganPet = null;
        window.modeKunjunganGarden = null;
        window.modeKunjunganFarm = null;
        document.body.classList.remove("from-myworld-hub");
        window.nonaktifkanLandscapeFullscreenMyWorld();
    }
    if (ws.rafId) {
        cancelAnimationFrame(ws.rafId);
        ws.rafId = null;
    }
    if (typeof window.tutupModal === "function") window.tutupModal("modal-my-world");
    else {
        let m = document.getElementById("modal-my-world");
        if (m) m.style.display = "none";
    }
};

// =========================================================================
// 5. MESIN GERAK AVATAR (60FPS, KLIK PETA, WASD/PANAH, & AUTO-MASUK ZONA)
// =========================================================================
window.klikPetaMyWorld = function(e) {
    let stage = document.getElementById("myworld-stage");
    let modal = document.getElementById("modal-my-world");
    if (!stage) return;
    let rect = stage.getBoundingClientRect();
    let isCssRotated = Boolean(
        document.body.classList.contains("world-force-rotated") ||
        (modal && modal.classList.contains("myworld-css-rotated"))
    );

    let rawPx = isCssRotated
        ? ((e.clientY - rect.top) / Math.max(1, rect.height)) * 100
        : ((e.clientX - rect.left) / Math.max(1, rect.width)) * 100;
    let rawPy = isCssRotated
        ? ((rect.right - e.clientX) / Math.max(1, rect.width)) * 100
        : ((e.clientY - rect.top) / Math.max(1, rect.height)) * 100;

    let px = Math.max(7, Math.min(93, rawPx));
    let py = Math.max(18, Math.min(90, rawPy));

    let ws = window.myWorldState;
    ws.targetX = px;
    ws.targetY = py;
    ws.autoEnterZone = "";

    let rip = document.getElementById("myworld-click-ripple");
    if (rip) {
        rip.style.left = px + "%";
        rip.style.top = py + "%";
        rip.style.display = "block";
        rip.classList.remove("pop");
        void rip.offsetWidth;
        rip.classList.add("pop");
    }
};

window.arahkanAvatarKeZona = function(zoneId) {
    let z = window.MY_WORLD_ZONES.find(function(item) { return item.id === zoneId; });
    if (!z) return;
    let ws = window.myWorldState;
    ws.targetX = z.doorX;
    ws.targetY = z.doorY;
    ws.autoEnterZone = zoneId;
    ws.exitCooldownUntil = 0;
};

window.setDpadMyWorld = function(dir, isDown) {
    let ws = window.myWorldState;
    ws.keys[dir] = Boolean(isDown);
    if (isDown) {
        ws.targetX = null;
        ws.targetY = null;
        ws.autoEnterZone = "";
    }
};

window.masukKeZonaMyWorld = function(zoneId) {
    let z = window.MY_WORLD_ZONES.find(function(item) { return item.id === zoneId; });
    if (!z) return;

    let ws = window.myWorldState;
    let targetVisitUser = window.modeKunjunganWorld;

    if (zoneId === "shop" || zoneId === "river") {
        ws.x = z.exitX;
        ws.y = z.exitY;
        ws.targetX = null;
        ws.targetY = null;
        ws.autoEnterZone = "";
        ws.keys = { up: false, down: false, left: false, right: false };
        ws.exitCooldownUntil = Date.now() + 1800;
        window.renderPosisiAvatarMyWorld(false);
        if (targetVisitUser) {
            window.tampilkanCustomDialog("alert", "Fitur Toko Lahan dan Memancing hanya tersedia di lahan My World milik Anda sendiri.", null, function() {
                window.pulihkanGerakSetelahOverlayWorld();
            });
            return;
        }
        if (zoneId === "shop") window.bukaWorldShop();
        else window.bukaMiniGameMancing();
        return;
    }

    ws.openedFromHub = true;
    ws.x = z.exitX;
    ws.y = z.exitY;
    ws.targetX = null;
    ws.targetY = null;
    ws.autoEnterZone = "";
    ws.nearZoneId = "";

    window.tutupModalMyWorld(false);
    document.body.classList.add("from-myworld-hub");

    if (targetVisitUser) {
        if (zoneId === "pet" && typeof window._origKunjungiPetOnly === "function") {
            window._origKunjungiPetOnly(targetVisitUser);
        } else if (zoneId === "garden" && typeof window.bukaModalMyGardenKunjungan === "function") {
            window.bukaModalMyGardenKunjungan(targetVisitUser);
        } else if (zoneId === "farm" && typeof window.bukaModalMyFarmKunjungan === "function") {
            window.bukaModalMyFarmKunjungan(targetVisitUser);
        } else if (zoneId === "lab" && typeof window.bukaModalMyLabKunjungan === "function") {
            window.bukaModalMyLabKunjungan(targetVisitUser);
        }
        return;
    }

    if (zoneId === "pet" && typeof window.bukaModalMyPet === "function") {
        window.bukaModalMyPet();
    } else if (zoneId === "garden" && typeof window.bukaModalMyGarden === "function") {
        window.bukaModalMyGarden();
    } else if (zoneId === "farm" && typeof window.bukaModalMyFarm === "function") {
        window.bukaModalMyFarm();
    } else if (zoneId === "lab" && typeof window.bukaModalMyLab === "function") {
        window.bukaModalMyLab();
    }
};

window.masukZonaTerdekatMyWorld = function() {
    if (window.myWorldState.nearZoneId) {
        window.masukKeZonaMyWorld(window.myWorldState.nearZoneId);
    }
};

window.kembaliKeLahanUtamaDariZona = function() {
    let ws = window.myWorldState;
    if (!ws.openedFromHub) return;
    ws.exitCooldownUntil = Date.now() + 1400;
    window.bukaModalMyWorld(false, Boolean(window.modeKunjunganWorld));
};

window.renderPosisiAvatarMyWorld = function(isWalking) {
    let ws = window.myWorldState;
    let av = document.getElementById("myworld-avatar");
    let flip = document.getElementById("myworld-avatar-flip");
    if (av) {
        av.style.left = ws.x.toFixed(2) + "%";
        av.style.top = ws.y.toFixed(2) + "%";
        av.classList.toggle("is-walking", Boolean(isWalking));
    }
    if (flip) {
        flip.classList.toggle("facing-left", !ws.facingRight);
    }
};

// Batas area padat bangunan, pagar kebun, sungai, & pohon (dalam % peta 1000x560)
window.MY_WORLD_OBSTACLES = [
    { id: "rumah_pet",    x1: 11.8, x2: 34.2, y1: 0.0,  y2: 41.2 },
    { id: "lumbung_farm", x1: 65.6, x2: 88.2, y1: 0.0,  y2: 41.2 },
    { id: "lahan_kebun",  x1: 32.8, x2: 67.2, y1: 68.2, y2: 96.0 },
    { id: "sungai_1",     x1: 0.0,  x2: 23.0, y1: 79.0, y2: 100.0 },
    { id: "sungai_2",     x1: 0.0,  x2: 29.5, y1: 87.5, y2: 100.0 },
    { id: "gedung_lab",   x1: 40.0, x2: 60.0, y1: 0.0,  y2: 32.5 },
    { id: "kios_shop",    x1: 77.5, x2: 88.5, y1: 55.5, y2: 71.0 }
];

window.apakahPosisiMenabrakBangunan = function(x, y) {
    let list = window.MY_WORLD_OBSTACLES || [];
    for (let i = 0; i < list.length; i++) {
        let ob = list[i];
        if (x > ob.x1 && x < ob.x2 && y > ob.y1 && y < ob.y2) {
            return true;
        }
    }
    return false;
};

// Geser avatar per sumbu (X lalu Y) agar mulus menyusuri dinding/pagar dan tidak pernah menembus bangunan
window.gerakkanAvatarDenganTabrakan = function(ws, dx, dy) {
    let oldX = ws.x;
    let oldY = ws.y;

    let tryX = Math.max(7, Math.min(93, oldX + dx));
    if (!window.apakahPosisiMenabrakBangunan(tryX, oldY)) {
        ws.x = tryX;
    }

    let tryY = Math.max(15, Math.min(91, oldY + dy));
    if (!window.apakahPosisiMenabrakBangunan(ws.x, tryY)) {
        ws.y = tryY;
    }

    return Math.hypot(ws.x - oldX, ws.y - oldY);
};

window.mulaiLoopGerakMyWorld = function() {
    let ws = window.myWorldState;
    if (ws.rafId) cancelAnimationFrame(ws.rafId);
    ws.lastFrameMs = performance.now();
    let stuckTimer = 0;

    function tick(nowMs) {
        if (!ws.isOpen) return;
        let dt = Math.min(0.05, Math.max(0.004, (nowMs - ws.lastFrameMs) / 1000));
        ws.lastFrameMs = nowMs;

        if (typeof window.apakahOverlayDalamWorldTerbuka === "function" && window.apakahOverlayDalamWorldTerbuka()) {
            ws.keys = { up: false, down: false, left: false, right: false };
            ws.targetX = null;
            ws.targetY = null;
            ws.autoEnterZone = "";
            window.renderPosisiAvatarMyWorld(false);
            ws.rafId = requestAnimationFrame(tick);
            return;
        }

        let speed = 28;
        let vx = 0, vy = 0;

        if (ws.keys.left) vx -= 1;
        if (ws.keys.right) vx += 1;
        if (ws.keys.up) vy -= 1;
        if (ws.keys.down) vy += 1;

        let moving = false;

        if (vx !== 0 || vy !== 0) {
            stuckTimer = 0;
            let len = Math.hypot(vx, vy);
            let movedDist = window.gerakkanAvatarDenganTabrakan(ws, (vx / len) * speed * dt, (vy / len) * speed * dt);
            if (vx !== 0) ws.facingRight = vx > 0;
            moving = movedDist > 0.01;
        } else if (ws.targetX !== null && ws.targetY !== null) {
            let dx = ws.targetX - ws.x;
            let dy = ws.targetY - ws.y;
            let dist = Math.hypot(dx, dy);
            let step = speed * dt;

            if (dist <= step + 0.8) {
                window.gerakkanAvatarDenganTabrakan(ws, dx, dy);
                ws.targetX = null;
                ws.targetY = null;
                stuckTimer = 0;
                if (ws.autoEnterZone) {
                    let targetZ = ws.autoEnterZone;
                    ws.autoEnterZone = "";
                    window.masukKeZonaMyWorld(targetZ);
                    if (ws.isOpen) ws.rafId = requestAnimationFrame(tick);
                    return;
                }
            } else {
                let stepX = (dx / dist) * step;
                let stepY = (dy / dist) * step;
                let movedDist = window.gerakkanAvatarDenganTabrakan(ws, stepX, stepY);
                if (Math.abs(dx) > 0.3) ws.facingRight = dx > 0;

                if (movedDist < 0.03) {
                    stuckTimer += dt;
                    // Jika klik tepat di dalam bangunan/tembok dan mentok, hentikan otomatis agar tidak jalan di tempat
                    if (stuckTimer > 0.25) {
                        ws.targetX = null;
                        ws.targetY = null;
                        ws.autoEnterZone = "";
                        stuckTimer = 0;
                    }
                } else {
                    stuckTimer = 0;
                    moving = true;
                }
            }
        }

        window.renderPosisiAvatarMyWorld(moving);

        let closestZone = null;
        let closestDist = 999;
        window.MY_WORLD_ZONES.forEach(function(z) {
            let d = Math.hypot(ws.x - z.doorX, ws.y - z.doorY);
            if (d < closestDist) {
                closestDist = d;
                closestZone = z;
            }
        });

        let nowWall = Date.now();
        if (closestZone && closestDist < 6.4 && nowWall >= ws.exitCooldownUntil && moving) {
            window.masukKeZonaMyWorld(closestZone.id);
            if (ws.isOpen) ws.rafId = requestAnimationFrame(tick);
            return;
        }

        let newNear = (closestZone && closestDist < 13.5) ? closestZone.id : "";
        if (newNear !== ws.nearZoneId) {
            ws.nearZoneId = newNear;
            document.querySelectorAll(".world-zone-btn").forEach(function(b) { b.classList.remove("is-near"); });
            let hintEl = document.getElementById("myworld-enter-hint");
            let btnEnter = document.getElementById("btn-myworld-enter-now");

            if (newNear && closestZone) {
                let zBtn = document.getElementById("world-zone-" + newNear);
                if (zBtn) zBtn.classList.add("is-near");
                if (hintEl) hintEl.innerHTML = "📍 Di depan <b>" + closestZone.nama + "</b>";
                if (btnEnter) {
                    btnEnter.style.display = "inline-flex";
                    btnEnter.innerText = "🚪 Masuk " + closestZone.labelSingkat;
                }
            } else {
                let msg = window.modeKunjunganWorld
                    ? "🎁 Masuk ke <b>Kebun</b> atau <b>Kandang</b> teman untuk meminta hasil (maks. 3 produk/8 jam)!"
                    : "🚶 Arahkan avatar ke <b>Rumah (My Pet)</b>, <b>Kebun (My Garden)</b>, atau <b>Kandang (My Farm)</b>";
                if (hintEl) hintEl.innerHTML = msg;
                if (btnEnter) btnEnter.style.display = "none";
            }
        }

        ws.rafId = requestAnimationFrame(tick);
    }

    ws.rafId = requestAnimationFrame(tick);
};

document.addEventListener("keydown", function(e) {
    let ws = window.myWorldState;
    if (!ws.isOpen) return;
    let tag = (document.activeElement && document.activeElement.tagName) ? document.activeElement.tagName.toUpperCase() : "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    let k = (e.key || "").toLowerCase();
    if (k === "w" || k === "arrowup") { e.preventDefault(); ws.keys.up = true; ws.targetX = null; ws.autoEnterZone = ""; }
    else if (k === "s" || k === "arrowdown") { e.preventDefault(); ws.keys.down = true; ws.targetX = null; ws.autoEnterZone = ""; }
    else if (k === "a" || k === "arrowleft") { e.preventDefault(); ws.keys.left = true; ws.targetX = null; ws.autoEnterZone = ""; }
    else if (k === "d" || k === "arrowright") { e.preventDefault(); ws.keys.right = true; ws.targetX = null; ws.autoEnterZone = ""; }
    else if ((k === "enter" || k === " ") && ws.nearZoneId) {
        e.preventDefault();
        window.masukZonaTerdekatMyWorld();
    } else if (k === "escape") {
        window.tutupModalMyWorld(true);
    }
});

document.addEventListener("keyup", function(e) {
    let ws = window.myWorldState;
    if (!ws.isOpen) return;
    let k = (e.key || "").toLowerCase();
    if (k === "w" || k === "arrowup") ws.keys.up = false;
    else if (k === "s" || k === "arrowdown") ws.keys.down = false;
    else if (k === "a" || k === "arrowleft") ws.keys.left = false;
    else if (k === "d" || k === "arrowright") ws.keys.right = false;
});

// =========================================================================
// 6. HOOK VISIT LEADERBOARD & KEMBALI KE LAHAN UTAMA (PET, GARDEN, & FARM)
// =========================================================================
window.pasangHookKembaliKeMyWorld = function() {
    // 1. Arahkan tombol "🏡 Visit" dari Leaderboard ke My World milik teman
    if (typeof window.kunjungiHabitatSiswaLain === "function" && !window.kunjungiHabitatSiswaLain._worldRedirected) {
        window._origKunjungiPetOnly = window.kunjungiHabitatSiswaLain;
        window.kunjungiHabitatSiswaLain = function(targetUsername) {
            window.kunjungiWorldSiswaLain(targetUsername);
        };
        window.kunjungiHabitatSiswaLain._worldRedirected = true;
    }

    // 2. Hook tombol "Pulang" di My Pet saat sedang dalam Visit World -> kembali ke World Teman
    if (typeof window.akhiriKunjunganPet === "function" && !window.akhiriKunjunganPet._worldHooked) {
        let origAkhiriPet = window.akhiriKunjunganPet;
        window.akhiriKunjunganPet = function() {
            if (window.modeKunjunganWorld && window.myWorldState.openedFromHub) {
                window.tutupModalMyPet();
                return;
            }
            origAkhiriPet();
        };
        window.akhiriKunjunganPet._worldHooked = true;
    }

    // 3. Hook tutup modal Pet, Garden, & Farm -> kembali ke Lahan Utama (Sendiri maupun Teman)
    if (typeof window.tutupModalMyPet === "function" && !window.tutupModalMyPet._worldHooked) {
        let origClosePet = window.tutupModalMyPet;
        window.tutupModalMyPet = function() {
            origClosePet();
            if (window.myWorldState.openedFromHub) {
                window.kembaliKeLahanUtamaDariZona();
            } else {
                window.perbaruiBadgeMyWorld();
            }
        };
        window.tutupModalMyPet._worldHooked = true;
    }

    if (typeof window.tutupModalMyGarden === "function" && !window.tutupModalMyGarden._worldHooked) {
        let origCloseGarden = window.tutupModalMyGarden;
        window.tutupModalMyGarden = function() {
            origCloseGarden();
            if (window.myWorldState.openedFromHub) {
                window.kembaliKeLahanUtamaDariZona();
            } else {
                window.perbaruiBadgeMyWorld();
            }
        };
        window.tutupModalMyGarden._worldHooked = true;
    }

    if (typeof window.tutupModalMyFarm === "function" && !window.tutupModalMyFarm._worldHooked) {
        let origCloseFarm = window.tutupModalMyFarm;
        window.tutupModalMyFarm = function() {
            origCloseFarm();
            if (window.myWorldState.openedFromHub) {
                window.kembaliKeLahanUtamaDariZona();
            } else {
                window.perbaruiBadgeMyWorld();
            }
        };
        window.tutupModalMyFarm._worldHooked = true;
    }

    if (typeof window.tutupModalMyLab === "function" && !window.tutupModalMyLab._worldHooked) {
        let origCloseLab = window.tutupModalMyLab;
        window.tutupModalMyLab = function() {
            origCloseLab();
            if (window.myWorldState.openedFromHub) {
                window.kembaliKeLahanUtamaDariZona();
            } else {
                window.perbaruiBadgeMyWorld();
            }
        };
        window.tutupModalMyLab._worldHooked = true;
    }
};

document.addEventListener("DOMContentLoaded", function() {
    window.pastikanUIMyWorldAda();
    window.pasangHookKembaliKeMyWorld();
    setTimeout(window.perbaruiBadgeMyWorld, 2000);
});
// =========================================================================
// 7. MESIN LANDSCAPE GLOBAL (ANDROID FULLSCREEN + IPHONE AUTO-ROTATE 90°
//    BERBASIS VISUALVIEWPORT UNTUK WORLD, PET, GARDEN, FARM, & KUIS)
// =========================================================================
window.apakahPerangkatHPMyWorld = function() {
    let vv = window.visualViewport;
    let curW = vv ? vv.width : window.innerWidth;
    let curH = vv ? vv.height : window.innerHeight;
    let minSide = Math.min(curW, curH);
    let maxSide = Math.max(curW, curH);
    let isTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
    return (minSide <= 540) || (isTouch && maxSide <= 960 && minSide <= 600);
};

window.apakahSesiWorldAktif = function() {
    return Boolean(
        (window.myWorldState && (window.myWorldState.isOpen || window.myWorldState.openedFromHub)) ||
        window.modeKunjunganWorld
    );
};

window.sinkronkanUkuranViewportWorld = function() {
    let vv = window.visualViewport;
    let vw = Math.round(vv ? vv.width : window.innerWidth);
    let vh = Math.round(vv ? vv.height : window.innerHeight);
    document.documentElement.style.setProperty("--mw-vp-w", vw + "px");
    document.documentElement.style.setProperty("--mw-vp-h", vh + "px");
    return { vw: vw, vh: vh };
};

window.sesuaikanRasioPetaMyWorld = function() {
    let wrap = document.querySelector("#modal-my-world .myworld-map-wrap");
    let stage = document.getElementById("myworld-stage");
    if (!wrap || !stage) return;

    let w = wrap.clientWidth;
    let h = wrap.clientHeight;
    if (w <= 0 || h <= 0) return;

    let rasio = 1000 / 560;
    if ((w / h) > rasio) {
        stage.style.height = h + "px";
        stage.style.width = Math.round(h * rasio) + "px";
    } else {
        stage.style.width = w + "px";
        stage.style.height = Math.round(w / rasio) + "px";
    }
};

window.perbaruiOrientasiTampilanMyWorld = function() {
    if (!window.apakahSesiWorldAktif()) return;

    let vp = window.sinkronkanUkuranViewportWorld();
    let isMobile = window.apakahPerangkatHPMyWorld();
    let isPortrait = vp.vh > vp.vw;
    let modalWorld = document.getElementById("modal-my-world");

    if (isMobile && isPortrait) {
        // Putar 90° secara global (World, Pet, Garden, Farm, Kuis, & Dialog) saat HP masih posisi potret (termasuk iPhone)
        document.body.classList.add("world-force-rotated");
        document.body.classList.remove("world-mobile-landscape");
        if (modalWorld) {
            modalWorld.classList.add("myworld-css-rotated");
            modalWorld.classList.remove("myworld-mobile-landscape");
        }
    } else if (isMobile) {
        // HP sudah dalam orientasi landscape asli (Android Lock atau iPhone diputar fisik)
        document.body.classList.remove("world-force-rotated");
        document.body.classList.add("world-mobile-landscape");
        if (modalWorld) {
            modalWorld.classList.remove("myworld-css-rotated");
            modalWorld.classList.add("myworld-mobile-landscape");
        }
    } else {
        document.body.classList.remove("world-force-rotated", "world-mobile-landscape");
        if (modalWorld) {
            modalWorld.classList.remove("myworld-css-rotated", "myworld-mobile-landscape");
        }
    }

    if (window.myWorldState && window.myWorldState.isOpen) {
        setTimeout(window.sesuaikanRasioPetaMyWorld, 40);
        setTimeout(window.sesuaikanRasioPetaMyWorld, 240);
    }
};

window.aktifkanLandscapeFullscreenMyWorld = function() {
    window.perbaruiOrientasiTampilanMyWorld();
    if (!window.apakahPerangkatHPMyWorld()) return;

    let docEl = document.documentElement;
    let reqFs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;

    let kunciOrientasi = function() {
        if (screen.orientation && typeof screen.orientation.lock === "function") {
            screen.orientation.lock("landscape").then(function() {
                window.perbaruiOrientasiTampilanMyWorld();
            }).catch(function() {
                window.perbaruiOrientasiTampilanMyWorld();
            });
        } else {
            window.perbaruiOrientasiTampilanMyWorld();
        }
    };

    if (reqFs && !document.fullscreenElement && !document.webkitFullscreenElement) {
        try {
            let p = reqFs.call(docEl);
            if (p && typeof p.then === "function") {
                p.then(kunciOrientasi).catch(kunciOrientasi);
            } else {
                setTimeout(kunciOrientasi, 120);
            }
        } catch (err) {
            kunciOrientasi();
        }
    } else {
        kunciOrientasi();
    }
};

window.nonaktifkanLandscapeFullscreenMyWorld = function() {
    document.body.classList.remove("world-force-rotated", "world-mobile-landscape");
    let modalWorld = document.getElementById("modal-my-world");
    if (modalWorld) {
        modalWorld.classList.remove("myworld-css-rotated", "myworld-mobile-landscape");
    }

    try {
        if (screen.orientation && typeof screen.orientation.unlock === "function") {
            screen.orientation.unlock();
        }
    } catch (e) {}

    try {
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(function() {});
        } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    } catch (e) {}
};

window.addEventListener("resize", function() {
    if (window.apakahSesiWorldAktif()) {
        window.perbaruiOrientasiTampilanMyWorld();
    }
});

window.addEventListener("orientationchange", function() {
    if (window.apakahSesiWorldAktif()) {
        setTimeout(window.perbaruiOrientasiTampilanMyWorld, 160);
    }
});

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function() {
        if (window.apakahSesiWorldAktif()) {
            window.perbaruiOrientasiTampilanMyWorld();
        }
    });
}

document.addEventListener("fullscreenchange", function() {
    if (window.apakahSesiWorldAktif()) {
        setTimeout(window.perbaruiOrientasiTampilanMyWorld, 120);
    }
});
// =========================================================================
// 8. SCROLL TOUCH HALUS UNTUK MODE PUTAR 90° (IPHONE) + ANTI MENU TEKAN LAMA
// =========================================================================
window._MYWORLD_GAME_MODAL_SELECTOR = "#modal-my-world, #modal-my-pet, #modal-my-garden, #modal-my-farm, #modal-my-lab, #modal-visit-quiz-20, #btn-floating-myworld";

// Matikan menu klik kanan / tekan lama ("Salin, Cari Tahu, Terjemahkan") di seluruh area game
document.addEventListener("contextmenu", function(e) {
    if (!e.target || !e.target.closest) return;
    let tag = e.target.tagName ? e.target.tagName.toUpperCase() : "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.target.closest(window._MYWORLD_GAME_MODAL_SELECTOR)) {
        e.preventDefault();
    }
}, true);

document.addEventListener("selectstart", function(e) {
    if (!e.target || !e.target.closest) return;
    let tag = e.target.tagName ? e.target.tagName.toUpperCase() : "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.target.closest(window._MYWORLD_GAME_MODAL_SELECTOR)) {
        e.preventDefault();
    }
}, true);

// Mesin Scroll Touch Khusus Mode Putar 90° (Memetakan sumbu X/Y fisik ke scrollTop/scrollLeft visual)
(function pasangMesinScrollRotasi90() {
    let scState = {
        active: false,
        vTarget: null,
        hTarget: null,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        velV: 0,
        velH: 0,
        moved: false,
        momentumRaf: null
    };

    function cariTargetScroll(startEl, arah) {
        let el = startEl;
        while (el && el !== document.body && el !== document.documentElement) {
            let st = window.getComputedStyle(el);
            if (arah === "v") {
                let oy = st.overflowY;
                if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 2) {
                    return el;
                }
            } else {
                let ox = st.overflowX;
                if ((ox === "auto" || ox === "scroll") && el.scrollWidth > el.clientWidth + 2) {
                    return el;
                }
            }
            el = el.parentElement;
        }
        return null;
    }

    function stopMomentum() {
        if (scState.momentumRaf) {
            cancelAnimationFrame(scState.momentumRaf);
            scState.momentumRaf = null;
        }
    }

    document.addEventListener("touchstart", function(e) {
        stopMomentum();
        if (!document.body.classList.contains("world-force-rotated")) return;
        if (!e.touches || e.touches.length !== 1) return;

        let t = e.target;
        if (!t || !t.closest) return;
        if (!t.closest("#modal-my-pet, #modal-my-garden, #modal-my-farm, #modal-my-lab, #modal-visit-quiz-20, #modal-custom-dialog, #myworld-shop-overlay, #myworld-fishing-overlay")) return;
        // Jangan ganggu slider, input ketikan, drag hewan di Habitat Pet, atau pengadukan sumur di My Lab
        let tag = t.tagName ? t.tagName.toUpperCase() : "";
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        if (t.closest(".is-draggable-pet, .mypet-decor-drag-btn, .lab-glass-slide.is-stir-mode, .gen-dnd-chip, .lab-dnd-item")) return;

        let vEl = cariTargetScroll(t, "v");
        let hEl = cariTargetScroll(t, "h");
        if (!vEl && !hEl) return;

        let pt = e.touches[0];
        scState.active = true;
        scState.vTarget = vEl;
        scState.hTarget = hEl;
        scState.startX = pt.clientX;
        scState.startY = pt.clientY;
        scState.lastX = pt.clientX;
        scState.lastY = pt.clientY;
        scState.velV = 0;
        scState.velH = 0;
        scState.moved = false;
    }, { passive: true });

    document.addEventListener("touchmove", function(e) {
        if (!scState.active || !e.touches || e.touches.length !== 1) return;
        if (!document.body.classList.contains("world-force-rotated")) {
            scState.active = false;
            return;
        }

        let pt = e.touches[0];
        let dx = pt.clientX - scState.lastX;
        let dy = pt.clientY - scState.lastY;

        if (!scState.moved) {
            if (Math.hypot(pt.clientX - scState.startX, pt.clientY - scState.startY) < 6) return;
            scState.moved = true;
        }

        e.preventDefault();

        // Pada rotasi 90° searah jarum jam:
        // - Geser jari visual ke ATAS = +X layar fisik -> menambah scrollTop
        // - Geser jari visual ke KIRI = -Y layar fisik -> menambah scrollLeft
        if (scState.vTarget) {
            scState.vTarget.scrollTop += dx;
            scState.velV = dx;
        }
        if (scState.hTarget) {
            scState.hTarget.scrollLeft -= dy;
            scState.velH = -dy;
        }

        scState.lastX = pt.clientX;
        scState.lastY = pt.clientY;
    }, { passive: false });

    document.addEventListener("touchend", function() {
        if (!scState.active) return;
        let vEl = scState.vTarget;
        let hEl = scState.hTarget;
        let vv = scState.velV;
        let vh = scState.velH;
        let wasMoved = scState.moved;

        scState.active = false;
        scState.vTarget = null;
        scState.hTarget = null;

        if (!wasMoved) return;

        // Luncuran halus (inertia) setelah jari dilepas
        function glide() {
            vv *= 0.92;
            vh *= 0.92;
            let lanjut = false;
            if (vEl && Math.abs(vv) > 0.4) {
                vEl.scrollTop += vv;
                lanjut = true;
            }
            if (hEl && Math.abs(vh) > 0.4) {
                hEl.scrollLeft += vh;
                lanjut = true;
            }
            if (lanjut) {
                scState.momentumRaf = requestAnimationFrame(glide);
            } else {
                scState.momentumRaf = null;
            }
        }
        scState.momentumRaf = requestAnimationFrame(glide);
    }, { passive: true });
})();
// =========================================================================
// 9. TOKO LAHAN (WORLD SHOP) & MINI-GAME MEMANCING 4 SPESIES IKAN DI SUNGAI
// =========================================================================
window.MY_WORLD_SHOP_ITEMS = {
    rod: {
        id: "joran_pancing",
        nama: "Joran Pancing Bambu",
        harga: 150,
        ikon: "🎣",
        deskripsi: "Peralatan memancing permanen untuk menangkap ikan di sungai My World."
    }
};

window.MY_WORLD_FISH_CATALOG = [
    {
        id: "ikan_mujair",
        nama: "Ikan Mujair",
        latin: "Oreochromis mossambicus",
        rarity: "Common",
        chance: 50,
        coin: 30,
        xp: 6,
        zoneWidth: 34,
        speed: 1.9,
        primary: "#94a3b8",
        belly: "#e2e8f0",
        fin: "#475569"
    },
    {
        id: "ikan_gurame",
        nama: "Ikan Gurame",
        latin: "Osphronemus goramy",
        rarity: "Uncommon",
        chance: 28,
        coin: 75,
        xp: 15,
        zoneWidth: 26,
        speed: 2.4,
        primary: "#65a30d",
        belly: "#d9f99d",
        fin: "#365314"
    },
    {
        id: "ikan_koi",
        nama: "Ikan Koi Kohaku",
        latin: "Cyprinus rubrofuscus",
        rarity: "Rare",
        chance: 15,
        coin: 160,
        xp: 30,
        zoneWidth: 19,
        speed: 3.0,
        primary: "#ffffff",
        belly: "#f8fafc",
        fin: "#ef4444",
        isKoi: true
    },
    {
        id: "ikan_arwana",
        nama: "Arwana Super Red",
        latin: "Scleropages formosus",
        rarity: "Legendary",
        chance: 7,
        coin: 400,
        xp: 80,
        zoneWidth: 13,
        speed: 3.7,
        primary: "#dc2626",
        belly: "#fde047",
        fin: "#f59e0b",
        isArwana: true
    }
];

window.activeWorldShopTab = "gear"; // 'gear' | 'sell'
window._fishingState = null;
window._fishingBiteTimer = null;
window._fishingGaugeTimer = null;

window.pastikanStrukturMyWorldData = function(uName) {
    let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(uName)
        : null;
    if (!lb) return null;

    if (!lb.myWorldData || typeof lb.myWorldData !== "object") {
        lb.myWorldData = {
            hasFishingRod: false,
            fishInventory: {},
            totalFishCaught: 0,
            totalFishSold: 0
        };
    } else {
        if (!lb.myWorldData.fishInventory || typeof lb.myWorldData.fishInventory !== "object") {
            lb.myWorldData.fishInventory = {};
        }
        lb.myWorldData.hasFishingRod = Boolean(lb.myWorldData.hasFishingRod);
        lb.myWorldData.totalFishCaught = Number(lb.myWorldData.totalFishCaught) || 0;
        lb.myWorldData.totalFishSold = Number(lb.myWorldData.totalFishSold) || 0;
    }
    return lb;
};

window.simpanDataWorldKeServer = function(lb) {
    if (!lb) return;
    let rawU = String(sessionStorage.getItem("username") || "").trim();
    let cleanKey = (typeof window.normalisasiKeySiswaPet === "function")
        ? window.normalisasiKeySiswaPet(rawU)
        : rawU.toLowerCase();
    let isAdmin = (typeof window.isAdminSession === "function" && window.isAdminSession()) ||
                  sessionStorage.getItem("statusLogin") === "admin" ||
                  cleanKey === "mahardika";
    if (!isAdmin && cleanKey && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(cleanKey, lb);
    }
};

window.bangunSVGIkanWorld = function(fishObj, sizePx) {
    let sz = sizePx || 64;
    let f = fishObj || window.MY_WORLD_FISH_CATALOG[0];
    let spot = f.isKoi
        ? '<ellipse cx="48" cy="36" rx="14" ry="8" fill="#ef4444"/><ellipse cx="76" cy="44" rx="10" ry="7" fill="#dc2626"/>'
        : (f.isArwana ? '<path d="M26,48 L12,56 M28,50 L14,60" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/><path d="M36,34 L88,36 M38,44 L86,44 M40,54 L84,52" stroke="#fde047" stroke-width="2" opacity="0.65"/>' : '');

    return '<svg viewBox="0 0 120 84" width="' + sz + '" height="' + Math.round(sz * 0.7) + '">' +
        '<polygon points="88,42 114,22 108,42 114,62" fill="' + f.fin + '" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M44,24 Q64,6 82,28 Z" fill="' + f.fin + '" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M52,60 Q64,76 76,58 Z" fill="' + f.fin + '" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<ellipse cx="56" cy="42" rx="38" ry="20" fill="' + f.primary + '" stroke="#0f172a" stroke-width="3"/>' +
        '<path d="M24,48 Q56,62 86,48 Q56,56 24,48 Z" fill="' + f.belly + '"/>' +
        spot +
        '<circle cx="31" cy="37" r="4.5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>' +
        '<circle cx="30" cy="37" r="2.2" fill="#0f172a"/>' +
        '<path d="M46,34 Q52,42 46,50" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>' +
    '</svg>';
};

// --- TOKO LAHAN (WORLD SHOP) ---
window.bukaWorldShop = function(tabName) {
    if (window.modeKunjunganWorld) {
        return window.tampilkanCustomDialog("alert", "Toko Lahan hanya dapat diakses saat berada di My World milik Anda sendiri.", null, null);
    }
    let uName = sessionStorage.getItem("username");
    window.pastikanStrukturMyWorldData(uName);
    window.activeWorldShopTab = tabName || "gear";
    window.renderWorldShopUI();
    let ov = document.getElementById("myworld-shop-overlay");
    if (ov) ov.style.display = "flex";
};

window.apakahOverlayDalamWorldTerbuka = function() {
    let ids = ["myworld-shop-overlay", "myworld-fishing-overlay", "modal-custom-dialog"];
    return ids.some(function(id) {
        let el = document.getElementById(id);
        return Boolean(el && el.style.display && el.style.display !== "none");
    });
};

window.pulihkanGerakSetelahOverlayWorld = function() {
    let ws = window.myWorldState;
    if (!ws) return;
    ws.keys = { up: false, down: false, left: false, right: false };
    ws.targetX = null;
    ws.targetY = null;
    ws.autoEnterZone = "";
    ws.exitCooldownUntil = Date.now() + 1400;
    window.renderPosisiAvatarMyWorld(false);
    if (ws.isOpen && !ws.rafId && typeof window.mulaiLoopGerakMyWorld === "function") {
        window.mulaiLoopGerakMyWorld();
    }
};

window.tutupWorldShop = function() {
    let ov = document.getElementById("myworld-shop-overlay");
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

window.gantiTabWorldShop = function(tabName) {
    window.activeWorldShopTab = tabName || "gear";
    window.renderWorldShopUI();
};

window.renderWorldShopUI = function() {
    let ov = document.getElementById("myworld-shop-overlay");
    if (!ov) return;
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyWorldData(uName);
    if (!lb) return;

    let wd = lb.myWorldData;
    let inv = wd.fishInventory || {};
    let totalIkanDiTas = 0;
    let totalNilaiCoin = 0;
    window.MY_WORLD_FISH_CATALOG.forEach(function(f) {
        let q = Number(inv[f.id]) || 0;
        totalIkanDiTas += q;
        totalNilaiCoin += q * f.coin;
    });

    let bodyHtml = '';
    if (window.activeWorldShopTab === "gear") {
        let rod = window.MY_WORLD_SHOP_ITEMS.rod;
        bodyHtml =
            '<div class="ws-gear-grid">' +
                '<div class="ws-item-card">' +
                    '<div class="cozy-card-top-row"><span class="cozy-tag green">Peralatan Permanen</span><span class="cozy-stock-lbl">' + (wd.hasFishingRod ? '✓ Dimiliki' : 'Belum Dimiliki') + '</span></div>' +
                    '<div style="font-size:46px; margin:8px 0;">' + rod.ikon + '</div>' +
                    '<div class="cozy-item-name">' + rod.nama + '</div>' +
                    '<div class="cozy-item-sub">' + rod.deskripsi + '</div>' +
                    (wd.hasFishingRod
                        ? '<button type="button" class="mypet-gray-cta sm" disabled>✓ Sudah Dimiliki — Berjalan ke Sungai untuk Memancing</button>'
                        : '<button type="button" class="mypet-amber-cta sm" onclick="window.beliPancingWorldShop()">🪙 Beli (' + rod.harga.toLocaleString("id-ID") + ' Coin)</button>') +
                '</div>' +
                '<div class="ws-item-card is-info-fish">' +
                    '<div class="cozy-card-top-row"><span class="cozy-tag amber">Panduan Ikan Sungai</span><span class="cozy-stock-lbl">4 Spesies</span></div>' +
                    '<div class="ws-fish-guide-list">' +
                        window.MY_WORLD_FISH_CATALOG.map(function(f) {
                            return '<div class="ws-fish-mini-row"><span class="ws-rar-dot rar-' + f.rarity.toLowerCase() + '">' + f.rarity + '</span><b>' + f.nama + '</b><span>🪙 ' + f.coin + '</span></div>';
                        }).join('') +
                    '</div>' +
                '</div>' +
            '</div>';
    } else {
        let cardsHtml = '';
        window.MY_WORLD_FISH_CATALOG.forEach(function(f) {
            let qty = Number(inv[f.id]) || 0;
            let rarSlug = f.rarity.toLowerCase();
            cardsHtml +=
                '<div class="ws-item-card rar-' + rarSlug + '">' +
                    '<div class="cozy-card-top-row"><span class="cozy-tag neutral">' + f.rarity + '</span><span class="cozy-stock-lbl">Tas: <b>x' + qty + '</b></span></div>' +
                    '<div style="margin:6px 0;">' + window.bangunSVGIkanWorld(f, 76) + '</div>' +
                    '<div class="cozy-item-name">' + f.nama + '</div>' +
                    '<div class="garden-latin-name"><i>' + f.latin + '</i></div>' +
                    '<div class="garden-shop-meta">🪙 ' + f.coin + ' Coin • ⭐ +' + f.xp + ' XP / ekor</div>' +
                    '<button type="button" class="' + (qty > 0 ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (qty > 0 ? '' : 'disabled') + ' onclick="window.jualSatuIkanWorld(\'' + f.id + '\')">' + (qty > 0 ? ('💰 Jual 1 (+🪙 ' + f.coin + ')') : 'Kosong') + '</button>' +
                '</div>';
        });

        bodyHtml =
            (totalIkanDiTas > 0
                ? '<div class="ws-sell-all-bar"><span>🐟 Total di Tas: <b>' + totalIkanDiTas + ' ekor</b> (Estimasi <b>🪙 ' + totalNilaiCoin.toLocaleString("id-ID") + ' Coin</b>)</span><button type="button" class="mypet-amber-cta sm" style="width:auto; padding:6px 14px;" onclick="window.jualSemuaIkanWorld()">💰 Jual Semua Ikan</button></div>'
                : '') +
            '<div class="ws-fish-sell-grid">' + cardsHtml + '</div>';
    }

    ov.innerHTML =
        '<div class="ws-modal-card">' +
            '<div class="ws-modal-head">' +
                '<div><strong>🏪 Toko Lahan (World Shop)</strong><small>Beli peralatan memancing dan jual hasil tangkapan ikan sungai.</small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupWorldShop()">✕</button>' +
            '</div>' +
            '<div class="ws-tabs-row">' +
                '<button type="button" class="ws-tab-btn' + (window.activeWorldShopTab === "gear" ? ' active' : '') + '" onclick="window.gantiTabWorldShop(\'gear\')">🎣 Perlengkapan</button>' +
                '<button type="button" class="ws-tab-btn' + (window.activeWorldShopTab === "sell" ? ' active' : '') + '" onclick="window.gantiTabWorldShop(\'sell\')">🐟 Jual Ikan (' + totalIkanDiTas + ')</button>' +
            '</div>' +
            '<div class="world-shop-body">' + bodyHtml + '</div>' +
        '</div>';
};

window.beliPancingWorldShop = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyWorldData(uName);
    let rod = window.MY_WORLD_SHOP_ITEMS.rod;
    if (!lb || lb.myWorldData.hasFishingRod) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < rod.harga) {
        return window.tampilkanCustomDialog("alert", "Saldo Coin belum mencukupi untuk membeli " + rod.nama + " (" + rod.harga + " Coin).", null, null);
    }

    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(rod.harga, "beli_pancing_world", true)) {
        lb.myWorldData.hasFishingRod = true;
        window.simpanDataWorldKeServer(lb);
        window.perbaruiBadgeMyWorld();
        window.renderWorldShopUI();
        window.tampilkanCustomDialog("alert", "🎣 Berhasil membeli " + rod.nama + "! Arahkan avatar ke Dermaga Sungai (pojok kiri bawah peta) untuk mulai memancing.", null, null);
    }
};

window.jualSatuIkanWorld = function(fishId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyWorldData(uName);
    let f = window.MY_WORLD_FISH_CATALOG.find(function(x) { return x.id === fishId; });
    if (!lb || !f) return;

    let stok = Number(lb.myWorldData.fishInventory[fishId]) || 0;
    if (stok <= 0) return;

    lb.myWorldData.fishInventory[fishId] = stok - 1;
    if (lb.myWorldData.fishInventory[fishId] <= 0) delete lb.myWorldData.fishInventory[fishId];
    lb.myWorldData.totalFishSold++;

    lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + f.coin;
    lb.xpTersedia = lb.coin;
    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + f.xp;
    lb.xp = lb.xpTotal;

    window.simpanDataWorldKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.perbaruiBadgeMyWorld();
    window.renderWorldShopUI();
};

window.jualSemuaIkanWorld = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyWorldData(uName);
    if (!lb) return;

    let inv = lb.myWorldData.fishInventory || {};
    let totCoin = 0, totXp = 0, totEkor = 0;

    window.MY_WORLD_FISH_CATALOG.forEach(function(f) {
        let q = Number(inv[f.id]) || 0;
        if (q > 0) {
            totCoin += q * f.coin;
            totXp += q * f.xp;
            totEkor += q;
            delete inv[f.id];
        }
    });
    if (totEkor === 0) return;

    lb.myWorldData.totalFishSold += totEkor;
    lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + totCoin;
    lb.xpTersedia = lb.coin;
    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + totXp;
    lb.xp = lb.xpTotal;

    window.simpanDataWorldKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.perbaruiBadgeMyWorld();
    window.renderWorldShopUI();
};

// --- MINI-GAME MEMANCING DI SUNGAI MY WORLD ---
window.hentikanTimerMancingWorld = function() {
    clearTimeout(window._fishingBiteTimer);
    clearInterval(window._fishingGaugeTimer);
    window._fishingBiteTimer = null;
    window._fishingGaugeTimer = null;
};

window.acakSpesiesIkanSungai = function() {
    let roll = Math.random() * 100;
    let acc = 0;
    for (let i = 0; i < window.MY_WORLD_FISH_CATALOG.length; i++) {
        acc += window.MY_WORLD_FISH_CATALOG[i].chance;
        if (roll <= acc) return window.MY_WORLD_FISH_CATALOG[i];
    }
    return window.MY_WORLD_FISH_CATALOG[0];
};

window.bukaMiniGameMancing = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyWorldData(uName);
    if (!lb) return;

    if (!lb.myWorldData.hasFishingRod) {
        window.tampilkanCustomDialog("alert", "Anda belum memiliki Joran Pancing.\nSilakan berjalan menuju Toko Lahan (🏪 Shop) di sisi kanan peta untuk membelinya terlebih dahulu.", null, function() {
            window.pulihkanGerakSetelahOverlayWorld();
        });
        return;
    }

    window.hentikanTimerMancingWorld();
    window._fishingState = {
        phase: "idle", // 'idle' | 'waiting' | 'biting' | 'caught' | 'missed'
        targetFish: null,
        needlePos: 0,
        needleDir: 1,
        zoneStart: 35,
        zoneWidth: 28,
        savedToBag: false,
        soldDirect: false
    };

    window.renderMiniGameMancingUI();
    let ov = document.getElementById("myworld-fishing-overlay");
    if (ov) ov.style.display = "flex";
};

window.tutupMiniGameMancing = function() {
    window.hentikanTimerMancingWorld();
    window._fishingState = null;
    let ov = document.getElementById("myworld-fishing-overlay");
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

window.renderMiniGameMancingUI = function() {
    let ov = document.getElementById("myworld-fishing-overlay");
    let st = window._fishingState;
    if (!ov || !st) return;

    let stageHtml = '';
    if (st.phase === "idle") {
        stageHtml =
            '<div class="fish-river-stage">' +
                '<div class="fish-bobber-idle">🎣</div>' +
                '<p class="fish-stage-msg">Dermaga Sungai My World — Lempar kail untuk memancing ikan!</p>' +
            '</div>' +
            '<button type="button" class="mypet-green-cta sm" style="max-width:220px;" onclick="window.lemparKailMancing()">🎣 Lempar Kail</button>';
    } else if (st.phase === "waiting") {
        stageHtml =
            '<div class="fish-river-stage is-waiting">' +
                '<div class="fish-bobber-float">🔴</div>' +
                '<div class="fish-ripple-ring"></div>' +
                '<p class="fish-stage-msg">Menunggu ikan menyambar umpan...</p>' +
            '</div>' +
            '<button type="button" class="mypet-gray-cta sm" style="max-width:200px; margin:0 auto;" disabled>⏳ Perhatikan Pelampung...</button>';
    } else if (st.phase === "biting" && st.targetFish) {
        let rarSlug = st.targetFish.rarity.toLowerCase();
        stageHtml =
            '<div class="fish-river-stage is-biting">' +
                '<div class="fish-bite-alert">❗ IKAN MENYAMBAR! (' + st.targetFish.rarity + ')</div>' +
                '<div class="fish-gauge-track">' +
                    '<div class="fish-gauge-zone rar-' + rarSlug + '" style="left:' + st.zoneStart + '%; width:' + st.zoneWidth + '%;">TARIK!</div>' +
                    '<div id="world-fish-needle" class="fish-gauge-needle" style="left:' + Math.round(st.needlePos) + '%;"></div>' +
                '</div>' +
            '</div>' +
            '<button type="button" class="mypet-green-cta" style="max-width:260px; margin:0 auto;" onclick="window.tarikKailMancing()">🎣 TARIK KAIL SEKARANG!</button>';
    } else if (st.phase === "caught" && st.targetFish) {
        let f = st.targetFish;
        let actionRow = !st.savedToBag
            ? '<button type="button" class="mypet-green-cta sm" style="max-width:240px;" onclick="window.aksiHasilIkan(\'keep\')">🎒 Simpan ke Tas Ikan</button>'
            : '<div class="garden-quiz-feedback ok" style="margin:4px 0; width:100%; box-sizing:border-box;">🎒 <b>' + f.nama + '</b> tersimpan di Tas Ikan. Berjalanlah ke <b>Toko Lahan (🏪 Shop)</b> untuk menjualnya.</div>' +
              '<button type="button" class="mypet-green-cta sm" style="max-width:220px; margin:4px auto 0 auto;" onclick="window.lemparKailMancing()">🎣 Pancing Lagi</button>';

        stageHtml =
            '<div class="fish-catch-card rar-' + f.rarity.toLowerCase() + '">' +
                '<span class="ws-rar-dot rar-' + f.rarity.toLowerCase() + '">' + f.rarity.toUpperCase() + '</span>' +
                '<div style="margin:6px 0;">' + window.bangunSVGIkanWorld(f, 112) + '</div>' +
                '<div style="font-size:16px; font-weight:900; color:#0f172a;">' + f.nama + '</div>' +
                '<div style="font-size:11px; color:#64748b; font-style:italic; margin-bottom:8px;">' + f.latin + ' • Nilai: 🪙 ' + f.coin + ' Coin</div>' +
                actionRow +
            '</div>';
    } else if (st.phase === "missed") {
        stageHtml =
            '<div class="fish-river-stage">' +
                '<div style="font-size:40px;">💨🐟</div>' +
                '<p class="fish-stage-msg">Ikan terlepas! Tarik kail tepat saat jarum berada di dalam zona target.</p>' +
            '</div>' +
            '<button type="button" class="mypet-amber-cta sm" style="max-width:220px; margin:0 auto;" onclick="window.lemparKailMancing()">🔄 Lempar Kail Lagi</button>';
    }

    ov.innerHTML =
        '<div class="ws-modal-card fish-modal-card">' +
            '<div class="ws-modal-head">' +
                '<div><strong>🎣 Memancing di Sungai My World</strong><small>Tangkap ikan Common, Uncommon, Rare, hingga Legendary!</small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupMiniGameMancing()">✕</button>' +
            '</div>' +
            '<div class="world-shop-body" style="display:flex; flex-direction:column; gap:10px; align-items:center;">' + stageHtml + '</div>' +
        '</div>';
};

window.lemparKailMancing = function() {
    let st = window._fishingState;
    if (!st) return;
    window.hentikanTimerMancingWorld();

    let fish = window.acakSpesiesIkanSungai();
    st.phase = "waiting";
    st.targetFish = fish;
    st.savedToBag = false;
    st.soldDirect = false;
    st.needlePos = 4;
    st.needleDir = 1;
    st.zoneWidth = fish.zoneWidth;
    st.zoneStart = Math.round(18 + Math.random() * (64 - fish.zoneWidth));

    window.renderMiniGameMancingUI();

    let waitMs = 1400 + Math.floor(Math.random() * 1900);
    window._fishingBiteTimer = setTimeout(function() {
        if (!window._fishingState || window._fishingState.phase !== "waiting") return;
        window._fishingState.phase = "biting";
        window.renderMiniGameMancingUI();

        window._fishingGaugeTimer = setInterval(function() {
            let cur = window._fishingState;
            if (!cur || cur.phase !== "biting") { window.hentikanTimerMancingWorld(); return; }
            cur.needlePos += cur.needleDir * cur.targetFish.speed;
            if (cur.needlePos >= 98) { cur.needlePos = 98; cur.needleDir = -1; }
            else if (cur.needlePos <= 2) { cur.needlePos = 2; cur.needleDir = 1; }
            let nEl = document.getElementById("world-fish-needle");
            if (nEl) nEl.style.left = Math.round(cur.needlePos) + "%";
        }, 28);
    }, waitMs);
};

window.tarikKailMancing = function() {
    let st = window._fishingState;
    if (!st || st.phase !== "biting" || !st.targetFish) return;
    window.hentikanTimerMancingWorld();

    let hit = (st.needlePos >= st.zoneStart && st.needlePos <= (st.zoneStart + st.zoneWidth));
    if (hit) {
        st.phase = "caught";
        let uName = sessionStorage.getItem("username");
        let lb = window.pastikanStrukturMyWorldData(uName);
        if (lb) {
            lb.myWorldData.totalFishCaught++;
            window.simpanDataWorldKeServer(lb);
        }
    } else {
        st.phase = "missed";
    }
    window.renderMiniGameMancingUI();
};

window.aksiHasilIkan = function(mode) {
    let st = window._fishingState;
    if (!st || st.phase !== "caught" || !st.targetFish || st.savedToBag || st.soldDirect) return;

    let f = st.targetFish;
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyWorldData(uName);
    if (!lb) return;

    if (mode === "sell") {
        st.soldDirect = true;
        lb.myWorldData.totalFishSold++;
        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + f.coin;
        lb.xpTersedia = lb.coin;
        lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + f.xp;
        lb.xp = lb.xpTotal;
    } else {
        st.savedToBag = true;
        lb.myWorldData.fishInventory[f.id] = (Number(lb.myWorldData.fishInventory[f.id]) || 0) + 1;
    }

    window.simpanDataWorldKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.perbaruiBadgeMyWorld();
    window.renderMiniGameMancingUI();
};

// Pastikan tombol Shop HUD tersembunyi saat Mode Visit & timer mancing berhenti saat tutup My World
(function pasangHookShopDanMancingWorld() {
    if (typeof window.perbaruiBadgeMyWorld === "function" && !window.perbaruiBadgeMyWorld._shopHooked) {
        let origB = window.perbaruiBadgeMyWorld;
        window.perbaruiBadgeMyWorld = function() {
            origB.apply(this, arguments);
            let btnShop = document.getElementById("btn-myworld-shop");
            if (btnShop) btnShop.style.display = window.modeKunjunganWorld ? "none" : "inline-flex";
        };
        window.perbaruiBadgeMyWorld._shopHooked = true;
    }

    if (typeof window.tutupModalMyWorld === "function" && !window.tutupModalMyWorld._fishCloseHooked) {
        let origC = window.tutupModalMyWorld;
        window.tutupModalMyWorld = function(fullExit) {
            window.tutupWorldShop();
            window.tutupMiniGameMancing();
            origC.apply(this, arguments);
        };
        window.tutupModalMyWorld._fishCloseHooked = true;
    }
})();