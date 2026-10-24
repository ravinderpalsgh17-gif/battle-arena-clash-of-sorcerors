// Master Game Engine: Loop, Stages, Modes, Combat Resolution & Input
// Battle Arena: Clash of Sorcerors

class BattleArenaGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 1280;
        this.height = 720;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.particles = new ParticleEngine();
        this.sound = Sound;

        this.mode = 'arcade'; // arcade, versus, pvp, training
        this.stage = 'olympus'; // olympus, underworld, celestial, shinjuku
        this.difficulty = 'medium';

        // Fighters
        this.p1 = null;
        this.p2 = null;
        this.p2AI = null;

        // Round & Game State
        this.state = 'menu'; // menu, char_select, shop, fighting, round_over, match_over, paused
        this.roundTimer = 99;
        this.timerInterval = null;
        this.p1RoundsWon = 0;
        this.p2RoundsWon = 0;
        this.currentRound = 1;

        // Arcade Ladder Progression
        this.arcadeLadder = ['zeus', 'anubis', 'wukong', 'sukuna'];
        this.arcadeIndex = 0;

        // Input tracking
        this.keys = {};
        this.initInputListeners();

        // Projectiles container
        this.particles.projectiles = [];

        // Animation frame
        this.lastTime = 0;
        this.animId = null;

        // Screen Freeze / Hitstop for juicy arcade impact feel
        this.hitstopFrames = 0;
    }

    initInputListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            // Audio unlock on first user gesture
            this.sound.resume();

            if (this.state !== 'fighting') return;

            // Player 1 Controls (WASD + J, K, L, U + Space)
            if (this.p1 && this.p1.canAct()) {
                if (e.code === 'KeyW' || e.code === 'Space') this.p1.jump();
                if (e.code === 'KeyS') this.p1.startBlock();
                if (e.code === 'KeyJ') this.p1.triggerBasicAttack();
                if (e.code === 'KeyK') this.p1.triggerSkill1();
                if (e.code === 'KeyL') this.p1.triggerSkill2();
                if (e.code === 'KeyU') this.p1.triggerUltimate();
            }

            // Player 2 Controls for Local PvP (Arrow Keys + Numpad / Alternate Keys)
            if (this.mode === 'pvp' && this.p2 && this.p2.canAct()) {
                if (e.code === 'ArrowUp') this.p2.jump();
                if (e.code === 'ArrowDown') this.p2.startBlock();
                if (e.code === 'Numpad1' || e.code === 'Digit1') this.p2.triggerBasicAttack();
                if (e.code === 'Numpad2' || e.code === 'Digit2') this.p2.triggerSkill1();
                if (e.code === 'Numpad3' || e.code === 'Digit3') this.p2.triggerSkill2();
                if (e.code === 'Numpad5' || e.code === 'Digit5' || e.code === 'Digit0') this.p2.triggerUltimate();
            }

            // Pause
            if (e.code === 'Escape' || e.code === 'KeyP') {
                this.togglePause();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;

            if (this.p1) {
                if (e.code === 'KeyS') this.p1.stopBlock();
                if (e.code === 'KeyA' || e.code === 'KeyD') {
                    if (!this.keys['KeyA'] && !this.keys['KeyD']) this.p1.stopMoving();
                }
            }

            if (this.mode === 'pvp' && this.p2) {
                if (e.code === 'ArrowDown') this.p2.stopBlock();
                if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                    if (!this.keys['ArrowLeft'] && !this.keys['ArrowRight']) this.p2.stopMoving();
                }
            }
        });
    }

    // Start a match between selected fighters
    startMatch(p1CharKey, p2CharKey, mode = 'arcade', difficulty = 'medium') {
        this.mode = mode;
        this.difficulty = difficulty;

        // Choose stage appropriate to the opponent or mode
        if (p2CharKey === 'zeus') this.stage = 'olympus';
        else if (p2CharKey === 'anubis') this.stage = 'underworld';
        else if (p2CharKey === 'wukong') this.stage = 'celestial';
        else if (p2CharKey === 'sukuna') this.stage = 'shinjuku';
        else this.stage = 'olympus';

        this.p1 = new Fighter(p1CharKey, 280, false, this.particles, this.sound);
        this.p2 = new Fighter(p2CharKey, 930, true, this.particles, this.sound);

        this.p1.setOpponent(this.p2);
        this.p2.setOpponent(this.p1);

        if (this.mode !== 'pvp') {
            this.p2AI = new AIController(this.p2, this.difficulty);
        } else {
            this.p2AI = null;
        }

        this.p1RoundsWon = 0;
        this.p2RoundsWon = 0;
        this.currentRound = 1;

        this.startRound();
        this.state = 'fighting';
        this.sound.startBGM();

        if (window.UI && window.UI.touchControls && window.UI.touchEnabled) {
            window.UI.touchControls.classList.remove('hidden');
        }

        // Start render loop if not running
        if (!this.animId) {
            this.loop(0);
        }
    }

    startRound() {
        this.p1.hp = this.p1.maxHp;
        this.p1.displayedHp = this.p1.maxHp;
        this.p1.ghostHp = this.p1.maxHp;
        this.p1.x = 280;
        this.p1.y = 420;
        this.p1.vx = 0;
        this.p1.vy = 0;
        this.p1.state = 'idle';
        this.p1.direction = 1;

        this.p2.hp = this.p2.maxHp;
        this.p2.displayedHp = this.p2.maxHp;
        this.p2.ghostHp = this.p2.maxHp;
        this.p2.x = 930;
        this.p2.y = 420;
        this.p2.vx = 0;
        this.p2.vy = 0;
        this.p2.state = 'idle';
        this.p2.direction = -1;

        this.particles.reset();
        this.roundTimer = (this.mode === 'training') ? 999 : 99;

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.state === 'fighting' && this.mode !== 'training') {
                this.roundTimer--;
                if (this.roundTimer <= 0) {
                    this.roundTimer = 0;
                    this.handleRoundEnd(true); // Timeout
                }
            }
        }, 1000);

        this.particles.addFloatingText(`ROUND ${this.currentRound}`, this.width / 2, 280, '#ffd700', 48);
        this.particles.addFloatingText('FIGHT!', this.width / 2, 350, '#ff0033', 54);
        this.sound.playThunder();
    }

    handleRoundEnd(isTimeout = false) {
        clearInterval(this.timerInterval);
        this.state = 'round_over';

        let winner = null;
        if (isTimeout) {
            winner = (this.p1.hp > this.p2.hp) ? this.p1 : ((this.p2.hp > this.p1.hp) ? this.p2 : null);
        } else {
            winner = (this.p1.state === 'dead') ? this.p2 : this.p1;
        }

        if (winner === this.p1) {
            this.p1RoundsWon++;
            this.particles.addFloatingText('P1 WINS ROUND!', this.width / 2, 300, '#00e5ff', 44);
        } else if (winner === this.p2) {
            this.p2RoundsWon++;
            this.particles.addFloatingText('P2 WINS ROUND!', this.width / 2, 300, '#ff0055', 44);
        } else {
            this.particles.addFloatingText('DRAW!', this.width / 2, 300, '#ffffff', 44);
        }

        setTimeout(() => {
            // Check Match winner (Best of 3)
            const roundsToWin = (this.mode === 'training') ? 999 : 2;
            if (this.p1RoundsWon >= roundsToWin || this.p2RoundsWon >= roundsToWin) {
                this.handleMatchEnd(winner);
            } else {
                this.currentRound++;
                this.state = 'fighting';
                this.startRound();
            }
        }, 2500);
    }

    handleMatchEnd(winner) {
        this.state = 'match_over';
        const p1Won = (winner === this.p1);

        let earnedPoints = 0;
        if (p1Won) {
            this.sound.playVictory();
            // Calculate Points Reward
            const basePoints = (this.difficulty === 'deity') ? 600 : ((this.difficulty === 'hard') ? 450 : 300);
            const comboBonus = Math.min(200, this.p1.comboCount * 20);
            const timeBonus = Math.floor(this.roundTimer * 2);
            earnedPoints = basePoints + comboBonus + timeBonus;

            // Save points to user storage
            StorageManager.addPoints(earnedPoints);

            // Arcade ladder step
            if (this.mode === 'arcade') {
                this.arcadeIndex++;
            }
        } else {
            this.sound.playKO();
            // Consolation points
            earnedPoints = 50;
            StorageManager.addPoints(earnedPoints);
        }

        // Show game over UI overlay
        if (window.UI) {
            window.UI.showGameOver(p1Won, earnedPoints, this.p1RoundsWon, this.p2RoundsWon, this.arcadeIndex);
        }
    }

    togglePause() {
        if (this.state === 'fighting') {
            this.state = 'paused';
            if (window.UI) window.UI.showPause(true);
        } else if (this.state === 'paused') {
            this.state = 'fighting';
            if (window.UI) window.UI.showPause(false);
        }
    }

    // ----------------------------------------------------
    // PROJECTILE PROCESSING & COLLISION
    // ----------------------------------------------------
    updateProjectiles() {
        const projs = this.particles.projectiles;
        for (let i = projs.length - 1; i >= 0; i--) {
            const p = projs[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;

            // Homing logic (e.g. Zeus chain spark)
            if (p.homing && p.owner && p.owner.opponent) {
                const opp = p.owner.opponent;
                const targetY = opp.y + 40;
                if (p.y < targetY) p.y += 2;
                else if (p.y > targetY) p.y -= 2;
            }

            // Projectile trail particles
            if (p.life % 2 === 0) {
                this.particles.particles.push({
                    x: p.x + p.width / 2,
                    y: p.y + p.height / 2,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    color: p.color,
                    size: 3,
                    alpha: 0.8,
                    decay: 0.05,
                    type: 'spark',
                    gravity: 0
                });
            }

            // Check collision with targets
            const target = (p.owner === this.p1) ? this.p2 : this.p1;
            if (target && target.state !== 'dead') {
                if (
                    p.x < target.x + target.width &&
                    p.x + p.width > target.x &&
                    p.y < target.y + target.height &&
                    p.y + p.height > target.y
                ) {
                    target.takeDamage(p.damage, p.owner, p.type, p.knockback);

                    if (p.type === 'anubis_skull' && p.owner) {
                        p.owner.heal(p.damage * 0.40);
                    } else if (p.type === 'sukuna_fuga') {
                        this.particles.createFireBurst(p.x, p.y, 40);
                        this.particles.addShockwave(p.x, p.y, 110, '#ff5500', 6);
                    } else if (p.type === 'zeus_lance' || p.type === 'zeus_chain') {
                        this.particles.createLightningSparks(p.x, p.y, 20);
                    }

                    projs.splice(i, 1);
                    continue;
                }
            }

            // Arena boundary or lifetime expiry
            if (p.life <= 0 || p.x < 10 || p.x > 1270) {
                projs.splice(i, 1);
            }
        }
    }

    // ----------------------------------------------------
    // MAIN GAME LOOP
    // ----------------------------------------------------
    loop(time) {
        this.animId = requestAnimationFrame((t) => this.loop(t));

        if (this.state === 'paused') {
            this.draw();
            return;
        }

        // Screen Freeze / Hitstop
        if (this.hitstopFrames > 0) {
            this.hitstopFrames--;
            this.draw();
            return;
        }

        // 1. Process Player 1 continuous inputs (movement)
        if (this.state === 'fighting' && this.p1 && this.p1.canAct()) {
            if (this.keys['KeyA']) {
                this.p1.moveLeft();
            } else if (this.keys['KeyD']) {
                this.p1.moveRight();
            }
        }

        // 2. Process Player 2 continuous inputs for PvP
        if (this.state === 'fighting' && this.mode === 'pvp' && this.p2 && this.p2.canAct()) {
            if (this.keys['ArrowLeft']) {
                this.p2.moveLeft();
            } else if (this.keys['ArrowRight']) {
                this.p2.moveRight();
            }
        }

        // 3. Process AI decisions
        if (this.state === 'fighting' && this.p2AI) {
            this.p2AI.update();
        }

        // 4. Update Fighters
        if (this.p1) this.p1.update();
        if (this.p2) this.p2.update();

        // 5. Check if a fighter just died
        if (this.state === 'fighting') {
            if (this.p1 && this.p1.state === 'dead') {
                this.handleRoundEnd(false);
            } else if (this.p2 && this.p2.state === 'dead') {
                this.handleRoundEnd(false);
            }
        }

        // 6. Update Projectiles & Particles
        this.updateProjectiles();
        this.particles.update();

        // 7. Render Everything
        this.draw();
    }

    // ----------------------------------------------------
    // RENDERING: STAGES, FIGHTERS, PARTICLES, HUD
    // ----------------------------------------------------
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Apply screen shake
        this.ctx.save();
        if (this.particles.screenShake > 0) {
            const shake = (Math.random() - 0.5) * this.particles.screenShakeIntensity;
            this.ctx.translate(shake, shake);
        }

        // 1. Draw Arena Stage Background
        this.drawStageBackground();

        // 2. Draw Projectiles
        this.drawProjectiles();

        // 3. Draw Fighters
        if (this.p1) this.p1.draw(this.ctx);
        if (this.p2) this.p2.draw(this.ctx);

        // 4. Draw Particles, Shockwaves, Floating Text
        this.particles.draw(this.ctx);

        this.ctx.restore();

        // 5. Draw HUD (Health bars, Ultimate gauges, Round timer, Portraits)
        this.drawHUD();

        // 6. Update virtual touch controls indicator
        if (window.UI && this.p1) {
            window.UI.updateTouchHUD(this.p1);
        }
    }

    drawStageBackground() {
        const ctx = this.ctx;

        if (this.stage === 'olympus') {
            // MOUNT OLYMPUS: Golden cosmic skies, floating marble platforms, glowing lightning
            const grad = ctx.createLinearGradient(0, 0, 0, 720);
            grad.addColorStop(0, '#0a0d24');
            grad.addColorStop(0.5, '#1e1644');
            grad.addColorStop(1, '#0e0b1f');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);

            // Distant starry nebulas
            ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
            ctx.beginPath();
            ctx.arc(640, 200, 350, 0, Math.PI * 2);
            ctx.fill();

            // Marble Greek Pillars in background
            ctx.fillStyle = '#2b234d';
            for (let i = 0; i < 7; i++) {
                ctx.fillRect(80 + i * 180, 220, 36, 340);
                ctx.fillRect(68 + i * 180, 208, 60, 16); // Capital
                ctx.fillRect(68 + i * 180, 550, 60, 14); // Base
            }

            // Divine Floor / Podium
            ctx.fillStyle = '#1c1636';
            ctx.fillRect(0, 560, this.width, 160);
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 560);
            ctx.lineTo(this.width, 560);
            ctx.stroke();

        } else if (this.stage === 'underworld') {
            // UNDERWORLD GATES: Dark obsidian obelisks, eerie purple soul fire
            const grad = ctx.createLinearGradient(0, 0, 0, 720);
            grad.addColorStop(0, '#07050d');
            grad.addColorStop(0.6, '#180e2b');
            grad.addColorStop(1, '#08050e');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);

            // Glowing Underworld Eclipse / Moon
            ctx.fillStyle = '#5a189a';
            ctx.beginPath();
            ctx.arc(640, 180, 100, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#07050d';
            ctx.beginPath();
            ctx.arc(620, 170, 92, 0, Math.PI * 2);
            ctx.fill();

            // Obsidian Pyramids / Obelisks
            ctx.fillStyle = '#1b1429';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(100 + i * 260, 560);
                ctx.lineTo(160 + i * 260, 260);
                ctx.lineTo(220 + i * 260, 560);
                ctx.closePath();
                ctx.fill();
            }

            // Floor with spectral glyphs
            ctx.fillStyle = '#0e0b17';
            ctx.fillRect(0, 560, this.width, 160);
            ctx.strokeStyle = '#9d4edd';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 560);
            ctx.lineTo(this.width, 560);
            ctx.stroke();

        } else if (this.stage === 'celestial') {
            // CELESTIAL CLOUD PALACE (Wukong): Warm jade & amber sunrise, floating golden pagodas
            const grad = ctx.createLinearGradient(0, 0, 0, 720);
            grad.addColorStop(0, '#2d132c');
            grad.addColorStop(0.4, '#801336');
            grad.addColorStop(0.8, '#c72c41');
            grad.addColorStop(1, '#ee4540');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);

            // Floating Golden Clouds
            ctx.fillStyle = 'rgba(255, 215, 0, 0.18)';
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc(120 + i * 210, 320, 80, 0, Math.PI * 2);
                ctx.fill();
            }

            // Golden Cloud Floor
            ctx.fillStyle = '#22092c';
            ctx.fillRect(0, 560, this.width, 160);
            ctx.strokeStyle = '#ff9f1c';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 560);
            ctx.lineTo(this.width, 560);
            ctx.stroke();

        } else if (this.stage === 'shinjuku') {
            // CURSED SHINJUKU RUINS (Sukuna): Crumbled modern metropolis, blood moon, malevolent miasma
            const grad = ctx.createLinearGradient(0, 0, 0, 720);
            grad.addColorStop(0, '#100003');
            grad.addColorStop(0.5, '#2e020a');
            grad.addColorStop(1, '#110103');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);

            // Gigantic Crimson Blood Moon
            ctx.fillStyle = '#d90429';
            ctx.shadowColor = '#ff0033';
            ctx.shadowBlur = 35;
            ctx.beginPath();
            ctx.arc(640, 160, 110, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Shattered Skyscrapers silhouette
            ctx.fillStyle = '#1c0307';
            ctx.fillRect(100, 200, 120, 360);
            ctx.fillRect(260, 280, 100, 280);
            ctx.fillRect(800, 240, 140, 320);
            ctx.fillRect(980, 180, 110, 380);

            // Ruined Concrete Floor
            ctx.fillStyle = '#150508';
            ctx.fillRect(0, 560, this.width, 160);
            ctx.strokeStyle = '#ff0033';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 560);
            ctx.lineTo(this.width, 560);
            ctx.stroke();
        }
    }

    drawProjectiles() {
        const ctx = this.ctx;
        for (const p of this.particles.projectiles) {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;

            if (p.type === 'zeus_lance') {
                ctx.fillRect(p.x, p.y, p.width, p.height);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(p.x + 10, p.y + 4, p.width - 20, p.height - 8);
            } else if (p.type === 'anubis_skull') {
                ctx.beginPath();
                ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'sukuna_dismantle') {
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + p.width, p.y + p.height);
                ctx.moveTo(p.x, p.y + p.height);
                ctx.lineTo(p.x + p.width, p.y);
                ctx.stroke();
            } else if (p.type === 'sukuna_fuga') {
                ctx.fillStyle = '#ff3300';
                ctx.fillRect(p.x, p.y, p.width, p.height);
            } else if (p.type === 'anubis_quicksand') {
                ctx.fillStyle = 'rgba(114, 9, 183, 0.45)';
                ctx.beginPath();
                ctx.ellipse(p.x, p.y, p.width / 2, 14, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(p.x, p.y, p.width, p.height);
            }
            ctx.restore();
        }
    }

    // ----------------------------------------------------
    // ARCADE HEADS-UP DISPLAY (HUD)
    // ----------------------------------------------------
    drawHUD() {
        if (!this.p1 || !this.p2) return;
        const ctx = this.ctx;

        const p1 = this.p1;
        const p2 = this.p2;

        const barWidth = 460;
        const barHeight = 26;

        // --- PLAYER 1 HUD (Left) ---
        // Character Name & Title
        ctx.save();
        ctx.font = "900 22px 'Cinzel', 'Impact', sans-serif";
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = p1.data.color;
        ctx.shadowBlur = 10;
        ctx.fillText(p1.data.name.toUpperCase(), 70, 48);
        ctx.font = "600 13px sans-serif";
        ctx.fillStyle = p1.data.color;
        ctx.fillText(p1.data.title, 70, 68);

        // P1 Health Bar Container
        ctx.fillStyle = '#0a0a10';
        ctx.fillRect(70, 78, barWidth, barHeight);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(70, 78, barWidth, barHeight);

        // P1 Ghost HP (Yellow trailing)
        const p1GhostPct = Math.max(0, p1.ghostHp / p1.maxHp);
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(70, 78, barWidth * p1GhostPct, barHeight);

        // P1 Current HP
        const p1HpPct = Math.max(0, p1.displayedHp / p1.maxHp);
        const p1Grad = ctx.createLinearGradient(70, 0, 70 + barWidth, 0);
        p1Grad.addColorStop(0, '#00ff88');
        p1Grad.addColorStop(1, p1.data.color);
        ctx.fillStyle = p1Grad;
        ctx.fillRect(70, 78, barWidth * p1HpPct, barHeight);

        // P1 HP Numeric text
        ctx.font = "bold 13px monospace";
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(p1.hp)} / ${p1.maxHp}`, 70 + barWidth - 8, 96);

        // P1 Energy / Ultimate Gauge
        ctx.fillStyle = '#0a0a10';
        ctx.fillRect(70, 110, barWidth * 0.75, 12);
        const p1EnergyPct = Math.min(1, p1.energy / 100);
        ctx.fillStyle = (p1.energy >= 100) ? '#ff0055' : '#00e5ff';
        ctx.shadowColor = (p1.energy >= 100) ? '#ff0055' : '#00e5ff';
        ctx.shadowBlur = (p1.energy >= 100) ? 12 : 4;
        ctx.fillRect(70, 110, barWidth * 0.75 * p1EnergyPct, 12);
        ctx.shadowBlur = 0;

        ctx.textAlign = 'left';
        ctx.font = "bold 11px sans-serif";
        ctx.fillStyle = '#ffffff';
        ctx.fillText((p1.energy >= 100) ? 'ULTIMATE READY! [U]' : `ENERGY: ${Math.round(p1.energy)}%`, 72, 120);

        // P1 Rounds Won
        for (let r = 0; r < 2; r++) {
            ctx.fillStyle = (r < this.p1RoundsWon) ? '#ffd700' : '#222';
            ctx.beginPath();
            ctx.arc(70 + r * 22, 136, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- PLAYER 2 HUD (Right) ---
        const p2X = this.width - 70 - barWidth;

        // P2 Name & Title
        ctx.textAlign = 'right';
        ctx.font = "900 22px 'Cinzel', 'Impact', sans-serif";
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = p2.data.color;
        ctx.shadowBlur = 10;
        ctx.fillText(p2.data.name.toUpperCase(), this.width - 70, 48);
        ctx.font = "600 13px sans-serif";
        ctx.fillStyle = p2.data.color;
        ctx.fillText(p2.data.title, this.width - 70, 68);

        // P2 Health Bar Container
        ctx.fillStyle = '#0a0a10';
        ctx.fillRect(p2X, 78, barWidth, barHeight);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(p2X, 78, barWidth, barHeight);

        // P2 Ghost HP
        const p2GhostPct = Math.max(0, p2.ghostHp / p2.maxHp);
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(p2X + barWidth * (1 - p2GhostPct), 78, barWidth * p2GhostPct, barHeight);

        // P2 Current HP
        const p2HpPct = Math.max(0, p2.displayedHp / p2.maxHp);
        const p2Grad = ctx.createLinearGradient(p2X, 0, p2X + barWidth, 0);
        p2Grad.addColorStop(0, p2.data.color);
        p2Grad.addColorStop(1, '#ff3366');
        ctx.fillStyle = p2Grad;
        ctx.fillRect(p2X + barWidth * (1 - p2HpPct), 78, barWidth * p2HpPct, barHeight);

        // P2 HP Numeric text
        ctx.font = "bold 13px monospace";
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(`${Math.round(p2.hp)} / ${p2.maxHp}`, p2X + 8, 96);

        // P2 Energy Gauge
        const p2EnergyW = barWidth * 0.75;
        const p2EnergyX = this.width - 70 - p2EnergyW;
        ctx.fillStyle = '#0a0a10';
        ctx.fillRect(p2EnergyX, 110, p2EnergyW, 12);
        const p2EnergyPct = Math.min(1, p2.energy / 100);
        ctx.fillStyle = (p2.energy >= 100) ? '#ff0055' : '#ff9f1c';
        ctx.shadowColor = (p2.energy >= 100) ? '#ff0055' : '#ff9f1c';
        ctx.shadowBlur = (p2.energy >= 100) ? 12 : 4;
        ctx.fillRect(p2EnergyX + p2EnergyW * (1 - p2EnergyPct), 110, p2EnergyW * p2EnergyPct, 12);
        ctx.shadowBlur = 0;

        ctx.textAlign = 'right';
        ctx.font = "bold 11px sans-serif";
        ctx.fillStyle = '#ffffff';
        ctx.fillText((p2.energy >= 100) ? 'ULTIMATE READY!' : `ENERGY: ${Math.round(p2.energy)}%`, this.width - 72, 120);

        // P2 Rounds Won
        for (let r = 0; r < 2; r++) {
            ctx.fillStyle = (r < this.p2RoundsWon) ? '#ffd700' : '#222';
            ctx.beginPath();
            ctx.arc(this.width - 70 - r * 22, 136, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- ROUND TIMER (Center) ---
        ctx.textAlign = 'center';
        ctx.fillStyle = '#0f0e17';
        ctx.beginPath();
        ctx.arc(640, 75, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = "900 36px 'Impact', 'Cinzel', sans-serif";
        ctx.fillStyle = (this.roundTimer <= 10) ? '#ff0033' : '#ffd700';
        ctx.fillText(this.roundTimer, 640, 88);

        // Round Label
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`ROUND ${this.currentRound}`, 640, 30);

        // --- COMBOS & STATS ---
        if (p1.comboCount > 1) {
            ctx.textAlign = 'left';
            ctx.font = "900 28px 'Cinzel', 'Impact', sans-serif";
            ctx.fillStyle = '#ffdd00';
            ctx.shadowColor = '#ff6600';
            ctx.shadowBlur = 12;
            ctx.fillText(`${p1.comboCount} HITS!`, 70, 180);
            ctx.shadowBlur = 0;
        }

        if (p2.comboCount > 1) {
            ctx.textAlign = 'right';
            ctx.font = "900 28px 'Cinzel', 'Impact', sans-serif";
            ctx.fillStyle = '#ffdd00';
            ctx.shadowColor = '#ff6600';
            ctx.shadowBlur = 12;
            ctx.fillText(`${p2.comboCount} HITS!`, this.width - 70, 180);
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }
}

// Global Game Instance
window.GameInstance = new BattleArenaGame();
