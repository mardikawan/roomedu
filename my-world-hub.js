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
    { id: "shop",    nama: "Toko Lahan (World Shop)",     labelSingkat: "🏪 Shop",       doorX: 74.5, doorY: 66, exitX: 69, exitY: 62 },
    { id: "river",   nama: "Dermaga Sungai (Memancing)",  labelSingkat: "🎣 Memancing",  doorX: 25,   doorY: 74, exitX: 31, exitY: 66 },
    { id: "kitchen", nama: "Dapur Gizi (My Kitchen)",     labelSingkat: "🍳 My Kitchen", doorX: 21.5, doorY: 57, exitX: 27, exitY: 57 }
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
                        '<span id="myworld-env-pill" class="world-env-pill" title="Waktu & Cuaca Lokal Real-Time">☀️ Siang • Cerah</span>' +
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

                        '<button type="button" id="world-zone-kitchen" class="world-zone-btn zone-kitchen" onclick="event.stopPropagation(); window.arahkanAvatarKeZona(\'kitchen\')" title="Arahkan avatar ke Dapur Gizi (My Kitchen)">' +
                            '<div class="world-zone-tag">🍳 Dapur • My Kitchen</div>' +
                            '<div class="world-door-glow"></div>' +
                        '</button>' +

                        '<div id="myworld-env-fx" class="myworld-env-fx"></div>' +
                        '<div id="myworld-toast-env" class="myworld-toast-env" style="display:none;"></div>' +
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
                '<div id="myworld-kitchen-overlay" class="myworld-inner-overlay" style="display:none;" onclick="if(event.target===this) window.tutupMyKitchen()"></div>' +
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
            '<circle cx="38" cy="236" r="28" fill="#2e7d32" stroke="#1b5e20" stroke-width="4"/><circle cx="38" cy="222" r="18" fill="#43a047"/>' +
            '<!-- GEDUNG BARU (BARAT TENGAH): DAPUR GIZI (MY KITCHEN) -->' +
            '<g transform="translate(74, 260)">' +
                '<ellipse cx="58" cy="96" rx="56" ry="13" fill="rgba(25,55,15,0.22)"/>' +
                '<rect x="86" y="6" width="16" height="32" rx="3" fill="#9a3412" stroke="#431407" stroke-width="3"/>' +
                '<circle cx="94" cy="-2" r="6" fill="#ffffff" opacity="0.72"/><circle cx="102" cy="-10" r="8" fill="#ffffff" opacity="0.52"/>' +
                '<rect x="10" y="38" width="96" height="56" rx="6" fill="#fff7ed" stroke="#9a3412" stroke-width="4"/>' +
                '<polygon points="0,42 58,8 116,42" fill="#f97316" stroke="#7c2d12" stroke-width="4" stroke-linejoin="round"/>' +
                '<polygon points="14,39 58,15 102,39" fill="#fb923c"/>' +
                '<rect x="20" y="54" width="26" height="22" rx="4" fill="#fef08a" stroke="#9a3412" stroke-width="3"/>' +
                '<path d="M62,94 L62,62 A15,15 0 0,1 92,62 L92,94 Z" fill="#b45309" stroke="#451a03" stroke-width="3.5"/>' +
                '<circle cx="84" cy="78" r="2.8" fill="#fde047"/>' +
                '<rect x="58" y="95" width="38" height="10" rx="4" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>' +
            '</g>' +
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

    if (zoneId === "shop" || zoneId === "river" || zoneId === "kitchen") {
        ws.x = z.exitX;
        ws.y = z.exitY;
        ws.targetX = null;
        ws.targetY = null;
        ws.autoEnterZone = "";
        ws.keys = { up: false, down: false, left: false, right: false };
        ws.exitCooldownUntil = Date.now() + 1800;
        window.renderPosisiAvatarMyWorld(false);
        if (targetVisitUser) {
            window.tampilkanCustomDialog("alert", "Fitur Toko Lahan, Memancing, dan Dapur Gizi hanya tersedia di lahan My World milik Anda sendiri.", null, function() {
                window.pulihkanGerakSetelahOverlayWorld();
            });
            return;
        }
        if (zoneId === "shop") window.bukaWorldShop();
        else if (zoneId === "river") window.bukaMiniGameMancing();
        else window.bukaMyKitchen();
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
    { id: "gedung_lab",    x1: 40.0, x2: 60.0, y1: 0.0,  y2: 32.5 },
    { id: "kios_shop",     x1: 77.5, x2: 88.5, y1: 55.5, y2: 71.0 },
    { id: "dapur_kitchen", x1: 6.5,  x2: 19.8, y1: 46.0, y2: 64.5 }
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
window._MYWORLD_GAME_MODAL_SELECTOR = "#modal-my-world, #modal-my-pet, #modal-my-garden, #modal-my-farm, #modal-my-lab, #modal-my-arcade, #modal-visit-quiz-20, #btn-floating-myworld";

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
        if (!t.closest("#modal-my-pet, #modal-my-garden, #modal-my-farm, #modal-my-lab, #modal-my-arcade, #modal-visit-quiz-20, #modal-custom-dialog, #myworld-shop-overlay, #myworld-fishing-overlay, #myworld-kitchen-overlay, #myworld-map-overlay, #myworld-bugcatch-overlay, #myworld-biodex-overlay, #myworld-stamina-overlay, #myworld-museum-overlay, #myworld-npc-overlay, #myworld-forage-overlay")) return;
        // Jangan ganggu slider, input ketikan, drag hewan di Habitat Pet, atau pengadukan sumur di My Lab
        let tag = t.tagName ? t.tagName.toUpperCase() : "";
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        if (t.closest(".is-draggable-pet, .mypet-decor-svg-item, .mypet-decor-drag-btn, .lab-glass-slide.is-stir-mode, .gen-dnd-chip, .lab-dnd-item, .ow-joystick-zone, .ow-decor-placed")) return;

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
    let ids = ["myworld-shop-overlay", "myworld-fishing-overlay", "myworld-kitchen-overlay", "modal-custom-dialog"];
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
// =========================================================================
// 10. SIKLUS SIANG–MALAM & CUACA LOKAL + KUSTOMISASI AVATAR + MY KITCHEN
// =========================================================================

// --- A. SIKLUS WAKTU & CUACA LOKAL (0 EXTRA FIREBASE READS) ---
window.dapatkanFaseWaktuLokalWorld = function() {
    let jam = new Date().getHours();
    if (jam >= 5 && jam < 11) return { id: "pagi",  nama: "Pagi",  ikon: "🌅" };
    if (jam >= 11 && jam < 15) return { id: "siang", nama: "Siang", ikon: "☀️" };
    if (jam >= 15 && jam < 18) return { id: "sore",  nama: "Sore",  ikon: "🌇" };
    return { id: "malam", nama: "Malam", ikon: "🌙" };
};

window.dapatkanCuacaLokalMyWorld = function() {
    // Berubah otomatis setiap 30 menit secara deterministik lokal
    let slot30 = Math.floor(Date.now() / (30 * 60 * 1000));
    let hash = ((slot30 * 2654435761) >>> 0) % 100;
    if (hash < 45) return { id: "cerah",   nama: "Cerah",    ikon: "☀️", efek: "Cuaca cerah ideal untuk aktivitas lahan." };
    if (hash < 70) return { id: "berawan", nama: "Berawan",  ikon: "⛅", efek: "Udara sejuk berawan." };
    if (hash < 88) return { id: "hujan",   nama: "Hujan",    ikon: "🌧️", efek: "Hujan menyiram seluruh tanaman My Garden secara otomatis!" };
    return { id: "angin", nama: "Berangin", ikon: "🍃", efek: "Angin sepoi menambah peluang ikan langka di sungai!" };
};

window.terapkanHujanSiramOtomatisGarden = function(uName) {
    let cuaca = window.dapatkanCuacaLokalMyWorld();
    if (cuaca.id !== "hujan") return 0;
    if (typeof window.pastikanStrukturMyGarden !== "function" || typeof window.hitungStatusPetakKebun !== "function") return 0;

    let lb = window.pastikanStrukturMyGarden(uName || sessionStorage.getItem("username"));
    if (!lb || !lb.myGardenData || !lb.myGardenData.plots) return 0;

    let count = 0;
    let plots = lb.myGardenData.plots;
    Object.keys(plots).forEach(function(k) {
        let pObj = plots[k];
        if (!pObj || pObj.watered) return;
        let info = window.hitungStatusPetakKebun(pObj);
        if (info && (info.status === "sprout" || info.status === "growing")) {
            let pot = Math.round(info.remainingMs * 0.15);
            pObj.readyAt = Math.max(Date.now(), pObj.readyAt - pot);
            pObj.watered = true;
            count++;
        }
    });

    if (count > 0 && typeof window.simpanDataKebunKeServer === "function") {
        window.simpanDataKebunKeServer(lb);
    }
    return count;
};

window.tampilkanToastEnvMyWorld = function(pesan) {
    let t = document.getElementById("myworld-toast-env");
    if (!t) return;
    t.innerHTML = pesan;
    t.style.display = "block";
    clearTimeout(window._mwEnvToastTimer);
    window._mwEnvToastTimer = setTimeout(function() {
        if (t) t.style.display = "none";
    }, 3400);
};

window.terapkanSiklusWaktuDanCuacaWorld = function() {
    let stage = document.getElementById("myworld-stage");
    let fxEl = document.getElementById("myworld-env-fx");
    let pillEl = document.getElementById("myworld-env-pill");
    if (!stage || !fxEl) return;

    let waktu = window.dapatkanFaseWaktuLokalWorld();
    let cuaca = window.dapatkanCuacaLokalMyWorld();

    stage.classList.remove("time-pagi", "time-siang", "time-sore", "time-malam", "weather-cerah", "weather-berawan", "weather-hujan", "weather-angin");
    stage.classList.add("time-" + waktu.id, "weather-" + cuaca.id);

    if (pillEl) {
        pillEl.innerHTML = waktu.ikon + " " + waktu.nama + " • " + cuaca.ikon + " " + cuaca.nama;
        pillEl.title = cuaca.efek;
    }

    let fxHtml = '';
    if (waktu.id === "malam") {
        fxHtml += '<div class="mw-stars-layer"></div>';
    }
    if (cuaca.id === "hujan") {
        fxHtml += '<div class="mw-rain-layer"></div>';
    } else if (cuaca.id === "berawan") {
        fxHtml += '<div class="mw-clouds-layer"></div>';
    } else if (cuaca.id === "angin") {
        fxHtml += '<div class="mw-wind-layer"><span>🍃</span><span>🍂</span><span>🍃</span><span>🌿</span></div>';
    }
    fxEl.innerHTML = fxHtml;

    // Jika hujan dan bukan mode visit, siram otomatis kebun sendiri
    if (cuaca.id === "hujan" && !window.modeKunjunganWorld) {
        let jml = window.terapkanHujanSiramOtomatisGarden(sessionStorage.getItem("username"));
        if (jml > 0) {
            window.tampilkanToastEnvMyWorld("🌧️ Cuaca Hujan menyiram otomatis <b>" + jml + " tanaman</b> di My Garden!");
        }
    }
};

// --- B. KUSTOMISASI AVATAR MY WORLD (TOPI, PAKAIAN, & AKSESORI WAJAH) ---
window.MY_WORLD_AVATAR_CATALOG = {
    hats: [
        { id: "hat_straw", nama: "Topi Jerami",        harga: 0,   ikon: "👒" },
        { id: "hat_none",  nama: "Tanpa Topi",         harga: 0,   ikon: "🙂" },
        { id: "hat_cap",   nama: "Topi Penjelajah",    harga: 120, ikon: "🧢" },
        { id: "hat_chef",  nama: "Topi Koki Gizi",     harga: 180, ikon: "👨‍🍳" },
        { id: "hat_grad",  nama: "Topi Toga Ilmuwan",  harga: 250, ikon: "🎓" },
        { id: "hat_crown", nama: "Mahkota Peneliti",   harga: 600, ikon: "👑" }
    ],
    outfits: [
        { id: "out_farmer",   nama: "Overall Kebun",     harga: 0,   ikon: "👖", shirt: "#38bdf8", body: "#1d4ed8", btn: "#fde047" },
        { id: "out_labcoat",  nama: "Jas Laboratorium",  harga: 200, ikon: "🥼", shirt: "#ffffff", body: "#e2e8f0", btn: "#0284c7" },
        { id: "out_chef",     nama: "Seragam Koki",      harga: 240, ikon: "🍽️", shirt: "#fff7ed", body: "#ea580c", btn: "#ffffff" },
        { id: "out_explorer", nama: "Rompi Ekspedisi",   harga: 300, ikon: "🦺", shirt: "#bef264", body: "#65a30d", btn: "#78350f" },
        { id: "out_royal",    nama: "Jubah Profesor",    harga: 550, ikon: "🧥", shirt: "#7c3aed", body: "#4c1d95", btn: "#facc15" }
    ],
    accessories: [
        { id: "acc_none",    nama: "Tanpa Kacamata",      harga: 0,   ikon: "➖" },
        { id: "acc_glasses", nama: "Kacamata Ilmuwan",    harga: 140, ikon: "👓" },
        { id: "acc_goggles", nama: "Goggles Lab",         harga: 220, ikon: "🥽" },
        { id: "acc_shades",  nama: "Kacamata Hitam",      harga: 280, ikon: "🕶️" }
    ]
};

window.pastikanDataAvatarDanDapurWorld = function(uName) {
    let lb = window.pastikanStrukturMyWorldData(uName);
    if (!lb || !lb.myWorldData) return null;
    let wd = lb.myWorldData;

    if (!wd.avatarOutfit || typeof wd.avatarOutfit !== "object") {
        wd.avatarOutfit = { hat: "hat_straw", outfit: "out_farmer", accessory: "acc_none" };
    }
    if (!Array.isArray(wd.ownedAvatarItems)) {
        wd.ownedAvatarItems = wd.ownedAvatarItems ? Object.values(wd.ownedAvatarItems) : [];
    }
    ["hat_straw", "hat_none", "out_farmer", "acc_none"].forEach(function(defId) {
        if (wd.ownedAvatarItems.indexOf(defId) === -1) wd.ownedAvatarItems.push(defId);
    });
    if (!wd.kitchenInventory || typeof wd.kitchenInventory !== "object") {
        wd.kitchenInventory = { padi: 2, bayam: 2, wortel: 2, telur: 2 };
    }
    if (typeof wd.totalDishesCooked !== "number") wd.totalDishesCooked = 0;
    return lb;
};

window.bangunSVGAvatarKustomWorld = function(outfitObj, sizeW) {
    let eq = outfitObj || { hat: "hat_straw", outfit: "out_farmer", accessory: "acc_none" };
    let outCfg = window.MY_WORLD_AVATAR_CATALOG.outfits.find(function(o) { return o.id === eq.outfit; }) || window.MY_WORLD_AVATAR_CATALOG.outfits[0];
    let w = sizeW || 46;
    let h = Math.round(w * (96 / 80));

    let hatSvg = '';
    if (eq.hat === "hat_straw") {
        hatSvg = '<ellipse cx="40" cy="17" rx="26" ry="7" fill="#facc15" stroke="#a16207" stroke-width="2.5"/><path d="M23,16 C25,4 55,4 57,16 Z" fill="#fde047" stroke="#a16207" stroke-width="2.5"/><path d="M24,14 Q40,18 56,14" fill="none" stroke="#dc2626" stroke-width="3.5"/>';
    } else if (eq.hat === "hat_cap") {
        hatSvg = '<path d="M22,18 C22,5 58,5 58,18 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="2.5"/><path d="M22,18 L64,19 Q58,24 22,20 Z" fill="#0369a1" stroke="#0c4a6e" stroke-width="2"/>';
    } else if (eq.hat === "hat_chef") {
        hatSvg = '<circle cx="30" cy="10" r="8" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/><circle cx="40" cy="7" r="9" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/><circle cx="50" cy="10" r="8" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/><rect x="24" y="13" width="32" height="8" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>';
    } else if (eq.hat === "hat_grad") {
        hatSvg = '<polygon points="40,3 66,12 40,21 14,12" fill="#1e293b" stroke="#0f172a" stroke-width="2"/><rect x="26" y="16" width="28" height="6" rx="2" fill="#334155"/><line x1="60" y1="12" x2="62" y2="24" stroke="#facc15" stroke-width="2.5"/>';
    } else if (eq.hat === "hat_crown") {
        hatSvg = '<polygon points="24,18 22,5 32,12 40,3 48,12 58,5 56,18" fill="#facc15" stroke="#a16207" stroke-width="2.5" stroke-linejoin="round"/><circle cx="40" cy="13" r="2.5" fill="#dc2626"/>';
    } else {
        hatSvg = '<path d="M22,26 C22,10 58,10 58,26 Q40,18 22,26 Z" fill="#451a03"/>';
    }

    let accSvg = '';
    if (eq.accessory === "acc_glasses") {
        accSvg = '<circle cx="33" cy="30" r="5.5" fill="rgba(186,230,253,0.4)" stroke="#0f172a" stroke-width="2"/><circle cx="47" cy="30" r="5.5" fill="rgba(186,230,253,0.4)" stroke="#0f172a" stroke-width="2"/><line x1="38.5" y1="30" x2="41.5" y2="30" stroke="#0f172a" stroke-width="2"/>';
    } else if (eq.accessory === "acc_goggles") {
        accSvg = '<rect x="24" y="25" width="32" height="10" rx="5" fill="#38bdf8" stroke="#0369a1" stroke-width="2.2" opacity="0.88"/><line x1="40" y1="25" x2="40" y2="35" stroke="#0369a1" stroke-width="2"/>';
    } else if (eq.accessory === "acc_shades") {
        accSvg = '<rect x="25" y="26" width="13" height="8" rx="3" fill="#0f172a"/><rect x="42" y="26" width="13" height="8" rx="3" fill="#0f172a"/><line x1="38" y1="29" x2="42" y2="29" stroke="#0f172a" stroke-width="2"/>';
    }

    return '<svg viewBox="0 0 80 96" width="' + w + '" height="' + h + '" class="myworld-avatar-svg">' +
        '<ellipse cx="40" cy="88" rx="18" ry="6" fill="rgba(15,23,42,0.28)"/>' +
        '<rect class="av-leg-l" x="28" y="68" width="9" height="17" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2"/>' +
        '<rect class="av-leg-r" x="43" y="68" width="9" height="17" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2"/>' +
        '<rect x="23" y="45" width="34" height="27" rx="10" fill="' + outCfg.shirt + '" stroke="#334155" stroke-width="2.5"/>' +
        '<path d="M26,56 L54,56 L53,72 L27,72 Z" fill="' + outCfg.body + '" stroke="#1e293b" stroke-width="2"/>' +
        '<circle cx="31" cy="59" r="2.2" fill="' + outCfg.btn + '"/><circle cx="49" cy="59" r="2.2" fill="' + outCfg.btn + '"/>' +
        '<ellipse cx="19" cy="57" rx="5" ry="9" fill="#fed7aa" stroke="#9a3412" stroke-width="2"/>' +
        '<ellipse cx="61" cy="57" rx="5" ry="9" fill="#fed7aa" stroke="#9a3412" stroke-width="2"/>' +
        '<circle cx="40" cy="30" r="18" fill="#fed7aa" stroke="#9a3412" stroke-width="2.5"/>' +
        '<circle cx="33" cy="30" r="2.7" fill="#0f172a"/><circle cx="47" cy="30" r="2.7" fill="#0f172a"/>' +
        '<ellipse cx="28" cy="34" rx="3.2" ry="1.8" fill="#fb7185" opacity="0.7"/>' +
        '<ellipse cx="52" cy="34" rx="3.2" ry="1.8" fill="#fb7185" opacity="0.7"/>' +
        '<path d="M36,36 Q40,40 44,36" fill="none" stroke="#7c2d12" stroke-width="2.2" stroke-linecap="round"/>' +
        accSvg + hatSvg +
    '</svg>';
};

window.segarkanVisualAvatarDiPetaWorld = function() {
    let flip = document.getElementById("myworld-avatar-flip");
    if (!flip) return;
    let lb = window.pastikanDataAvatarDanDapurWorld(sessionStorage.getItem("username"));
    let eq = (lb && lb.myWorldData && lb.myWorldData.avatarOutfit) || null;
    flip.innerHTML = window.bangunSVGAvatarKustomWorld(eq, 46);
};

window.beliAtauPakaiAvatarWorld = function(slotKey, itemId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataAvatarDanDapurWorld(uName);
    if (!lb) return;
    let wd = lb.myWorldData;

    let pool = slotKey === "hat"
        ? window.MY_WORLD_AVATAR_CATALOG.hats
        : (slotKey === "outfit" ? window.MY_WORLD_AVATAR_CATALOG.outfits : window.MY_WORLD_AVATAR_CATALOG.accessories);
    let item = pool.find(function(x) { return x.id === itemId; });
    if (!item) return;

    let owned = wd.ownedAvatarItems.indexOf(itemId) !== -1 || item.harga === 0;
    if (!owned) {
        let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
        if (saldo < item.harga) {
            return window.tampilkanCustomDialog("alert", "Saldo Coin belum mencukupi untuk membeli " + item.nama + " (" + item.harga + " Coin).", null, null);
        }
        if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(item.harga, "beli_avatar_" + itemId, true)) {
            wd.ownedAvatarItems.push(itemId);
        } else {
            return;
        }
    }

    wd.avatarOutfit[slotKey] = itemId;
    window.simpanDataWorldKeServer(lb);
    window.perbaruiBadgeMyWorld();
    window.segarkanVisualAvatarDiPetaWorld();
    window.renderWorldShopUI();
};

// --- C. MY KITCHEN / DAPUR GIZI & OLAHAN ---
window.MY_KITCHEN_INGREDIENTS = {
    padi:        { nama: "Beras / Padi",     ikon: "🌾", gizi: "Karbohidrat (Amilum)",          kat: "karbo",   hargaBeli: 35 },
    jagung:      { nama: "Jagung Manis",     ikon: "🌽", gizi: "Karbohidrat Kompleks & Serat",  kat: "karbo",   hargaBeli: 45 },
    telur:       { nama: "Telur Segar",      ikon: "🥚", gizi: "Protein Hewani (Albumin)",      kat: "protein", hargaBeli: 40 },
    susu:        { nama: "Susu Segar",       ikon: "🥛", gizi: "Protein Kasein & Kalsium",      kat: "protein", hargaBeli: 55 },
    kedelai:     { nama: "Kedelai Kuning",   ikon: "🫘", gizi: "Protein Nabati Lengkap",        kat: "protein", hargaBeli: 50 },
    ikan_mujair: { nama: "Ikan Mujair",      ikon: "🐟", gizi: "Protein Hewani & Fosfor",       kat: "protein", hargaBeli: 0, fromFish: true },
    ikan_gurame: { nama: "Ikan Gurame",      ikon: "🐠", gizi: "Protein Tinggi & Omega-3",      kat: "protein", hargaBeli: 0, fromFish: true },
    alpukat:     { nama: "Alpukat Mentega",  ikon: "🥑", gizi: "Lemak Tak Jenuh (Omega-9)",     kat: "lemak",   hargaBeli: 70 },
    bayam:       { nama: "Bayam Hijau",      ikon: "🥬", gizi: "Zat Besi (Fe) & Vitamin A",     kat: "vit",     hargaBeli: 25 },
    wortel:      { nama: "Wortel",           ikon: "🥕", gizi: "Beta-Karoten (Pro-Vitamin A)",  kat: "vit",     hargaBeli: 30 },
    tomat:       { nama: "Tomat Ceri",       ikon: "🍅", gizi: "Vitamin C & Likopen",           kat: "vit",     hargaBeli: 40 },
    stroberi:    { nama: "Stroberi Manis",   ikon: "🍓", gizi: "Vitamin C & Antioksidan",       kat: "vit",     hargaBeli: 55 },
    brokoli:     { nama: "Brokoli Segar",    ikon: "🥦", gizi: "Vitamin C, K, & Serat Pangan",  kat: "vit",     hargaBeli: 65 }
};

window.MY_KITCHEN_RECIPES = [
    { id: "bubur_sayur",      nama: "Bubur Bayam Wortel",          ikon: "🥣", req: ["padi", "bayam", "wortel"],              coin: 180, xp: 30, petFoodId: "food_nutri",  petFoodNama: "Nutri Bowl",   gizi: "Karbohidrat + Zat Besi (Fe) + Beta-Karoten" },
    { id: "omelet_tomat",     nama: "Omelet Telur Bayam Tomat",    ikon: "🍳", req: ["telur", "tomat", "bayam"],              coin: 210, xp: 35, petFoodId: "food_nutri",  petFoodNama: "Nutri Bowl",   gizi: "Protein Albumin + Zat Besi + Vitamin C" },
    { id: "perkedel_kedelai", nama: "Perkedel Kedelai Jagung",     ikon: "🧆", req: ["kedelai", "jagung", "telur"],           coin: 240, xp: 40, petFoodId: "food_nutri",  petFoodNama: "Nutri Bowl",   gizi: "Protein Nabati-Hewani + Karbohidrat Kompleks" },
    { id: "sup_ikan",         nama: "Sup Ikan Mujair Brokoli",     ikon: "🍲", req: ["ikan_mujair", "brokoli", "wortel"],     coin: 260, xp: 45, petFoodId: "food_feast",  petFoodNama: "Hearty Feast", gizi: "Protein Hewani + Vitamin C, K, & Beta-Karoten" },
    { id: "smoothie_alpukat", nama: "Smoothie Alpukat Stroberi",   ikon: "🥤", req: ["alpukat", "stroberi", "susu"],          coin: 320, xp: 55, petFoodId: "food_feast",  petFoodNama: "Hearty Feast", gizi: "Lemak Tak Jenuh Omega-9 + Kalsium + Vitamin C" },
    { id: "bento_gurame",     nama: "Bento Gurame Gizi Seimbang",  ikon: "🍱", req: ["ikan_gurame", "padi", "brokoli", "alpukat"], coin: 460, xp: 85, petFoodId: "food_golden", petFoodNama: "Golden Meal", gizi: "4 Makronutrien Lengkap (Karbo, Protein, Lemak Sehat, Vitamin)" }
];

