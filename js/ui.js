// UI Manager: Menus, Character Selection, Shop, Move List & Overlays
// Battle Arena: Clash of Sorcerors

class UIManager {
    constructor() {
        this.selectedP1Char = 'yuji';
        this.selectedP2Char = 'zeus';
        this.pickingForPlayer = 1; // 1 or 2
        this.currentMode = 'arcade';
        this.currentDifficulty = 'medium';

        this.initDOMElements();
        this.bindEvents();
        this.updatePointsDisplay();
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
    }

    bindEvents() {
        // Mode Buttons
        document.getElementById('btnModeArcade')?.addEventListener('click', () => {
            Sound.playClick();
            this.currentMode = 'arcade';
            this.openCharSelect(1);
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
            this.openShop();
        });

        document.getElementById('btnMoveList')?.addEventListener('click', () => {
            Sound.playClick();
            this.openMoveList();
        });

        document.getElementById('btnCloseMoveList')?.addEventListener('click', () => {
            Sound.playClick();
            this.moveListModal.classList.add('hidden');
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
            window.GameInstance.startMatch(this.selectedP1Char, this.selectedP2Char, this.currentMode, this.currentDifficulty);
        });

        document.getElementById('btnQuitToMenu')?.addEventListener('click', () => {
            Sound.playClick();
            this.returnToMainMenu();
        });

        // Game Over buttons
        document.getElementById('btnGameOverRematch')?.addEventListener('click', () => {
            Sound.playClick();
            this.gameOverOverlay.classList.add('hidden');
            window.GameInstance.startMatch(this.selectedP1Char, this.selectedP2Char, this.currentMode, this.currentDifficulty);
        });

        document.getElementById('btnGameOverNext')?.addEventListener('click', () => {
            Sound.playClick();
            this.gameOverOverlay.classList.add('hidden');
            if (this.currentMode === 'arcade') {
                const nextOpponent = window.GameInstance.arcadeLadder[window.GameInstance.arcadeIndex] || 'sukuna';
                this.selectedP2Char = nextOpponent;
                window.GameInstance.startMatch(this.selectedP1Char, this.selectedP2Char, 'arcade', this.currentDifficulty);
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
            if (window.GameInstance && window.GameInstance.clearPreview3D) window.GameInstance.clearPreview3D();
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
            if (window.GameInstance.clearPreview3D) window.GameInstance.clearPreview3D();
            if (window.GameInstance.p1) window.GameInstance.p1.cleanup();
            if (window.GameInstance.p2) window.GameInstance.p2.cleanup();
            window.GameInstance.clearProjectiles();
            if (window.GameInstance.world3d) window.GameInstance.world3d.clearDomain();
        }
        this.pauseOverlay.classList.add('hidden');
        this.gameOverOverlay.classList.add('hidden');
        this.charSelectScreen.classList.add('hidden');
        this.shopScreen.classList.add('hidden');
        this.hudOverlay.classList.add('hidden');
        if (this.touchControls) {
            this.touchControls.classList.add('hidden');
        }
        this.menuScreen.classList.remove('hidden');
        this.updatePointsDisplay();
    }

    // ----------------------------------------------------
    // CHARACTER SELECTION SCREEN
    // ----------------------------------------------------
    openCharSelect(forPlayer = 1) {
        this.pickingForPlayer = forPlayer;
        this.menuScreen.classList.add('hidden');
        this.charSelectScreen.classList.remove('hidden');

        const title = document.getElementById('charSelectTitle');
        if (title) {
            title.textContent = (this.currentMode === 'pvp')
                ? `SELECT FIGHTER - PLAYER ${forPlayer}`
                : 'CHOOSE YOUR FIGHTER';
        }

        this.renderCharCards();
        this.selectCharacterCard(this.selectedP1Char);
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
                    if (this.currentMode === 'pvp') {
                        // In PvP, now prompt Player 2
                        this.openCharSelect(2);
                    } else if (this.currentMode === 'arcade') {
                        // Start Arcade Ladder round 1 vs Zeus
                        this.selectedP2Char = window.GameInstance.arcadeLadder[0];
                        this.launchGame();
                    } else if (this.currentMode === 'training') {
                        this.selectedP2Char = (key === 'sukuna') ? 'gojo' : ((key === 'gojo') ? 'sukuna' : 'sukuna');
                        this.launchGame();
                    } else {
                        // Versus AI: pick random unlocked or default opponent
                        this.selectedP2Char = (key === 'sukuna') ? 'gojo' : ((key === 'gojo') ? 'sukuna' : 'sukuna');
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
        if (this.touchControls && this.touchEnabled) {
            this.touchControls.classList.remove('hidden');
        }
        window.GameInstance.startMatch(this.selectedP1Char, this.selectedP2Char, this.currentMode, this.currentDifficulty);
    }

    // ----------------------------------------------------
    // GOD SHOP & UNLOCKS
    // ----------------------------------------------------
    openShop() {
        this.menuScreen.classList.add('hidden');
        this.shopScreen.classList.remove('hidden');
        this.updatePointsDisplay();
        this.renderShopCards();
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

    showGameOver(p1Won, points, p1Rounds, p2Rounds, arcadeIdx) {
        if (this.touchControls) this.touchControls.classList.add('hidden');
        this.gameOverOverlay.classList.remove('hidden');
        const titleEl = document.getElementById('gameOverTitle');
        const pointsEl = document.getElementById('gameOverPoints');
        const scoreEl = document.getElementById('gameOverScore');
        const nextBtn = document.getElementById('btnGameOverNext');

        if (titleEl) {
            titleEl.textContent = p1Won ? 'VICTORY!' : 'DEFEAT!';
            titleEl.style.color = p1Won ? '#ffd700' : '#ff0033';
        }
        if (pointsEl) {
            pointsEl.textContent = `+🪙 ${points} Battle Points Earned!`;
        }
        if (scoreEl) {
            scoreEl.textContent = `Final Rounds: P1 [ ${p1Rounds} ] - [ ${p2Rounds} ] P2`;
        }

        if (nextBtn) {
            if (this.currentMode === 'arcade' && p1Won) {
                if (arcadeIdx >= window.GameInstance.arcadeLadder.length) {
                    nextBtn.textContent = 'LADDER CHAMPION! FINISH';
                } else {
                    nextBtn.textContent = `NEXT GOD: ${window.GameInstance.arcadeLadder[arcadeIdx].toUpperCase()}`;
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

        // Helper to bind tactile multi-touch pointer events with pointer capture
        const bindKey = (btnId, onDown, onUp) => {
            const btn = document.getElementById(btnId);
            if (!btn) return;

            let activeId = null;

            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (activeId !== null) return;
                activeId = e.pointerId;
                try { btn.setPointerCapture(e.pointerId); } catch (_) {}
                btn.classList.add('touch-active');
                if (window.GameInstance && window.GameInstance.sound) {
                    window.GameInstance.sound.resume();
                }
                if (onDown) onDown();
            }, { passive: false });

            const release = (e) => {
                if (e.pointerId !== activeId) return;
                e.preventDefault();
                e.stopPropagation();
                activeId = null;
                try { btn.releasePointerCapture(e.pointerId); } catch (_) {}
                btn.classList.remove('touch-active');
                if (onUp) onUp();
            };

            btn.addEventListener('pointerup', release, { passive: false });
            btn.addEventListener('pointercancel', release, { passive: false });
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