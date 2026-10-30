// UI Manager: Menus, Character Selection, Shop, Move List & Overlays
// Battle Arena: Clash of Sorcerors

class UIManager {
    constructor() {
        this.selectedP1Char = 'yuji';
        this.selectedP2Char = 'megumi';
        this.pickingForPlayer = 1; // 1 or 2
        this.currentMode = 'arcade';
        this.currentDifficulty = 'medium';
        this.p1Name = 'Sorcerer';
        this.friendName = 'Friend';
        this.selectedAvatar = '👁️';
        this.roomCode = 'JJK-7749';

        // Auto-detect mobile / touch capability
        const savedTouch = localStorage.getItem('battle_arena_touch_enabled');
        const isTouchOrMobile = ('ontouchstart' in window) || 
                                (navigator.maxTouchPoints > 0) || 
                                (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || 
                                (window.innerWidth <= 900);
        this.touchEnabled = (savedTouch !== null) ? (savedTouch === 'true') : isTouchOrMobile;

        this.initDOMElements();
        this.bindEvents();
        this.updatePointsDisplay();
        this.initProfile();
        this.checkURLParams();
    }

    initDOMElements() {
        this.menuScreen = document.getElementById('menuScreen');
        this.charSelectScreen = document.getElementById('charSelectScreen');
        this.shopScreen = document.getElementById('shopScreen');
        this.hudOverlay = document.getElementById('hudOverlay');
        this.pauseOverlay = document.getElementById('pauseOverlay');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.moveListModal = document.getElementById('moveListModal');

        this.pointsElements = document.querySelectorAll('.points-val');
        this.touchControls = document.getElementById('touchControls');
        this.btnTouchU = document.getElementById('btnTouchU');
        this.btnToggleTouch = document.getElementById('btnToggleTouch');

        // Mobile orientation & fullscreen buttons
        this.btnToggleFullscreen = document.getElementById('btnToggleFullscreen');
        this.mobileOrientationHint = document.getElementById('mobileOrientationHint');
        this.btnCloseOrientationHint = document.getElementById('btnCloseOrientationHint');

        // Profile & Sign In Modal Elements
        this.signInModal = document.getElementById('signInModal');
        this.formSignIn = document.getElementById('formSignIn');
        this.inputPlayerName = document.getElementById('inputPlayerName');
        this.selectPlayerTitle = document.getElementById('selectPlayerTitle');
        this.avatarPicker = document.getElementById('avatarPicker');
        this.btnGuestSignIn = document.getElementById('btnGuestSignIn');
        this.btnTopProfile = document.getElementById('btnTopProfile');
        this.topProfileAvatar = document.getElementById('topProfileAvatar');
        this.topProfileName = document.getElementById('topProfileName');
        this.menuProfileCard = document.getElementById('menuProfileCard');
        this.menuProfileAvatar = document.getElementById('menuProfileAvatar');
        this.menuProfileName = document.getElementById('menuProfileName');
        this.menuProfileTitle = document.getElementById('menuProfileTitle');
        this.btnMenuEditProfile = document.getElementById('btnMenuEditProfile');

        // Play vs Friend Modal Elements
        this.friendModal = document.getElementById('friendModal');
        this.btnModeFriend = document.getElementById('btnModeFriend');
        this.btnCloseFriendModal = document.getElementById('btnCloseFriendModal');
        this.friendP1DisplayName = document.getElementById('friendP1DisplayName');
        this.inputFriendName = document.getElementById('inputFriendName');
        this.btnStartFriendLocalDuel = document.getElementById('btnStartFriendLocalDuel');
        this.roomCodeDisplay = document.getElementById('roomCodeDisplay');
        this.btnRegenerateRoom = document.getElementById('btnRegenerateRoom');
        this.inputShareLink = document.getElementById('inputShareLink');
        this.btnCopyInviteLink = document.getElementById('btnCopyInviteLink');
        this.copyFeedback = document.getElementById('copyFeedback');

        // Battlefield & Arena Elements
        this.shopTabFighters = document.getElementById('btnShopTabFighters');
        this.shopTabBattlefields = document.getElementById('btnShopTabBattlefields');
        this.shopGrid = document.getElementById('shopGrid');
        this.shopBattlefieldGrid = document.getElementById('shopBattlefieldGrid');
        this.btnBattlefields = document.getElementById('btnBattlefields');
        this.activeArenaBanner = document.getElementById('activeArenaBanner');
        this.activeArenaName = document.getElementById('activeArenaName');
        this.activeArenaReward = document.getElementById('activeArenaReward');
        this.btnCharSelectChangeArena = document.getElementById('btnCharSelectChangeArena');
        this.arenaSelectModal = document.getElementById('arenaSelectModal');
        this.btnCloseArenaModal = document.getElementById('btnCloseArenaModal');
        this.arenaModalGrid = document.getElementById('arenaModalGrid');
    }

    bindEvents() {
        // Mode Buttons
        document.getElementById('btnModeArcade')?.addEventListener('click', () => {
            Sound.playClick();
            this.currentMode = 'arcade';
            this.openCharSelect(1);
        });

        document.getElementById('btnModeFriend')?.addEventListener('click', () => {
            Sound.playClick();
            this.openFriendModal();
        });

        document.getElementById('btnModeVersus')?.addEventListener('click', () => {
            Sound.playClick();
            this.currentMode = 'versus';
            this.openCharSelect(1);
        });

        document.getElementById('btnModePvP')?.addEventListener('click', () => {
            Sound.playClick();
            this.currentMode = 'pvp';
            this.openCharSelect(1);
        });

        document.getElementById('btnModeTraining')?.addEventListener('click', () => {
            Sound.playClick();
            this.currentMode = 'training';
            this.openCharSelect(1);
        });

        document.getElementById('btnShop')?.addEventListener('click', () => {
            Sound.playClick();
            this.openShop('fighters');
        });

        document.getElementById('btnBattlefields')?.addEventListener('click', () => {
            Sound.playClick();
            this.openBattlefieldsShop();
        });

        // Shop Tabs
        this.shopTabFighters?.addEventListener('click', () => {
            Sound.playClick();
            this.switchShopTab('fighters');
        });

        this.shopTabBattlefields?.addEventListener('click', () => {
            Sound.playClick();
            this.switchShopTab('battlefields');
        });

        // Quick Arena Modal Trigger
        this.btnCharSelectChangeArena?.addEventListener('click', () => {
            Sound.playClick();
            this.openArenaSelectModal();
        });

        this.btnCloseArenaModal?.addEventListener('click', () => {
            Sound.playClick();
            this.arenaSelectModal?.classList.add('hidden');
        });

        document.getElementById('btnMoveList')?.addEventListener('click', () => {
            Sound.playClick();
            this.openMoveList();
        });

        document.getElementById('btnCloseMoveList')?.addEventListener('click', () => {
            Sound.playClick();
            this.moveListModal.classList.add('hidden');
        });

        // Sign In & Profile Management Events
        this.btnTopProfile?.addEventListener('click', () => {
            Sound.playClick();
            this.openSignInModal();
        });

        this.btnMenuEditProfile?.addEventListener('click', () => {
            Sound.playClick();
            this.openSignInModal();
        });

        this.formSignIn?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignIn();
        });