window.MY_KITCHEN_NUTRITION_CASES = [
    {
        id: "anemia",
        pasien: "Siswa penderita Anemia Defisiensi Besi (mudah lelah, Hb rendah)",
        target: "Susun 3 bahan yang mencakup sumber Zat Besi (Fe), Vitamin C (membantu absorpsi Fe), dan Protein pembentuk globin!",
        cek: function(arr) {
            let hasFe = arr.indexOf("bayam") !== -1;
            let hasVitC = arr.some(function(x) { return x === "tomat" || x === "brokoli" || x === "stroberi"; });
            let hasProt = arr.some(function(x) { return window.MY_KITCHEN_INGREDIENTS[x] && window.MY_KITCHEN_INGREDIENTS[x].kat === "protein"; });
            return hasFe && hasVitC && hasProt;
        },
        pembahasan: "Bayam memasok zat besi (Fe), Vitamin C (tomat/brokoli/stroberi) meningkatkan penyerapan Fe di usus, dan protein menyusun rantai globin hemoglobin."
    },
    {
        id: "atlet",
        pasien: "Atlet lari jarak jauh menjelang pemulihan pascapertandingan",
        target: "Susun 3 bahan yang lengkap mengandung Karbohidrat (pemulih glikogen), Protein (perbaikan otot), dan Vitamin/Serat!",
        cek: function(arr) {
            let cats = arr.map(function(x) { return window.MY_KITCHEN_INGREDIENTS[x] ? window.MY_KITCHEN_INGREDIENTS[x].kat : ""; });
            return cats.indexOf("karbo") !== -1 && cats.indexOf("protein") !== -1 && cats.indexOf("vit") !== -1;
        },
        pembahasan: "Karbohidrat mengisi ulang cadangan glikogen otot, protein memperbaiki serabut otot lurik, dan vitamin berperan sebagai koenzim metabolisme."
    },
    {
        id: "jantung",
        pasien: "Pasien diet sehat kardiovaskular (menjaga elastisitas pembuluh darah)",
        target: "Susun 3 bahan yang mencakup Lemak Tak Jenuh (Alpukat), Protein Nabati/Ikan, dan Sayuran Tinggi Serat!",
        cek: function(arr) {
            let hasFat = arr.indexOf("alpukat") !== -1;
            let hasGoodProt = arr.some(function(x) { return x === "kedelai" || x === "ikan_mujair" || x === "ikan_gurame"; });
            let hasVeg = arr.some(function(x) { return x === "bayam" || x === "brokoli" || x === "wortel" || x === "tomat"; });
            return hasFat && hasGoodProt && hasVeg;
        },
        pembahasan: "Asam oleat pada alpukat dan serat sayuran menurunkan kolesterol LDL, sementara protein kedelai/ikan rendah lemak jenuh."
    }
];

window.tambahBahanDapurWorld = function(lb, ingKey, qty) {
    if (!lb || !window.MY_KITCHEN_INGREDIENTS[ingKey]) return false;
    if (!lb.myWorldData || typeof lb.myWorldData !== "object") {
        lb.myWorldData = { hasFishingRod: false, fishInventory: {}, kitchenInventory: {} };
    }
    if (!lb.myWorldData.kitchenInventory || typeof lb.myWorldData.kitchenInventory !== "object") {
        lb.myWorldData.kitchenInventory = {};
    }
    lb.myWorldData.kitchenInventory[ingKey] = (Number(lb.myWorldData.kitchenInventory[ingKey]) || 0) + (Number(qty) || 1);
    return true;
};

window.ambilStokBahanDapur = function(lb, ingKey) {
    if (!lb || !lb.myWorldData) return 0;
    let cfg = window.MY_KITCHEN_INGREDIENTS[ingKey];
    if (cfg && cfg.fromFish) {
        return Number((lb.myWorldData.fishInventory || {})[ingKey]) || 0;
    }
    return Number((lb.myWorldData.kitchenInventory || {})[ingKey]) || 0;
};

window.kurangiStokBahanDapur = function(lb, ingKey, qty) {
    if (!lb || !lb.myWorldData) return;
    let cfg = window.MY_KITCHEN_INGREDIENTS[ingKey];
    let bag = (cfg && cfg.fromFish) ? lb.myWorldData.fishInventory : lb.myWorldData.kitchenInventory;
    if (!bag) return;
    let next = Math.max(0, (Number(bag[ingKey]) || 0) - (Number(qty) || 1));
    if (next <= 0) delete bag[ingKey];
    else bag[ingKey] = next;
};

// Upgrade World Shop menjadi 4 Tab: Perlengkapan, Jual Ikan, Avatar, & Pasar Bahan
window.renderWorldShopUI = function() {
    let ov = document.getElementById("myworld-shop-overlay");
    if (!ov) return;
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataAvatarDanDapurWorld(uName);
    if (!lb) return;

    let wd = lb.myWorldData;
    let inv = wd.fishInventory || {};
    let totalIkanDiTas = 0, totalNilaiCoin = 0;
    window.MY_WORLD_FISH_CATALOG.forEach(function(f) {
        let q = Number(inv[f.id]) || 0;
        totalIkanDiTas += q;
        totalNilaiCoin += q * f.coin;
    });

    let tab = window.activeWorldShopTab || "gear";
    let bodyHtml = '';

    if (tab === "gear") {
        let rod = window.MY_WORLD_SHOP_ITEMS.rod;
        bodyHtml =
            '<div class="ws-gear-grid">' +
                '<div class="ws-item-card">' +
                    '<div class="cozy-card-top-row"><span class="cozy-tag green">Peralatan Permanen</span><span class="cozy-stock-lbl">' + (wd.hasFishingRod ? '✓ Dimiliki' : 'Belum Dimiliki') + '</span></div>' +
                    '<div style="font-size:46px; margin:8px 0;">' + rod.ikon + '</div>' +
                    '<div class="cozy-item-name">' + rod.nama + '</div>' +
                    '<div class="cozy-item-sub">' + rod.deskripsi + '</div>' +
                    (wd.hasFishingRod
                        ? '<button type="button" class="mypet-gray-cta sm" disabled>✓ Dimiliki — Berjalan ke Sungai</button>'
                        : '<button type="button" class="mypet-amber-cta sm" onclick="window.beliPancingWorldShop()">🪙 Beli (' + rod.harga.toLocaleString("id-ID") + ' Coin)</button>') +
                '</div>' +
                '<div class="ws-item-card is-info-fish">' +
                    '<div class="cozy-card-top-row"><span class="cozy-tag amber">Spesies Ikan Sungai</span><span class="cozy-stock-lbl">4 Jenis</span></div>' +
                    '<div class="ws-fish-guide-list">' +
                        window.MY_WORLD_FISH_CATALOG.map(function(f) {
                            return '<div class="ws-fish-mini-row"><span class="ws-rar-dot rar-' + f.rarity.toLowerCase() + '">' + f.rarity + '</span><b>' + f.nama + '</b><span>🪙 ' + f.coin + '</span></div>';
                        }).join('') +
                    '</div>' +
                '</div>' +
            '</div>';
    } else if (tab === "sell") {
        let cardsHtml = window.MY_WORLD_FISH_CATALOG.map(function(f) {
            let qty = Number(inv[f.id]) || 0;
            return '<div class="ws-item-card rar-' + f.rarity.toLowerCase() + '">' +
                '<div class="cozy-card-top-row"><span class="cozy-tag neutral">' + f.rarity + '</span><span class="cozy-stock-lbl">Tas: <b>x' + qty + '</b></span></div>' +
                '<div style="margin:6px 0;">' + window.bangunSVGIkanWorld(f, 76) + '</div>' +
                '<div class="cozy-item-name">' + f.nama + '</div>' +
                '<div class="garden-latin-name"><i>' + f.latin + '</i></div>' +
                '<div class="garden-shop-meta">🪙 ' + f.coin + ' Coin • ⭐ +' + f.xp + ' XP / ekor</div>' +
                '<button type="button" class="' + (qty > 0 ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (qty > 0 ? '' : 'disabled') + ' onclick="window.jualSatuIkanWorld(\'' + f.id + '\')">' + (qty > 0 ? ('💰 Jual 1 (+🪙 ' + f.coin + ')') : 'Kosong') + '</button>' +
            '</div>';
        }).join('');
        bodyHtml = (totalIkanDiTas > 0 ? '<div class="ws-sell-all-bar"><span>🐟 Total di Tas: <b>' + totalIkanDiTas + ' ekor</b> (Estimasi <b>🪙 ' + totalNilaiCoin.toLocaleString("id-ID") + '</b>)</span><button type="button" class="mypet-amber-cta sm" style="width:auto; padding:6px 14px;" onclick="window.jualSemuaIkanWorld()">💰 Jual Semua</button></div>' : '') + '<div class="ws-fish-sell-grid">' + cardsHtml + '</div>';
    } else if (tab === "avatar") {
        let renderGrupAv = function(slotKey, judul, arr) {
            return '<div class="ws-av-sec-title">' + judul + '</div><div class="ws-av-items-grid">' +
                arr.map(function(it) {
                    let owned = wd.ownedAvatarItems.indexOf(it.id) !== -1 || it.harga === 0;
                    let eq = wd.avatarOutfit[slotKey] === it.id;
                    return '<button type="button" class="ws-av-chip' + (eq ? ' is-equipped' : '') + '" onclick="window.beliAtauPakaiAvatarWorld(\'' + slotKey + '\', \'' + it.id + '\')">' +
                        '<span style="font-size:20px;">' + it.ikon + '</span>' +
                        '<b>' + it.nama + '</b>' +
                        '<small>' + (eq ? '✓ Dipakai' : (owned ? 'Pakai' : ('🪙 ' + it.harga))) + '</small>' +
                    '</button>';
                }).join('') + '</div>';
        };
        bodyHtml =
            '<div class="ws-avatar-layout">' +
                '<div class="ws-avatar-preview-box">' +
                    window.bangunSVGAvatarKustomWorld(wd.avatarOutfit, 96) +
                    '<div style="font-size:11.5px; font-weight:900; color:#451a03; margin-top:4px;">Pratinjau Avatar</div>' +
                '</div>' +
                '<div style="flex:1; min-width:220px; display:flex; flex-direction:column; gap:8px;">' +
                    renderGrupAv("hat", "🎩 1. Penutup Kepala", window.MY_WORLD_AVATAR_CATALOG.hats) +
                    renderGrupAv("outfit", "👕 2. Pakaian", window.MY_WORLD_AVATAR_CATALOG.outfits) +
                    renderGrupAv("accessory", "👓 3. Aksesori Wajah", window.MY_WORLD_AVATAR_CATALOG.accessories) +
                '</div>' +
            '</div>';
    } else if (tab === "pantry") {
        let keysBuy = Object.keys(window.MY_KITCHEN_INGREDIENTS).filter(function(k) { return !window.MY_KITCHEN_INGREDIENTS[k].fromFish; });
        bodyHtml = '<div class="ws-pantry-grid">' +
            keysBuy.map(function(k) {
                let it = window.MY_KITCHEN_INGREDIENTS[k];
                let stok = window.ambilStokBahanDapur(lb, k);
                return '<div class="ws-item-card" style="padding:8px;">' +
                    '<div class="cozy-card-top-row"><span class="cozy-tag neutral">' + it.kat.toUpperCase() + '</span><span class="cozy-stock-lbl">Stok: <b>x' + stok + '</b></span></div>' +
                    '<div style="font-size:30px; margin:4px 0;">' + it.ikon + '</div>' +
                    '<div class="cozy-item-name" style="font-size:12px;">' + it.nama + '</div>' +
                    '<div class="cozy-item-sub" style="font-size:9.5px;">' + it.gizi + '</div>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.beliBahanDapurShop(\'' + k + '\')">🪙 Beli (' + it.hargaBeli + ')</button>' +
                '</div>';
            }).join('') + '</div>';
    }

    ov.innerHTML =
        '<div class="ws-modal-card">' +
            '<div class="ws-modal-head">' +
                '<div><strong>🏪 Toko Lahan (World Shop)</strong><small>Perlengkapan, Pasar Ikan, Kustomisasi Avatar, dan Bahan Dapur Gizi.</small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupWorldShop()">✕</button>' +
            '</div>' +
            '<div class="ws-tabs-row">' +
                '<button type="button" class="ws-tab-btn' + (tab === "gear" ? ' active' : '') + '" onclick="window.gantiTabWorldShop(\'gear\')">🎣 Alat</button>' +
                '<button type="button" class="ws-tab-btn' + (tab === "sell" ? ' active' : '') + '" onclick="window.gantiTabWorldShop(\'sell\')">🐟 Ikan (' + totalIkanDiTas + ')</button>' +
                '<button type="button" class="ws-tab-btn' + (tab === "avatar" ? ' active' : '') + '" onclick="window.gantiTabWorldShop(\'avatar\')">👕 Avatar</button>' +
                '<button type="button" class="ws-tab-btn' + (tab === "pantry" ? ' active' : '') + '" onclick="window.gantiTabWorldShop(\'pantry\')">🧺 Bahan</button>' +
            '</div>' +
            '<div class="world-shop-body">' + bodyHtml + '</div>' +
        '</div>';
};

window.beliBahanDapurShop = function(ingKey) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataAvatarDanDapurWorld(uName);
    let it = window.MY_KITCHEN_INGREDIENTS[ingKey];
    if (!lb || !it || it.fromFish) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < it.hargaBeli) {
        return window.tampilkanCustomDialog("alert", "Saldo Coin belum mencukupi untuk membeli " + it.nama + " (" + it.hargaBeli + " Coin).", null, null);
    }
    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(it.hargaBeli, "beli_bahan_" + ingKey, true)) {
        window.tambahBahanDapurWorld(lb, ingKey, 1);
        window.simpanDataWorldKeServer(lb);
        window.perbaruiBadgeMyWorld();
        window.renderWorldShopUI();
    }
};

// --- ENGINE MY KITCHEN (MASAK RESEP TIMING GAUGE + TANTANGAN AHLI GIZI) ---
window._kitchenState = null;
window._kitchenCookTimer = null;

window.hentikanTimerKitchen = function() {
    clearInterval(window._kitchenCookTimer);
    window._kitchenCookTimer = null;
};

window.bukaMyKitchen = function() {
    let uName = sessionStorage.getItem("username");
    window.pastikanDataAvatarDanDapurWorld(uName);
    window.hentikanTimerKitchen();
    let rndCase = window.MY_KITCHEN_NUTRITION_CASES[Math.floor(Math.random() * window.MY_KITCHEN_NUTRITION_CASES.length)];
    window._kitchenState = {
        tab: "recipes", // 'recipes' | 'nutrition' | 'cooking' | 'cooked'
        activeRecipe: null,
        heatVal: 0,
        cookingActive: false,
        cookQuality: "",
        claimed: false,
        claimedMsg: "",
        caseObj: rndCase,
        pickedCaseIngs: [],
        caseResult: null,
        showRef: false
    };
    window.renderMyKitchenUI();
    let ov = document.getElementById("myworld-kitchen-overlay");
    if (ov) ov.style.display = "flex";
};

window.tutupMyKitchen = function() {
    window.hentikanTimerKitchen();
    window._kitchenState = null;
    let ov = document.getElementById("myworld-kitchen-overlay");
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

window.gantiTabKitchen = function(tabName) {
    if (!window._kitchenState) return;
    window.hentikanTimerKitchen();
    window._kitchenState.tab = tabName;
    window._kitchenState.showRef = false;
    window.renderMyKitchenUI();
};

window.toggleReferensiGiziKitchen = function(show) {
    if (!window._kitchenState) return;
    window._kitchenState.showRef = typeof show === "boolean" ? show : !window._kitchenState.showRef;
    window.renderMyKitchenUI();
};

window.renderMyKitchenUI = function() {
    let ov = document.getElementById("myworld-kitchen-overlay");
    let st = window._kitchenState;
    if (!ov || !st) return;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataAvatarDanDapurWorld(uName);
    if (!lb) return;

    // Overlay Referensi Gizi Penutup Layar Sementara
    let refOverlayHtml = '';
    if (st.showRef) {
        let rows = Object.keys(window.MY_KITCHEN_INGREDIENTS).map(function(k) {
            let it = window.MY_KITCHEN_INGREDIENTS[k];
            return '<tr><td>' + it.ikon + ' <b>' + it.nama + '</b></td><td>' + it.gizi + '</td></tr>';
        }).join('');
        refOverlayHtml =
            '<div class="kitchen-ref-cover" onclick="if(event.target===this) window.toggleReferensiGiziKitchen(false)">' +
                '<div class="kitchen-ref-card">' +
                    '<div class="ws-modal-head"><div><strong>❓ Tabel Referensi Gizi &amp; Makronutrien</strong><small>Pahami kandungan gizi tiap bahan lalu tutup referensi untuk kembali meracik.</small></div><button type="button" class="mypet-hud-close-btn" onclick="window.toggleReferensiGiziKitchen(false)">✕</button></div>' +
                    '<div class="world-shop-body"><table class="lab-guide-tbl"><thead><tr><th>Bahan Pangan</th><th>Kandungan Nutrien Utama</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
                '</div>' +
            '</div>';
    }

    let bodyHtml = '';

    if (st.tab === "recipes") {
        let pantryStrip = Object.keys(window.MY_KITCHEN_INGREDIENTS).map(function(k) {
            let it = window.MY_KITCHEN_INGREDIENTS[k];
            let q = window.ambilStokBahanDapur(lb, k);
            return '<span class="kit-stock-pill' + (q > 0 ? ' has-stock' : '') + '">' + it.ikon + ' ' + it.nama.split(" ")[0] + ': <b>x' + q + '</b></span>';
        }).join('');

        let recCards = window.MY_KITCHEN_RECIPES.map(function(r) {
            let canCook = r.req.every(function(ingKey) { return window.ambilStokBahanDapur(lb, ingKey) > 0; });
            let reqTags = r.req.map(function(ingKey) {
                let it = window.MY_KITCHEN_INGREDIENTS[ingKey];
                let ada = window.ambilStokBahanDapur(lb, ingKey) > 0;
                return '<span class="kit-req-chip ' + (ada ? 'ok' : 'miss') + '">' + it.ikon + ' ' + it.nama.split(" ")[0] + '</span>';
            }).join('');
            return '<div class="ws-item-card kit-recipe-card">' +
                '<div style="font-size:34px; margin:2px 0;">' + r.ikon + '</div>' +
                '<div class="cozy-item-name" style="font-size:12.5px;">' + r.nama + '</div>' +
                '<div class="cozy-item-sub" style="font-size:10px; margin:2px 0 5px 0;">' + r.gizi + '</div>' +
                '<div class="kit-reqs-wrap">' + reqTags + '</div>' +
                '<div class="garden-shop-meta" style="margin:5px 0;">🪙 ' + r.coin + ' Coin atau 🐾 ' + r.petFoodNama + '</div>' +
                '<button type="button" class="' + (canCook ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (canCook ? '' : 'disabled') + ' onclick="window.mulaiMasakResepKitchen(\'' + r.id + '\')">' + (canCook ? '🔥 Masak Sekarang' : 'Bahan Belum Lengkap') + '</button>' +
            '</div>';
        }).join('');

        bodyHtml =
            '<div class="kit-pantry-bar"><div style="font-size:11px; font-weight:900; color:#5c3210; margin-bottom:4px;">🧺 Stok Gudang Dapur (Otomatis dari Panen Kebun, Kandang, Sungai, atau Toko Lahan):</div><div class="kit-stock-list">' + pantryStrip + '</div></div>' +
            '<div class="ws-fish-sell-grid">' + recCards + '</div>';
    } else if (st.tab === "cooking" && st.activeRecipe) {
        let r = st.activeRecipe;
        bodyHtml =
            '<div class="kit-stove-box">' +
                '<div style="font-size:44px;">' + r.ikon + '</div>' +
                '<h4 style="margin:4px 0; color:#451a03;">Memasak: ' + r.nama + '</h4>' +
                '<p style="margin:0 0 10px 0; font-size:11.5px; color:#78350f;">Nyalakan kompor lalu angkat wajan tepat di <b>Zona Matang Optimal (55%–82%)</b> agar vitamin tidak rusak oleh panas berlebih!</p>' +
                '<div class="tc-gauge-track" style="max-width:420px;">' +
                    '<div class="tc-gauge-green-zone" style="left:55%; width:27%;">MATANG OPTIMAL</div>' +
                    '<div id="kit-heat-fill" class="tc-gauge-fill" style="width:' + Math.round(st.heatVal) + '%; background:rgba(234,88,12,0.48);"></div>' +
                    '<div id="kit-heat-needle" class="tc-gauge-needle" style="left:' + Math.round(st.heatVal) + '%;"></div>' +
                '</div>' +
                '<div style="margin-top:10px;">' +
                    (!st.cookingActive
                        ? '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:9px 24px;" onclick="window.nyalakanKomporKitchen()">🔥 Nyalakan Kompor</button>'
                        : '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:9px 26px;" onclick="window.angkatWajanKitchen()">🍳 Angkat Masakan Sekarang!</button>') +
                '</div>' +
            '</div>';
    } else if (st.tab === "cooked" && st.activeRecipe) {
        let r = st.activeRecipe;
        let mult = st.cookQuality === "perfect" ? 1.0 : 0.6;
        let finalCoin = Math.round(r.coin * mult);
        let finalXp = Math.round(r.xp * mult);

        bodyHtml =
            '<div class="kit-stove-box">' +
                '<div style="font-size:48px;">' + r.ikon + '</div>' +
                '<h4 style="margin:4px 0; color:' + (st.cookQuality === "perfect" ? '#15803d' : '#b45309') + ';">' + (st.cookQuality === "perfect" ? '🌟 Matang Sempurna! Nutrisi 100% Terjaga' : '⚠️ Kurang Optimal (Terlalu Cepat / Terlalu Panas)') + '</h4>' +
                '<p style="margin:0 0 10px 0; font-size:11.5px; color:#475569;">' + r.nama + ' — ' + r.gizi + '</p>' +
                (!st.claimed
                    ? '<div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; width:100%;">' +
                          '<button type="button" class="mypet-amber-cta sm" style="flex:1; max-width:210px;" onclick="window.klaimOlahanKitchen(\'sell\')">💰 Jual (+🪙 ' + finalCoin + ' &amp; +' + finalXp + ' XP)</button>' +
                          '<button type="button" class="mypet-green-cta sm" style="flex:1; max-width:210px;" onclick="window.klaimOlahanKitchen(\'pet\')">🐾 Kirim +1 ' + r.petFoodNama + ' ke My Pet</button>' +
                      '</div>'
                    : '<div class="garden-quiz-feedback ok" style="width:100%; box-sizing:border-box;">' + st.claimedMsg + '</div>' +
                      '<button type="button" class="mypet-green-cta sm" style="max-width:220px; margin-top:8px;" onclick="window.gantiTabKitchen(\'recipes\')">🍳 Masak Menu Lain</button>') +
            '</div>';
    } else if (st.tab === "nutrition") {
        let cObj = st.caseObj;
        let allIngs = Object.keys(window.MY_KITCHEN_INGREDIENTS);
        let pickGrid = allIngs.map(function(k) {
            let it = window.MY_KITCHEN_INGREDIENTS[k];
            let on = st.pickedCaseIngs.indexOf(k) !== -1;
            return '<button type="button" class="kit-case-chip' + (on ? ' is-picked' : '') + '" onclick="window.toggleBahanKasusGizi(\'' + k + '\')"><span>' + it.ikon + '</span><b>' + it.nama + '</b></button>';
        }).join('');

        let resBox = st.caseResult
            ? '<div class="garden-quiz-feedback ' + (st.caseResult.ok ? 'ok' : 'err') + '" style="margin-top:8px;"><b>' + (st.caseResult.ok ? '✅ Komposisi Gizi Tepat! (+🪙 140 Coin & +⭐ 65 XP)' : '❌ Komposisi Belum Memenuhi Target Kasus!') + '</b><br>' + cObj.pembahasan + '</div>' +
              '<button type="button" class="mypet-amber-cta sm" style="margin-top:8px;" onclick="window.muatKasusGiziBaruKitchen()">🔄 Kasus Gizi Berikutnya</button>'
            : '<button type="button" class="mypet-green-cta sm" style="margin-top:8px;" onclick="window.evaluasiKasusGiziKitchen()">📋 Evaluasi Komposisi 3 Bahan (' + st.pickedCaseIngs.length + '/3)</button>';

        bodyHtml =
            '<div class="kit-case-box">' +
                '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:6px;">' +
                    '<div style="font-size:12.5px; font-weight:900; color:#0b3954;">🩺 Kasus Fisiologi Gizi: ' + cObj.pasien + '</div>' +
                    '<button type="button" class="lab-banner-help-btn" style="padding:4px 9px; font-size:10.5px;" onclick="window.toggleReferensiGiziKitchen(true)">❓ Referensi</button>' +
                '</div>' +
                '<div style="font-size:11.5px; color:#475569; margin-bottom:10px;">' + cObj.target + '</div>' +
                '<div class="kit-case-grid">' + pickGrid + '</div>' +
                resBox +
            '</div>';
    }

    ov.innerHTML =
        '<div class="ws-modal-card kit-modal-card">' +
            '<div class="ws-modal-head">' +
                '<div><strong>🍳 My Kitchen — Dapur Gizi &amp; Olahan</strong><small>Olah hasil kebun, ternak, &amp; sungai menjadi hidangan bergizi seimbang.</small></div>' +
                '<div style="display:flex; gap:6px; align-items:center;">' +
                    '<button type="button" class="lab-banner-help-btn" style="padding:4px 9px; font-size:10.5px;" onclick="window.toggleReferensiGiziKitchen(true)">❓ Gizi</button>' +
                    '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupMyKitchen()">✕</button>' +
                '</div>' +
            '</div>' +
            '<div class="ws-tabs-row">' +
                '<button type="button" class="ws-tab-btn' + (st.tab !== "nutrition" ? ' active' : '') + '" onclick="window.gantiTabKitchen(\'recipes\')">🍳 Masak Resep</button>' +
                '<button type="button" class="ws-tab-btn' + (st.tab === "nutrition" ? ' active' : '') + '" onclick="window.gantiTabKitchen(\'nutrition\')">🩺 Tantangan Ahli Gizi</button>' +
            '</div>' +
            '<div class="world-shop-body">' + bodyHtml + '</div>' +
            refOverlayHtml +
        '</div>';
};

window.mulaiMasakResepKitchen = function(recId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataAvatarDanDapurWorld(uName);
    let rec = window.MY_KITCHEN_RECIPES.find(function(r) { return r.id === recId; });
    if (!lb || !rec) return;

    let cukup = rec.req.every(function(k) { return window.ambilStokBahanDapur(lb, k) > 0; });
    if (!cukup) return;

    rec.req.forEach(function(k) { window.kurangiStokBahanDapur(lb, k, 1); });
    window.simpanDataWorldKeServer(lb);

    window._kitchenState.activeRecipe = rec;
    window._kitchenState.tab = "cooking";
    window._kitchenState.heatVal = 0;
    window._kitchenState.cookingActive = false;
    window._kitchenState.claimed = false;
    window.renderMyKitchenUI();
};

window.nyalakanKomporKitchen = function() {
    let st = window._kitchenState;
    if (!st || st.tab !== "cooking" || st.cookingActive) return;
    st.cookingActive = true;
    st.heatVal = 0;
    window.renderMyKitchenUI();

    window.hentikanTimerKitchen();
    window._kitchenCookTimer = setInterval(function() {
        let cur = window._kitchenState;
        if (!cur || !cur.cookingActive) { window.hentikanTimerKitchen(); return; }
        cur.heatVal = Math.min(100, cur.heatVal + 2.3);
        let fEl = document.getElementById("kit-heat-fill");
        let nEl = document.getElementById("kit-heat-needle");
        let v = Math.round(cur.heatVal);
        if (fEl) fEl.style.width = v + "%";
        if (nEl) nEl.style.left = v + "%";
        if (cur.heatVal >= 100) window.angkatWajanKitchen();
    }, 40);
};

window.angkatWajanKitchen = function() {
    let st = window._kitchenState;
    if (!st || !st.cookingActive) return;
    window.hentikanTimerKitchen();
    st.cookingActive = false;
    st.cookQuality = (st.heatVal >= 55 && st.heatVal <= 82) ? "perfect" : "suboptimal";
    st.tab = "cooked";
    window.renderMyKitchenUI();
};

window.klaimOlahanKitchen = function(mode) {
    let st = window._kitchenState;
    if (!st || !st.activeRecipe || st.claimed) return;
    let r = st.activeRecipe;
    let mult = st.cookQuality === "perfect" ? 1.0 : 0.6;
    let gainCoin = Math.round(r.coin * mult);
    let gainXp = Math.round(r.xp * mult);

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataAvatarDanDapurWorld(uName);
    if (!lb) return;

    lb.myWorldData.totalDishesCooked = (Number(lb.myWorldData.totalDishesCooked) || 0) + 1;
    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + gainXp;
    lb.xp = lb.xpTotal;

    if (mode === "pet") {
        if (lb.myPetData && lb.myPetData.foodInventory) {
            lb.myPetData.foodInventory[r.petFoodId] = (Number(lb.myPetData.foodInventory[r.petFoodId]) || 0) + 1;
        }
        st.claimedMsg = "🐾 <b>+1 " + r.petFoodNama + "</b> berhasil dikirim ke inventaris <b>My Pet</b> &amp; +⭐ " + gainXp + " XP!";
    } else {
        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + gainCoin;
        lb.xpTersedia = lb.coin;
        st.claimedMsg = "💰 Hidangan <b>" + r.nama + "</b> terjual! +🪙 " + gainCoin + " Coin &amp; +⭐ " + gainXp + " XP!";
    }

    st.claimed = true;
    window.simpanDataWorldKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.perbaruiBadgeMyWorld();
    window.renderMyKitchenUI();
};

window.toggleBahanKasusGizi = function(ingKey) {
    let st = window._kitchenState;
    if (!st || st.caseResult) return;
    let idx = st.pickedCaseIngs.indexOf(ingKey);
    if (idx !== -1) st.pickedCaseIngs.splice(idx, 1);
    else if (st.pickedCaseIngs.length < 3) st.pickedCaseIngs.push(ingKey);
    window.renderMyKitchenUI();
};

window.evaluasiKasusGiziKitchen = function() {
    let st = window._kitchenState;
    if (!st || st.caseResult) return;
    if (st.pickedCaseIngs.length !== 3) {
        return window.tampilkanCustomDialog("alert", "Pilih tepat 3 bahan pangan untuk mengevaluasi komposisi gizi kasus ini.", null, null);
    }

    let ok = Boolean(st.caseObj.cek(st.pickedCaseIngs));
    st.caseResult = { ok: ok };

    if (ok) {
        let uName = sessionStorage.getItem("username");
        let lb = window.pastikanDataAvatarDanDapurWorld(uName);
        if (lb) {
            lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + 140;
            lb.xpTersedia = lb.coin;
            lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + 65;
            lb.xp = lb.xpTotal;
            window.simpanDataWorldKeServer(lb);
            if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
            if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
            window.perbaruiBadgeMyWorld();
        }
    }
    window.renderMyKitchenUI();
};

window.muatKasusGiziBaruKitchen = function() {
    let st = window._kitchenState;
    if (!st) return;
    let pool = window.MY_KITCHEN_NUTRITION_CASES.filter(function(c) { return c.id !== st.caseObj.id; });
    st.caseObj = pool[Math.floor(Math.random() * pool.length)] || window.MY_KITCHEN_NUTRITION_CASES[0];
    st.pickedCaseIngs = [];
    st.caseResult = null;
    window.renderMyKitchenUI();
};

// Hook pembukaan & penutupan My World agar Cuaca, Siang-Malam, Avatar Kustom, & Kitchen aktif otomatis
(function pasangHookEnvAvatarKitchenWorld() {
    if (typeof window.bukaModalMyWorld === "function" && !window.bukaModalMyWorld._v6EnvHooked) {
        let origOpen = window.bukaModalMyWorld;
        window.bukaModalMyWorld = function() {
            origOpen.apply(this, arguments);
            window.segarkanVisualAvatarDiPetaWorld();
            window.terapkanSiklusWaktuDanCuacaWorld();
        };
        window.bukaModalMyWorld._v6EnvHooked = true;
    }

    if (typeof window.tutupModalMyWorld === "function" && !window.tutupModalMyWorld._v6KitCloseHooked) {
        let origClose = window.tutupModalMyWorld;
        window.tutupModalMyWorld = function() {
            window.tutupMyKitchen();
            origClose.apply(this, arguments);
        };
        window.tutupModalMyWorld._v6KitCloseHooked = true;
    }
})();
// =========================================================================
// 11. OPEN-WORLD 2400x1500: KAMERA, KEBUN HALAMAN RUMAH, TEBANG POHON,
//     BUKA JALAN, EKSPLORASI SERANGGA (JARING), HOTBAR, & PETA DUNIA
// =========================================================================
window.MY_WORLD_OPEN_DIM = { w: 2400, h: 1500 };
window.myWorldCamera = { x: 0, y: 0 };
window.myWorldActiveTool = "hand"; // 'hand' | 'axe' | 'net' | 'rod'
window.myWorldLiveInsects = [];
window._bugCatchState = null;
window._bugCatchTimer = null;
window._openWorldPendingAction = null;

// Perbarui Daftar Zona dengan Jarak Luas (Kebun di Halaman Depan Rumah!)
window.MY_WORLD_ZONES = [
    { id: "pet",     nama: "Rumah Sanctuary (My Pet)",    labelSingkat: "🏡 My Pet",     doorX: 16.6, doorY: 27.6, exitX: 16.6, exitY: 32.5 },
    { id: "garden",  nama: "Kebun Halaman (My Garden)",   labelSingkat: "🌱 My Garden",  doorX: 16.8, doorY: 39.8, exitX: 16.8, exitY: 35.5 },
    { id: "kitchen", nama: "Dapur Gizi (My Kitchen)",     labelSingkat: "🍳 My Kitchen", doorX: 33.3, doorY: 27.2, exitX: 33.3, exitY: 32.5 },
    { id: "shop",    nama: "Toko Lahan (World Shop)",     labelSingkat: "🏪 Shop",       doorX: 52.5, doorY: 33.0, exitX: 52.5, exitY: 38.5 },
    { id: "lab",     nama: "Laboratorium Sains (My Lab)", labelSingkat: "🧪 My Lab",     doorX: 77.3, doorY: 25.8, exitX: 77.3, exitY: 31.5 },
    { id: "farm",    nama: "Peternakan (My Farm)",        labelSingkat: "🐄 My Farm",    doorX: 82.1, doorY: 56.2, exitX: 82.1, exitY: 60.5 },
    { id: "river",   nama: "Dermaga Sungai (Memancing)",  labelSingkat: "🎣 Memancing",  doorX: 25.5, doorY: 68.0, exitX: 28.5, exitY: 63.0 }
];

// Batas Padat Bangunan, Sungai, & Tebing Hutan
window.MY_WORLD_OBSTACLES = [
    { id: "rumah_pet",      x1: 11.2, x2: 22.0, y1: 11.0, y2: 26.2 },
    { id: "lahan_kebun",    x1: 10.2, x2: 23.6, y1: 41.5, y2: 53.8 },
    { id: "dapur_kitchen",  x1: 28.8, x2: 37.8, y1: 13.0, y2: 25.5 },
    { id: "kios_shop",      x1: 47.6, x2: 57.4, y1: 18.5, y2: 31.2 },
    { id: "gedung_lab",     x1: 71.8, x2: 82.8, y1: 10.0, y2: 24.0 },
    { id: "lumbung_farm",   x1: 76.0, x2: 88.2, y1: 39.5, y2: 54.5 },
    // Sungai Barat & Tebing Pembatas Hutan Langka Timur
    { id: "sungai_atas",    x1: 0.0,  x2: 24.0, y1: 67.5, y2: 77.5 },
    { id: "tebing_timur_n", x1: 65.5, x2: 100,  y1: 63.5, y2: 67.0 },
    { id: "tebing_timur_1", x1: 65.0, x2: 68.5, y1: 67.0, y2: 73.5 },
    { id: "tebing_timur_2", x1: 65.0, x2: 68.5, y1: 82.5, y2: 100 }
];

// 2 Gerbang / Jalur Terkunci (Buka Jalan dengan Kayu + Coin)
window.MY_WORLD_GATES = [
    {
        id: "gate_east_forest",
        nama: "Barikade Hutan Langka Timur",
        x: 66.8, y: 78.0,
        box: { x1: 65.0, x2: 68.5, y1: 73.5, y2: 82.5 },
        woodCost: 3, coinCost: 100,
        ikon: "🪵🚧",
        deskripsi: "Singkirkan barikade batang kayu untuk membuka jalur menuju Hutan Langka Timur (habitat serangga Rare & Legendary)."
    },
    {
        id: "gate_lotus_bridge",
        nama: "Jembatan Pulau Teratai",
        x: 20.5, y: 86.0,
        box: { x1: 16.5, x2: 24.5, y1: 82.5, y2: 89.5 },
        woodCost: 2, coinCost: 80,
        ikon: "🌉",
        deskripsi: "Perbaiki jembatan kayu menyeberangi sungai untuk menjelajahi Pulau Teratai di barat daya."
    }
];

// 16 Pohon yang Bisa Ditebang (Penghasil Kayu & Pembuka Ruang)
window.MY_WORLD_TREES = [
    { id: "tr_1",  x: 6.5,  y: 22.0, tipe: "pine", wood: 2 },
    { id: "tr_2",  x: 6.0,  y: 44.0, tipe: "oak",  wood: 2 },
    { id: "tr_3",  x: 26.0, y: 46.0, tipe: "oak",  wood: 2 },
    { id: "tr_4",  x: 42.0, y: 18.0, tipe: "pine", wood: 2 },
    { id: "tr_5",  x: 63.0, y: 16.0, tipe: "oak",  wood: 2 },
    { id: "tr_6",  x: 92.0, y: 22.0, tipe: "pine", wood: 2 },
    { id: "tr_7",  x: 38.0, y: 61.0, tipe: "oak",  wood: 2 },
    { id: "tr_8",  x: 47.0, y: 68.0, tipe: "pine", wood: 2 },
    { id: "tr_9",  x: 56.0, y: 63.0, tipe: "oak",  wood: 2 },
    { id: "tr_10", x: 42.0, y: 82.0, tipe: "pine", wood: 2 },
    { id: "tr_11", x: 54.0, y: 86.0, tipe: "oak",  wood: 2 },
    { id: "tr_12", x: 61.0, y: 76.0, tipe: "pine", wood: 2 },
    // Hutan Langka Timur (Di balik Gate 1)
    { id: "tr_13", x: 75.0, y: 74.0, tipe: "pine", wood: 3 },
    { id: "tr_14", x: 85.0, y: 73.0, tipe: "oak",  wood: 3 },
    { id: "tr_15", x: 91.0, y: 86.0, tipe: "pine", wood: 3 },
    // Pulau Teratai (Di balik Jembatan Gate 2)
    { id: "tr_16", x: 9.0,  y: 86.0, tipe: "oak",  wood: 3 }
];

// Katalog 6 Spesies Serangga (Eksplorasi Semak & Hutan)
window.MY_WORLD_INSECT_CATALOG = [
    { id: "kupu_kuning",     nama: "Kupu-Kupu Kuning",       latin: "Eurema hecabe",            ordo: "Lepidoptera", rarity: "Common",    coin: 35,  xp: 8,  zoneWidth: 34, speed: 2.0, ikon: "🦋", zones: ["yard", "forest"] },
    { id: "capung_hijau",    nama: "Capung Jarum Hijau",     latin: "Agriocnemis femina",       ordo: "Odonata",     rarity: "Common",    coin: 45,  xp: 10, zoneWidth: 30, speed: 2.2, ikon: "🪰", zones: ["river", "yard"] },
    { id: "belalang_sembah", nama: "Belalang Sembah",        latin: "Hierodula vitrea",         ordo: "Mantodea",    rarity: "Uncommon",  coin: 95,  xp: 20, zoneWidth: 24, speed: 2.6, ikon: "🦗", zones: ["forest"] },
    { id: "kumbang_badak",   nama: "Kumbang Badak",          latin: "Oryctes rhinoceros",       ordo: "Coleoptera",  rarity: "Rare",      coin: 185, xp: 38, zoneWidth: 19, speed: 3.1, ikon: "🪲", zones: ["forest", "east_forest"] },
    { id: "kupu_sayap",      nama: "Kupu-Kupu Sayap Burung", latin: "Ornithoptera priamus",     ordo: "Lepidoptera", rarity: "Rare",      coin: 250, xp: 52, zoneWidth: 17, speed: 3.3, ikon: "🦋", zones: ["east_forest", "island"] },
    { id: "kumbang_emas",    nama: "Kumbang Rusa Emas",      latin: "Cyclommatus metallifer",   ordo: "Coleoptera",  rarity: "Legendary", coin: 460, xp: 95, zoneWidth: 13, speed: 3.9, ikon: "🪲", zones: ["east_forest", "island"] }
];

window.MY_WORLD_SHOP_ITEMS.axe = {
    id: "kapak_kayu",
    nama: "Kapak Penebang",
    harga: 100,
    ikon: "🪓",
    deskripsi: "Menebang pohon di hutan My World untuk memperoleh Kayu dan membuka jalan baru."
};

window.MY_WORLD_SHOP_ITEMS.bugNet = {
    id: "jaring_serangga",
    nama: "Jaring Serangga",
    harga: 120,
    ikon: "🕸️",
    deskripsi: "Menangkap berbagai spesies serangga (Common hingga Legendary) di semak dan hutan."
};

// Pastikan Struktur Data Open-World di profil siswa (0 extra reads)
window.pastikanDataOpenWorldSiswa = function(uName) {
    let lb = window.pastikanDataAvatarDanDapurWorld(uName);
    if (!lb || !lb.myWorldData) return null;
    let wd = lb.myWorldData;
    if (typeof wd.hasAxe !== "boolean") wd.hasAxe = false;
    if (typeof wd.hasBugNet !== "boolean") wd.hasBugNet = false;
    if (typeof wd.woodCount !== "number") wd.woodCount = 0;
    if (!Array.isArray(wd.clearedTrees)) wd.clearedTrees = wd.clearedTrees ? Object.values(wd.clearedTrees) : [];
    if (!Array.isArray(wd.unlockedGates)) wd.unlockedGates = wd.unlockedGates ? Object.values(wd.unlockedGates) : [];
    if (!wd.insectInventory || typeof wd.insectInventory !== "object") wd.insectInventory = {};
    if (typeof wd.totalInsectsCaught !== "number") wd.totalInsectsCaught = 0;
    return lb;
};

// --- GENERATOR SVG PETA OPEN-WORLD 2400x1500 ---
window.bangunSVGOpenWorld2400 = function() {
    let bushesSvg = '';
    let bushPts = [
        [210, 560], [610, 480], [920, 460], [1080, 620], [1480, 460], [1640, 640],
        [860, 960], [1020, 1080], [1260, 980], [1420, 1180], [980, 1340], [1360, 1360],
        [1760, 1120], [1980, 1240], [2180, 1140], [2060, 1380], [260, 1280], [140, 1350]
    ];
    bushPts.forEach(function(pt) {
        bushesSvg += '<g transform="translate(' + pt[0] + ',' + pt[1] + ')">' +
            '<ellipse cx="0" cy="14" rx="28" ry="10" fill="rgba(20,55,15,0.2)"/>' +
            '<circle cx="-12" cy="4" r="16" fill="#2e7d32" stroke="#14532d" stroke-width="2.5"/>' +
            '<circle cx="12" cy="4" r="16" fill="#15803d" stroke="#14532d" stroke-width="2.5"/>' +
            '<circle cx="0" cy="-4" r="18" fill="#43a047" stroke="#14532d" stroke-width="2.5"/>' +
            '<circle cx="-6" cy="-6" r="3" fill="#f43f5e"/><circle cx="8" cy="2" r="3" fill="#fde047"/>' +
        '</g>';
    });

    return '<svg viewBox="0 0 2400 1500" width="2400" height="1500" class="myworld-open-svg">' +
        '<defs>' +
            '<linearGradient id="owGrassG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#89cf5e"/><stop offset="55%" stop-color="#74bd4b"/><stop offset="100%" stop-color="#589e38"/></linearGradient>' +
            '<linearGradient id="owWaterG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7dd3fc"/><stop offset="50%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#0369a1"/></linearGradient>' +
        '</defs>' +
        '<!-- Lahan Rumput Luas -->' +
        '<rect width="2400" height="1500" fill="url(#owGrassG)"/>' +
        '<!-- Variasi Zona Hutan & Rumput -->' +
        '<rect x="1580" y="960" width="820" height="540" rx="40" fill="#4d8f34" opacity="0.55"/>' +
        '<ellipse cx="1200" cy="1160" rx="460" ry="260" fill="#63ab40" opacity="0.45"/>' +
        '<ellipse cx="1950" cy="760" rx="280" ry="180" fill="#a3e635" opacity="0.32"/>' +

        '<!-- SUNGAI BARAT & PULAU TERATAI -->' +
        '<path d="M0,1010 L560,1010 Q595,1010 595,1060 L595,1500 L0,1500 Z" fill="#fde68a"/>' +
        '<path d="M0,1025 L542,1025 Q578,1025 578,1070 L578,1500 L0,1500 Z" fill="url(#owWaterG)"/>' +
        '<path d="M90,1080 Q190,1065 290,1082 M330,1115 Q420,1105 510,1120 M440,1260 Q490,1250 540,1265" stroke="#e0f2fe" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.72"/>' +
        '<!-- Pulau Teratai di Tengah Sungai Barat-Selatan -->' +
        '<rect x="65" y="1175" width="325" height="255" rx="52" fill="#fde68a" stroke="#d97706" stroke-width="6"/>' +
        '<rect x="82" y="1192" width="291" height="221" rx="42" fill="#74bd4b"/>' +
        '<circle cx="145" cy="1245" r="12" fill="#f472b6"/><circle cx="315" cy="1365" r="12" fill="#facc15"/>' +

        '<!-- DERMAGA MEMANCING DI TEPI SUNGAI -->' +
        '<g transform="translate(530, 1005)">' +
            '<rect x="0" y="12" width="92" height="36" rx="6" fill="#b45309" stroke="#5c2606" stroke-width="4"/>' +
            '<line x1="22" y1="12" x2="22" y2="48" stroke="#78350f" stroke-width="3"/><line x1="46" y1="12" x2="46" y2="48" stroke="#78350f" stroke-width="3"/><line x1="70" y1="12" x2="70" y2="48" stroke="#78350f" stroke-width="3"/>' +
        '</g>' +

        '<!-- JARINGAN JALAN TANAH UTAMA ANTAR-BANGUNAN -->' +
        '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M400,440 L400,605 M400,500 L1260,540 L1855,440 M1260,540 L1960,860 M1260,540 L1140,1120 M660,520 L660,1010 M1140,1120 L1940,1170 M800,440 L800,515" stroke="#c89254" stroke-width="76"/>' +
            '<path d="M400,440 L400,605 M400,500 L1260,540 L1855,440 M1260,540 L1960,860 M1260,540 L1140,1120 M660,520 L660,1010 M1140,1120 L1940,1170 M800,440 L800,515" stroke="#eac28a" stroke-width="58"/>' +
        '</g>' +
        '<ellipse cx="1260" cy="545" rx="95" ry="52" fill="#d9a86c" stroke="#b07b3f" stroke-width="4"/>' +
        '<ellipse cx="1260" cy="545" rx="74" ry="38" fill="#f3d6a7"/>' +

        '<!-- TEBING PEMBATAS HUTAN LANGKA TIMUR -->' +
        '<rect x="1570" y="952" width="830" height="52" rx="14" fill="#78716c" stroke="#44403c" stroke-width="5"/>' +
        '<rect x="1560" y="990" width="84" height="115" rx="12" fill="#78716c" stroke="#44403c" stroke-width="5"/>' +
        '<rect x="1560" y="1235" width="84" height="265" rx="12" fill="#78716c" stroke="#44403c" stroke-width="5"/>' +

        '<!-- 1. RUMAH SANCTUARY (MY PET) — BARAT UTARA -->' +
        '<g transform="translate(260, 145)">' +
            '<ellipse cx="140" cy="240" rx="132" ry="26" fill="rgba(25,55,15,0.22)"/>' +
            '<rect x="34" y="114" width="212" height="122" rx="8" fill="#fff3d6" stroke="#7c4a1d" stroke-width="6"/>' +
            '<line x1="34" y1="154" x2="246" y2="154" stroke="#e4c391" stroke-width="4"/><line x1="34" y1="194" x2="246" y2="194" stroke="#e4c391" stroke-width="4"/>' +
            '<rect x="190" y="20" width="30" height="56" rx="4" fill="#b45309" stroke="#5c2606" stroke-width="5"/>' +
            '<polygon points="8,124 140,26 272,124" fill="#dc5a38" stroke="#7c2d12" stroke-width="6" stroke-linejoin="round"/>' +
            '<polygon points="32,116 140,42 248,116" fill="#ef6f4b"/>' +
            '<path d="M112,236 L112,174 A28,28 0 0,1 168,174 L168,236 Z" fill="#8b4d22" stroke="#4e270c" stroke-width="5"/>' +
            '<circle cx="154" cy="206" r="4.5" fill="#fde047"/>' +
            '<rect x="54" y="156" width="38" height="36" rx="5" fill="#bae6fd" stroke="#7c4a1d" stroke-width="4"/>' +
            '<rect x="188" y="156" width="38" height="36" rx="5" fill="#bae6fd" stroke="#7c4a1d" stroke-width="4"/>' +
            '<rect x="108" y="238" width="64" height="16" rx="5" fill="#f59e0b" stroke="#78350f" stroke-width="3"/>' +
        '</g>' +

        '<!-- 2. KEBUN HALAMAN RUMAH (MY GARDEN) — TEPAT DI DEPAN RUMAH! -->' +
        '<g transform="translate(242, 618)">' +
            '<rect x="0" y="12" width="324" height="176" rx="18" fill="#65a30d" stroke="#8c5a2b" stroke-width="7"/>' +
            '<rect x="16" y="26" width="292" height="148" rx="12" fill="#8b5a2b" stroke="#5c3210" stroke-width="4"/>' +
            '<g fill="#71431b" stroke="#5c3210" stroke-width="2.5">' +
                '<rect x="30" y="42" width="58" height="50" rx="6"/><rect x="100" y="42" width="58" height="50" rx="6"/><rect x="170" y="42" width="58" height="50" rx="6"/><rect x="240" y="42" width="54" height="50" rx="6"/>' +
                '<rect x="30" y="106" width="58" height="50" rx="6"/><rect x="100" y="106" width="58" height="50" rx="6"/><rect x="170" y="106" width="58" height="50" rx="6"/><rect x="240" y="106" width="54" height="50" rx="6"/>' +
            '</g>' +
            '<circle cx="59" cy="66" r="10" fill="#facc15"/><circle cx="129" cy="66" r="9" fill="#4ade80"/><circle cx="199" cy="66" r="10" fill="#f43f5e"/><circle cx="267" cy="66" r="9" fill="#38bdf8"/>' +
            '<circle cx="59" cy="130" r="9" fill="#f97316"/><circle cx="129" cy="130" r="10" fill="#a855f7"/><circle cx="199" cy="130" r="9" fill="#4ade80"/><circle cx="267" cy="130" r="10" fill="#facc15"/>' +
            '<rect x="128" y="0" width="68" height="20" rx="5" fill="#f5deb3" stroke="#7c4a1d" stroke-width="3"/>' +
        '</g>' +

        '<!-- 3. DAPUR GIZI (MY KITCHEN) — TIMUR RUMAH -->' +
        '<g transform="translate(690, 185)">' +
            '<ellipse cx="110" cy="186" rx="104" ry="22" fill="rgba(25,55,15,0.22)"/>' +
            '<rect x="160" y="10" width="28" height="56" rx="4" fill="#9a3412" stroke="#431407" stroke-width="4"/>' +
            '<circle cx="174" cy="-2" r="10" fill="#ffffff" opacity="0.72"/><circle cx="188" cy="-16" r="13" fill="#ffffff" opacity="0.52"/>' +
            '<rect x="18" y="72" width="184" height="110" rx="8" fill="#fff7ed" stroke="#9a3412" stroke-width="5"/>' +
            '<polygon points="0,80 110,14 220,80" fill="#f97316" stroke="#7c2d12" stroke-width="5" stroke-linejoin="round"/>' +
            '<rect x="38" y="104" width="46" height="40" rx="5" fill="#fef08a" stroke="#9a3412" stroke-width="4"/>' +
            '<path d="M116,182 L116,120 A26,26 0 0,1 168,120 L168,182 Z" fill="#b45309" stroke="#451a03" stroke-width="4"/>' +
            '<rect x="112" y="184" width="60" height="14" rx="4" fill="#f59e0b" stroke="#78350f" stroke-width="3"/>' +
        '</g>' +

        '<!-- 4. TOKO LAHAN (WORLD SHOP) — ALUN-ALUN TENGAH -->' +
        '<g transform="translate(1140, 270)">' +
            '<ellipse cx="120" cy="190" rx="116" ry="22" fill="rgba(20,50,15,0.22)"/>' +
            '<rect x="22" y="78" width="196" height="110" rx="8" fill="#fef3c7" stroke="#78350f" stroke-width="5"/>' +
            '<rect x="42" y="106" width="156" height="52" rx="6" fill="#92400e" stroke="#451a03" stroke-width="4"/>' +
            '<rect x="36" y="150" width="168" height="16" rx="4" fill="#d97706" stroke="#78350f" stroke-width="3"/>' +
            '<path d="M6,82 L30,28 L210,28 L234,82 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="5" stroke-linejoin="round"/>' +
            '<path d="M46,82 L58,28 L94,28 L86,82 Z" fill="#ffffff"/>' +
            '<path d="M134,82 L140,28 L176,28 L188,82 Z" fill="#ffffff"/>' +
            '<rect x="86" y="190" width="68" height="16" rx="5" fill="#f59e0b" stroke="#78350f" stroke-width="3"/>' +
        '</g>' +

        '<!-- 5. LABORATORIUM SAINS (MY LAB) — UTARA TIMUR -->' +
        '<g transform="translate(1720, 130)">' +
            '<ellipse cx="135" cy="218" rx="126" ry="24" fill="rgba(15,45,35,0.22)"/>' +
            '<path d="M40,86 C40,20 230,20 230,86 Z" fill="#38bdf8" stroke="#0369a1" stroke-width="5"/>' +
            '<path d="M66,82 C72,38 198,38 204,82" fill="#bae6fd" opacity="0.65"/>' +
            '<rect x="22" y="84" width="226" height="132" rx="10" fill="#f8fafc" stroke="#0f766e" stroke-width="5"/>' +
            '<rect x="22" y="84" width="226" height="24" rx="5" fill="#14b8a6"/>' +
            '<rect x="40" y="126" width="48" height="48" rx="6" fill="#ccfbf1" stroke="#0f766e" stroke-width="4"/>' +
            '<rect x="182" y="126" width="48" height="48" rx="6" fill="#ccfbf1" stroke="#0f766e" stroke-width="4"/>' +
            '<path d="M104,216 L104,138 A31,31 0 0,1 166,138 L166,216 Z" fill="#0ea5e9" stroke="#0c4a6e" stroke-width="5"/>' +
            '<rect x="100" y="218" width="70" height="16" rx="5" fill="#14b8a6" stroke="#0f766e" stroke-width="3"/>' +
        '</g>' +

        '<!-- 6. PETERNAKAN (MY FARM) — PADANG TIMUR -->' +
        '<g transform="translate(1820, 580)">' +
            '<ellipse cx="150" cy="226" rx="146" ry="28" fill="rgba(25,55,15,0.22)"/>' +
            '<rect x="18" y="176" width="264" height="56" rx="12" fill="#c99352" stroke="#ffffff" stroke-width="6" stroke-dasharray="16,8"/>' +
            '<path d="M48,110 L82,46 L218,46 L252,110 L252,196 L48,196 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="6" stroke-linejoin="round"/>' +
            '<path d="M32,116 L80,36 L220,36 L268,116" fill="none" stroke="#fef3c7" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<rect x="110" y="120" width="80" height="76" fill="#991b1b" stroke="#fef3c7" stroke-width="5"/>' +
            '<line x1="110" y1="120" x2="190" y2="196" stroke="#fef3c7" stroke-width="4"/><line x1="190" y1="120" x2="110" y2="196" stroke="#fef3c7" stroke-width="4"/>' +
        '</g>' +

        bushesSvg +
    '</svg>';
};

// --- PASANG STRUKTUR CAMERA OPEN-WORLD, HOTBAR, & OVERLAY PETA/SERANGGA ---
window.pastikanOpenWorldDOMTerpasang = function() {
    let modal = document.getElementById("modal-my-world");
    let stage = document.getElementById("myworld-stage");
    if (!modal || !stage) return;

    // 1. Tambahkan tombol 🗺️ Peta di HUD
    let hudRight = modal.querySelector(".myworld-hud-right");
    if (hudRight && !document.getElementById("btn-myworld-map")) {
        let btnMap = document.createElement("button");
        btnMap.type = "button";
        btnMap.id = "btn-myworld-map";
        btnMap.className = "world-map-hud-btn";
        btnMap.innerHTML = "🗺️ Peta";
        btnMap.title = "Buka Peta Seluruh Wilayah My World";
        btnMap.onclick = function() { window.bukaWorldMapOverlay(); };
        hudRight.insertBefore(btnMap, hudRight.firstChild);
    }

    // 2. Pastikan overlay Peta & Tangkap Serangga ada
    let box = modal.querySelector(".myworld-modal-box");
    if (box && !document.getElementById("myworld-map-overlay")) {
        let mapOv = document.createElement("div");
        mapOv.id = "myworld-map-overlay";
        mapOv.className = "myworld-inner-overlay";
        mapOv.style.display = "none";
        mapOv.onclick = function(e) { if (e.target === mapOv) window.tutupWorldMapOverlay(); };
        box.appendChild(mapOv);
    }
    if (box && !document.getElementById("myworld-bugcatch-overlay")) {
        let bugOv = document.createElement("div");
        bugOv.id = "myworld-bugcatch-overlay";
        bugOv.className = "myworld-inner-overlay";
        bugOv.style.display = "none";
        bugOv.onclick = function(e) { if (e.target === bugOv) window.tutupMiniGameSerangga(); };
        box.appendChild(bugOv);
    }

    // 3. Bungkus isi peta ke dalam #myworld-camera-world (2400x1500)
    if (!document.getElementById("myworld-camera-world")) {
        stage.classList.add("is-open-world-viewport");
        stage.style.width = "100%";
        stage.style.height = "100%";

        let camWorld = document.createElement("div");
        camWorld.id = "myworld-camera-world";
        camWorld.className = "myworld-camera-world";
        camWorld.innerHTML = window.bangunSVGOpenWorld2400();

        let treesLayer = document.createElement("div");
        treesLayer.id = "myworld-trees-layer";
        treesLayer.className = "myworld-entities-layer";
        camWorld.appendChild(treesLayer);

        let insectsLayer = document.createElement("div");
        insectsLayer.id = "myworld-insects-layer";
        insectsLayer.className = "myworld-entities-layer";
        camWorld.appendChild(insectsLayer);

        // Pindahkan zona bangunan, ripple, & avatar ke dalam dunia 2400x1500
        let oldBg = stage.querySelector(".myworld-bg-svg");
        if (oldBg) oldBg.remove();

        ["world-zone-pet", "world-zone-garden", "world-zone-kitchen", "world-zone-shop", "world-zone-lab", "world-zone-farm", "world-zone-river", "myworld-click-ripple", "myworld-avatar"].forEach(function(id) {
            let el = document.getElementById(id);
            if (el) camWorld.appendChild(el);
        });

        stage.insertBefore(camWorld, stage.firstChild);
    }

    // 4. Pasang Hotbar Alat Ala Stardew Valley di Bawah Layar
    if (!document.getElementById("myworld-hotbar")) {
        let hb = document.createElement("div");
        hb.id = "myworld-hotbar";
        hb.className = "myworld-hotbar";
        hb.onclick = function(e) { e.stopPropagation(); };
        stage.appendChild(hb);
    }
};

window.renderHotbarAlatWorld = function() {
    let hb = document.getElementById("myworld-hotbar");
    if (!hb) return;
    let isVisit = Boolean(window.modeKunjunganWorld);
    if (isVisit) {
        hb.style.display = "none";
        return;
    }
    hb.style.display = "flex";
    let lb = window.pastikanDataOpenWorldSiswa(sessionStorage.getItem("username"));
    let wd = (lb && lb.myWorldData) ? lb.myWorldData : {};
    let cur = window.myWorldActiveTool || "hand";

    let tools = [
        { id: "hand", ico: "🖐️", lbl: "Jalan",   owned: true },
        { id: "axe",  ico: "🪓", lbl: "Kapak",   owned: Boolean(wd.hasAxe) },
        { id: "net",  ico: "🕸️", lbl: "Jaring",  owned: Boolean(wd.hasBugNet) },
        { id: "rod",  ico: "🎣", lbl: "Pancing", owned: Boolean(wd.hasFishingRod) }
    ];

    hb.innerHTML = tools.map(function(t) {
        return '<button type="button" class="ow-hotbar-slot' + (cur === t.id ? ' active' : '') + (t.owned ? '' : ' locked') + '" onclick="window.pilihAlatHotbarWorld(\'' + t.id + '\')" title="' + t.lbl + '">' +
            '<span>' + t.ico + '</span><small>' + (t.owned ? t.lbl : '🔒') + '</small>' +
        '</button>';
    }).join('') +
    '<div class="ow-wood-counter" title="Stok Kayu Hasil Tebang Pohon">🪵 <b>' + (Number(wd.woodCount) || 0) + '</b></div>';
};

window.pilihAlatHotbarWorld = function(toolId) {
    let lb = window.pastikanDataOpenWorldSiswa(sessionStorage.getItem("username"));
    let wd = (lb && lb.myWorldData) ? lb.myWorldData : {};
    if (toolId === "axe" && !wd.hasAxe) {
        return window.tampilkanToastEnvMyWorld("🔒 Belum punya Kapak! Berjalanlah ke <b>Toko Lahan (🏪 Shop)</b> untuk membelinya.");
    }
    if (toolId === "net" && !wd.hasBugNet) {
        return window.tampilkanToastEnvMyWorld("🔒 Belum punya Jaring Serangga! Berjalanlah ke <b>Toko Lahan (🏪 Shop)</b> untuk membelinya.");
    }
    if (toolId === "rod" && !wd.hasFishingRod) {
        return window.tampilkanToastEnvMyWorld("🔒 Belum punya Joran Pancing! Berjalanlah ke <b>Toko Lahan (🏪 Shop)</b> untuk membelinya.");
    }
    window.myWorldActiveTool = toolId;
    window.renderHotbarAlatWorld();
};

// --- RENDER POHON, GERBANG BUKA JALAN, & SERANGGA LIAR ---
window.ambilDataOpenWorldTampil = function() {
    if (window.modeKunjunganWorld && window.leaderboardSiswaData && window.leaderboardSiswaData[window.modeKunjunganWorld]) {
        let h = window.leaderboardSiswaData[window.modeKunjunganWorld];
        let wd = (h && h.myWorldData) ? h.myWorldData : {};
        return {
            isVisit: true,
            clearedTrees: Array.isArray(wd.clearedTrees) ? wd.clearedTrees : Object.values(wd.clearedTrees || {}),
            unlockedGates: Array.isArray(wd.unlockedGates) ? wd.unlockedGates : Object.values(wd.unlockedGates || {})
        };
    }
    let lb = window.pastikanDataOpenWorldSiswa(sessionStorage.getItem("username"));
    let wd = (lb && lb.myWorldData) ? lb.myWorldData : {};
    return {
        isVisit: false,
        clearedTrees: Array.isArray(wd.clearedTrees) ? wd.clearedTrees : [],
        unlockedGates: Array.isArray(wd.unlockedGates) ? wd.unlockedGates : []
    };
};

window.spawnSeranggaLiarWorld = function() {
    let ctx = window.ambilDataOpenWorldTampil();
    let unlocked = ctx.unlockedGates || [];
    let spots = [
        { x: 25, y: 50, zone: "yard" },
        { x: 37, y: 69, zone: "forest" },
        { x: 50, y: 74, zone: "forest" },
        { x: 58, y: 85, zone: "forest" },
        { x: 32, y: 66, zone: "river" }
    ];
    if (unlocked.indexOf("gate_east_forest") !== -1) {
        spots.push({ x: 76, y: 82, zone: "east_forest" }, { x: 88, y: 78, zone: "east_forest" });
    }
    if (unlocked.indexOf("gate_lotus_bridge") !== -1) {
        spots.push({ x: 11, y: 84, zone: "island" });
    }

    window.myWorldLiveInsects = spots.map(function(sp, idx) {
        let pool = window.MY_WORLD_INSECT_CATALOG.filter(function(b) { return b.zones.indexOf(sp.zone) !== -1; });
        let pick = pool[Math.floor(Math.random() * pool.length)] || window.MY_WORLD_INSECT_CATALOG[0];
        return {
            uid: "bug_" + idx + "_" + Date.now(),
            bugId: pick.id,
            x: sp.x + (Math.random() * 4 - 2),
            y: sp.y + (Math.random() * 4 - 2)
        };
    });
};

window.renderEntitasOpenWorld = function() {
    let treesLayer = document.getElementById("myworld-trees-layer");
    let insectsLayer = document.getElementById("myworld-insects-layer");
    if (!treesLayer || !insectsLayer) return;

    let ctx = window.ambilDataOpenWorldTampil();
    let htmlTrees = '';

    // 1. Pohon Tebang
    window.MY_WORLD_TREES.forEach(function(tr) {
        let isCleared = ctx.clearedTrees.indexOf(tr.id) !== -1;
        if (isCleared) {
            htmlTrees += '<div class="ow-stump" style="left:' + tr.x + '%; top:' + tr.y + '%;" title="Tunggul Pohon">🪵</div>';
            return;
        }
        let svgTree = tr.tipe === "pine"
            ? '<svg viewBox="0 0 80 100" width="66" height="82"><ellipse cx="40" cy="90" rx="22" ry="7" fill="rgba(0,0,0,0.22)"/><rect x="34" y="68" width="12" height="22" fill="#78350f"/><polygon points="40,8 12,50 68,50" fill="#15803d" stroke="#052e16" stroke-width="3"/><polygon points="40,26 8,72 72,72" fill="#166534" stroke="#052e16" stroke-width="3"/></svg>'
            : '<svg viewBox="0 0 80 100" width="66" height="82"><ellipse cx="40" cy="90" rx="24" ry="7" fill="rgba(0,0,0,0.22)"/><rect x="33" y="60" width="14" height="30" rx="4" fill="#78350f"/><circle cx="40" cy="36" r="24" fill="#2e7d32" stroke="#14532d" stroke-width="3"/><circle cx="26" cy="46" r="16" fill="#43a047"/><circle cx="54" cy="46" r="16" fill="#1b5e20"/></svg>';

        htmlTrees += '<button type="button" id="ow-tree-' + tr.id + '" class="ow-tree-actor" style="left:' + tr.x + '%; top:' + tr.y + '%;" onclick="event.stopPropagation(); window.klikPohonOpenWorld(\'' + tr.id + '\')" title="Tebang Pohon (+' + tr.wood + ' Kayu)">' +
            svgTree +
        '</button>';
    });

    // 2. Gerbang / Jembatan Buka Jalan
    window.MY_WORLD_GATES.forEach(function(g) {
        let isOpen = ctx.unlockedGates.indexOf(g.id) !== -1;
        if (g.id === "gate_lotus_bridge") {
            htmlTrees += isOpen
                ? '<div class="ow-built-bridge" style="left:' + g.x + '%; top:' + g.y + '%;"></div>'
                : '<button type="button" class="ow-gate-actor" style="left:' + g.x + '%; top:' + g.y + '%;" onclick="event.stopPropagation(); window.klikGerbangBukaJalan(\'' + g.id + '\')"><span>' + g.ikon + '</span><small>Buka (' + g.woodCost + '🪵 + ' + g.coinCost + '🪙)</small></button>';
        } else if (!isOpen) {
            htmlTrees += '<button type="button" class="ow-gate-actor" style="left:' + g.x + '%; top:' + g.y + '%;" onclick="event.stopPropagation(); window.klikGerbangBukaJalan(\'' + g.id + '\')"><span>' + g.ikon + '</span><small>Buka (' + g.woodCost + '🪵 + ' + g.coinCost + '🪙)</small></button>';
        }
    });

    treesLayer.innerHTML = htmlTrees;

    // 3. Serangga Liar
    if (ctx.isVisit) {
        insectsLayer.innerHTML = '';
        return;
    }
    if (!window.myWorldLiveInsects || window.myWorldLiveInsects.length === 0) {
        window.spawnSeranggaLiarWorld();
    }
    insectsLayer.innerHTML = window.myWorldLiveInsects.map(function(it) {
        let cfg = window.MY_WORLD_INSECT_CATALOG.find(function(b) { return b.id === it.bugId; }) || window.MY_WORLD_INSECT_CATALOG[0];
        return '<button type="button" class="ow-bug-actor rar-' + cfg.rarity.toLowerCase() + '" style="left:' + it.x.toFixed(1) + '%; top:' + it.y.toFixed(1) + '%;" onclick="event.stopPropagation(); window.klikSeranggaOpenWorld(\'' + it.uid + '\')" title="Tangkap ' + cfg.nama + ' (' + cfg.rarity + ')">' +
            '<span class="ow-bug-ico">' + cfg.ikon + '</span>' +
            '<span class="ow-bug-tag">' + cfg.rarity + '</span>' +
        '</button>';
    }).join('');
};

// --- AKSI TEBANG POHON, BUKA JALAN, & TANGKAP SERANGGA ---
window._treeHpMap = {};

window.klikPohonOpenWorld = function(treeId) {
    if (window.modeKunjunganWorld) return;
    let tr = window.MY_WORLD_TREES.find(function(t) { return t.id === treeId; });
    if (!tr) return;

    let ws = window.myWorldState;
    let dist = Math.hypot((ws.x - tr.x) * 24, (ws.y - tr.y) * 15);
    if (dist > 155) {
        ws.targetX = tr.x + (ws.x < tr.x ? -3.2 : 3.2);
        ws.targetY = tr.y + 3.0;
        ws.autoEnterZone = "";
        window._openWorldPendingAction = { type: "tree", id: treeId };
        return;
    }
    window.eksekusiTebangPohon(treeId);
};

window.eksekusiTebangPohon = function(treeId) {
    let tr = window.MY_WORLD_TREES.find(function(t) { return t.id === treeId; });
    let lb = window.pastikanDataOpenWorldSiswa(sessionStorage.getItem("username"));
    if (!tr || !lb) return;
    let wd = lb.myWorldData;
    if (wd.clearedTrees.indexOf(treeId) !== -1) return;

    if (!wd.hasAxe) {
        return window.tampilkanCustomDialog("alert", "Anda belum memiliki Kapak Penebang.\nBerjalanlah ke Toko Lahan (🏪 Shop) untuk membelinya (100 Coin).", null, function() {
            window.pulihkanGerakSetelahOverlayWorld();
        });
    }

    window.myWorldActiveTool = "axe";
    window.renderHotbarAlatWorld();

    let hp = (typeof window._treeHpMap[treeId] === "number") ? window._treeHpMap[treeId] : 3;
    hp--;
    window._treeHpMap[treeId] = hp;

    let el = document.getElementById("ow-tree-" + treeId);
    if (el) {
        el.classList.remove("is-chopped-shake");
        void el.offsetWidth;
        el.classList.add("is-chopped-shake");
    }

    if (hp > 0) {
        window.tampilkanToastEnvMyWorld("🪓 Tebang pohon... (" + (3 - hp) + "/3)");
        return;
    }

    wd.clearedTrees.push(treeId);
    wd.woodCount = (Number(wd.woodCount) || 0) + tr.wood;
    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + 5;
    lb.xp = lb.xpTotal;

    window.simpanDataWorldKeServer(lb);
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.perbaruiBadgeMyWorld();
    window.renderEntitasOpenWorld();
    window.renderHotbarAlatWorld();
    window.tampilkanToastEnvMyWorld("🪵 Pohon berhasil ditebang! Dapat <b>+" + tr.wood + " Kayu</b> &amp; +5 XP!");
};

window.klikGerbangBukaJalan = function(gateId) {
    if (window.modeKunjunganWorld) return;
    let g = window.MY_WORLD_GATES.find(function(x) { return x.id === gateId; });
    if (!g) return;

    let ws = window.myWorldState;
    let dist = Math.hypot((ws.x - g.x) * 24, (ws.y - g.y) * 15);
    if (dist > 210) {
        ws.targetX = g.x + (ws.x < g.x ? -4.2 : 4.2);
        ws.targetY = g.y;
        ws.autoEnterZone = "";
        window._openWorldPendingAction = { type: "gate", id: gateId };
        return;
    }

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataOpenWorldSiswa(uName);
    if (!lb) return;
    let wd = lb.myWorldData;
    if (wd.unlockedGates.indexOf(gateId) !== -1) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    let woodNow = Number(wd.woodCount) || 0;

    if (woodNow < g.woodCost || saldo < g.coinCost) {
        return window.tampilkanCustomDialog("alert", g.nama + "\n\n" + g.deskripsi + "\n\nSyarat Buka Jalan:\n• " + g.woodCost + " 🪵 Kayu (Punya: " + woodNow + ")\n• " + g.coinCost + " 🪙 Coin (Punya: " + saldo.toLocaleString("id-ID") + ")", null, function() {
            window.pulihkanGerakSetelahOverlayWorld();
        });
    }

    window.tampilkanCustomDialog("confirm", "Buka " + g.nama + "?\n\nBiaya: " + g.woodCost + " 🪵 Kayu + " + g.coinCost + " 🪙 Coin.", null, function(yes) {
        if (!yes) { window.pulihkanGerakSetelahOverlayWorld(); return; }
        if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(g.coinCost, "buka_jalan_" + gateId, true)) {
            wd.woodCount = Math.max(0, woodNow - g.woodCost);
            wd.unlockedGates.push(gateId);
            window.simpanDataWorldKeServer(lb);
            window.spawnSeranggaLiarWorld();
            window.perbaruiBadgeMyWorld();
            window.renderEntitasOpenWorld();
            window.renderHotbarAlatWorld();
            window.tampilkanToastEnvMyWorld("🔓 <b>" + g.nama + "</b> terbuka! Wilayah eksplorasi baru kini dapat dijelajahi!");
        }
        window.pulihkanGerakSetelahOverlayWorld();
    });
};

window.klikSeranggaOpenWorld = function(bugUid) {
    if (window.modeKunjunganWorld) return;
    let it = window.myWorldLiveInsects.find(function(b) { return b.uid === bugUid; });
    if (!it) return;

    let ws = window.myWorldState;
    let dist = Math.hypot((ws.x - it.x) * 24, (ws.y - it.y) * 15);
    if (dist > 170) {
        ws.targetX = it.x;
        ws.targetY = it.y;
        ws.autoEnterZone = "";
        window._openWorldPendingAction = { type: "bug", id: bugUid };
        return;
    }
    window.bukaMiniGameSerangga(bugUid);
};

window.bukaMiniGameSerangga = function(bugUid) {
    let it = window.myWorldLiveInsects.find(function(b) { return b.uid === bugUid; });
    let lb = window.pastikanDataOpenWorldSiswa(sessionStorage.getItem("username"));
    if (!it || !lb) return;

    if (!lb.myWorldData.hasBugNet) {
        return window.tampilkanCustomDialog("alert", "Anda belum memiliki Jaring Serangga.\nBerjalanlah ke Toko Lahan (🏪 Shop) untuk membelinya (120 Coin).", null, function() {
            window.pulihkanGerakSetelahOverlayWorld();
        });
    }

    window.myWorldActiveTool = "net";
    window.renderHotbarAlatWorld();

    let cfg = window.MY_WORLD_INSECT_CATALOG.find(function(b) { return b.id === it.bugId; }) || window.MY_WORLD_INSECT_CATALOG[0];
    clearInterval(window._bugCatchTimer);
    window._bugCatchState = {
        uid: bugUid,
        bug: cfg,
        phase: "aiming", // 'aiming' | 'caught' | 'missed'
        needlePos: 5,
        needleDir: 1,
        zoneStart: Math.round(18 + Math.random() * (64 - cfg.zoneWidth)),
        zoneWidth: cfg.zoneWidth
    };

    window.renderMiniGameSeranggaUI();
    let ov = document.getElementById("myworld-bugcatch-overlay");
    if (ov) ov.style.display = "flex";

    window._bugCatchTimer = setInterval(function() {
        let cur = window._bugCatchState;
        if (!cur || cur.phase !== "aiming") { clearInterval(window._bugCatchTimer); return; }
        cur.needlePos += cur.needleDir * cur.bug.speed;
        if (cur.needlePos >= 98) { cur.needlePos = 98; cur.needleDir = -1; }
        else if (cur.needlePos <= 2) { cur.needlePos = 2; cur.needleDir = 1; }
        let nEl = document.getElementById("ow-bug-needle");
        if (nEl) nEl.style.left = Math.round(cur.needlePos) + "%";
    }, 26);
};

window.tutupMiniGameSerangga = function() {
    clearInterval(window._bugCatchTimer);
    window._bugCatchTimer = null;
    window._bugCatchState = null;
    let ov = document.getElementById("myworld-bugcatch-overlay");
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

window.renderMiniGameSeranggaUI = function() {
    let ov = document.getElementById("myworld-bugcatch-overlay");
    let st = window._bugCatchState;
    if (!ov || !st) return;
    let b = st.bug;

    let bodyHtml = '';
    if (st.phase === "aiming") {
        bodyHtml =
            '<div class="ow-bug-arena">' +
                '<div style="font-size:44px;">' + b.ikon + '</div>' +
                '<div style="color:#ffffff; font-weight:900; font-size:13px;">' + b.nama + ' (' + b.rarity + ')</div>' +
                '<div class="fish-gauge-track">' +
                    '<div class="fish-gauge-zone rar-' + b.rarity.toLowerCase() + '" style="left:' + st.zoneStart + '%; width:' + st.zoneWidth + '%;">AYUNKAN!</div>' +
                    '<div id="ow-bug-needle" class="fish-gauge-needle" style="left:' + Math.round(st.needlePos) + '%;"></div>' +
                '</div>' +
            '</div>' +
            '<button type="button" class="mypet-green-cta" style="max-width:250px; margin:0 auto;" onclick="window.ayunkanJaringSerangga()">🕸️ AYUNKAN JARING!</button>';
    } else if (st.phase === "caught") {
        bodyHtml =
            '<div class="fish-catch-card rar-' + b.rarity.toLowerCase() + '">' +
                '<span class="ws-rar-dot rar-' + b.rarity.toLowerCase() + '">' + b.rarity.toUpperCase() + '</span>' +
                '<div style="font-size:46px; margin:4px 0;">' + b.ikon + '</div>' +
                '<div style="font-size:16px; font-weight:900; color:#0f172a;">' + b.nama + '</div>' +
                '<div style="font-size:11px; color:#64748b; margin-bottom:8px;"><i>' + b.latin + '</i> • Ordo: <b>' + b.ordo + '</b> • Nilai: 🪙 ' + b.coin + ' Coin</div>' +
                '<div class="garden-quiz-feedback ok" style="width:100%; box-sizing:border-box;">🎒 Tersimpan di Tas Serangga (+⭐ ' + b.xp + ' XP)! Berjalanlah ke <b>Toko Lahan (🏪 Shop)</b> untuk menjualnya.</div>' +
                '<button type="button" class="mypet-green-cta sm" style="max-width:220px; margin-top:8px;" onclick="window.tutupMiniGameSerangga()">✅ Lanjut Eksplorasi</button>' +
            '</div>';
    } else {
        bodyHtml =
            '<div class="ow-bug-arena"><div style="font-size:40px;">💨' + b.ikon + '</div><p class="fish-stage-msg">Serangga terbang kabur! Ayunkan jaring tepat di zona target.</p></div>' +
            '<button type="button" class="mypet-amber-cta sm" style="max-width:220px; margin:0 auto;" onclick="window.tutupMiniGameSerangga()">Lanjut Mencari</button>';
    }

    ov.innerHTML =
        '<div class="ws-modal-card" style="max-width:460px; border-color:#15803d;">' +
            '<div class="ws-modal-head" style="background:linear-gradient(180deg,#bbf7d0,#22c55e); border-bottom-color:#14532d;">' +
                '<div><strong style="color:#052e16;">🕸️ Menangkap Serangga</strong><small style="color:#14532d;">Eksplorasi Taksonomi &amp; Keanekaragaman Hayati</small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupMiniGameSerangga()">✕</button>' +
            '</div>' +
            '<div class="world-shop-body" style="display:flex; flex-direction:column; gap:10px; align-items:center;">' + bodyHtml + '</div>' +
        '</div>';
};

window.ayunkanJaringSerangga = function() {
    let st = window._bugCatchState;
    if (!st || st.phase !== "aiming") return;
    clearInterval(window._bugCatchTimer);

    let hit = (st.needlePos >= st.zoneStart && st.needlePos <= (st.zoneStart + st.zoneWidth));
    window.myWorldLiveInsects = window.myWorldLiveInsects.filter(function(x) { return x.uid !== st.uid; });

    if (hit) {
        st.phase = "caught";
        let lb = window.pastikanDataOpenWorldSiswa(sessionStorage.getItem("username"));
        if (lb) {
            let b = st.bug;
            lb.myWorldData.insectInventory[b.id] = (Number(lb.myWorldData.insectInventory[b.id]) || 0) + 1;
            lb.myWorldData.totalInsectsCaught = (Number(lb.myWorldData.totalInsectsCaught) || 0) + 1;
            lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + b.xp;
            lb.xp = lb.xpTotal;
            window.simpanDataWorldKeServer(lb);
            if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
            window.perbaruiBadgeMyWorld();
        }
    } else {
        st.phase = "missed";
    }

    if (window.myWorldLiveInsects.length < 2) {
        setTimeout(function() { window.spawnSeranggaLiarWorld(); window.renderEntitasOpenWorld(); }, 1800);
    } else {
        window.renderEntitasOpenWorld();
    }
    window.renderMiniGameSeranggaUI();
};

// --- MODAL PETA DUNIA (WORLD MAP OVERLAY) ---
window.bukaWorldMapOverlay = function() {
    let ov = document.getElementById("myworld-map-overlay");
    if (!ov) return;
    let ws = window.myWorldState;
    let ctx = window.ambilDataOpenWorldTampil();
    let eastOpen = ctx.unlockedGates.indexOf("gate_east_forest") !== -1;
    let islandOpen = ctx.unlockedGates.indexOf("gate_lotus_bridge") !== -1;

    let pins = [
        { x: 16.6, y: 18, lbl: "🏡 My Pet" },
        { x: 16.8, y: 47, lbl: "🌱 My Garden" },
        { x: 33.3, y: 19, lbl: "🍳 My Kitchen" },
        { x: 52.5, y: 24, lbl: "🏪 Shop" },
        { x: 77.3, y: 16, lbl: "🧪 My Lab" },
        { x: 82.1, y: 47, lbl: "🐄 My Farm" },
        { x: 24.0, y: 69, lbl: "🎣 Sungai" },
        { x: 49.0, y: 78, lbl: "🌲 Hutan Tengah" },
        { x: 83.0, y: 80, lbl: (eastOpen ? "🦋 Hutan Langka" : "🔒 Hutan Langka") },
        { x: 10.0, y: 86, lbl: (islandOpen ? "🪷 Pulau Teratai" : "🔒 Pulau Teratai") }
    ];

    let pinsHtml = pins.map(function(p) {
        return '<div class="ow-minimap-pin" style="left:' + p.x + '%; top:' + p.y + '%;">' + p.lbl + '</div>';
    }).join('');

    ov.innerHTML =
        '<div class="ws-modal-card" style="max-width:640px; border-color:#78350f;">' +
            '<div class="ws-modal-head">' +
                '<div><strong>🗺️ Peta Wilayah My World</strong><small>Titik merah berkedip menunjukkan posisi avatar Anda saat ini.</small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupWorldMapOverlay()">✕</button>' +
            '</div>' +
            '<div class="world-shop-body">' +
                '<div class="ow-worldmap-canvas">' +
                    '<div class="ow-wm-river"></div>' +
                    '<div class="ow-wm-island' + (islandOpen ? '' : ' is-locked') + '"></div>' +
                    '<div class="ow-wm-eastforest' + (eastOpen ? '' : ' is-locked') + '"></div>' +
                    pinsHtml +
                    '<div class="ow-minimap-player" style="left:' + ws.x.toFixed(1) + '%; top:' + ws.y.toFixed(1) + '%;" title="Posisi Anda"></div>' +
                '</div>' +
                '<div class="ow-wm-legend">' +
                    '<span>🔴 Posisi Anda</span>' +
                    '<span>🌲 Pohon Tersisa: <b>' + (window.MY_WORLD_TREES.length - ctx.clearedTrees.length) + '/' + window.MY_WORLD_TREES.length + '</b></span>' +
                    '<span>🔓 Jalur Terbuka: <b>' + ctx.unlockedGates.length + '/' + window.MY_WORLD_GATES.length + '</b></span>' +
                '</div>' +
            '</div>' +
        '</div>';

    ov.style.display = "flex";
};

window.tutupWorldMapOverlay = function() {
    let ov = document.getElementById("myworld-map-overlay");
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

// --- UPGRADE WORLD SHOP: TAMBAH KAPAK, JARING SERANGGA, & JUAL SERANGGA/KAYU ---
window.beliAlatEksplorasiShop = function(toolKey) {
    let item = window.MY_WORLD_SHOP_ITEMS[toolKey];
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataOpenWorldSiswa(uName);
    if (!item || !lb) return;
    let flag = toolKey === "axe" ? "hasAxe" : "hasBugNet";
    if (lb.myWorldData[flag]) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < item.harga) {
        return window.tampilkanCustomDialog("alert", "Saldo Coin belum mencukupi untuk membeli " + item.nama + " (" + item.harga + " Coin).", null, null);
    }
    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(item.harga, "beli_" + item.id, true)) {
        lb.myWorldData[flag] = true;
        window.simpanDataWorldKeServer(lb);
        window.perbaruiBadgeMyWorld();
        window.renderHotbarAlatWorld();
        window.renderWorldShopUI();
        window.tampilkanCustomDialog("alert", item.ikon + " Berhasil membeli " + item.nama + "! Alat sudah aktif di hotbar bawah peta.", null, null);
    }
};

window.jualSeranggaAtauKayuWorld = function(tipe, idOrAll) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataOpenWorldSiswa(uName);
    if (!lb) return;
    let wd = lb.myWorldData;
    let gainCoin = 0, gainXp = 0;

    if (tipe === "wood") {
        let wQty = Number(wd.woodCount) || 0;
        if (wQty <= 0) return;
        let sellQty = idOrAll === "all" ? wQty : 1;
        wd.woodCount = Math.max(0, wQty - sellQty);
        gainCoin = sellQty * 15;
    } else if (tipe === "bug") {
        let inv = wd.insectInventory || {};
        if (idOrAll === "all") {
            window.MY_WORLD_INSECT_CATALOG.forEach(function(b) {
                let q = Number(inv[b.id]) || 0;
                if (q > 0) { gainCoin += q * b.coin; delete inv[b.id]; }
            });
        } else {
            let bCfg = window.MY_WORLD_INSECT_CATALOG.find(function(x) { return x.id === idOrAll; });
            let q = Number(inv[idOrAll]) || 0;
            if (!bCfg || q <= 0) return;
            inv[idOrAll] = q - 1;
            if (inv[idOrAll] <= 0) delete inv[idOrAll];
            gainCoin = bCfg.coin;
        }
    }

    if (gainCoin <= 0) return;
    lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + gainCoin;
    lb.xpTersedia = lb.coin;
    if (gainXp > 0) { lb.xpTotal = (Number(lb.xpTotal) || 0) + gainXp; lb.xp = lb.xpTotal; }

    window.simpanDataWorldKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.perbaruiBadgeMyWorld();
    window.renderHotbarAlatWorld();
    window.renderWorldShopUI();
};