        document.getElementById('btnConfirmSignIn')?.addEventListener('click', () => {
            this.handleSignIn();
        });

        this.btnGuestSignIn?.addEventListener('click', () => {
            this.handleGuestSignIn();
        });

        // Avatar Picker selection
        if (this.avatarPicker) {
            const avatarButtons = this.avatarPicker.querySelectorAll('.avatar-opt');
            avatarButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    Sound.playClick();
                    this.selectedAvatar = btn.getAttribute('data-avatar') || '👁️';
                    this.updateAvatarPickerSelection();
                });
            });
        }

        // Play vs Friend Modal Events
        this.btnCloseFriendModal?.addEventListener('click', () => {
            Sound.playClick();
            this.closeFriendModal();
        });

        this.btnRegenerateRoom?.addEventListener('click', () => {
            Sound.playClick();
            this.generateRoomCode();
        });

        this.btnCopyInviteLink?.addEventListener('click', () => {
            this.copyInviteLink();
        });

        this.btnStartFriendLocalDuel?.addEventListener('click', () => {
            this.startFriendLocalDuel();
        });

        // Mobile Fullscreen & Orientation Handlers
        this.btnToggleFullscreen?.addEventListener('click', () => {
            Sound.playClick();
            this.toggleFullscreen();
        });

        this.btnCloseOrientationHint?.addEventListener('click', () => {
            Sound.playClick();
            if (this.mobileOrientationHint) {
                this.mobileOrientationHint.classList.add('hidden');
            }
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.checkMobileOrientation(), 300);
        });
        window.addEventListener('resize', () => {
            this.checkMobileOrientation();
        });

        // Audio Mute Toggle
        document.getElementById('btnToggleMute')?.addEventListener('click', () => {
            const muted = Sound.toggleMute();
            const btn = document.getElementById('btnToggleMute');
            if (btn) btn.textContent = muted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
        });

        // 3D Camera View Toggle
        document.getElementById('btnToggleCam')?.addEventListener('click', () => {
            Sound.playClick();
            if (window.GameInstance) {
                window.GameInstance.cycleCameraMode();
            }
        });

        // Pause Menu buttons
        document.getElementById('btnResume')?.addEventListener('click', () => {
            Sound.playClick();
            window.GameInstance.togglePause();
        });

        document.getElementById('btnRestartMatch')?.addEventListener('click', () => {
            Sound.playClick();
            window.GameInstance.togglePause();
            this.launchGame();
        });

        document.getElementById('btnQuitToMenu')?.addEventListener('click', () => {
            Sound.playClick();
            this.returnToMainMenu();
        });

        // Game Over buttons
        document.getElementById('btnGameOverRematch')?.addEventListener('click', () => {
            Sound.playClick();
            this.gameOverOverlay.classList.add('hidden');
            this.launchGame();
        });

        document.getElementById('btnGameOverNext')?.addEventListener('click', () => {
            Sound.playClick();
            this.gameOverOverlay.classList.add('hidden');
            if (this.currentMode === 'arcade') {
                const nextOpponent = window.GameInstance.arcadeLadder[window.GameInstance.arcadeIndex] || 'sukuna';
                this.selectedP2Char = nextOpponent;
                const profile = StorageManager.getPlayerProfile();
                window.GameInstance.startMatch(this.selectedP1Char, this.selectedP2Char, 'arcade', this.currentDifficulty, this.p1Name || profile.name);
            } else {
                this.returnToMainMenu();
            }
        });

        document.getElementById('btnGameOverMenu')?.addEventListener('click', () => {
            Sound.playClick();
            this.returnToMainMenu();
        });

        // Back from Char Select
        document.getElementById('btnCharSelectBack')?.addEventListener('click', () => {
            Sound.playClick();
            if (window.GameInstance && window.GameInstance.showPreview3D) window.GameInstance.showPreview3D('sukuna');
            this.charSelectScreen.classList.add('hidden');
            this.menuScreen.classList.remove('hidden');
        });

        // Back from Shop
        document.getElementById('btnShopBack')?.addEventListener('click', () => {
            Sound.playClick();
            this.shopScreen.classList.add('hidden');
            this.menuScreen.classList.remove('hidden');
        });

        // Reset Points to 0
        document.getElementById('btnResetPoints')?.addEventListener('click', () => {
            if (confirm('Reset your coins/points balance to 0?')) {
                StorageManager.resetPoints();
                this.updatePointsDisplay();
                this.renderCharCards();
                this.renderShopCards();
                this.renderBattlefieldShopCards();
            }
        });

        // Initialize Virtual Arcade Touch Controls
        this.initTouchControls();
    }

    updatePointsDisplay() {
        const data = StorageManager.load();
        this.pointsElements.forEach(el => {
            el.textContent = `🪙 ${data.points || 0}`;
        });
    }

    returnToMainMenu() {
        if (window.GameInstance) {
            window.GameInstance.state = 'menu';
            window.GameInstance.sound.stopBGM();
            if (window.GameInstance.p1) window.GameInstance.p1.cleanup();
            if (window.GameInstance.p2) window.GameInstance.p2.cleanup();
            window.GameInstance.clearProjectiles();
            if (window.GameInstance.world3d) window.GameInstance.world3d.clearDomain();
            if (window.GameInstance.showPreview3D) window.GameInstance.showPreview3D('sukuna');
        }
        document.body.classList.remove('in-battle');
        if (this.mobileOrientationHint) {
            this.mobileOrientationHint.classList.add('hidden');
        }
        this.pauseOverlay.classList.add('hidden');
        this.gameOverOverlay.classList.add('hidden');
        this.charSelectScreen.classList.add('hidden');
        this.shopScreen.classList.add('hidden');
        this.hudOverlay.classList.add('hidden');
        if (this.signInModal) this.signInModal.classList.add('hidden');
        if (this.friendModal) this.friendModal.classList.add('hidden');
        if (this.touchControls) {
            this.touchControls.classList.add('hidden');
        }
        this.menuScreen.classList.remove('hidden');
        this.updatePointsDisplay();
        this.updateProfileDisplay();
    }

    // ----------------------------------------------------
    // CHARACTER SELECTION SCREEN
    // ----------------------------------------------------
    openCharSelect(forPlayer = 1) {
        this.pickingForPlayer = forPlayer;
        this.menuScreen.classList.add('hidden');
        if (this.friendModal) this.friendModal.classList.add('hidden');
        this.charSelectScreen.classList.remove('hidden');

        const profile = StorageManager.getPlayerProfile();
        const p1Name = this.p1Name || profile.name || 'PLAYER 1';
        const friendName = this.friendName || profile.friendName || 'FRIEND';

        const title = document.getElementById('charSelectTitle');
        if (title) {
            if (this.currentMode === 'pvp' || this.currentMode === 'friend') {
                title.textContent = (forPlayer === 1)
                    ? `SELECT FIGHTER — ${p1Name.toUpperCase()}`
                    : `SELECT FIGHTER — ${friendName.toUpperCase()}`;
            } else {
                title.textContent = `CHOOSE YOUR FIGHTER — ${p1Name.toUpperCase()}`;
            }
        }

        this.updateActiveArenaDisplay();
        this.renderCharCards();
        const defaultChar = (forPlayer === 1) ? this.selectedP1Char : this.selectedP2Char;
        this.selectCharacterCard(defaultChar || 'yuji');
    }

    renderCharCards() {
        const grid = document.getElementById('charSelectGrid');
        if (!grid) return;
        grid.innerHTML = '';

        const chars = Object.keys(CHARACTERS_DATA);

        chars.forEach(key => {
            const char = CHARACTERS_DATA[key];
            const unlocked = StorageManager.isUnlocked(key);

            const card = document.createElement('div');
            card.className = `char-card ${unlocked ? 'unlocked' : 'locked'} ${key === this.selectedP1Char ? 'active' : ''}`;
            card.id = `card-${key}`;

            card.innerHTML = `
                <div class="char-card-portrait" style="border-color: ${char.color}">
                    <div class="char-avatar ${key}"></div>
                </div>
                <div class="char-card-info">
                    <div class="char-card-name">${char.name}</div>
                    <div class="char-card-title" style="color: ${char.color}"><strong>${char.grade || ""}</strong> &bull; ${char.title}</div>
                    <div class="char-card-status">
                        ${unlocked ? '<span class="status-unlocked">UNLOCKED</span>' : `<span class="status-locked">🔒 ${char.cost} PTS</span>`}
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                Sound.playClick();
                this.selectCharacterCard(key);
            });

            grid.appendChild(card);
        });
    }

    selectCharacterCard(key) {
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('active'));
        const activeCard = document.getElementById(`card-${key}`);
        if (activeCard) activeCard.classList.add('active');

        // Show live 3D preview model in 3D Arena
        if (window.GameInstance && window.GameInstance.showPreview3D) {
            window.GameInstance.showPreview3D(key);
        }

        const char = CHARACTERS_DATA[key];
        const unlocked = StorageManager.isUnlocked(key);
        const data = StorageManager.load();

        const previewContainer = document.getElementById('charSelectPreview');
        if (!previewContainer) return;

        let actionBtnHtml = '';
        if (unlocked) {
            actionBtnHtml = `<button id="btnConfirmSelect" class="btn btn-primary btn-large">FIGHT WITH ${char.name.toUpperCase()}</button>`;
        } else {
            const canAfford = (data.points >= char.cost);
            actionBtnHtml = `
                <button id="btnUnlockChar" class="btn ${canAfford ? 'btn-gold' : 'btn-disabled'} btn-large">
                    ${canAfford ? `UNLOCK FOR 🪙 ${char.cost} PTS` : `NEED 🪙 ${char.cost - data.points} MORE PTS`}
                </button>
            `;
        }

        previewContainer.innerHTML = `
            <div class="preview-header">
                <h2 style="color: ${char.color}">${char.name}</h2>
                <div class="preview-title"><strong>${char.grade || ""}</strong> &bull; ${char.title}</div>
                <p class="preview-tagline">${char.tagline}</p>
            </div>

            <div class="preview-stats">
                <div class="stat-bar"><span>HP</span><div class="stat-track"><div style="width: ${(char.stats.hp / 1100) * 100}%; background: #00ff88;"></div></div></div>
                <div class="stat-bar"><span>SPEED</span><div class="stat-track"><div style="width: ${(char.stats.speed / 7) * 100}%; background: #00e5ff;"></div></div></div>
                <div class="stat-bar"><span>DEFENSE</span><div class="stat-track"><div style="width: ${(char.stats.defense / 1.2) * 100}%; background: #ffd700;"></div></div></div>
            </div>

            <div class="preview-moves">
                <h3>ATTACKS & ABILITIES</h3>
                <div class="move-item">
                    <span class="move-key">[J / Z]</span> <strong>${char.attacks.basic.name}:</strong> ${char.attacks.basic.desc}
                </div>
                <div class="move-item">
                    <span class="move-key">[K / X]</span> <strong>${char.attacks.skill1.name}:</strong> ${char.attacks.skill1.desc}
                </div>
                <div class="move-item">
                    <span class="move-key">[L / C]</span> <strong>${char.attacks.skill2.name}:</strong> ${char.attacks.skill2.desc}
                </div>
                <div class="move-item">
                    <span class="move-key">[U / V]</span> <strong style="color: #ff0055">${char.attacks.ultimate.name}:</strong> ${char.attacks.ultimate.desc}
                </div>
                <div class="move-item passive">
                    <span class="move-key">[PASSIVE]</span> <strong>${char.passive.name}:</strong> ${char.passive.desc}
                </div>
            </div>

            <div class="preview-actions">
                ${actionBtnHtml}
            </div>
        `;

        // Action Button Handlers
        const btnConfirm = document.getElementById('btnConfirmSelect');
        if (btnConfirm) {
            btnConfirm.addEventListener('click', () => {
                Sound.playClick();
                if (this.pickingForPlayer === 1) {
                    this.selectedP1Char = key;
                    if (this.currentMode === 'pvp' || this.currentMode === 'friend') {
                        // In PvP / Friend duel, now prompt Player 2 / Friend
                        this.openCharSelect(2);
                    } else if (this.currentMode === 'arcade') {
                        // Start Arcade Ladder round 1
                        this.selectedP2Char = window.GameInstance.arcadeLadder[0];
                        this.launchGame();
                    } else if (this.currentMode === 'training') {
                        this.selectedP2Char = (key === 'sukuna') ? 'gojo' : 'sukuna';
                        this.launchGame();
                    } else {
                        // Versus AI: pick random unlocked or default opponent
                        this.selectedP2Char = (key === 'sukuna') ? 'gojo' : 'sukuna';
                        this.launchGame();
                    }
                } else {
                    this.selectedP2Char = key;
                    this.launchGame();
                }
            });
        }

        const btnUnlock = document.getElementById('btnUnlockChar');
        if (btnUnlock && !unlocked && data.points >= char.cost) {
            btnUnlock.addEventListener('click', () => {
                Sound.playUnlock();
                StorageManager.addPoints(-char.cost);
                StorageManager.unlockCharacter(key);
                this.updatePointsDisplay();
                this.renderCharCards();
                this.selectCharacterCard(key);
            });
        }
    }

    launchGame() {
        this.charSelectScreen.classList.add('hidden');
        this.hudOverlay.classList.remove('hidden');

        // Show touch controls on mobile or touch-enabled devices
        const isTouchOrMobile = ('ontouchstart' in window) || 
                                (navigator.maxTouchPoints > 0) || 
                                (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || 
                                (window.innerWidth <= 900);
        if (this.touchControls && (this.touchEnabled || isTouchOrMobile)) {
            this.touchControls.classList.remove('hidden');
        }

        document.body.classList.add('in-battle');
        if (window.GameInstance && window.GameInstance.handleResize) {
            window.GameInstance.handleResize();
        }
        this.checkMobileOrientation();

        const profile = StorageManager.getPlayerProfile();
        const p1 = this.p1Name || profile.name || 'Sorcerer';
        const p2 = (this.currentMode === 'pvp' || this.currentMode === 'friend') ? (this.friendName || profile.friendName || 'Friend') : null;
        window.GameInstance.startMatch(this.selectedP1Char, this.selectedP2Char, this.currentMode, this.currentDifficulty, p1, p2);
    }

    // ----------------------------------------------------
    // GOD SHOP & UNLOCKS (FIGHTERS & 10 BATTLEFIELDS)
    // ----------------------------------------------------
    openShop(tab = 'fighters') {
        this.menuScreen.classList.add('hidden');
        this.shopScreen.classList.remove('hidden');
        this.updatePointsDisplay();
        this.switchShopTab(tab);
    }

    openBattlefieldsShop() {
        this.openShop('battlefields');
    }

    switchShopTab(tab) {
        if (tab === 'battlefields') {
            this.shopTabFighters?.classList.remove('active');
            this.shopTabBattlefields?.classList.add('active');
            this.shopGrid?.classList.add('hidden');
            this.shopBattlefieldGrid?.classList.remove('hidden');
            this.renderBattlefieldShopCards();
        } else {
            this.shopTabBattlefields?.classList.remove('active');
            this.shopTabFighters?.classList.add('active');
            this.shopBattlefieldGrid?.classList.add('hidden');
            this.shopGrid?.classList.remove('hidden');
            this.renderShopCards();
        }
    }

    renderShopCards() {
        const grid = document.getElementById('shopGrid');
        if (!grid) return;
        grid.innerHTML = '';

        const data = StorageManager.load();
        const chars = Object.keys(CHARACTERS_DATA);

        chars.forEach(key => {
            const char = CHARACTERS_DATA[key];
            const unlocked = StorageManager.isUnlocked(key);
            const canAfford = (data.points >= char.cost);

            const card = document.createElement('div');
            card.className = `shop-card ${unlocked ? 'owned' : ''}`;
            card.innerHTML = `
                <div class="shop-badge" style="background: ${char.color}">
                    ${unlocked ? 'OWNED' : `🪙 ${char.cost} PTS`}
                </div>
                <h3 style="color: ${char.color}">${char.name}</h3>
                <div class="shop-title"><strong>${char.grade || ""}</strong> &bull; ${char.title}</div>
                <p class="shop-tagline">${char.tagline}</p>
                <div class="shop-ultimate">
                    <strong>Ultimate:</strong> ${char.attacks.ultimate.name}
                </div>
                <div class="shop-action">
                    ${unlocked
                        ? '<button class="btn btn-disabled" disabled>ALREADY UNLOCKED</button>'
                        : `<button class="btn ${canAfford ? 'btn-gold' : 'btn-disabled'} btn-buy" data-key="${key}" ${canAfford ? '' : 'disabled'}>
                            ${canAfford ? `UNLOCK FOR 🪙 ${char.cost}` : `NEED 🪙 ${char.cost} PTS`}
                           </button>`
                    }
                </div>
            `;

            const buyBtn = card.querySelector('.btn-buy');
            if (buyBtn && canAfford) {
                buyBtn.addEventListener('click', () => {
                    Sound.playUnlock();
                    StorageManager.addPoints(-char.cost);
                    StorageManager.unlockCharacter(key);
                    this.updatePointsDisplay();
                    this.renderShopCards();
                });
            }

            grid.appendChild(card);
        });
    }

    renderBattlefieldShopCards() {
        const grid = document.getElementById('shopBattlefieldGrid');
        if (!grid || typeof BATTLEFIELDS_DATA === 'undefined') return;
        grid.innerHTML = '';

        const data = StorageManager.load();
        const unlockedFields = (StorageManager.getUnlockedBattlefields) ? StorageManager.getUnlockedBattlefields() : ['jjk_high'];
        const currentActive = (StorageManager.getSelectedBattlefield) ? StorageManager.getSelectedBattlefield() : 'jjk_high';

        Object.keys(BATTLEFIELDS_DATA).forEach(key => {
            const field = BATTLEFIELDS_DATA[key];
            const isUnlocked = unlockedFields.includes(key);
            const isEquipped = (currentActive === key);
            const canAfford = (data.points >= field.cost);

            const card = document.createElement('div');
            card.className = `battlefield-card ${isEquipped ? 'equipped' : ''} ${isUnlocked ? 'owned' : ''}`;

            let badgeText = '';
            let badgeBg = field.accentColor;
            if (isEquipped) {
                badgeText = 'EQUIPPED';
                badgeBg = '#ffd700';
            } else if (isUnlocked) {
                badgeText = 'OWNED';
                badgeBg = '#00e5ff';
            } else {
                badgeText = `🪙 ${field.cost} COINS`;
            }

            let actionHtml = '';
            if (isEquipped) {
                actionHtml = `<button class="btn btn-disabled" disabled style="width: 100%;">✓ EQUIPPED ARENA</button>`;
            } else if (isUnlocked) {
                actionHtml = `<button class="btn btn-gold btn-equip-field" data-key="${key}" style="width: 100%;">SELECT BATTLEFIELD</button>`;
            } else {
                actionHtml = `<button class="btn ${canAfford ? 'btn-gold' : 'btn-disabled'} btn-buy-field" data-key="${key}" ${canAfford ? '' : 'disabled'} style="width: 100%;">
                    ${canAfford ? `UNLOCK FOR 🪙 ${field.cost}` : `NEED 🪙 ${field.cost} COINS`}
                </button>`;
            }

            card.innerHTML = `
                <div class="shop-badge" style="background: ${badgeBg}">
                    ${badgeText}
                </div>
                <div class="battlefield-kanji">${field.kanji || ''}</div>
                <h3 style="color: ${field.accentColor}">${field.name}</h3>
                <div class="shop-title"><strong>${field.tagline}</strong></div>
                <div class="battlefield-reward-pill">
                    <span>WIN MONEY REWARD</span>
                    <strong>${field.winBonusText}</strong>
                </div>
                <p class="shop-tagline" style="font-size: 13px; line-height: 1.4;">${field.desc}</p>
                <div class="shop-action" style="margin-top: 15px;">
                    ${actionHtml}
                </div>
            `;

            const equipBtn = card.querySelector('.btn-equip-field');
            if (equipBtn) {
                equipBtn.addEventListener('click', () => {
                    Sound.playClick();
                    if (window.GameInstance && window.GameInstance.setBattlefield) {
                        window.GameInstance.setBattlefield(key);
                    } else if (typeof StorageManager !== 'undefined') {
                        StorageManager.selectBattlefield(key);
                    }
                    this.updateActiveArenaDisplay();
                    this.renderBattlefieldShopCards();
                });
            }

            const buyBtn = card.querySelector('.btn-buy-field');
            if (buyBtn && canAfford) {
                buyBtn.addEventListener('click', () => {
                    Sound.playUnlock();
                    StorageManager.addPoints(-field.cost);
                    StorageManager.unlockBattlefield(key);
                    if (window.GameInstance && window.GameInstance.setBattlefield) {
                        window.GameInstance.setBattlefield(key);
                    } else if (typeof StorageManager !== 'undefined') {
                        StorageManager.selectBattlefield(key);
                    }
                    this.updatePointsDisplay();
                    this.updateActiveArenaDisplay();
                    this.renderBattlefieldShopCards();
                });
            }

            grid.appendChild(card);
        });
    }

    openArenaSelectModal() {
        if (!this.arenaSelectModal) return;
        this.arenaSelectModal.classList.remove('hidden');
        this.renderArenaModalGrid();
    }

    renderArenaModalGrid() {
        const grid = document.getElementById('arenaModalGrid');
        if (!grid || typeof BATTLEFIELDS_DATA === 'undefined') return;
        grid.innerHTML = '';

        const data = StorageManager.load();
        const unlockedFields = (StorageManager.getUnlockedBattlefields) ? StorageManager.getUnlockedBattlefields() : ['jjk_high'];
        const currentActive = (StorageManager.getSelectedBattlefield) ? StorageManager.getSelectedBattlefield() : 'jjk_high';

        Object.keys(BATTLEFIELDS_DATA).forEach(key => {
            const field = BATTLEFIELDS_DATA[key];
            const isUnlocked = unlockedFields.includes(key);
            const isSelected = (currentActive === key);
            const canAfford = (data.points >= field.cost);

            const item = document.createElement('div');
            item.className = `arena-select-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;

            let badgeHtml = '';
            if (isSelected) {
                badgeHtml = `<span class="arena-select-badge" style="background: #ffd700; color: #000;">SELECTED</span>`;
            } else if (isUnlocked) {
                badgeHtml = `<span class="arena-select-badge" style="background: #00e5ff; color: #000;">UNLOCKED</span>`;
            } else {
                badgeHtml = `<span class="arena-select-badge" style="background: #ff0055; color: #fff;">🪙 ${field.cost}</span>`;
            }

            item.innerHTML = `
                ${badgeHtml}
                <div style="font-size: 11px; color: #8899aa; letter-spacing: 1px;">${field.kanji || ''}</div>
                <h4 style="color: ${field.accentColor}; font-size: 17px; margin: 4px 0;">${field.name}</h4>
                <div style="font-size: 12px; color: #ccc; margin-bottom: 6px;">${field.tagline}</div>
                <div class="battlefield-reward-pill" style="margin: 6px 0; padding: 4px 8px; font-size: 12px;">
                    <span>WIN MONEY</span>
                    <strong>${field.winBonusText}</strong>
                </div>
                <div style="margin-top: 10px;">
                    ${isSelected 
                        ? '<button class="btn btn-disabled btn-micro" disabled style="width: 100%;">✓ EQUIPPED</button>'
                        : (isUnlocked 
                            ? `<button class="btn btn-secondary btn-micro btn-modal-select" data-key="${key}" style="width: 100%;">SELECT ARENA</button>`
                            : `<button class="btn ${canAfford ? 'btn-gold' : 'btn-disabled'} btn-micro btn-modal-unlock" data-key="${key}" ${canAfford ? '' : 'disabled'} style="width: 100%;">
                                ${canAfford ? `UNLOCK 🪙 ${field.cost}` : `NEED 🪙 ${field.cost}`}
                               </button>`
                          )
                    }
                </div>
            `;

            const selectBtn = item.querySelector('.btn-modal-select');
            if (selectBtn) {
                selectBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    Sound.playClick();
                    if (window.GameInstance && window.GameInstance.setBattlefield) {
                        window.GameInstance.setBattlefield(key);
                    } else if (typeof StorageManager !== 'undefined') {
                        StorageManager.selectBattlefield(key);
                    }
                    this.updateActiveArenaDisplay();
                    this.arenaSelectModal?.classList.add('hidden');
                });
            }

            const unlockBtn = item.querySelector('.btn-modal-unlock');
            if (unlockBtn && canAfford) {
                unlockBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    Sound.playUnlock();
                    StorageManager.addPoints(-field.cost);
                    StorageManager.unlockBattlefield(key);
                    if (window.GameInstance && window.GameInstance.setBattlefield) {
                        window.GameInstance.setBattlefield(key);
                    } else if (typeof StorageManager !== 'undefined') {
                        StorageManager.selectBattlefield(key);
                    }
                    this.updatePointsDisplay();
                    this.updateActiveArenaDisplay();
                    this.renderArenaModalGrid();
                });
            }

            item.addEventListener('click', () => {
                if (isUnlocked) {
                    Sound.playClick();
                    if (window.GameInstance && window.GameInstance.setBattlefield) {
                        window.GameInstance.setBattlefield(key);
                    } else if (typeof StorageManager !== 'undefined') {
                        StorageManager.selectBattlefield(key);
                    }
                    this.updateActiveArenaDisplay();
                    this.arenaSelectModal?.classList.add('hidden');
                }
            });

            grid.appendChild(item);
        });
    }

    updateActiveArenaDisplay() {
        const activeKey = (typeof StorageManager !== 'undefined' && StorageManager.getSelectedBattlefield) 
            ? StorageManager.getSelectedBattlefield() 
            : 'jjk_high';
        const field = (typeof BATTLEFIELDS_DATA !== 'undefined' && BATTLEFIELDS_DATA[activeKey]) 
            ? BATTLEFIELDS_DATA[activeKey] 
            : null;

        if (this.activeArenaName && field) {
            this.activeArenaName.textContent = field.name;
            this.activeArenaName.style.color = field.accentColor;
        }
        if (this.activeArenaReward && field) {
            this.activeArenaReward.textContent = `(${field.winBonusText})`;
        }
    }

    // ----------------------------------------------------
    // MOVE LIST & GOD CODEX
    // ----------------------------------------------------
    openMoveList() {
        this.moveListModal.classList.remove('hidden');
        const container = document.getElementById('moveListContent');
        if (!container) return;

        let html = '';
        for (const key in CHARACTERS_DATA) {
            const c = CHARACTERS_DATA[key];
            html += `
                <div class="codex-entry" style="border-left: 4px solid ${c.color}">
                    <h3 style="color: ${c.color}">${c.name} — <small>${c.title}</small></h3>
                    <p><em>${c.tagline}</em></p>
                    <table class="codex-table">
                        <tr><th>Move</th><th>Command</th><th>Type</th><th>Damage</th><th>Cooldown</th><th>Description</th></tr>
                        <tr>
                            <td><strong>${c.attacks.basic.name}</strong></td>
                            <td><code>J / Z</code></td>
                            <td>${c.attacks.basic.type}</td>
                            <td>${c.attacks.basic.damage}</td>
                            <td>${c.attacks.basic.cooldown}s</td>
                            <td>${c.attacks.basic.desc}</td>
                        </tr>
                        <tr>
                            <td><strong>${c.attacks.skill1.name}</strong></td>
                            <td><code>K / X</code></td>
                            <td>${c.attacks.skill1.type}</td>
                            <td>${c.attacks.skill1.damage}</td>
                            <td>${c.attacks.skill1.cooldown}s</td>
                            <td>${c.attacks.skill1.desc}</td>
                        </tr>
                        <tr>
                            <td><strong>${c.attacks.skill2.name}</strong></td>
                            <td><code>L / C</code></td>
                            <td>${c.attacks.skill2.type}</td>
                            <td>${c.attacks.skill2.damage}</td>
                            <td>${c.attacks.skill2.cooldown}s</td>
                            <td>${c.attacks.skill2.desc}</td>
                        </tr>
                        <tr style="background: rgba(255, 0, 85, 0.1);">
                            <td><strong style="color: #ff0055">${c.attacks.ultimate.name}</strong></td>
                            <td><code>U / V</code></td>
                            <td>${c.attacks.ultimate.type}</td>
                            <td>${c.attacks.ultimate.damage}</td>
                            <td>${c.attacks.ultimate.cooldown}s</td>
                            <td>${c.attacks.ultimate.desc}</td>
                        </tr>
                        <tr>
                            <td colspan="6"><strong>Passive (${c.passive.name}):</strong> ${c.passive.desc}</td>
                        </tr>
                    </table>
                </div>
            `;
        }
        container.innerHTML = html;
    }

    // ----------------------------------------------------
    // OVERLAYS: PAUSE & GAME OVER
    // ----------------------------------------------------
    showPause(show = true) {
        if (show) {
            this.pauseOverlay.classList.remove('hidden');
            if (this.touchControls) this.touchControls.classList.add('hidden');
        } else {
            this.pauseOverlay.classList.add('hidden');
            if (this.touchControls && this.touchEnabled) this.touchControls.classList.remove('hidden');
        }
    }

    showGameOver(p1Won, points, p1Rounds, p2Rounds, arcadeIdx, p1Name = 'Player 1', p2Name = 'Player 2', isPvP = false, arenaName = 'Jujutsu High Courtyard', arenaBaseReward = 350) {
        if (this.touchControls) this.touchControls.classList.add('hidden');
        this.gameOverOverlay.classList.remove('hidden');
        const titleEl = document.getElementById('gameOverTitle');
        const pointsEl = document.getElementById('gameOverPoints');
        const scoreEl = document.getElementById('gameOverScore');
        const nextBtn = document.getElementById('btnGameOverNext');
        const battlefieldEl = document.getElementById('gameOverBattlefield');

        if (battlefieldEl) {
            battlefieldEl.textContent = `🗺️ Battlefield: ${arenaName} (+🪙 ${arenaBaseReward} Base Reward)`;
        }

        if (titleEl) {
            if (p1Won) {
                titleEl.textContent = `${p1Name} WINS!`;
                titleEl.style.color = '#ffd700';
            } else if (isPvP) {
                titleEl.textContent = `${p2Name} WINS!`;
                titleEl.style.color = '#ff0055';
            } else {
                titleEl.textContent = 'DEFEAT!';
                titleEl.style.color = '#ff0033';
            }
        }
        if (pointsEl) {
            pointsEl.textContent = `+🪙 ${points} Battle Points Earned!`;
        }
        if (scoreEl) {
            scoreEl.textContent = `Final Rounds: ${p1Name} [ ${p1Rounds} ] - [ ${p2Rounds} ] ${p2Name}`;
        }

        if (nextBtn) {
            if (this.currentMode === 'arcade' && p1Won) {
                if (arcadeIdx >= window.GameInstance.arcadeLadder.length) {
                    nextBtn.textContent = 'LADDER CHAMPION! FINISH';
                } else {
                    nextBtn.textContent = `NEXT OPPONENT: ${window.GameInstance.arcadeLadder[arcadeIdx].toUpperCase()}`;
                }
                nextBtn.classList.remove('hidden');
            } else {
                nextBtn.classList.add('hidden');
            }
        }

        this.updatePointsDisplay();
    }

    // ----------------------------------------------------
    // VIRTUAL ARCADE TOUCH CONTROLS (U, K, L, J, S, D-Pad)
    // ----------------------------------------------------
    initTouchControls() {
        if (!this.touchControls) return;

        this.updateTouchToggleButton();

        this.btnToggleTouch?.addEventListener('click', () => {
            Sound.playClick();
            this.touchEnabled = !this.touchEnabled;
            localStorage.setItem('battle_arena_touch_enabled', this.touchEnabled ? 'true' : 'false');
            this.updateTouchToggleButton();
            if (window.GameInstance && window.GameInstance.state === 'fighting') {
                this.touchControls.classList.toggle('hidden', !this.touchEnabled);
            }
        });

        // Helper to bind tactile multi-touch pointer & touch events
        const bindKey = (btnId, onDown, onUp) => {
            const btn = document.getElementById(btnId);
            if (!btn) return;

            let isPressed = false;

            const handleDown = (e) => {
                if (e.cancelable) e.preventDefault();
                e.stopPropagation();
                if (isPressed) return;
                isPressed = true;
                btn.classList.add('touch-active');
                if (window.GameInstance && window.GameInstance.sound) {
                    window.GameInstance.sound.resume();
                }
                if (onDown) onDown();
            };

            const handleUp = (e) => {
                if (e.cancelable) e.preventDefault();
                e.stopPropagation();
                if (!isPressed) return;
                isPressed = false;
                btn.classList.remove('touch-active');
                if (onUp) onUp();
            };

            btn.addEventListener('pointerdown', handleDown, { passive: false });
            btn.addEventListener('pointerup', handleUp, { passive: false });
            btn.addEventListener('pointercancel', handleUp, { passive: false });

            btn.addEventListener('touchstart', handleDown, { passive: false });
            btn.addEventListener('touchend', handleUp, { passive: false });
            btn.addEventListener('touchcancel', handleUp, { passive: false });
        };

        // 3D Navigation: Forward (KeyW)
        bindKey('btnTouchUp',
            () => {
                if (window.GameInstance) {
                    window.GameInstance.keys['KeyW'] = true;
                }
            },
            () => {
                if (window.GameInstance) {
                    window.GameInstance.keys['KeyW'] = false;
                }
            }
        );

        // 3D Navigation: Backward (KeyS)
        bindKey('btnTouchDown',
            () => {
                if (window.GameInstance) {
                    window.GameInstance.keys['KeyS'] = true;
                }
            },
            () => {
                if (window.GameInstance) {
                    window.GameInstance.keys['KeyS'] = false;
                }
            }
        );

        // Move Left (KeyA)
        bindKey('btnTouchLeft',
            () => {
                if (window.GameInstance) {
                    window.GameInstance.keys['KeyA'] = true;
                }
            },
            () => {
                if (window.GameInstance) {
                    window.GameInstance.keys['KeyA'] = false;
                }
            }
        );

        // Move Right (KeyD)
        bindKey('btnTouchRight',
            () => {
                if (window.GameInstance) {
                    window.GameInstance.keys['KeyD'] = true;
                }
            },
            () => {
                if (window.GameInstance) {
                    window.GameInstance.keys['KeyD'] = false;
                }
            }
        );

        // Camera Toggle
        bindKey('btnTouchCam', () => {
            if (window.GameInstance) {
                window.GameInstance.cycleCameraMode();
            }
        });

        // Jump (KeyW / Space)
        bindKey('btnTouchJump', () => {
            if (window.GameInstance && window.GameInstance.p1) {
                window.GameInstance.p1.jump();
            }
        });

        // Guard / Block (KeyS)
        bindKey('btnTouchS',
            () => {
                if (window.GameInstance) {
                    window.GameInstance.keys['KeyS'] = true;
                    if (window.GameInstance.p1) window.GameInstance.p1.startBlock();
                }
            },
            () => {
                if (window.GameInstance) {
                    window.GameInstance.keys['KeyS'] = false;
                    if (window.GameInstance.p1) window.GameInstance.p1.stopBlock();
                }
            }
        );

        // Basic Attack (KeyJ)
        bindKey('btnTouchJ', () => {
            if (window.GameInstance && window.GameInstance.p1) {
                window.GameInstance.p1.triggerBasicAttack();
            }
        });

        // Skill 1 (KeyK)
        bindKey('btnTouchK', () => {
            if (window.GameInstance && window.GameInstance.p1) {
                window.GameInstance.p1.triggerSkill1();
            }
        });

        // Skill 2 (KeyL)
        bindKey('btnTouchL', () => {
            if (window.GameInstance && window.GameInstance.p1) {
                window.GameInstance.p1.triggerSkill2();
            }
        });

        // Ultimate (KeyU)
        bindKey('btnTouchU', () => {
            if (window.GameInstance && window.GameInstance.p1) {
                window.GameInstance.p1.triggerUltimate();
            }
        });

        // Mobile Pause Button
        bindKey('btnTouchPause', () => {
            if (window.GameInstance) {
                window.GameInstance.togglePause();
            }
        });
    }

    // ----------------------------------------------------
    // SORCERER SIGN-IN & PROFILE MANAGEMENT
    // ----------------------------------------------------
    initProfile() {
        const profile = StorageManager.getPlayerProfile();
        this.p1Name = profile.name;
        this.selectedAvatar = profile.avatar || '👁️';
        this.friendName = profile.friendName || 'Friend';

        this.updateProfileDisplay();

        // If player has never signed in before, show Sign In Modal upon launch!
        if (!profile.isRegistered) {
            setTimeout(() => {
                this.openSignInModal();
            }, 350);
        }
    }

    updateProfileDisplay() {
        const profile = StorageManager.getPlayerProfile();
        const name = this.p1Name || profile.name || 'Sorcerer';
        const title = profile.title || 'Special Grade Sorcerer';
        const avatar = this.selectedAvatar || profile.avatar || '👁️';

        if (this.topProfileAvatar) this.topProfileAvatar.textContent = avatar;
        if (this.topProfileName) this.topProfileName.textContent = name;
        if (this.menuProfileAvatar) this.menuProfileAvatar.textContent = avatar;
        if (this.menuProfileName) this.menuProfileName.textContent = name;
        if (this.menuProfileTitle) this.menuProfileTitle.textContent = title;
        if (this.friendP1DisplayName) this.friendP1DisplayName.textContent = `${avatar} ${name}`;
    }

    openSignInModal() {
        if (!this.signInModal) return;
        const profile = StorageManager.getPlayerProfile();
        if (this.inputPlayerName) {
            this.inputPlayerName.value = profile.isRegistered ? profile.name : '';
            this.inputPlayerName.placeholder = profile.isRegistered ? profile.name : 'Enter Sorcerer Name...';
        }
        if (this.selectPlayerTitle && profile.title) {
            this.selectPlayerTitle.value = profile.title;
        }
        this.selectedAvatar = profile.avatar || '👁️';
        this.updateAvatarPickerSelection();
        this.signInModal.classList.remove('hidden');
        if (this.inputPlayerName) {
            setTimeout(() => this.inputPlayerName.focus(), 150);
        }
    }

    closeSignInModal() {
        if (this.signInModal) this.signInModal.classList.add('hidden');
    }

    updateAvatarPickerSelection() {
        if (!this.avatarPicker) return;
        const buttons = this.avatarPicker.querySelectorAll('.avatar-opt');
        buttons.forEach(btn => {
            if (btn.getAttribute('data-avatar') === this.selectedAvatar) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    handleSignIn() {
        let name = this.inputPlayerName ? this.inputPlayerName.value.trim() : '';
        if (!name) name = 'Sorcerer';
        const title = this.selectPlayerTitle ? this.selectPlayerTitle.value : 'Special Grade Sorcerer';
        const avatar = this.selectedAvatar || '👁️';

        StorageManager.savePlayerProfile({
            name: name,
            title: title,
            avatar: avatar,
            isRegistered: true
        });

        this.p1Name = name;
        this.updateProfileDisplay();
        this.closeSignInModal();
        Sound.playUnlock();

        if (window.GameInstance && window.GameInstance.particles) {
            window.GameInstance.particles.addFloatingText(`WELCOME, ${name.toUpperCase()}!`, 0, 4.0, '#ffd700', 32, true);
        }
    }

    handleGuestSignIn() {
        StorageManager.savePlayerProfile({
            name: 'Guest Sorcerer',
            title: 'Tokyo Jujutsu Tech',
            avatar: '⚡',
            isRegistered: true
        });
        this.p1Name = 'Guest Sorcerer';
        this.selectedAvatar = '⚡';
        this.updateProfileDisplay();
        this.closeSignInModal();
        Sound.playClick();
    }

    // ----------------------------------------------------
    // PLAY VS FRIEND MODAL & LOGIC
    // ----------------------------------------------------
    openFriendModal(challengerName = null) {
        if (!this.friendModal) return;
        this.updateProfileDisplay();

        if (challengerName) {
            this.friendName = challengerName;
            if (this.inputFriendName) this.inputFriendName.value = challengerName;
        } else {
            const profile = StorageManager.getPlayerProfile();
            if (this.inputFriendName) this.inputFriendName.value = profile.friendName || 'Friend';
        }

        this.generateRoomCode();
        this.friendModal.classList.remove('hidden');
        if (this.copyFeedback) this.copyFeedback.classList.add('hidden');
    }

    closeFriendModal() {
        if (this.friendModal) this.friendModal.classList.add('hidden');
    }

    generateRoomCode() {
        const rand = Math.floor(1000 + Math.random() * 9000);
        this.roomCode = `JJK-${rand}`;
        if (this.roomCodeDisplay) this.roomCodeDisplay.textContent = this.roomCode;

        const profile = StorageManager.getPlayerProfile();
        const p1 = encodeURIComponent(this.p1Name || profile.name || 'Sorcerer');
        const shareUrl = `${window.location.origin}${window.location.pathname}?mode=friend&challenger=${p1}&room=${this.roomCode}`;
        if (this.inputShareLink) this.inputShareLink.value = shareUrl;
    }

    copyInviteLink() {
        if (!this.inputShareLink) return;
        const url = this.inputShareLink.value;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                if (this.copyFeedback) this.copyFeedback.classList.remove('hidden');
                Sound.playClick();
            }).catch(() => {
                this.inputShareLink.select();
                document.execCommand('copy');
                if (this.copyFeedback) this.copyFeedback.classList.remove('hidden');
            });
        } else {
            this.inputShareLink.select();
            document.execCommand('copy');
            if (this.copyFeedback) this.copyFeedback.classList.remove('hidden');
        }
    }

    startFriendLocalDuel() {
        Sound.playClick();
        let friend = this.inputFriendName ? this.inputFriendName.value.trim() : '';
        if (!friend) friend = 'Friend';
        this.friendName = friend;

        StorageManager.savePlayerProfile({ friendName: friend });

        this.currentMode = 'friend';
        this.closeFriendModal();
        this.openCharSelect(1);
    }

    checkURLParams() {
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('mode') === 'friend' || params.has('challenger')) {
                const challenger = params.get('challenger') || 'Rival Sorcerer';
                setTimeout(() => {
                    this.openFriendModal(challenger);
                    if (window.GameInstance && window.GameInstance.particles) {
                        window.GameInstance.particles.addFloatingText(`⚔️ CHALLENGE FROM ${challenger.toUpperCase()}!`, 0, 4.5, '#00e5ff', 30, true);
                    }
                }, 500);
            }
        } catch (e) {
            console.warn('URL params check failed', e);
        }
    }

    checkMobileOrientation() {
        if (!this.mobileOrientationHint) return;
        const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 900);
        const isPortrait = window.innerHeight > window.innerWidth;
        if (isMobile && isPortrait && window.GameInstance && window.GameInstance.state === 'fighting') {
            this.mobileOrientationHint.classList.remove('hidden');
            setTimeout(() => {
                if (this.mobileOrientationHint) this.mobileOrientationHint.classList.add('hidden');
            }, 5500);
        } else {
            this.mobileOrientationHint.classList.add('hidden');
        }
    }

    toggleFullscreen() {
        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        } catch (e) {
            console.warn('Fullscreen request failed', e);
        }
    }

    updateTouchToggleButton() {
        if (!this.btnToggleTouch) return;
        this.btnToggleTouch.textContent = this.touchEnabled ? '📱 Touch: ON' : '📱 Touch: OFF';
    }

    updateTouchHUD(p1) {
        if (!this.btnTouchU || !p1) return;
        if (p1.energy >= 100 && p1.cooldowns.ultimate <= 0) {
            this.btnTouchU.classList.add('ultimate-ready');
        } else {
            this.btnTouchU.classList.remove('ultimate-ready');
        }
    }
}

// Global UI singleton
window.addEventListener('DOMContentLoaded', () => {
    window.UI = new UIManager();
});