const _origRenderWorldShopV6 = window.renderWorldShopUI;
window.renderWorldShopUI = function() {
    let ov = document.getElementById("myworld-shop-overlay");
    if (!ov) return;
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataOpenWorldSiswa(uName);
    if (!lb) return;
    let wd = lb.myWorldData;
    let tab = window.activeWorldShopTab || "gear";

    if (tab !== "gear" && tab !== "bugs") {
        _origRenderWorldShopV6();
        // Sisipkan tab 🦋 Serangga ke bar tab World Shop
        let tabsRow = ov.querySelector(".ws-tabs-row");
        if (tabsRow && !tabsRow.querySelector('[data-ws-tab="bugs"]')) {
            let totalBug = Object.values(wd.insectInventory || {}).reduce(function(a, b) { return a + (Number(b) || 0); }, 0);
            let btnBug = document.createElement("button");
            btnBug.type = "button";
            btnBug.setAttribute("data-ws-tab", "bugs");
            btnBug.className = "ws-tab-btn";
            btnBug.innerHTML = "🦋 Serangga (" + totalBug + ")";
            btnBug.onclick = function() { window.gantiTabWorldShop("bugs"); };
            tabsRow.insertBefore(btnBug, tabsRow.children[2] || null);
        }
        return;
    }

    let totalIkan = Object.values(wd.fishInventory || {}).reduce(function(a, b) { return a + (Number(b) || 0); }, 0);
    let totalBug = Object.values(wd.insectInventory || {}).reduce(function(a, b) { return a + (Number(b) || 0); }, 0);
    let bodyHtml = '';

    if (tab === "gear") {
        let toolsList = [
            { key: "rod",    item: window.MY_WORLD_SHOP_ITEMS.rod,    owned: wd.hasFishingRod, fn: "window.beliPancingWorldShop()" },
            { key: "axe",    item: window.MY_WORLD_SHOP_ITEMS.axe,    owned: wd.hasAxe,        fn: "window.beliAlatEksplorasiShop('axe')" },
            { key: "bugNet", item: window.MY_WORLD_SHOP_ITEMS.bugNet, owned: wd.hasBugNet,     fn: "window.beliAlatEksplorasiShop('bugNet')" }
        ];
        bodyHtml = '<div class="ws-tools-3grid">' + toolsList.map(function(t) {
            return '<div class="ws-item-card">' +
                '<div class="cozy-card-top-row"><span class="cozy-tag green">Alat Permanen</span><span class="cozy-stock-lbl">' + (t.owned ? '✓ Dimiliki' : 'Tersedia') + '</span></div>' +
                '<div style="font-size:40px; margin:6px 0;">' + t.item.ikon + '</div>' +
                '<div class="cozy-item-name" style="font-size:12.5px;">' + t.item.nama + '</div>' +
                '<div class="cozy-item-sub" style="flex:1;">' + t.item.deskripsi + '</div>' +
                (t.owned
                    ? '<button type="button" class="mypet-gray-cta sm" disabled>✓ Sudah Dimiliki</button>'
                    : '<button type="button" class="mypet-amber-cta sm" onclick="' + t.fn + '">🪙 Beli (' + t.item.harga + ' Coin)</button>') +
            '</div>';
        }).join('') + '</div>';
    } else {
        let woodQty = Number(wd.woodCount) || 0;
        let bugCards = window.MY_WORLD_INSECT_CATALOG.map(function(b) {
            let q = Number((wd.insectInventory || {})[b.id]) || 0;
            return '<div class="ws-item-card rar-' + b.rarity.toLowerCase() + '">' +
                '<div class="cozy-card-top-row"><span class="cozy-tag neutral">' + b.rarity + '</span><span class="cozy-stock-lbl">Tas: <b>x' + q + '</b></span></div>' +
                '<div style="font-size:34px; margin:4px 0;">' + b.ikon + '</div>' +
                '<div class="cozy-item-name" style="font-size:12px;">' + b.nama + '</div>' +
                '<div class="garden-latin-name"><i>' + b.latin + '</i></div>' +
                '<div class="garden-shop-meta">🪙 ' + b.coin + ' Coin / ekor</div>' +
                '<button type="button" class="' + (q > 0 ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (q > 0 ? '' : 'disabled') + ' onclick="window.jualSeranggaAtauKayuWorld(\'bug\', \'' + b.id + '\')">' + (q > 0 ? ('💰 Jual 1 (+🪙 ' + b.coin + ')') : 'Kosong') + '</button>' +
            '</div>';
        }).join('');

        bodyHtml =
            '<div class="ws-sell-all-bar">' +
                '<span>🪵 Kayu di Tas: <b>' + woodQty + '</b> (15 Coin/kayu) • 🦋 Serangga: <b>' + totalBug + '</b></span>' +
                '<div style="display:flex; gap:6px; flex-wrap:wrap;">' +
                    (woodQty > 0 ? '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:5px 11px;" onclick="window.jualSeranggaAtauKayuWorld(\'wood\', \'1\')">🪵 Jual 1 Kayu</button>' : '') +
                    (totalBug > 0 ? '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:5px 11px;" onclick="window.jualSeranggaAtauKayuWorld(\'bug\', \'all\')">💰 Jual Semua Serangga</button>' : '') +
                '</div>' +
            '</div>' +
            '<div class="ws-fish-sell-grid">' + bugCards + '</div>';
    }

    ov.innerHTML =
        '<div class="ws-modal-card">' +
            '<div class="ws-modal-head">' +
                '<div><strong>🏪 Toko Lahan (World Shop)</strong><small>Perlengkapan eksplorasi, Pasar Ikan, Serangga, Avatar, dan Bahan Dapur.</small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupWorldShop()">✕</button>' +
            '</div>' +
            '<div class="ws-tabs-row">' +
                '<button type="button" class="ws-tab-btn' + (tab === "gear" ? ' active' : '') + '" onclick="window.gantiTabWorldShop(\'gear\')">🛠️ Alat</button>' +
                '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'sell\')">🐟 Ikan (' + totalIkan + ')</button>' +
                '<button type="button" data-ws-tab="bugs" class="ws-tab-btn' + (tab === "bugs" ? ' active' : '') + '" onclick="window.gantiTabWorldShop(\'bugs\')">🦋 Serangga (' + totalBug + ')</button>' +
                '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'avatar\')">👕 Avatar</button>' +
                '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'pantry\')">🧺 Bahan</button>' +
            '</div>' +
            '<div class="world-shop-body">' + bodyHtml + '</div>' +
        '</div>';
};

// --- KAMERA MENGIKUTI AVATAR, KLIK PETA OPEN-WORLD, & COLLISION DINAMIS ---
window.perbaruiKameraOpenWorld = function() {
    let stage = document.getElementById("myworld-stage");
    let worldEl = document.getElementById("myworld-camera-world");
    if (!stage || !worldEl) return;

    let vpW = stage.clientWidth || 800;
    let vpH = stage.clientHeight || 480;
    let worldW = window.MY_WORLD_OPEN_DIM.w;
    let worldH = window.MY_WORLD_OPEN_DIM.h;

    let ws = window.myWorldState;
    let avPxX = (ws.x / 100) * worldW;
    let avPxY = (ws.y / 100) * worldH;

    let maxCamX = Math.max(0, worldW - vpW);
    let maxCamY = Math.max(0, worldH - vpH);
    let camX = Math.max(0, Math.min(maxCamX, avPxX - vpW / 2));
    let camY = Math.max(0, Math.min(maxCamY, avPxY - vpH / 2));

    window.myWorldCamera.x = camX;
    window.myWorldCamera.y = camY;
    worldEl.style.transform = "translate3d(" + (-camX.toFixed(1)) + "px, " + (-camY.toFixed(1)) + "px, 0)";
};

window.sesuaikanRasioPetaMyWorld = function() {
    let stage = document.getElementById("myworld-stage");
    if (stage && stage.classList.contains("is-open-world-viewport")) {
        stage.style.width = "100%";
        stage.style.height = "100%";
        window.perbaruiKameraOpenWorld();
    }
};

window.klikPetaMyWorld = function(e) {
    let stage = document.getElementById("myworld-stage");
    let modal = document.getElementById("modal-my-world");
    if (!stage) return;
    let rect = stage.getBoundingClientRect();
    let isCssRotated = Boolean(
        document.body.classList.contains("world-force-rotated") ||
        (modal && modal.classList.contains("myworld-css-rotated"))
    );

    let visX = isCssRotated ? (e.clientY - rect.top) : (e.clientX - rect.left);
    let visY = isCssRotated ? (rect.right - e.clientX) : (e.clientY - rect.top);
    let worldPxX = visX + (window.myWorldCamera ? window.myWorldCamera.x : 0);
    let worldPxY = visY + (window.myWorldCamera ? window.myWorldCamera.y : 0);

    let px = Math.max(2.5, Math.min(97.5, (worldPxX / window.MY_WORLD_OPEN_DIM.w) * 100));
    let py = Math.max(6.0, Math.min(96.0, (worldPxY / window.MY_WORLD_OPEN_DIM.h) * 100));

    let ws = window.myWorldState;
    ws.targetX = px;
    ws.targetY = py;
    ws.autoEnterZone = "";
    window._openWorldPendingAction = null;

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

window.apakahPosisiMenabrakBangunan = function(x, y) {
    let list = window.MY_WORLD_OBSTACLES || [];
    for (let i = 0; i < list.length; i++) {
        let ob = list[i];
        if (x > ob.x1 && x < ob.x2 && y > ob.y1 && y < ob.y2) return true;
    }

    let ctx = window.ambilDataOpenWorldTampil();

    // Cek Sungai Timur Pulau Teratai (bebas dilalui di area jembatan bila sudah dibuka)
    if (x > 16.5 && x < 24.5 && y >= 77.5 && y <= 100) {
        let bridgeOpen = ctx.unlockedGates.indexOf("gate_lotus_bridge") !== -1;
        let onBridge = (y >= 82.8 && y <= 89.2);
        if (!bridgeOpen || !onBridge) return true;
    }

    // Cek Gerbang Hutan Langka Timur
    let gateEast = window.MY_WORLD_GATES[0];
    if (gateEast && ctx.unlockedGates.indexOf(gateEast.id) === -1) {
        let gb = gateEast.box;
        if (x > gb.x1 && x < gb.x2 && y > gb.y1 && y < gb.y2) return true;
    }

    // Cek Pohon yang belum ditebang
    for (let t = 0; t < window.MY_WORLD_TREES.length; t++) {
        let tr = window.MY_WORLD_TREES[t];
        if (ctx.clearedTrees.indexOf(tr.id) !== -1) continue;
        if (Math.abs(x - tr.x) < 1.35 && Math.abs(y - tr.y) < 1.9) return true;
    }

    return false;
};

window.gerakkanAvatarDenganTabrakan = function(ws, dx, dy) {
    let oldX = ws.x;
    let oldY = ws.y;
    let tryX = Math.max(2.5, Math.min(97.5, oldX + dx));
    if (!window.apakahPosisiMenabrakBangunan(tryX, oldY)) ws.x = tryX;
    let tryY = Math.max(6.0, Math.min(96.0, oldY + dy));
    if (!window.apakahPosisiMenabrakBangunan(ws.x, tryY)) ws.y = tryY;
    return Math.hypot((ws.x - oldX) * 24, (ws.y - oldY) * 15);
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
    if (flip) flip.classList.toggle("facing-left", !ws.facingRight);
    window.perbaruiKameraOpenWorld();
};

// Override Loop Gerak untuk kecepatan seimbang pada peta 2400x1500 & eksekusi aksi pending (pohon/gerbang/serangga)
window.mulaiLoopGerakMyWorld = function() {
    let ws = window.myWorldState;
    if (ws.rafId) cancelAnimationFrame(ws.rafId);
    ws.lastFrameMs = performance.now();
    let stuckTimer = 0;

    function tick(nowMs) {
        if (!ws.isOpen) return;
        let dt = Math.min(0.05, Math.max(0.004, (nowMs - ws.lastFrameMs) / 1000));
        ws.lastFrameMs = nowMs;

        if (window.apakahOverlayDalamWorldTerbuka()) {
            ws.keys = { up: false, down: false, left: false, right: false };
            ws.targetX = null;
            ws.targetY = null;
            ws.autoEnterZone = "";
            window.renderPosisiAvatarMyWorld(false);
            ws.rafId = requestAnimationFrame(tick);
            return;
        }

        let speedPx = 310; // 310 px/detik — terasa pas & lincah di peta 2400x1500
        let vx = 0, vy = 0;
        if (ws.keys.left) vx -= 1;
        if (ws.keys.right) vx += 1;
        if (ws.keys.up) vy -= 1;
        if (ws.keys.down) vy += 1;

        let moving = false;

        if (vx !== 0 || vy !== 0) {
            stuckTimer = 0;
            window._openWorldPendingAction = null;
            let len = Math.hypot(vx, vy);
            let dxPct = ((vx / len) * speedPx * dt / window.MY_WORLD_OPEN_DIM.w) * 100;
            let dyPct = ((vy / len) * speedPx * dt / window.MY_WORLD_OPEN_DIM.h) * 100;
            let movedPx = window.gerakkanAvatarDenganTabrakan(ws, dxPct, dyPct);
            if (vx !== 0) ws.facingRight = vx > 0;
            moving = movedPx > 0.3;
        } else if (ws.targetX !== null && ws.targetY !== null) {
            let dxPx = ((ws.targetX - ws.x) / 100) * window.MY_WORLD_OPEN_DIM.w;
            let dyPx = ((ws.targetY - ws.y) / 100) * window.MY_WORLD_OPEN_DIM.h;
            let distPx = Math.hypot(dxPx, dyPx);
            let stepPx = speedPx * dt;

            if (distPx <= stepPx + 8) {
                window.gerakkanAvatarDenganTabrakan(ws, ws.targetX - ws.x, ws.targetY - ws.y);
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
                if (window._openWorldPendingAction) {
                    let act = window._openWorldPendingAction;
                    window._openWorldPendingAction = null;
                    if (act.type === "tree") window.eksekusiTebangPohon(act.id);
                    else if (act.type === "gate") window.klikGerbangBukaJalan(act.id);
                    else if (act.type === "bug") window.bukaMiniGameSerangga(act.id);
                }
            } else {
                let sDxPct = ((dxPx / distPx) * stepPx / window.MY_WORLD_OPEN_DIM.w) * 100;
                let sDyPct = ((dyPx / distPx) * stepPx / window.MY_WORLD_OPEN_DIM.h) * 100;
                let movedPx = window.gerakkanAvatarDenganTabrakan(ws, sDxPct, sDyPct);
                if (Math.abs(dxPx) > 4) ws.facingRight = dxPx > 0;

                if (movedPx < 0.6) {
                    stuckTimer += dt;
                    if (stuckTimer > 0.28) {
                        ws.targetX = null;
                        ws.targetY = null;
                        ws.autoEnterZone = "";
                        window._openWorldPendingAction = null;
                        stuckTimer = 0;
                    }
                } else {
                    stuckTimer = 0;
                    moving = true;
                }
            }
        }

        window.renderPosisiAvatarMyWorld(moving);

        // Deteksi jarak ke pintu gedung dalam satuan piksel
        let closestZone = null;
        let closestPx = 9999;
        window.MY_WORLD_ZONES.forEach(function(z) {
            let dPx = Math.hypot((ws.x - z.doorX) * 24, (ws.y - z.doorY) * 15);
            if (dPx < closestPx) { closestPx = dPx; closestZone = z; }
        });

        let nowWall = Date.now();
        if (closestZone && closestPx < 48 && nowWall >= ws.exitCooldownUntil && moving) {
            window.masukKeZonaMyWorld(closestZone.id);
            if (ws.isOpen) ws.rafId = requestAnimationFrame(tick);
            return;
        }

        let newNear = (closestZone && closestPx < 120) ? closestZone.id : "";
        if (newNear !== ws.nearZoneId) {
            ws.nearZoneId = newNear;
            document.querySelectorAll(".world-zone-btn").forEach(function(b) { b.classList.remove("is-near"); });
            let hintEl = document.getElementById("myworld-enter-hint");
            let btnEnter = document.getElementById("btn-myworld-enter-now");

            if (newNear && closestZone) {
                let zBtn = document.getElementById("world-zone-" + newNear);
                if (zBtn) zBtn.classList.add("is-near");
                if (hintEl) hintEl.innerHTML = "📍 Di depan <b>" + closestZone.nama + "</b>";
                if (btnEnter) { btnEnter.style.display = "inline-flex"; btnEnter.innerText = "🚪 Masuk " + closestZone.labelSingkat; }
            } else {
                if (hintEl) hintEl.innerHTML = "🗺️ Jelajahi My World! Klik <b>Peta</b> untuk melihat seluruh wilayah, tebang pohon, &amp; tangkap serangga!";
                if (btnEnter) btnEnter.style.display = "none";
            }
        }

        ws.rafId = requestAnimationFrame(tick);
    }

    ws.rafId = requestAnimationFrame(tick);
};

// Update pengecekan overlay terbuka & hook buka/tutup modal My World
window.apakahOverlayDalamWorldTerbuka = function() {
    let ids = ["myworld-shop-overlay", "myworld-fishing-overlay", "myworld-kitchen-overlay", "myworld-map-overlay", "myworld-bugcatch-overlay", "modal-custom-dialog"];
    return ids.some(function(id) {
        let el = document.getElementById(id);
        return Boolean(el && el.style.display && el.style.display !== "none");
    });
};

(function pasangHookOpenWorldV7() {
    if (typeof window.bukaModalMyWorld === "function" && !window.bukaModalMyWorld._v7OpenWorld) {
        let origOpen = window.bukaModalMyWorld;
        window.bukaModalMyWorld = function(resetToCenter, keepVisitMode) {
            origOpen.apply(this, arguments);
            window.pastikanOpenWorldDOMTerpasang();
            if (resetToCenter) {
                window.myWorldState.x = 24;
                window.myWorldState.y = 35;
            }
            window.pastikanDataOpenWorldSiswa(sessionStorage.getItem("username"));
            window.spawnSeranggaLiarWorld();
            window.renderEntitasOpenWorld();
            window.renderHotbarAlatWorld();
            window.renderPosisiAvatarMyWorld(false);
            setTimeout(window.perbaruiKameraOpenWorld, 60);
        };
        window.bukaModalMyWorld._v7OpenWorld = true;
    }

    if (typeof window.tutupModalMyWorld === "function" && !window.tutupModalMyWorld._v7CloseWorld) {
        let origClose = window.tutupModalMyWorld;
        window.tutupModalMyWorld = function() {
            window.tutupWorldMapOverlay();
            window.tutupMiniGameSerangga();
            origClose.apply(this, arguments);
        };
        window.tutupModalMyWorld._v7CloseWorld = true;
    }
})();
// =========================================================================
// 12. REVISI BESAR MY WORLD STARDEW VALLEY:
//     - Akses Garden dari Semua Sisi Pagar
//     - Analog Joystick 360° (Kompatibel Rotasi 90° iPhone)
//     - Minimap Preview Kiri Atas (Gaya Mobile Legends)
//     - Serangga Murah + Ikon Bersih Tanpa Teks Rarity
//     - Hujan Ringan & Tidak Berlebihan
//     - Umpan Pancing + Kapak Habis Pakai (50 Pohon)
//     - Sumur & Tandon Air Manual (Suplai My Garden & My Farm)
//     - Peternakan Lebah (Real-Time Madu)
//     - Dekorasi My World (Beli di Shop & Atur Lokasi Peletakan)
// =========================================================================

// 1. REVISI HARGA SERANGGA & TAMBAHAN ITEM SHOP (UMPAN, DEKORASI, MADU)
window.MY_WORLD_INSECT_CATALOG = [
    { id: "kupu_kuning",     nama: "Kupu-Kupu Kuning",       latin: "Eurema hecabe",          ordo: "Lepidoptera", rarity: "Common",    coin: 12,  xp: 4,  zoneWidth: 34, speed: 2.0, ikon: "🦋", zones: ["yard", "forest"] },
    { id: "capung_hijau",    nama: "Capung Jarum Hijau",     latin: "Agriocnemis femina",     ordo: "Odonata",     rarity: "Common",    coin: 15,  xp: 5,  zoneWidth: 30, speed: 2.2, ikon: "🪰", zones: ["river", "yard"] },
    { id: "belalang_sembah", nama: "Belalang Sembah",        latin: "Hierodula vitrea",       ordo: "Mantodea",    rarity: "Uncommon",  coin: 28,  xp: 9,  zoneWidth: 24, speed: 2.6, ikon: "🦗", zones: ["forest"] },
    { id: "kumbang_badak",   nama: "Kumbang Badak",          latin: "Oryctes rhinoceros",     ordo: "Coleoptera",  rarity: "Rare",      coin: 52,  xp: 16, zoneWidth: 19, speed: 3.1, ikon: "🪲", zones: ["forest", "east_forest"] },
    { id: "kupu_sayap",      nama: "Kupu-Kupu Sayap Burung", latin: "Ornithoptera priamus",   ordo: "Lepidoptera", rarity: "Rare",      coin: 68,  xp: 20, zoneWidth: 17, speed: 3.3, ikon: "🦋", zones: ["east_forest", "island"] },
    { id: "kumbang_emas",    nama: "Kumbang Rusa Emas",      latin: "Cyclommatus metallifer", ordo: "Coleoptera",  rarity: "Legendary", coin: 140, xp: 40, zoneWidth: 13, speed: 3.9, ikon: "🪲", zones: ["east_forest", "island"] }
];

window.MY_WORLD_SHOP_ITEMS.bait = {
    id: "umpan_cacing",
    nama: "Umpan Pancing (Isi 5)",
    harga: 20,
    qty: 5,
    ikon: "🪱",
    deskripsi: "Wajib digunakan 1 umpan setiap kali melempar kail di Sungai My World."
};

window.MY_WORLD_SHOP_ITEMS.axe.deskripsi = "Menebang pohon hingga 50 kali pakai (dapat dibeli lagi jika aus) untuk kayu & buka jalan.";

window.MY_WORLD_DECOR_CATALOG = [
    { id: "wd_lamp",     nama: "Lentera Taman",       harga: 45,  ikon: "🏮", deskripsi: "Lampu kayu hangat yang menyala cantik di malam hari." },
    { id: "wd_bench",    nama: "Bangku Kayu",         harga: 55,  ikon: "🪑", deskripsi: "Tempat duduk santai di tepi jalan atau halaman rumah." },
    { id: "wd_flower",   nama: "Pot Bunga Meriah",    harga: 40,  ikon: "🪴", deskripsi: "Pot bunga hias memperindah sekitar kebun dan rumah." },
    { id: "wd_fountain", nama: "Air Mancur Batu",     harga: 160, ikon: "⛲", deskripsi: "Hiasan air mancur klasik untuk alun-alun My World." },
    { id: "wd_mushroom", nama: "Jamur Hias Raksasa",  harga: 85,  ikon: "🍄", deskripsi: "Jamur merah dekoratif bergaya Stardew Valley." },
    { id: "wd_owl",      nama: "Patung Burung Hantu", harga: 110, ikon: "🦉", deskripsi: "Patung penjaga kebun & hutan yang unik." },
    { id: "wd_tent",     nama: "Tenda Piknik",        harga: 140, ikon: "⛺", deskripsi: "Tenda berkemah nyaman di tepi sungai atau hutan." },
    { id: "wd_sign",     nama: "Papan Penunjuk Kayu", harga: 35,  ikon: "🪧", deskripsi: "Papan kayu penanda rute di lahan luas." }
];

// Tambah Madu ke Dapur Gizi My Kitchen
if (window.MY_KITCHEN_INGREDIENTS) {
    window.MY_KITCHEN_INGREDIENTS.madu = { nama: "Madu Lebah Murni", ikon: "🍯", gizi: "Karbohidrat Alami & Antioksidan", kat: "karbo", hargaBeli: 65 };
}
if (window.MY_KITCHEN_RECIPES && !window.MY_KITCHEN_RECIPES.some(function(r) { return r.id === "toast_madu"; })) {
    window.MY_KITCHEN_RECIPES.push({
        id: "toast_madu", nama: "Susu Madu Stroberi", ikon: "🍯",
        req: ["madu", "susu", "stroberi"], coin: 290, xp: 52,
        petFoodId: "food_feast", petFoodNama: "Hearty Feast",
        gizi: "Energi Alami Madu + Kalsium Susu + Vitamin C"
    });
}

// 2. TAMBAH ZONA SUMUR, TANDON AIR, & PETERNAKAN LEBAH KE PETA 2400x1500
(function daftarZonaBaruOpenWorld() {
    let extraZones = [
        { id: "well",    nama: "Sumur Batu (Timba Air)",     labelSingkat: "🪣 Sumur",      doorX: 28.0, doorY: 36.2, exitX: 28.0, exitY: 41.0 },
        { id: "tank",    nama: "Tandon Air (Distribusi Air)",labelSingkat: "🛢️ Tandon Air", doorX: 35.8, doorY: 43.2, exitX: 35.8, exitY: 47.8 },
        { id: "beehive", nama: "Peternakan Lebah (Madu)",    labelSingkat: "🐝 Lebah",      doorX: 7.4,  doorY: 54.0, exitX: 9.2,  exitY: 57.5 }
    ];
    extraZones.forEach(function(ez) {
        if (!window.MY_WORLD_ZONES.some(function(z) { return z.id === ez.id; })) {
            window.MY_WORLD_ZONES.push(ez);
        }
    });

    let extraObs = [
        { id: "sumur_batu",  x1: 26.2, x2: 29.8, y1: 31.8, y2: 35.4 },
        { id: "tandon_air",  x1: 33.8, x2: 37.8, y1: 38.2, y2: 42.4 },
        { id: "kotak_lebah", x1: 4.5,  x2: 9.6,  y1: 48.0, y2: 53.0 }
    ];
    extraObs.forEach(function(eo) {
        if (!window.MY_WORLD_OBSTACLES.some(function(o) { return o.id === eo.id; })) {
            window.MY_WORLD_OBSTACLES.push(eo);
        }
    });
})();

// 3. STRUKTUR DATA BARU (AIR, UMPAN, KAPAK 50x, LEBAH, DEKORASI) — 0 EXTRA READS
window.pastikanDataV8MyWorld = function(uName) {
    let lb = window.pastikanDataOpenWorldSiswa(uName);
    if (!lb || !lb.myWorldData) return null;
    let wd = lb.myWorldData;

    if (typeof wd.baitCount !== "number") wd.baitCount = wd.hasFishingRod ? 5 : 0;
    if (typeof wd.axeDurability !== "number") wd.axeDurability = wd.hasAxe ? 50 : 0;
    if (wd.hasAxe && wd.axeDurability <= 0) wd.axeDurability = 50;

    // Sistem Air Sumur -> Tandon -> Garden & Farm
    if (typeof wd.wellBucket !== "number") wd.wellBucket = 0;       // Air di ember timba (maks 10 L)
    if (typeof wd.waterTank !== "number") wd.waterTank = 15;        // Air di Tandon (maks 60 L)
    if (typeof wd.gardenWater !== "number") wd.gardenWater = 5;     // Stok air siram My Garden (maks 20 L)
    if (typeof wd.farmWater !== "number") wd.farmWater = 5;         // Stok air minum My Farm (maks 20 L)

    // Peternakan Lebah (4 kotak, slot 0 dibuka saat beli pertama)
    if (!wd.beehives || typeof wd.beehives !== "object") {
        wd.beehives = { unlockedCount: 0, boxes: {} };
    } else {
        if (typeof wd.beehives.unlockedCount !== "number") wd.beehives.unlockedCount = 0;
        if (!wd.beehives.boxes || typeof wd.beehives.boxes !== "object") wd.beehives.boxes = {};
    }

    // Dekorasi My World
    if (!wd.ownedWorldDecor || typeof wd.ownedWorldDecor !== "object") wd.ownedWorldDecor = {};
    if (!Array.isArray(wd.placedWorldDecor)) {
        wd.placedWorldDecor = wd.placedWorldDecor ? Object.values(wd.placedWorldDecor) : [];
    }

    return lb;
};

// Helper Air untuk My Garden & My Farm
window.ambilStokAirKebunWorld = function() {
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    return lb ? (Number(lb.myWorldData.gardenWater) || 0) : 5;
};

window.pakaiAirKebunWorld = function(jml) {
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    if (!lb) return true;
    let cur = Number(lb.myWorldData.gardenWater) || 0;
    if (cur < jml) return false;
    lb.myWorldData.gardenWater = cur - jml;
    window.simpanDataWorldKeServer(lb);
    return true;
};

window.ambilStokAirFarmWorld = function() {
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    return lb ? (Number(lb.myWorldData.farmWater) || 0) : 5;
};

window.pakaiAirFarmWorld = function(jml) {
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    if (!lb) return true;
    let cur = Number(lb.myWorldData.farmWater) || 0;
    if (cur < jml) return false;
    lb.myWorldData.farmWater = cur - jml;
    window.simpanDataWorldKeServer(lb);
    return true;
};

// 4. KURANGI FREKUENSI & INTENSITAS HUJAN
window.dapatkanCuacaLokalMyWorld = function() {
    let slot30 = Math.floor(Date.now() / (30 * 60 * 1000));
    let hash = ((slot30 * 2654435761) >>> 0) % 100;
    if (hash < 54) return { id: "cerah",   nama: "Cerah",    ikon: "☀️", efek: "Cuaca cerah ideal untuk aktivitas lahan." };
    if (hash < 80) return { id: "berawan", nama: "Berawan",  ikon: "⛅", efek: "Udara sejuk berawan." };
    if (hash < 88) return { id: "hujan",   nama: "Gerimis",  ikon: "🌦️", efek: "Gerimis ringan menyiram otomatis kebun & mengisi tandon." };
    return { id: "angin", nama: "Berangin", ikon: "🍃", efek: "Angin sepoi membawa serangga berkeliaran." };
};

// 5. ANALOG JOYSTICK 360° (GANTI D-PAD) + MINIMAP KIRI ATAS (GAYA MOBILE LEGENDS)
window._owJoyState = { active: false, pointerId: null, vx: 0, vy: 0, centerX: 0, centerY: 0, maxR: 38 };
window.myWorldDecorMode = false;
window.myWorldSelectedDecorId = "";
window._beeTickInterval = null;

window.pasangUIStardewMinimapDanAnalog = function() {
    let modal = document.getElementById("modal-my-world");
    let stage = document.getElementById("myworld-stage");
    let camWorld = document.getElementById("myworld-camera-world");
    if (!modal || !stage || !camWorld) return;

    modal.classList.add("stardew-theme-active");

    // A. Tambahkan objek visual Sumur, Tandon, Peternakan Lebah, & Lapisan Dekorasi ke dunia 2400x1500
    if (!document.getElementById("ow-facilities-layer")) {
        let fac = document.createElement("div");
        fac.id = "ow-facilities-layer";
        fac.className = "myworld-entities-layer";
        fac.innerHTML =
            '<!-- SUMUR BATU -->' +
            '<button type="button" id="world-zone-well" class="world-zone-btn ow-fac-btn" style="left:28.0%; top:33.5%; width:92px; height:96px;" onclick="event.stopPropagation(); window.arahkanAvatarKeZona(\'well\')" title="Sumur Batu — Timba Air Manual">' +
                '<div class="world-zone-tag">🪣 Sumur</div>' +
                '<svg viewBox="0 0 80 80" width="66" height="66"><ellipse cx="40" cy="68" rx="28" ry="8" fill="rgba(0,0,0,0.22)"/><rect x="18" y="40" width="44" height="26" rx="8" fill="#94a3b8" stroke="#334155" stroke-width="3.5"/><ellipse cx="40" cy="40" rx="22" ry="8" fill="#0ea5e9" stroke="#334155" stroke-width="3"/><line x1="20" y1="40" x2="20" y2="16" stroke="#78350f" stroke-width="5"/><line x1="60" y1="40" x2="60" y2="16" stroke="#78350f" stroke-width="5"/><polygon points="10,20 40,4 70,20" fill="#b45309" stroke="#451a03" stroke-width="3.5" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<!-- TANDON AIR -->' +
            '<button type="button" id="world-zone-tank" class="world-zone-btn ow-fac-btn" style="left:35.8%; top:40.2%; width:98px; height:102px;" onclick="event.stopPropagation(); window.arahkanAvatarKeZona(\'tank\')" title="Tandon Air — Tampung & Ambil Air Garden/Farm">' +
                '<div class="world-zone-tag">🛢️ Tandon</div>' +
                '<svg viewBox="0 0 84 86" width="68" height="70"><ellipse cx="42" cy="76" rx="28" ry="8" fill="rgba(0,0,0,0.22)"/><rect x="22" y="54" width="8" height="22" fill="#78350f"/><rect x="54" y="54" width="8" height="22" fill="#78350f"/><rect x="16" y="16" width="52" height="44" rx="14" fill="#0284c7" stroke="#0c4a6e" stroke-width="4"/><ellipse cx="42" cy="18" rx="26" ry="7" fill="#38bdf8" stroke="#0c4a6e" stroke-width="3"/><line x1="16" y1="34" x2="68" y2="34" stroke="#0369a1" stroke-width="3"/><line x1="16" y1="46" x2="68" y2="46" stroke="#0369a1" stroke-width="3"/></svg>' +
            '</button>' +
            '<!-- PETERNAKAN LEBAH (APIARY) -->' +
            '<button type="button" id="world-zone-beehive" class="world-zone-btn ow-fac-btn" style="left:7.2%; top:50.5%; width:124px; height:96px;" onclick="event.stopPropagation(); window.arahkanAvatarKeZona(\'beehive\')" title="Peternakan Lebah — Produksi Madu">' +
                '<div class="world-zone-tag">🐝 Lebah</div>' +
                '<svg viewBox="0 0 110 76" width="96" height="66"><ellipse cx="55" cy="66" rx="46" ry="8" fill="rgba(0,0,0,0.2)"/>' +
                    '<g transform="translate(8,14)"><rect x="2" y="14" width="38" height="36" rx="5" fill="#f59e0b" stroke="#78350f" stroke-width="3"/><polygon points="0,16 21,2 42,16" fill="#b45309" stroke="#451a03" stroke-width="3"/><rect x="14" y="30" width="14" height="6" rx="3" fill="#451a03"/></g>' +
                    '<g transform="translate(56,14)"><rect x="2" y="14" width="38" height="36" rx="5" fill="#fbbf24" stroke="#78350f" stroke-width="3"/><polygon points="0,16 21,2 42,16" fill="#b45309" stroke="#451a03" stroke-width="3"/><rect x="14" y="30" width="14" height="6" rx="3" fill="#451a03"/></g>' +
                '</svg>' +
            '</button>';
        camWorld.appendChild(fac);
    }

    if (!document.getElementById("myworld-decor-layer")) {
        let decLayer = document.createElement("div");
        decLayer.id = "myworld-decor-layer";
        decLayer.className = "myworld-entities-layer";
        camWorld.appendChild(decLayer);
    }

    // B. Pasang Minimap Preview Kiri Atas (Gaya Mobile Legends)
    if (!document.getElementById("myworld-ml-minimap")) {
        let mm = document.createElement("div");
        mm.id = "myworld-ml-minimap";
        mm.className = "ow-ml-minimap";
        mm.title = "Ketuk untuk memperbesar Peta Dunia";
        mm.onclick = function(e) { e.stopPropagation(); window.bukaWorldMapOverlay(); };
        mm.innerHTML =
            '<div class="ow-ml-mm-river"></div>' +
            '<div class="ow-ml-mm-island"></div>' +
            '<div class="ow-ml-mm-east"></div>' +
            '<span class="ow-ml-dot d-pet" style="left:16.6%; top:18%;">🏡</span>' +
            '<span class="ow-ml-dot d-gar" style="left:16.8%; top:47%;">🌱</span>' +
            '<span class="ow-ml-dot d-kit" style="left:33.3%; top:19%;">🍳</span>' +
            '<span class="ow-ml-dot d-shp" style="left:52.5%; top:24%;">🏪</span>' +
            '<span class="ow-ml-dot d-lab" style="left:77.3%; top:16%;">🧪</span>' +
            '<span class="ow-ml-dot d-frm" style="left:82.1%; top:46%;">🐄</span>' +
            '<span class="ow-ml-dot d-bee" style="left:7.2%;  top:51%;">🐝</span>' +
            '<span class="ow-ml-dot d-riv" style="left:24.0%; top:69%;">🎣</span>' +
            '<div id="ow-ml-viewport-rect" class="ow-ml-viewport-rect"></div>' +
            '<div id="ow-ml-player-dot" class="ow-ml-player-dot" style="left:24%; top:35%;"></div>' +
            '<span class="ow-ml-mm-label">🗺️ PETA</span>';
        stage.appendChild(mm);
    }

    // C. Pasang Panel Jam & Cuaca Stardew Valley di Kanan Atas Panggung
    if (!document.getElementById("myworld-sdv-clock")) {
        let clk = document.createElement("div");
        clk.id = "myworld-sdv-clock";
        clk.className = "ow-sdv-clock-box";
        clk.onclick = function(e) { e.stopPropagation(); };
        stage.appendChild(clk);
    }

    // D. Pasang Analog Joystick 360° di Kiri Bawah (Menggantikan D-Pad)
    let oldDpad = stage.querySelector(".myworld-dpad");
    if (oldDpad) oldDpad.style.display = "none";

    if (!document.getElementById("myworld-analog-joy")) {
        let joy = document.createElement("div");
        joy.id = "myworld-analog-joy";
        joy.className = "ow-joystick-zone";
        joy.onclick = function(e) { e.stopPropagation(); };
        joy.innerHTML = '<div class="ow-joystick-base"><div id="ow-joystick-knob" class="ow-joystick-knob"></div></div>';
        stage.appendChild(joy);
        window.ikatEventAnalogJoystick(joy);
    }

    // E. Pasang Bar Mode Tata Dekorasi + Overlay Sumur, Tandon, & Lebah
    if (!document.getElementById("myworld-decor-toolbar")) {
        let dtb = document.createElement("div");
        dtb.id = "myworld-decor-toolbar";
        dtb.className = "ow-decor-toolbar";
        dtb.style.display = "none";
        dtb.onclick = function(e) { e.stopPropagation(); };
        stage.appendChild(dtb);
    }

    let box = modal.querySelector(".myworld-modal-box");
    ["myworld-well-overlay", "myworld-tank-overlay", "myworld-beehive-overlay"].forEach(function(oid) {
        if (box && !document.getElementById(oid)) {
            let ov = document.createElement("div");
            ov.id = oid;
            ov.className = "myworld-inner-overlay";
            ov.style.display = "none";
            ov.onclick = function(e) { if (e.target === ov) window.tutupOverlayFasilitasWorld(oid); };
            box.appendChild(ov);
        }
    });
};

window.ikatEventAnalogJoystick = function(joyEl) {
    let base = joyEl.querySelector(".ow-joystick-base");
    let knob = document.getElementById("ow-joystick-knob");
    if (!base || !knob) return;

    function updateKnobFromClient(cx, cy) {
        let rect = base.getBoundingClientRect();
        let midX = rect.left + rect.width / 2;
        let midY = rect.top + rect.height / 2;
        let rawDx = cx - midX;
        let rawDy = cy - midY;

        let isRot90 = document.body.classList.contains("world-force-rotated");
        let lx = isRot90 ? rawDy : rawDx;
        let ly = isRot90 ? -rawDx : rawDy;

        let maxR = window._owJoyState.maxR || 36;
        let dist = Math.hypot(lx, ly);
        if (dist > maxR) {
            lx = (lx / dist) * maxR;
            ly = (ly / dist) * maxR;
        }

        knob.style.transform = "translate(calc(-50% + " + lx.toFixed(1) + "px), calc(-50% + " + ly.toFixed(1) + "px))";
        let normX = lx / maxR;
        let normY = ly / maxR;
        window._owJoyState.vx = Math.abs(normX) < 0.12 ? 0 : normX;
        window._owJoyState.vy = Math.abs(normY) < 0.12 ? 0 : normY;

        if (window._owJoyState.vx !== 0 || window._owJoyState.vy !== 0) {
            window.myWorldState.targetX = null;
            window.myWorldState.targetY = null;
            window.myWorldState.autoEnterZone = "";
            window._openWorldPendingAction = null;
        }
    }

    function resetKnob() {
        window._owJoyState.active = false;
        window._owJoyState.pointerId = null;
        window._owJoyState.vx = 0;
        window._owJoyState.vy = 0;
        knob.style.transform = "translate(-50%, -50%)";
    }

    joyEl.addEventListener("pointerdown", function(e) {
        e.preventDefault();
        e.stopPropagation();
        window._owJoyState.active = true;
        window._owJoyState.pointerId = e.pointerId;
        try { joyEl.setPointerCapture(e.pointerId); } catch (err) {}
        updateKnobFromClient(e.clientX, e.clientY);
    });

    joyEl.addEventListener("pointermove", function(e) {
        if (!window._owJoyState.active || e.pointerId !== window._owJoyState.pointerId) return;
        e.preventDefault();
        e.stopPropagation();
        updateKnobFromClient(e.clientX, e.clientY);
    });

    joyEl.addEventListener("pointerup", function(e) {
        if (e.pointerId === window._owJoyState.pointerId) resetKnob();
    });
    joyEl.addEventListener("pointercancel", resetKnob);
    joyEl.addEventListener("lostpointercapture", resetKnob);
};

window.perbaruiMinimapDanJamStardew = function() {
    let ws = window.myWorldState;
    let pDot = document.getElementById("ow-ml-player-dot");
    if (pDot) {
        pDot.style.left = ws.x.toFixed(1) + "%";
        pDot.style.top = ws.y.toFixed(1) + "%";
    }

    let vpRect = document.getElementById("ow-ml-viewport-rect");
    let stage = document.getElementById("myworld-stage");
    if (vpRect && stage) {
        let wPct = Math.min(100, (stage.clientWidth / window.MY_WORLD_OPEN_DIM.w) * 100);
        let hPct = Math.min(100, (stage.clientHeight / window.MY_WORLD_OPEN_DIM.h) * 100);
        let lPct = (window.myWorldCamera.x / window.MY_WORLD_OPEN_DIM.w) * 100;
        let tPct = (window.myWorldCamera.y / window.MY_WORLD_OPEN_DIM.h) * 100;
        vpRect.style.left = lPct.toFixed(1) + "%";
        vpRect.style.top = tPct.toFixed(1) + "%";
        vpRect.style.width = wPct.toFixed(1) + "%";
        vpRect.style.height = hPct.toFixed(1) + "%";
    }

    let clk = document.getElementById("myworld-sdv-clock");
    if (clk) {
        let now = new Date();
        let hari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][now.getDay()];
        let jamStr = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
        let wkt = window.dapatkanFaseWaktuLokalWorld();
        let cuc = window.dapatkanCuacaLokalMyWorld();
        let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
        let wd = (lb && lb.myWorldData) ? lb.myWorldData : {};
        clk.innerHTML =
            '<div class="sdv-clk-top"><span>' + hari + ', ' + jamStr + '</span><span>' + wkt.ikon + ' ' + cuc.ikon + '</span></div>' +
            '<div class="sdv-clk-water">🛢️ Tandon: <b>' + (Number(wd.waterTank) || 0) + '/60L</b> • 🪣 <b>' + (Number(wd.wellBucket) || 0) + 'L</b></div>';
    }
};

// 6. OVERRIDE RENDER SERANGGA (IKON BERSIH TANPA LABEL RARITY) & DEKORASI PETA
const _origRenderEntitasV7 = window.renderEntitasOpenWorld;
window.renderEntitasOpenWorld = function() {
    _origRenderEntitasV7();
    let insectsLayer = document.getElementById("myworld-insects-layer");
    let ctx = window.ambilDataOpenWorldTampil();

    if (insectsLayer && !ctx.isVisit) {
        insectsLayer.innerHTML = (window.myWorldLiveInsects || []).map(function(it) {
            let cfg = window.MY_WORLD_INSECT_CATALOG.find(function(b) { return b.id === it.bugId; }) || window.MY_WORLD_INSECT_CATALOG[0];
            return '<button type="button" class="ow-bug-actor is-clean-bug" style="left:' + it.x.toFixed(1) + '%; top:' + it.y.toFixed(1) + '%;" onclick="event.stopPropagation(); window.klikSeranggaOpenWorld(\'' + it.uid + '\')" title="Tangkap Serangga!">' +
                '<span class="ow-bug-ico">' + cfg.ikon + '</span>' +
                '<span class="ow-bug-tag">Serangga!</span>' +
            '</button>';
        }).join('');
    }

    window.renderDekorasiDiPetaWorld();
};

window.renderDekorasiDiPetaWorld = function() {
    let layer = document.getElementById("myworld-decor-layer");
    if (!layer) return;
    let lb = window.modeKunjunganWorld
        ? (window.leaderboardSiswaData ? window.leaderboardSiswaData[window.modeKunjunganWorld] : null)
        : window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    let list = (lb && lb.myWorldData && Array.isArray(lb.myWorldData.placedWorldDecor))
        ? lb.myWorldData.placedWorldDecor
        : (lb && lb.myWorldData && lb.myWorldData.placedWorldDecor ? Object.values(lb.myWorldData.placedWorldDecor) : []);

    layer.innerHTML = list.map(function(dec, idx) {
        let cfg = window.MY_WORLD_DECOR_CATALOG.find(function(x) { return x.id === dec.decorId; });
        if (!cfg) return "";
        return '<button type="button" class="ow-decor-placed' + (window.myWorldDecorMode ? ' is-editable' : '') + '" style="left:' + dec.x + '%; top:' + dec.y + '%;" onclick="event.stopPropagation(); window.klikDekorasiTerpasangWorld(' + idx + ')" title="' + cfg.nama + (window.myWorldDecorMode ? ' (Klik untuk angkat ke tas)' : '') + '">' +
            '<span>' + cfg.ikon + '</span>' +
            (window.myWorldDecorMode ? '<small>✕</small>' : '') +
        '</button>';
    }).join('');
};

window.toggleModeDekorasiWorld = function(forceOff) {
    if (window.modeKunjunganWorld) return;
    window.myWorldDecorMode = (forceOff === true) ? false : !window.myWorldDecorMode;
    let bar = document.getElementById("myworld-decor-toolbar");
    if (!bar) return;

    if (!window.myWorldDecorMode) {
        bar.style.display = "none";
        window.myWorldSelectedDecorId = "";
        window.renderDekorasiDiPetaWorld();
        window.renderHotbarAlatWorld();
        return;
    }

    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    let ownedMap = (lb && lb.myWorldData && lb.myWorldData.ownedWorldDecor) ? lb.myWorldData.ownedWorldDecor : {};
    let avail = window.MY_WORLD_DECOR_CATALOG.filter(function(d) { return (Number(ownedMap[d.id]) || 0) > 0; });

    if (avail.length > 0 && !avail.some(function(d) { return d.id === window.myWorldSelectedDecorId; })) {
        window.myWorldSelectedDecorId = avail[0].id;
    }

    let chipsHtml = avail.length === 0
        ? '<span style="font-size:11px; color:#fef08a; font-weight:700;">Tas dekorasi kosong! Beli dekorasi di 🏪 Shop ➔ tab Dekorasi.</span>'
        : avail.map(function(d) {
              let q = Number(ownedMap[d.id]) || 0;
              let act = (window.myWorldSelectedDecorId === d.id) ? " active" : "";
              return '<button type="button" class="ow-dec-pick' + act + '" onclick="window.pilihItemDekorasiPasang(\'' + d.id + '\')">' + d.ikon + ' ' + d.nama + ' (x' + q + ')</button>';
          }).join('');

    bar.innerHTML =
        '<div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; flex:1;">' +
            '<b style="color:#fef08a; font-size:11px;">🪴 Mode Dekorasi (Klik peta untuk pasang / klik objek untuk angkat):</b>' +
            chipsHtml +
        '</div>' +
        '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:4px 12px;" onclick="window.toggleModeDekorasiWorld(true)">Selesai</button>';

    bar.style.display = "flex";
    window.renderDekorasiDiPetaWorld();
    window.renderHotbarAlatWorld();
};

window.pilihItemDekorasiPasang = function(decorId) {
    window.myWorldSelectedDecorId = decorId;
    window.myWorldDecorMode = false;
    window.toggleModeDekorasiWorld(false);
};

window.klikDekorasiTerpasangWorld = function(idx) {
    if (!window.myWorldDecorMode || window.modeKunjunganWorld) return;
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    if (!lb || !lb.myWorldData.placedWorldDecor[idx]) return;

    let removed = lb.myWorldData.placedWorldDecor.splice(idx, 1)[0];
    if (removed && removed.decorId) {
        lb.myWorldData.ownedWorldDecor[removed.decorId] = (Number(lb.myWorldData.ownedWorldDecor[removed.decorId]) || 0) + 1;
    }
    window.simpanDataWorldKeServer(lb);
    window.myWorldDecorMode = false;
    window.toggleModeDekorasiWorld(false);
    window.tampilkanToastEnvMyWorld("🎒 Dekorasi diangkat kembali ke tas!");
};

// 7. OVERRIDE HOTBAR STARDEW VALLEY (TAMPILKAN KAPAK 50x, UMPAN, EMBER, & DEKOR)
window.renderHotbarAlatWorld = function() {
    let hb = document.getElementById("myworld-hotbar");
    if (!hb) return;
    if (window.modeKunjunganWorld) { hb.style.display = "none"; return; }
    hb.style.display = "flex";

    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    let wd = (lb && lb.myWorldData) ? lb.myWorldData : {};
    let cur = window.myWorldActiveTool || "hand";

    let slots = [
        { id: "hand", ico: "🖐️", lbl: "Jalan",   owned: true,                     badge: "" },
        { id: "axe",  ico: "🪓", lbl: "Kapak",   owned: Boolean(wd.hasAxe),       badge: wd.hasAxe ? String(wd.axeDurability) : "" },
        { id: "net",  ico: "🕸️", lbl: "Jaring",  owned: Boolean(wd.hasBugNet),    badge: "" },
        { id: "rod",  ico: "🎣", lbl: "Pancing", owned: Boolean(wd.hasFishingRod),badge: wd.hasFishingRod ? ("🪱" + (wd.baitCount || 0)) : "" }
    ];

    hb.innerHTML = slots.map(function(t) {
        return '<button type="button" class="ow-hotbar-slot' + (cur === t.id && !window.myWorldDecorMode ? ' active' : '') + (t.owned ? '' : ' locked') + '" onclick="window.toggleModeDekorasiWorld(true); window.pilihAlatHotbarWorld(\'' + t.id + '\')" title="' + t.lbl + '">' +
            (t.badge ? '<span class="ow-slot-qty">' + t.badge + '</span>' : '') +
            '<span>' + t.ico + '</span><small>' + (t.owned ? t.lbl : '🔒') + '</small>' +
        '</button>';
    }).join('') +
    '<button type="button" class="ow-hotbar-slot' + (window.myWorldDecorMode ? ' active' : '') + '" onclick="window.toggleModeDekorasiWorld()" title="Atur Peletakan Dekorasi di Peta"><span>🪴</span><small>Dekor</small></button>' +
    '<div class="ow-wood-counter" title="Stok Kayu & Ember Air">🪵<b>' + (Number(wd.woodCount) || 0) + '</b> 🪣<b>' + (Number(wd.wellBucket) || 0) + 'L</b></div>';
};

// 8. KAPAK HABIS PAKAI (50 POHON) & UMPAN PANCING WAJIB
const _origTebangPohonV7 = window.eksekusiTebangPohon;
window.eksekusiTebangPohon = function(treeId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataV8MyWorld(uName);
    if (!lb) return;
    let wd = lb.myWorldData;
    if (!wd.hasAxe || (Number(wd.axeDurability) || 0) <= 0) {
        wd.hasAxe = false;
        wd.axeDurability = 0;
        window.renderHotbarAlatWorld();
        return window.tampilkanCustomDialog("alert", "Kapak Penebang Anda belum dimiliki atau sudah habis pakai (50 pohon).\nSilakan berjalan ke Toko Lahan (🏪 Shop) untuk membeli kapak baru.", null, function() {
            window.pulihkanGerakSetelahOverlayWorld();
        });
    }

    let beforeCount = wd.clearedTrees.length;
    _origTebangPohonV7(treeId);

    // Jika pohon baru saja tumbang -> kurangi 1 ketahanan kapak
    if (wd.clearedTrees.length > beforeCount) {
        wd.axeDurability = Math.max(0, (Number(wd.axeDurability) || 50) - 1);
        if (wd.axeDurability <= 0) {
            wd.hasAxe = false;
            window.myWorldActiveTool = "hand";
            window.tampilkanToastEnvMyWorld("💥 Kapak Penebang aus setelah 50 pohon! Beli kapak baru di Toko Lahan (🏪 Shop).");
        }
        window.simpanDataWorldKeServer(lb);
        window.renderHotbarAlatWorld();
    }
};

const _origLemparKailV7 = window.lemparKailMancing;
window.lemparKailMancing = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataV8MyWorld(uName);
    if (!lb) return;
    let bait = Number(lb.myWorldData.baitCount) || 0;
    if (bait <= 0) {
        return window.tampilkanCustomDialog("alert", "Umpan Pancing habis (0 umpan)!\nSilakan berjalan ke Toko Lahan (🏪 Shop) untuk membeli Umpan Pancing terlebih dahulu.", null, null);
    }
    lb.myWorldData.baitCount = bait - 1;
    window.simpanDataWorldKeServer(lb);
    window.renderHotbarAlatWorld();
    _origLemparKailV7();
};

const _origRenderMancingV7 = window.renderMiniGameMancingUI;
window.renderMiniGameMancingUI = function() {
    _origRenderMancingV7();
    let ov = document.getElementById("myworld-fishing-overlay");
    let headSub = ov ? ov.querySelector(".ws-modal-head small") : null;
    if (headSub) {
        let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
        let bait = lb ? (Number(lb.myWorldData.baitCount) || 0) : 0;
        headSub.innerHTML = "Stok Umpan: <b>🪱 " + bait + "</b> (1 umpan / lempar) • Tangkap ikan sungai!";
    }
};

// 9. SUMUR BATU, TANDON AIR, & PETERNAKAN LEBAH (APIARY)
window.tutupOverlayFasilitasWorld = function(oid) {
    if (oid === "myworld-beehive-overlay") {
        clearInterval(window._beeTickInterval);
        window._beeTickInterval = null;
    }
    let ov = document.getElementById(oid);
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

// A. SUMUR BATU (MENIMBA AIR MANUAL)
window._wellDrawPct = 0;
window.bukaOverlaySumurWorld = function() {
    window._wellDrawPct = 0;
    window.renderOverlaySumurWorld();
    let ov = document.getElementById("myworld-well-overlay");
    if (ov) ov.style.display = "flex";
};

window.renderOverlaySumurWorld = function() {
    let ov = document.getElementById("myworld-well-overlay");
    if (!ov) return;
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    let wd = (lb && lb.myWorldData) ? lb.myWorldData : { wellBucket: 0, waterTank: 0 };
    let isFull = wd.wellBucket >= 10;

    ov.innerHTML =
        '<div class="ws-modal-card" style="max-width:440px;">' +
            '<div class="ws-modal-head">' +
                '<div><strong>🪣 Sumur Batu My World</strong><small>Timba air bersih manual lalu tuang ke 🛢️ Tandon Air.</small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupOverlayFasilitasWorld(\'myworld-well-overlay\')">✕</button>' +
            '</div>' +
            '<div class="world-shop-body" style="text-align:center; display:flex; flex-direction:column; gap:10px; align-items:center;">' +
                '<div style="font-size:46px;">🪣💧</div>' +
                '<div class="sdv-stat-strip"><span>Air di Ember Timba: <b>' + wd.wellBucket + ' / 10 L</b></span><span>Tandon: <b>' + wd.waterTank + ' / 60 L</b></span></div>' +
                '<div class="garden-prog-wrap" style="max-width:340px;">' +
                    '<div class="garden-prog-top"><span>Tarik Tali Timba</span><b>' + window._wellDrawPct + '%</b></div>' +
                    '<div class="garden-prog-track"><div class="garden-prog-fill" style="width:' + window._wellDrawPct + '%; background:linear-gradient(90deg,#38bdf8,#0284c7);"></div></div>' +
                '</div>' +
                '<button type="button" class="' + (isFull ? 'mypet-gray-cta sm' : 'mypet-green-cta') + '" style="max-width:280px;" ' + (isFull ? 'disabled' : '') + ' onclick="window.tarikTaliSumurManual()">' +
                    (isFull ? '✓ Ember Penuh (10 L) — Bawa ke Tandon!' : '🪢 Tarik Tali Timba (+25%)') +
                '</button>' +
            '</div>' +
        '</div>';
};

window.tarikTaliSumurManual = function() {
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    if (!lb || lb.myWorldData.wellBucket >= 10) return;

    window._wellDrawPct = Math.min(100, window._wellDrawPct + 25);
    if (window._wellDrawPct >= 100) {
        window._wellDrawPct = 0;
        lb.myWorldData.wellBucket = Math.min(10, (Number(lb.myWorldData.wellBucket) || 0) + 5);
        window.simpanDataWorldKeServer(lb);
        window.renderHotbarAlatWorld();
        window.perbaruiMinimapDanJamStardew();
    }
    window.renderOverlaySumurWorld();
};

// B. TANDON AIR (TUANG DARI EMBER & AMBIL MANUAL UNTUK GARDEN & FARM)
window.bukaOverlayTandonWorld = function() {
    window.renderOverlayTandonWorld();
    let ov = document.getElementById("myworld-tank-overlay");
    if (ov) ov.style.display = "flex";
};

window.renderOverlayTandonWorld = function() {
    let ov = document.getElementById("myworld-tank-overlay");
    if (!ov) return;
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    let wd = (lb && lb.myWorldData) ? lb.myWorldData : { wellBucket: 0, waterTank: 0, gardenWater: 0, farmWater: 0 };
    let tankPct = Math.round((wd.waterTank / 60) * 100);

    ov.innerHTML =
        '<div class="ws-modal-card" style="max-width:480px;">' +
            '<div class="ws-modal-head">' +
                '<div><strong>🛢️ Tandon Air My World</strong><small>Tampung air dari Sumur &amp; bagikan ke My Garden dan My Farm.</small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupOverlayFasilitasWorld(\'myworld-tank-overlay\')">✕</button>' +
            '</div>' +
            '<div class="world-shop-body" style="display:flex; flex-direction:column; gap:10px;">' +
                '<div class="garden-prog-wrap">' +
                    '<div class="garden-prog-top"><span>🛢️ Volume Air Tandon</span><b>' + wd.waterTank + ' / 60 Liter (' + tankPct + '%)</b></div>' +
                    '<div class="garden-prog-track" style="height:14px;"><div class="garden-prog-fill" style="width:' + tankPct + '%; background:linear-gradient(90deg,#38bdf8,#0284c7);"></div></div>' +
                '</div>' +
                '<button type="button" class="' + (wd.wellBucket > 0 && wd.waterTank < 60 ? 'mypet-amber-cta sm' : 'mypet-gray-cta sm') + '" ' + (wd.wellBucket > 0 && wd.waterTank < 60 ? '' : 'disabled') + ' onclick="window.aksiTandonAirWorld(\'pour\')">' +
                    '⬇️ Tuang Ember Timba ke Tandon (Ember: ' + wd.wellBucket + ' L)' +
                '</button>' +
                '<div class="ws-gear-grid">' +
                    '<div class="ws-item-card">' +
                        '<div style="font-size:30px;">🌱💧</div>' +
                        '<div class="cozy-item-name">Air Siram My Garden</div>' +
                        '<div class="cozy-item-sub">Stok: <b>' + wd.gardenWater + ' / 20 L</b></div>' +
                        '<button type="button" class="' + (wd.waterTank >= 5 && wd.gardenWater < 20 ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (wd.waterTank >= 5 && wd.gardenWater < 20 ? '' : 'disabled') + ' onclick="window.aksiTandonAirWorld(\'garden\')">💧 Ambil +5 L</button>' +
                    '</div>' +
                    '<div class="ws-item-card">' +
                        '<div style="font-size:30px;">🐄💧</div>' +
                        '<div class="cozy-item-name">Air Minum My Farm</div>' +
                        '<div class="cozy-item-sub">Stok: <b>' + wd.farmWater + ' / 20 L</b></div>' +
                        '<button type="button" class="' + (wd.waterTank >= 5 && wd.farmWater < 20 ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (wd.waterTank >= 5 && wd.farmWater < 20 ? '' : 'disabled') + ' onclick="window.aksiTandonAirWorld(\'farm\')">💧 Ambil +5 L</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
};

window.aksiTandonAirWorld = function(mode) {
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    if (!lb) return;
    let wd = lb.myWorldData;

    if (mode === "pour") {
        let ruang = Math.max(0, 60 - wd.waterTank);
        let pindah = Math.min(wd.wellBucket, ruang);
        if (pindah <= 0) return;
        wd.wellBucket -= pindah;
        wd.waterTank += pindah;
    } else if (mode === "garden") {
        let ambil = Math.min(5, wd.waterTank, Math.max(0, 20 - wd.gardenWater));
        if (ambil <= 0) return;
        wd.waterTank -= ambil;
        wd.gardenWater += ambil;
    } else if (mode === "farm") {
        let ambilF = Math.min(5, wd.waterTank, Math.max(0, 20 - wd.farmWater));
        if (ambilF <= 0) return;
        wd.waterTank -= ambilF;
        wd.farmWater += ambilF;
    }

    window.simpanDataWorldKeServer(lb);
    window.renderHotbarAlatWorld();
    window.perbaruiMinimapDanJamStardew();
    window.renderOverlayTandonWorld();
};

// C. PETERNAKAN LEBAH (APIARY — MADU REAL-TIME)
window.MY_WORLD_BEE_PRICES = [80, 130, 190, 260];

window.bukaOverlayLebahWorld = function() {
    window.renderOverlayLebahWorld();
    let ov = document.getElementById("myworld-beehive-overlay");
    if (ov) ov.style.display = "flex";
    clearInterval(window._beeTickInterval);
    window._beeTickInterval = setInterval(function() {
        let m = document.getElementById("myworld-beehive-overlay");
        if (!m || m.style.display === "none") { clearInterval(window._beeTickInterval); return; }
        window.renderOverlayLebahWorld();
    }, 1000);
};

window.apakahAdaBungaAktifDiGarden = function(lb) {
    let plots = (lb && lb.myGardenData && lb.myGardenData.plots) ? lb.myGardenData.plots : {};
    return Object.values(plots).some(function(p) { return p && p.plantId && !p.harvestedWilted; });
};

window.renderOverlayLebahWorld = function() {
    let ov = document.getElementById("myworld-beehive-overlay");
    if (!ov) return;
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    if (!lb) return;

    let bh = lb.myWorldData.beehives;
    let adaBunga = window.apakahAdaBungaAktifDiGarden(lb);
    let now = Date.now();
    let cardsHtml = '';

    for (let i = 0; i < 4; i++) {
        let unlocked = i < (bh.unlockedCount || 0);
        if (!unlocked) {
            let cost = window.MY_WORLD_BEE_PRICES[i] || 200;
            let bisaBeli = (i === (bh.unlockedCount || 0));
            cardsHtml +=
                '<div class="ws-item-card" style="opacity:' + (bisaBeli ? '1' : '0.6') + ';">' +
                    '<div class="cozy-card-top-row"><span class="cozy-tag neutral">Kotak #' + (i + 1) + '</span><span>🔒</span></div>' +
                    '<div style="font-size:36px; margin:6px 0;">🪵</div>' +
                    '<div class="cozy-item-name">Kotak Lebah Madu</div>' +
                    '<div class="cozy-item-sub">Produksi Madu Murni tiap 12 menit!</div>' +
                    '<button type="button" class="' + (bisaBeli ? 'mypet-amber-cta sm' : 'mypet-gray-cta sm') + '" ' + (bisaBeli ? '' : 'disabled') + ' onclick="window.beliKotakLebahWorld(' + i + ')">🪙 Pasang (' + cost + ' Coin)</button>' +
                '</div>';
            continue;
        }

        let box = bh.boxes[String(i)] || { startedAt: now, readyAt: now + 720000 };
        bh.boxes[String(i)] = box;
        let rem = Math.max(0, (Number(box.readyAt) || 0) - now);
        let isReady = rem <= 0;
        let mnt = Math.floor(Math.ceil(rem / 1000) / 60);
        let dtk = Math.ceil(rem / 1000) % 60;
        let span = Math.max(1000, (Number(box.readyAt) || now) - (Number(box.startedAt) || now));
        let pct = isReady ? 100 : Math.max(2, Math.min(99, Math.round(((now - box.startedAt) / span) * 100)));

        cardsHtml +=
            '<div class="ws-item-card' + (isReady ? ' rar-legendary' : '') + '">' +
                '<div class="cozy-card-top-row"><span class="cozy-tag ' + (isReady ? 'amber' : 'green') + '">' + (isReady ? '🍯 Siap Panen!' : '🐝 Menyerbuki') + '</span><span>#' + (i + 1) + '</span></div>' +
                '<div style="font-size:38px; margin:4px 0;">' + (isReady ? '🍯' : '🐝') + '</div>' +
                '<div class="garden-prog-wrap" style="margin-bottom:6px;">' +
                    '<div class="garden-prog-top"><span>Madu Murni</span><b>' + (isReady ? '100%' : (mnt + 'm ' + String(dtk).padStart(2, '0') + 'd')) + '</b></div>' +
                    '<div class="garden-prog-track"><div class="garden-prog-fill" style="width:' + pct + '%; background:linear-gradient(90deg,#facc15,#d97706);"></div></div>' +
                '</div>' +
                (isReady
                    ? '<div style="display:flex; gap:5px; width:100%;">' +
                          '<button type="button" class="mypet-amber-cta sm" style="flex:1;" onclick="window.panenMaduLebahWorld(' + i + ', \'sell\')">💰 +🪙65</button>' +
                          '<button type="button" class="mypet-green-cta sm" style="flex:1;" onclick="window.panenMaduLebahWorld(' + i + ', \'kitchen\')">🍳 Dapur</button>' +
                      '</div>'
                    : '<button type="button" class="mypet-gray-cta sm" disabled>⏳ Sedang Memproduksi</button>') +
            '</div>';
    }

    ov.innerHTML =
        '<div class="ws-modal-card" style="max-width:540px;">' +
            '<div class="ws-modal-head">' +
                '<div><strong>🐝 Peternakan Lebah Madu (Apiary)</strong><small>' + (adaBunga ? '🌸 Bonus Kebun Berbunga Aktif: Produksi 25% lebih cepat!' : '💡 Tanam bunga di My Garden untuk mempercepat produksi madu 25%!') + '</small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupOverlayFasilitasWorld(\'myworld-beehive-overlay\')">✕</button>' +
            '</div>' +
            '<div class="world-shop-body"><div class="ws-gear-grid">' + cardsHtml + '</div></div>' +
        '</div>';
};

window.beliKotakLebahWorld = function(idx) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataV8MyWorld(uName);
    if (!lb) return;
    let cost = window.MY_WORLD_BEE_PRICES[idx] || 200;
    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < cost) return window.tampilkanCustomDialog("alert", "Saldo Coin belum mencukupi (" + cost + " Coin).", null, null);

    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(cost, "beli_kotak_lebah_" + idx, true)) {
        let now = Date.now();
        let dur = window.apakahAdaBungaAktifDiGarden(lb) ? 540000 : 720000;
        lb.myWorldData.beehives.unlockedCount = idx + 1;
        lb.myWorldData.beehives.boxes[String(idx)] = { startedAt: now, readyAt: now + dur };
        window.simpanDataWorldKeServer(lb);
        window.perbaruiBadgeMyWorld();
        window.renderOverlayLebahWorld();
    }
};

window.panenMaduLebahWorld = function(idx, mode) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataV8MyWorld(uName);
    if (!lb) return;
    let box = lb.myWorldData.beehives.boxes[String(idx)];
    if (!box || Date.now() < Number(box.readyAt)) return;

    let now = Date.now();
    let dur = window.apakahAdaBungaAktifDiGarden(lb) ? 540000 : 720000;
    lb.myWorldData.beehives.boxes[String(idx)] = { startedAt: now, readyAt: now + dur };

    if (mode === "kitchen") {
        window.tambahBahanDapurWorld(lb, "madu", 1);
    } else {
        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + 65;
        lb.xpTersedia = lb.coin;
    }
    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + 14;
    lb.xp = lb.xpTotal;

    window.simpanDataWorldKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.perbaruiBadgeMyWorld();
    window.renderOverlayLebahWorld();
};

// 10. UPGRADE WORLD SHOP: TAMBAH UMPAN PANCING, KAPAK 50x, & TAB DEKORASI MY WORLD
window.beliUmpanPancingShop = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataV8MyWorld(uName);
    let bait = window.MY_WORLD_SHOP_ITEMS.bait;
    if (!lb || !bait) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < bait.harga) return window.tampilkanCustomDialog("alert", "Saldo Coin belum mencukupi (" + bait.harga + " Coin).", null, null);

    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(bait.harga, "beli_umpan_pancing", true)) {
        lb.myWorldData.baitCount = (Number(lb.myWorldData.baitCount) || 0) + bait.qty;
        window.simpanDataWorldKeServer(lb);
        window.perbaruiBadgeMyWorld();
        window.renderHotbarAlatWorld();
        window.renderWorldShopUI();
    }
};

window.beliDekorasiMyWorldShop = function(decorId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataV8MyWorld(uName);
    let item = window.MY_WORLD_DECOR_CATALOG.find(function(d) { return d.id === decorId; });
    if (!lb || !item) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < item.harga) return window.tampilkanCustomDialog("alert", "Saldo Coin belum mencukupi (" + item.harga + " Coin).", null, null);

    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(item.harga, "beli_world_decor_" + decorId, true)) {
        lb.myWorldData.ownedWorldDecor[decorId] = (Number(lb.myWorldData.ownedWorldDecor[decorId]) || 0) + 1;
        window.simpanDataWorldKeServer(lb);
        window.perbaruiBadgeMyWorld();
        window.renderWorldShopUI();
    }
};

const _origBeliAlatEksV7 = window.beliAlatEksplorasiShop;
window.beliAlatEksplorasiShop = function(toolKey) {
    _origBeliAlatEksV7(toolKey);
    if (toolKey === "axe") {
        let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
        if (lb && lb.myWorldData.hasAxe && (Number(lb.myWorldData.axeDurability) || 0) <= 0) {
            lb.myWorldData.axeDurability = 50;
            window.simpanDataWorldKeServer(lb);
            window.renderHotbarAlatWorld();
        }
    }
};

const _origRenderWorldShopV7 = window.renderWorldShopUI;
window.renderWorldShopUI = function() {
    let ov = document.getElementById("myworld-shop-overlay");
    if (!ov) return;
    let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
    if (!lb) return;
    let wd = lb.myWorldData;
    let tab = window.activeWorldShopTab || "gear";

    if (tab !== "gear" && tab !== "decor") {
        _origRenderWorldShopV7();
        let tabsRow = ov.querySelector(".ws-tabs-row");
        if (tabsRow && !tabsRow.querySelector('[data-ws-tab="decor"]')) {
            let btnDec = document.createElement("button");
            btnDec.type = "button";
            btnDec.setAttribute("data-ws-tab", "decor");
            btnDec.className = "ws-tab-btn";
            btnDec.innerHTML = "🪴 Dekorasi";
            btnDec.onclick = function() { window.gantiTabWorldShop("decor"); };
            tabsRow.appendChild(btnDec);
        }
        return;
    }

    let totalIkan = Object.values(wd.fishInventory || {}).reduce(function(a, b) { return a + (Number(b) || 0); }, 0);
    let totalBug = Object.values(wd.insectInventory || {}).reduce(function(a, b) { return a + (Number(b) || 0); }, 0);
    let bodyHtml = '';

    if (tab === "gear") {
        let rod = window.MY_WORLD_SHOP_ITEMS.rod;
        let bait = window.MY_WORLD_SHOP_ITEMS.bait;
        let axe = window.MY_WORLD_SHOP_ITEMS.axe;
        let net = window.MY_WORLD_SHOP_ITEMS.bugNet;
        bodyHtml =
            '<div class="ws-fish-sell-grid">' +
                '<div class="ws-item-card"><div class="cozy-card-top-row"><span class="cozy-tag green">Permanen</span><span>' + (wd.hasFishingRod ? '✓ Dimiliki' : '') + '</span></div><div style="font-size:36px; margin:4px 0;">' + rod.ikon + '</div><div class="cozy-item-name">' + rod.nama + '</div><div class="cozy-item-sub">' + rod.deskripsi + '</div>' + (wd.hasFishingRod ? '<button type="button" class="mypet-gray-cta sm" disabled>✓ Sudah Dimiliki</button>' : '<button type="button" class="mypet-amber-cta sm" onclick="window.beliPancingWorldShop()">🪙 Beli (' + rod.harga + ')</button>') + '</div>' +
                '<div class="ws-item-card"><div class="cozy-card-top-row"><span class="cozy-tag amber">Habis Pakai</span><span>Stok: <b>x' + (wd.baitCount || 0) + '</b></span></div><div style="font-size:36px; margin:4px 0;">' + bait.ikon + '</div><div class="cozy-item-name">' + bait.nama + '</div><div class="cozy-item-sub">' + bait.deskripsi + '</div><button type="button" class="mypet-amber-cta sm" onclick="window.beliUmpanPancingShop()">🪙 Beli 5 Umpan (' + bait.harga + ')</button></div>' +
                '<div class="ws-item-card"><div class="cozy-card-top-row"><span class="cozy-tag amber">50 Pohon</span><span>' + (wd.hasAxe ? ('Sisa: <b>' + wd.axeDurability + '/50</b>') : 'Belum Ada') + '</span></div><div style="font-size:36px; margin:4px 0;">' + axe.ikon + '</div><div class="cozy-item-name">' + axe.nama + '</div><div class="cozy-item-sub">' + axe.deskripsi + '</div>' + (wd.hasAxe ? '<button type="button" class="mypet-gray-cta sm" disabled>✓ Masih Aktif (' + wd.axeDurability + 'x)</button>' : '<button type="button" class="mypet-amber-cta sm" onclick="window.beliAlatEksplorasiShop(\'axe\')">🪙 Beli (' + axe.harga + ')</button>') + '</div>' +
                '<div class="ws-item-card"><div class="cozy-card-top-row"><span class="cozy-tag green">Permanen</span><span>' + (wd.hasBugNet ? '✓ Dimiliki' : '') + '</span></div><div style="font-size:36px; margin:4px 0;">' + net.ikon + '</div><div class="cozy-item-name">' + net.nama + '</div><div class="cozy-item-sub">' + net.deskripsi + '</div>' + (wd.hasBugNet ? '<button type="button" class="mypet-gray-cta sm" disabled>✓ Sudah Dimiliki</button>' : '<button type="button" class="mypet-amber-cta sm" onclick="window.beliAlatEksplorasiShop(\'bugNet\')">🪙 Beli (' + net.harga + ')</button>') + '</div>' +
            '</div>';
    } else {
        let decCards = window.MY_WORLD_DECOR_CATALOG.map(function(d) {
            let stok = Number((wd.ownedWorldDecor || {})[d.id]) || 0;
            return '<div class="ws-item-card">' +
                '<div class="cozy-card-top-row"><span class="cozy-tag green">Dekorasi</span><span>Tas: <b>x' + stok + '</b></span></div>' +
                '<div style="font-size:34px; margin:4px 0;">' + d.ikon + '</div>' +
                '<div class="cozy-item-name" style="font-size:12px;">' + d.nama + '</div>' +
                '<div class="cozy-item-sub" style="flex:1;">' + d.deskripsi + '</div>' +
                '<button type="button" class="mypet-amber-cta sm" onclick="window.beliDekorasiMyWorldShop(\'' + d.id + '\')">🪙 Beli (' + d.harga + ')</button>' +
            '</div>';
        }).join('');
        bodyHtml = '<div class="ws-sell-all-bar"><span>🪴 Setelah membeli, tutup toko lalu klik <b>🪴 Dekor</b> di hotbar bawah untuk menempatkannya bebas di peta!</span></div><div class="ws-pantry-grid">' + decCards + '</div>';
    }

    ov.innerHTML =
        '<div class="ws-modal-card">' +
            '<div class="ws-modal-head"><div><strong>🏪 Toko Lahan (World Shop)</strong><small>Alat Eksplorasi, Umpan, Ikan, Serangga, Avatar, Bahan Dapur, &amp; Dekorasi.</small></div><button type="button" class="mypet-hud-close-btn" onclick="window.tutupWorldShop()">✕</button></div>' +
            '<div class="ws-tabs-row">' +
                '<button type="button" class="ws-tab-btn' + (tab === "gear" ? ' active' : '') + '" onclick="window.gantiTabWorldShop(\'gear\')">🛠️ Alat</button>' +
                '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'sell\')">🐟 Ikan (' + totalIkan + ')</button>' +
                '<button type="button" data-ws-tab="bugs" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'bugs\')">🦋 Serangga (' + totalBug + ')</button>' +
                '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'avatar\')">👕 Avatar</button>' +
                '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'pantry\')">🧺 Bahan</button>' +
                '<button type="button" data-ws-tab="decor" class="ws-tab-btn' + (tab === "decor" ? ' active' : '') + '" onclick="window.gantiTabWorldShop(\'decor\')">🪴 Dekorasi</button>' +
            '</div>' +
            '<div class="world-shop-body">' + bodyHtml + '</div>' +
        '</div>';
};

// 11. OVERRIDE KLIK PETA (PASANG DEKORASI) + MASUK ZONA (SUMUR/TANDON/LEBAH) + GARDEN SEMUA SISI + JOYSTICK LOOP
const _origKlikPetaV7 = window.klikPetaMyWorld;
window.klikPetaMyWorld = function(e) {
    if (window.myWorldDecorMode && !window.modeKunjunganWorld) {
        if (!window.myWorldSelectedDecorId) {
            return window.tampilkanToastEnvMyWorld("👆 Pilih item dekorasi di bar atas terlebih dahulu!");
        }
        let stage = document.getElementById("myworld-stage");
        let modal = document.getElementById("modal-my-world");
        let rect = stage.getBoundingClientRect();
        let isRot = Boolean(document.body.classList.contains("world-force-rotated") || (modal && modal.classList.contains("myworld-css-rotated")));
        let visX = isRot ? (e.clientY - rect.top) : (e.clientX - rect.left);
        let visY = isRot ? (rect.right - e.clientX) : (e.clientY - rect.top);
        let px = Number(Math.max(4, Math.min(96, ((visX + window.myWorldCamera.x) / window.MY_WORLD_OPEN_DIM.w) * 100)).toFixed(1));
        let py = Number(Math.max(8, Math.min(94, ((visY + window.myWorldCamera.y) / window.MY_WORLD_OPEN_DIM.h) * 100)).toFixed(1));

        let lb = window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
        let stok = lb ? (Number(lb.myWorldData.ownedWorldDecor[window.myWorldSelectedDecorId]) || 0) : 0;
        if (stok <= 0) return window.tampilkanToastEnvMyWorld("⚠️ Stok dekorasi ini habis!");

        lb.myWorldData.ownedWorldDecor[window.myWorldSelectedDecorId] = stok - 1;
        if (lb.myWorldData.ownedWorldDecor[window.myWorldSelectedDecorId] <= 0) delete lb.myWorldData.ownedWorldDecor[window.myWorldSelectedDecorId];
        lb.myWorldData.placedWorldDecor.push({ id: "wdp_" + Date.now(), decorId: window.myWorldSelectedDecorId, x: px, y: py });
        window.simpanDataWorldKeServer(lb);
        window.myWorldDecorMode = false;
        window.toggleModeDekorasiWorld(false);
        window.tampilkanToastEnvMyWorld("🪴 Dekorasi dipasang! Anda dapat mengetuknya lagi untuk mengangkatnya.");
        return;
    }
    _origKlikPetaV7(e);
};

// Arahkan ke Garden menuju tepi terdekat dari posisi avatar (bisa dari sisi mana pun!)
const _origArahkanZonaV7 = window.arahkanAvatarKeZona;
window.arahkanAvatarKeZona = function(zoneId) {
    if (zoneId === "garden") {
        let ws = window.myWorldState;
        let cx = Math.max(10.0, Math.min(23.8, ws.x));
        let cy = Math.max(41.2, Math.min(54.2, ws.y));
        // Jika posisi avatar di luar kotak kebun, arahkan ke tepi terdekat
        let dTop = Math.abs(ws.y - 40.2), dBot = Math.abs(ws.y - 55.2), dLeft = Math.abs(ws.x - 9.2), dRight = Math.abs(ws.x - 24.8);
        let minD = Math.min(dTop, dBot, dLeft, dRight);
        if (minD === dTop) { ws.targetX = cx; ws.targetY = 40.5; }
        else if (minD === dBot) { ws.targetX = cx; ws.targetY = 54.8; }
        else if (minD === dLeft) { ws.targetX = 9.6; ws.targetY = cy; }
        else { ws.targetX = 24.3; ws.targetY = cy; }
        ws.autoEnterZone = "garden";
        ws.exitCooldownUntil = 0;
        return;
    }
    _origArahkanZonaV7(zoneId);
};

const _origMasukZonaV7 = window.masukKeZonaMyWorld;
window.masukKeZonaMyWorld = function(zoneId) {
    if (zoneId === "well" || zoneId === "tank" || zoneId === "beehive") {
        let z = window.MY_WORLD_ZONES.find(function(x) { return x.id === zoneId; });
        let ws = window.myWorldState;
        if (z) { ws.x = z.exitX; ws.y = z.exitY; }
        ws.targetX = null; ws.targetY = null; ws.autoEnterZone = "";
        ws.keys = { up: false, down: false, left: false, right: false };
        ws.exitCooldownUntil = Date.now() + 1800;
        window.renderPosisiAvatarMyWorld(false);

        if (window.modeKunjunganWorld) {
            window.tampilkanCustomDialog("alert", "Fasilitas Sumur, Tandon Air, dan Peternakan Lebah hanya tersedia di My World milik Anda sendiri.", null, function() {
                window.pulihkanGerakSetelahOverlayWorld();
            });
            return;
        }
        if (zoneId === "well") window.bukaOverlaySumurWorld();
        else if (zoneId === "tank") window.bukaOverlayTandonWorld();
        else window.bukaOverlayLebahWorld();
        return;
    }

    if (zoneId === "garden") {
        // Saat keluar dari Garden nanti, tempatkan avatar sedikit mundur dari tepi tempat ia masuk
        let ws = window.myWorldState;
        let gZone = window.MY_WORLD_ZONES.find(function(z) { return z.id === "garden"; });
        if (gZone) {
            if (ws.y <= 42.5) { gZone.exitX = Math.max(10.5, Math.min(23.5, ws.x)); gZone.exitY = 36.8; }
            else if (ws.y >= 52.5) { gZone.exitX = Math.max(10.5, Math.min(23.5, ws.x)); gZone.exitY = 58.2; }
            else if (ws.x <= 11.5) { gZone.exitX = 7.4; gZone.exitY = Math.max(42, Math.min(53, ws.y)); }
            else { gZone.exitX = 27.2; gZone.exitY = Math.max(42, Math.min(53, ws.y)); }
        }
    }

    _origMasukZonaV7(zoneId);
};

window.apakahOverlayDalamWorldTerbuka = function() {
    let ids = ["myworld-shop-overlay", "myworld-fishing-overlay", "myworld-kitchen-overlay", "myworld-map-overlay", "myworld-bugcatch-overlay", "myworld-well-overlay", "myworld-tank-overlay", "myworld-beehive-overlay", "modal-custom-dialog"];
    return ids.some(function(id) {
        let el = document.getElementById(id);
        return Boolean(el && el.style.display && el.style.display !== "none");
    });
};

// Update Loop Gerak dengan Input Analog Joystick 360° + Akses Garden dari Semua Sisi Pagar + Live Minimap
window.mulaiLoopGerakMyWorld = function() {
    let ws = window.myWorldState;
    if (ws.rafId) cancelAnimationFrame(ws.rafId);
    ws.lastFrameMs = performance.now();
    let stuckTimer = 0;

    function tick(nowMs) {
        if (!ws.isOpen) return;
        let dt = Math.min(0.05, Math.max(0.004, (nowMs - ws.lastFrameMs) / 1000));
        ws.lastFrameMs = nowMs;

        if (window.apakahOverlayDalamWorldTerbuka()) {
            ws.keys = { up: false, down: false, left: false, right: false };
            window._owJoyState.vx = 0; window._owJoyState.vy = 0;
            ws.targetX = null; ws.targetY = null; ws.autoEnterZone = "";
            window.renderPosisiAvatarMyWorld(false);
            ws.rafId = requestAnimationFrame(tick);
            return;
        }

        let speedPx = 315;
        let vx = (window._owJoyState && window._owJoyState.vx) || 0;
        let vy = (window._owJoyState && window._owJoyState.vy) || 0;
        if (ws.keys.left) vx -= 1;
        if (ws.keys.right) vx += 1;
        if (ws.keys.up) vy -= 1;
        if (ws.keys.down) vy += 1;

        let moving = false;

        if (Math.abs(vx) > 0.01 || Math.abs(vy) > 0.01) {
            stuckTimer = 0;
            window._openWorldPendingAction = null;
            let mag = Math.hypot(vx, vy);
            let scale = mag > 1 ? (1 / mag) : 1;
            let dxPct = ((vx * scale) * speedPx * dt / window.MY_WORLD_OPEN_DIM.w) * 100;
            let dyPct = ((vy * scale) * speedPx * dt / window.MY_WORLD_OPEN_DIM.h) * 100;
            let movedPx = window.gerakkanAvatarDenganTabrakan(ws, dxPct, dyPct);
            if (Math.abs(vx) > 0.05) ws.facingRight = vx > 0;
            moving = movedPx > 0.25;
        } else if (ws.targetX !== null && ws.targetY !== null) {
            let dxPx = ((ws.targetX - ws.x) / 100) * window.MY_WORLD_OPEN_DIM.w;
            let dyPx = ((ws.targetY - ws.y) / 100) * window.MY_WORLD_OPEN_DIM.h;
            let distPx = Math.hypot(dxPx, dyPx);
            let stepPx = speedPx * dt;

            if (distPx <= stepPx + 8) {
                window.gerakkanAvatarDenganTabrakan(ws, ws.targetX - ws.x, ws.targetY - ws.y);
                ws.targetX = null; ws.targetY = null; stuckTimer = 0;
                if (ws.autoEnterZone) {
                    let tz = ws.autoEnterZone;
                    ws.autoEnterZone = "";
                    window.masukKeZonaMyWorld(tz);
                    if (ws.isOpen) ws.rafId = requestAnimationFrame(tick);
                    return;
                }
                if (window._openWorldPendingAction) {
                    let act = window._openWorldPendingAction;
                    window._openWorldPendingAction = null;
                    if (act.type === "tree") window.eksekusiTebangPohon(act.id);
                    else if (act.type === "gate") window.klikGerbangBukaJalan(act.id);
                    else if (act.type === "bug") window.bukaMiniGameSerangga(act.id);
                }
            } else {
                let sDxPct = ((dxPx / distPx) * stepPx / window.MY_WORLD_OPEN_DIM.w) * 100;
                let sDyPct = ((dyPx / distPx) * stepPx / window.MY_WORLD_OPEN_DIM.h) * 100;
                let movedPx = window.gerakkanAvatarDenganTabrakan(ws, sDxPct, sDyPct);
                if (Math.abs(dxPx) > 4) ws.facingRight = dxPx > 0;
                if (movedPx < 0.6) {
                    stuckTimer += dt;
                    if (stuckTimer > 0.28) { ws.targetX = null; ws.targetY = null; ws.autoEnterZone = ""; window._openWorldPendingAction = null; stuckTimer = 0; }
                } else { stuckTimer = 0; moving = true; }
            }
        }

        window.renderPosisiAvatarMyWorld(moving);
        window.perbaruiMinimapDanJamStardew();

        let nowWall = Date.now();

        // A. CEK MASUK MY GARDEN DARI SISI MANA PUN (KELILING PAGAR KEBUN)
        let gDxPx = Math.max(0, 10.2 - ws.x, ws.x - 23.6) * 24;
        let gDyPx = Math.max(0, 41.5 - ws.y, ws.y - 53.8) * 15;
        let gardenEdgeDistPx = Math.hypot(gDxPx, gDyPx);

        if (gardenEdgeDistPx < 22 && nowWall >= ws.exitCooldownUntil && moving) {
            window.masukKeZonaMyWorld("garden");
            if (ws.isOpen) ws.rafId = requestAnimationFrame(tick);
            return;
        }

        // B. CEK ZONA LAINNYA
        let closestZone = null;
        let closestPx = 9999;
        window.MY_WORLD_ZONES.forEach(function(z) {
            let dPx = (z.id === "garden") ? gardenEdgeDistPx : Math.hypot((ws.x - z.doorX) * 24, (ws.y - z.doorY) * 15);
            if (dPx < closestPx) { closestPx = dPx; closestZone = z; }
        });

        if (closestZone && closestZone.id !== "garden" && closestPx < 48 && nowWall >= ws.exitCooldownUntil && moving) {
            window.masukKeZonaMyWorld(closestZone.id);
            if (ws.isOpen) ws.rafId = requestAnimationFrame(tick);
            return;
        }

        let newNear = (closestZone && closestPx < 115) ? closestZone.id : "";
        if (newNear !== ws.nearZoneId) {
            ws.nearZoneId = newNear;
            document.querySelectorAll(".world-zone-btn").forEach(function(b) { b.classList.remove("is-near"); });
            let hintEl = document.getElementById("myworld-enter-hint");
            let btnEnter = document.getElementById("btn-myworld-enter-now");

            if (newNear && closestZone) {
                let zBtn = document.getElementById("world-zone-" + newNear);
                if (zBtn) zBtn.classList.add("is-near");
                if (hintEl) hintEl.innerHTML = "📍 Di dekat <b>" + closestZone.nama + "</b>";
                if (btnEnter) { btnEnter.style.display = "inline-flex"; btnEnter.innerText = "🚪 Buka " + closestZone.labelSingkat; }
            } else {
                if (hintEl) hintEl.innerHTML = "🕹️ Gunakan Analog / WASD untuk menjelajah, timba air di <b>Sumur</b>, &amp; tangkap serangga!";
                if (btnEnter) btnEnter.style.display = "none";
            }
        }

        ws.rafId = requestAnimationFrame(tick);
    }

    ws.rafId = requestAnimationFrame(tick);
};

// Hook pembukaan & penutupan My World untuk mengaktifkan Stardew Valley UI, Analog, & Minimap
(function pasangHookStardewV8() {
    if (typeof window.bukaModalMyWorld === "function" && !window.bukaModalMyWorld._v8Stardew) {
        let origOpen = window.bukaModalMyWorld;
        window.bukaModalMyWorld = function() {
            origOpen.apply(this, arguments);
            window.pastikanDataV8MyWorld(sessionStorage.getItem("username"));
            window.pasangUIStardewMinimapDanAnalog();
            window.renderEntitasOpenWorld();
            window.renderHotbarAlatWorld();
            window.perbaruiMinimapDanJamStardew();
        };
        window.bukaModalMyWorld._v8Stardew = true;
    }

    if (typeof window.tutupModalMyWorld === "function" && !window.tutupModalMyWorld._v8Close) {
        let origClose = window.tutupModalMyWorld;
        window.tutupModalMyWorld = function() {
            window.tutupOverlayFasilitasWorld("myworld-well-overlay");
            window.tutupOverlayFasilitasWorld("myworld-tank-overlay");
            window.tutupOverlayFasilitasWorld("myworld-beehive-overlay");
            window.toggleModeDekorasiWorld(true);
            origClose.apply(this, arguments);
        };
        window.tutupModalMyWorld._v8Close = true;
    }
})();
// =========================================================================
// 13. INTEGRASI GEDUNG BARU: MY ARCADE DI PETA OPEN-WORLD MY WORLD
// =========================================================================
(function pasangIntegrasiGedungMyArcade() {
    if (!window.MY_WORLD_ZONES.some(function(z) { return z.id === "arcade"; })) {
        window.MY_WORLD_ZONES.push({
            id: "arcade",
            nama: "Balai Permainan (My Arcade)",
            labelSingkat: "🕹️ My Arcade",
            doorX: 65.0,
            doorY: 40.4,
            exitX: 65.0,
            exitY: 45.8
        });
    }

    if (!window.MY_WORLD_OBSTACLES.some(function(o) { return o.id === "gedung_arcade"; })) {
        window.MY_WORLD_OBSTACLES.push({
            id: "gedung_arcade",
            x1: 60.8,
            x2: 69.2,
            y1: 27.5,
            y2: 39.2
        });
    }

    // Hook pemasangan UI Open-World untuk menambahkan gedung Arcade & titik minimapnya
    if (typeof window.pasangUIStardewMinimapDanAnalog === "function" && !window.pasangUIStardewMinimapDanAnalog._arcadeHooked) {
        let origUI = window.pasangUIStardewMinimapDanAnalog;
        window.pasangUIStardewMinimapDanAnalog = function() {
            origUI.apply(this, arguments);

            let fac = document.getElementById("ow-facilities-layer");
            if (fac && !document.getElementById("world-zone-arcade")) {
                let btnArc = document.createElement("button");
                btnArc.type = "button";
                btnArc.id = "world-zone-arcade";
                btnArc.className = "world-zone-btn ow-fac-btn";
                btnArc.style.cssText = "left:65.0%; top:33.2%; width:196px; height:172px;";
                btnArc.title = "Balai Permainan Santai — My Arcade (10 Game)";
                btnArc.onclick = function(e) { e.stopPropagation(); window.arahkanAvatarKeZona("arcade"); };
                btnArc.innerHTML =
                    '<div class="world-zone-tag">🕹️ My Arcade</div>' +
                    '<svg viewBox="0 0 180 140" width="168" height="130">' +
                        '<ellipse cx="90" cy="126" rx="82" ry="14" fill="rgba(25,20,55,0.28)"/>' +
                        '<rect x="16" y="42" width="148" height="82" rx="8" fill="#312e81" stroke="#1e1b4b" stroke-width="5"/>' +
                        '<polygon points="6,46 28,12 152,12 174,46" fill="#7c3aed" stroke="#4c1d95" stroke-width="5" stroke-linejoin="round"/>' +
                        '<rect x="38" y="20" width="104" height="18" rx="6" fill="#0f172a" stroke="#facc15" stroke-width="2.5"/>' +
                        '<text x="90" y="33" font-size="11" font-weight="900" fill="#fde047" text-anchor="middle">ARCADE</text>' +
                        '<rect x="28" y="64" width="32" height="30" rx="5" fill="#38bdf8" stroke="#e0f2fe" stroke-width="3"/>' +
                        '<rect x="120" y="64" width="32" height="30" rx="5" fill="#f472b6" stroke="#fce7f3" stroke-width="3"/>' +
                        '<path d="M72,124 L72,76 A18,18 0 0,1 108,76 L108,124 Z" fill="#f59e0b" stroke="#451a03" stroke-width="4"/>' +
                        '<circle cx="100" cy="100" r="3" fill="#fef08a"/>' +
                    '</svg>';
                fac.appendChild(btnArc);
            }

            let mm = document.getElementById("myworld-ml-minimap");
            if (mm && !mm.querySelector(".d-arc")) {
                let dot = document.createElement("span");
                dot.className = "ow-ml-dot d-arc";
                dot.style.cssText = "left:65.0%; top:33%;";
                dot.textContent = "🕹️";
                mm.insertBefore(dot, document.getElementById("ow-ml-viewport-rect"));
            }
        };
        window.pasangUIStardewMinimapDanAnalog._arcadeHooked = true;
    }

    // Hook masuk zona My Arcade (Sendiri & Mode Visit)
    if (typeof window.masukKeZonaMyWorld === "function" && !window.masukKeZonaMyWorld._arcadeHooked) {
        let origMasuk = window.masukKeZonaMyWorld;
        window.masukKeZonaMyWorld = function(zoneId) {
            if (zoneId === "arcade") {
                let z = window.MY_WORLD_ZONES.find(function(x) { return x.id === "arcade"; });
                let ws = window.myWorldState;
                let targetVisit = window.modeKunjunganWorld;
                ws.openedFromHub = true;
                if (z) { ws.x = z.exitX; ws.y = z.exitY; }
                ws.targetX = null; ws.targetY = null; ws.autoEnterZone = ""; ws.nearZoneId = "";
                window.tutupModalMyWorld(false);
                document.body.classList.add("from-myworld-hub");
                if (targetVisit && typeof window.bukaModalMyArcadeKunjungan === "function") {
                    window.bukaModalMyArcadeKunjungan(targetVisit);
                } else if (typeof window.bukaModalMyArcade === "function") {
                    window.bukaModalMyArcade();
                }
                return;
            }
            origMasuk.apply(this, arguments);
        };
        window.masukKeZonaMyWorld._arcadeHooked = true;
    }

    // Hook tutup My Arcade -> kembali ke Lahan Utama My World
    document.addEventListener("DOMContentLoaded", function() {
        if (typeof window.tutupModalMyArcade === "function" && !window.tutupModalMyArcade._worldHooked) {
            let origCloseArc = window.tutupModalMyArcade;
            window.tutupModalMyArcade = function() {
                origCloseArc();
                if (window.myWorldState && window.myWorldState.openedFromHub) {
                    window.kembaliKeLahanUtamaDariZona();
                }
            };
            window.tutupModalMyArcade._worldHooked = true;
        }
    });
})();