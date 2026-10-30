// Master 3D Game Engine: Open World Loop, Dynamic 3D Camera, Combat Resolution & HUD
// Battle Arena: Clash of Sorcerors (Open World 3D)

class BattleArenaGame {
    constructor() {
        this.isMobile = this.detectMobile();
        // 4K Ultra resolution pipeline is permanently enabled across all devices
        this.is4K = true;
        this.width = 1920;
        this.height = 1080;

        // 1. WebGL 3D Canvas & Three.js Engine
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('WebGL context lost, pausing render loop');
        }, false);
        this.canvas.addEventListener('webglcontextrestored', () => {
            console.info('WebGL context restored');
            this.handleResize();
        }, false);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 500);
        this.camera.position.set(0, 14, 28);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: !this.isMobile, // Disable MSAA on mobile for huge performance gain
            powerPreference: 'high-performance',
            precision: this.isMobile ? 'mediump' : 'highp'
        });
        this.renderer.setSize(this.width, this.height);
        this.updatePixelRatio();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = this.isMobile ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        // 2. HUD 2D Overlay Canvas (High-DPI 4K Crisp Vector Rendering)
        this.hudCanvas = document.getElementById('hudCanvas');
        if (!this.hudCanvas) {
            this.hudCanvas = document.createElement('canvas');
            this.hudCanvas.id = 'hudCanvas';
            this.canvas.parentElement.appendChild(this.hudCanvas);
        }
        this.hudCanvas.width = this.width;
        this.hudCanvas.height = this.height;
        this.hudCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:4;';
        this.hudCtx = this.hudCanvas.getContext('2d');
        this.hudCtx.imageSmoothingEnabled = true;
        this.hudCtx.imageSmoothingQuality = 'high';

        // 3. Subsystems
        this.particles = new ParticleEngine();
        this.sound = Sound;
        this.currentBattlefieldKey = (typeof StorageManager !== 'undefined' && StorageManager.getSelectedBattlefield) 
            ? StorageManager.getSelectedBattlefield() 
            : 'jjk_high';
        this.world3d = new World3D(this.scene);

        // Game Configuration
        this.mode = 'arcade'; // arcade, versus, pvp, training
        this.difficulty = 'medium';
        this.state = 'menu'; // menu, char_select, shop, fighting, round_over, match_over, paused

        // 3D Fighters & AI
        this.p1 = null;
        this.p2 = null;
        this.p2AI = null;
        this.projectiles3D = [];
        this.previewModel = null;

        // Camera System & View Modes
        this.cameraMode = 'action'; // 'action', 'follow', 'overview'
        this.camShakeX = 0;
        this.camShakeY = 0;

        // Round & Progression
        this.roundTimer = 99;
        this.timerInterval = null;
        this.p1RoundsWon = 0;
        this.p2RoundsWon = 0;
        this.currentRound = 1;
        this.arcadeLadder = ['megumi', 'nanami', 'todo', 'mahito', 'toji', 'yuta', 'sukuna'];
        this.arcadeIndex = 0;

        // Input Tracking
        this.keys = {};
        this.initInputListeners();

        // Animation Loop
        this.animId = null;
        this.lastTime = performance.now();
        this.menuOrbitAngle = 0;

        // Start continuous render loop
        this.loop(0);

        // Feature 4-Armed Heian Sukuna on 3D Main Menu
        this.showPreview3D('sukuna');

        // Dynamic viewport resize & orientation adaptation
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 250);
        });
        setTimeout(() => this.handleResize(), 50);
    }

    detectMobile() {
        if (typeof window === 'undefined') return false;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
               (window.innerWidth <= 900);
    }

    handleResize() {
        const container = document.getElementById('gameContainer');
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const displayW = Math.max(320, Math.round(rect.width));
        const displayH = Math.max(240, Math.round(rect.height));

        this.isMobile = this.detectMobile();

        const aspect = displayW / displayH;
        if (this.camera) {
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
        }

        // Keep internal coordinates at 1920 base width, adjust height for aspect ratio
        this.width = 1920;
        this.height = Math.round(1920 / aspect);

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if (this.hudCanvas) {
            this.hudCanvas.width = this.width;
            this.hudCanvas.height = this.height;
        }

        if (this.renderer) {
            this.renderer.setSize(this.width, this.height, false);
            this.updatePixelRatio();
        }
    }

    isPvPMode() {
        return this.mode === 'pvp' || this.mode === 'friend';
    }

    initInputListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.sound.resume();

            // Toggle Camera View with 'V' key
            if (e.code === 'KeyV' && this.state === 'fighting') {
                this.cycleCameraMode();
            }

            if (this.state !== 'fighting') return;

            const isPvP = this.isPvPMode();

            // Player 1 Combat Triggers (J, K, L, U + Space)
            if (this.p1 && this.p1.canAct()) {
                if (e.code === 'Space') this.p1.jump();
                if (e.code === 'KeyJ' || e.code === 'KeyZ') this.p1.triggerBasicAttack();
                if (e.code === 'KeyK' || e.code === 'KeyX') this.p1.triggerSkill1();
                if (e.code === 'KeyL' || e.code === 'KeyC') this.p1.triggerSkill2();
                if (e.code === 'KeyU') this.p1.triggerUltimate();

                // Dual-control support for solo modes
                if (!isPvP) {
                    if (e.code === 'Numpad0') this.p1.jump();
                    if (e.code === 'Numpad1' || e.code === 'Digit1') this.p1.triggerBasicAttack();
                    if (e.code === 'Numpad2' || e.code === 'Digit2') this.p1.triggerSkill1();
                    if (e.code === 'Numpad3' || e.code === 'Digit3') this.p1.triggerSkill2();
                    if (e.code === 'Numpad5' || e.code === 'Digit5') this.p1.triggerUltimate();
                }
            }

            // Player 2 Combat Triggers (Local PvP & Play vs Friend)
            // Supports Numpad / Digits as well as laptop-friendly I, O, P, [, ]
            if (isPvP && this.p2 && this.p2.canAct()) {
                if (e.code === 'Numpad0' || e.code === 'KeyI') this.p2.jump();
                if (e.code === 'Numpad1' || e.code === 'Digit1' || e.code === 'KeyO') this.p2.triggerBasicAttack();
                if (e.code === 'Numpad2' || e.code === 'Digit2' || e.code === 'KeyP') this.p2.triggerSkill1();
                if (e.code === 'Numpad3' || e.code === 'Digit3' || e.code === 'BracketLeft') this.p2.triggerSkill2();
                if (e.code === 'Numpad5' || e.code === 'Digit5' || e.code === 'BracketRight') this.p2.triggerUltimate();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;

            if (this.p1 && (e.code === 'KeyS' || e.code === 'ShiftLeft' || (!this.isPvPMode() && (e.code === 'ArrowDown' || e.code === 'NumpadPeriod')))) {
                this.p1.stopBlock();
            }
            if (this.p2 && (e.code === 'ArrowDown' || e.code === 'NumpadPeriod' || e.code === 'Slash' || e.code === 'ShiftRight' || e.code === 'Semicolon')) {
                this.p2.stopBlock();
            }
        });
    }

    cycleCameraMode() {
        if (this.cameraMode === 'action') this.cameraMode = 'follow';
        else if (this.cameraMode === 'follow') this.cameraMode = 'overview';
        else this.cameraMode = 'action';

        const btn = document.getElementById('btnToggleCam');
        if (btn) btn.textContent = `🎥 Cam: ${this.cameraMode.toUpperCase()}`;
        this.particles.addFloatingText(`CAM: ${this.cameraMode.toUpperCase()}`, (this.p1 ? this.p1.x : 0), 4.5, '#00e5ff', 20);
    }

    updatePixelRatio() {
        const dpr = window.devicePixelRatio || 1;
        let targetPixelRatio;
        if (this.isMobile) {
            targetPixelRatio = Math.min(Math.max(dpr, 1.5), 2.0);
        } else {
            targetPixelRatio = Math.min(Math.max(dpr, 2.0), 3.0);
        }
        if (this.renderer) {
            this.renderer.setPixelRatio(targetPixelRatio);
        }
    }

    toggle4KMode() {
        this.is4K = true; // Permanently enabled
        this.updatePixelRatio();
    }

    setBattlefield(fieldKey) {
        if (!fieldKey) return;
        this.currentBattlefieldKey = fieldKey;
        if (typeof StorageManager !== 'undefined' && StorageManager.selectBattlefield) {
            StorageManager.selectBattlefield(fieldKey);
        }
        if (this.world3d) {
            this.world3d.loadBattlefield(fieldKey);
        }
        if (window.UI && window.UI.updateActiveArenaDisplay) {
            window.UI.updateActiveArenaDisplay();
        }
    }

    // ----------------------------------------------------
    // MATCH & ROUND MANAGEMENT
    // ----------------------------------------------------
    startMatch(p1CharKey, p2CharKey, mode = 'arcade', difficulty = 'medium', p1Name = null, p2Name = null) {
        this.mode = mode;
        this.difficulty = difficulty;

        // Reset Arcade Ladder round counter on round 1 / initial gauntlet start
        if (this.mode === 'arcade') {
            if (!this.arcadeLadder || !this.arcadeLadder.length) {
                this.arcadeLadder = ['megumi', 'nanami', 'todo', 'mahito', 'toji', 'yuta', 'sukuna'];
            }
            if (p2CharKey === this.arcadeLadder[0]) {
                this.arcadeIndex = 0;
            }
        }

        // Custom names for Player 1 & Friend/Player 2
        const profile = (typeof StorageManager !== 'undefined' && StorageManager.getPlayerProfile) 
            ? StorageManager.getPlayerProfile() 
            : { name: 'Sorcerer', friendName: 'Friend' };
            
        this.p1CustomName = p1Name || profile.name || 'Sorcerer';
        this.p2CustomName = p2Name || (this.isPvPMode() ? (profile.friendName || 'Friend') : null);

        // Load active battlefield into 3D world
        this.currentBattlefieldKey = (typeof StorageManager !== 'undefined' && StorageManager.getSelectedBattlefield)
            ? StorageManager.getSelectedBattlefield()
            : (this.currentBattlefieldKey || 'jjk_high');
        if (this.world3d) {
            this.world3d.loadBattlefield(this.currentBattlefieldKey);
            this.world3d.clearDomain();
        }

        // Cleanup prior fighters, preview & projectiles
        this.clearPreview3D();
        if (this.p1) this.p1.cleanup();
        if (this.p2) this.p2.cleanup();
        this.clearProjectiles();

        // Create 3D Fighters in Open World
        this.p1 = new Fighter(p1CharKey, -12, 0, false, this.scene, this.particles, this.sound);
        this.p2 = new Fighter(p2CharKey, 12, 0, true, this.scene, this.particles, this.sound);

        this.p1.setOpponent(this.p2);
        this.p2.setOpponent(this.p1);
        this.p1.turnTowards(this.p2.x, this.p2.z);
        this.p2.turnTowards(this.p1.x, this.p1.z);
        this.p1.updateModelTransform();
        this.p2.updateModelTransform();

        if (!this.isPvPMode()) {
            this.p2AI = new AIController(this.p2, this.difficulty);
        } else {
            this.p2AI = null;
        }

        this.p1RoundsWon = 0;
        this.p2RoundsWon = 0;
        this.currentRound = 1;

        this.state = 'fighting';
        this.startRound();
        this.sound.startBGM();

        if (window.UI && window.UI.touchControls && window.UI.touchEnabled) {
            window.UI.touchControls.classList.remove('hidden');
        }
    }

    startRound() {
        this.p1.hp = this.p1.maxHp;
        this.p1.displayedHp = this.p1.maxHp;
        this.p1.ghostHp = this.p1.maxHp;
        this.p1.x = -12;
        this.p1.y = 0;
        this.p1.z = 0;
        this.p1.vx = 0;
        this.p1.vy = 0;
        this.p1.vz = 0;
        this.p1.state = 'idle';

        this.p2.hp = this.p2.maxHp;
        this.p2.displayedHp = this.p2.maxHp;
        this.p2.ghostHp = this.p2.maxHp;
        this.p2.x = 12;
        this.p2.y = 0;
        this.p2.z = 0;
        this.p2.vx = 0;
        this.p2.vy = 0;
        this.p2.vz = 0;
        this.p2.state = 'idle';

        // Correctly orient both fighters to face each other across the arena
        this.p1.turnTowards(this.p2.x, this.p2.z);
        this.p2.turnTowards(this.p1.x, this.p1.z);
        this.p1.updateModelTransform();
        this.p2.updateModelTransform();

        // Ensure Cursed Energy is initialized / maintained
        if (this.p1.energy < 25) this.p1.energy = 25;
        if (this.p2.energy < 25) this.p2.energy = 25;

        this.clearProjectiles();
        this.particles.reset();
        this.roundTimer = (this.mode === 'training') ? 999 : 99;

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.state === 'fighting' && this.mode !== 'training') {
                this.roundTimer--;
                if (this.roundTimer <= 0) {
                    this.roundTimer = 0;
                    this.handleRoundEnd(true);
                }
            }
        }, 1000);

        this.particles.addFloatingText(`ROUND ${this.currentRound}`, 0, 4.0, '#ffd700', 36, true);
        this.sound.playRoundStart();
    }

    handleRoundEnd(isTimeout = false) {
        this.state = 'round_over';
        if (this.timerInterval) clearInterval(this.timerInterval);

        let roundWinner = 0;
        if (isTimeout) {
            if (this.p1.hp > this.p2.hp) roundWinner = 1;
            else if (this.p2.hp > this.p1.hp) roundWinner = 2;
        } else {
            if (this.p1.state === 'dead') roundWinner = 2;
            else if (this.p2.state === 'dead') roundWinner = 1;
        }

        const p1DisplayName = (this.p1CustomName || 'PLAYER 1').toUpperCase();
        let p2DisplayName = (this.p2CustomName || (this.isPvPMode() ? 'FRIEND' : 'PLAYER 2')).toUpperCase();

        if (roundWinner === 1) {
            this.p1RoundsWon++;
            this.particles.addFloatingText(`${p1DisplayName} WINS ROUND!`, 0, 4.5, '#00e5ff', 32, true);
        } else if (roundWinner === 2) {
            this.p2RoundsWon++;
            this.particles.addFloatingText(`${p2DisplayName} WINS ROUND!`, 0, 4.5, '#ff2a5f', 32, true);
        } else {
            this.particles.addFloatingText('DRAW ROUND!', 0, 4.5, '#ffffff', 32);
        }

        setTimeout(() => {
            const roundsToWin = (this.mode === 'training') ? 999 : 2;
            if (this.p1RoundsWon >= roundsToWin || this.p2RoundsWon >= roundsToWin) {
                this.handleMatchEnd(this.p1RoundsWon >= roundsToWin);
            } else {
                this.currentRound++;
                this.state = 'fighting';
                this.startRound();
            }
        }, 2200);
    }

    handleMatchEnd(p1Won) {
        this.state = 'match_over';
        this.sound.stopBGM();

        const field = (typeof BATTLEFIELDS_DATA !== 'undefined' && BATTLEFIELDS_DATA[this.currentBattlefieldKey])
            ? BATTLEFIELDS_DATA[this.currentBattlefieldKey]
            : { name: 'Jujutsu High Courtyard', winMoney: 350 };

        let earnedPoints = 0;
        let baseReward = 0;
        if (p1Won) {
            this.sound.playVictory();
            const diffMultiplier = (this.difficulty === 'deity') ? 2.0 : ((this.difficulty === 'hard') ? 1.5 : 1.0);
            baseReward = Math.round((field.winMoney || 350) * diffMultiplier);
            const comboBonus = Math.min(200, this.p1.comboCount * 20);
            const timeBonus = Math.floor(this.roundTimer * 2);
            earnedPoints = baseReward + comboBonus + timeBonus;

            StorageManager.addPoints(earnedPoints);
            if (this.mode === 'arcade') {
                this.arcadeIndex++;
            }
        } else {
            this.sound.playKO();
            baseReward = Math.max(50, Math.round((field.winMoney || 350) * 0.15));
            earnedPoints = baseReward;
            StorageManager.addPoints(earnedPoints);
        }

        const p1DisplayName = (this.p1CustomName || 'PLAYER 1').toUpperCase();
        const p2DisplayName = (this.p2CustomName || (this.isPvPMode() ? 'FRIEND' : 'CPU')).toUpperCase();

        if (window.UI) {
            window.UI.showGameOver(p1Won, earnedPoints, this.p1RoundsWon, this.p2RoundsWon, this.arcadeIndex, p1DisplayName, p2DisplayName, this.isPvPMode(), field.name, baseReward);
        }
    }

    togglePause() {
        if (this.state === 'fighting') {
            this.state = 'paused';
            if (window.UI && window.UI.pauseOverlay) window.UI.pauseOverlay.classList.remove('hidden');
        } else if (this.state === 'paused') {
            this.state = 'fighting';
            if (window.UI && window.UI.pauseOverlay) window.UI.pauseOverlay.classList.add('hidden');
        }
    }

    clearProjectiles() {
        for (const p of this.projectiles3D) {
            if (p.mesh) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
            }
            if (p.light) this.scene.remove(p.light);
        }
        this.projectiles3D = [];
    }

    showPreview3D(charKey) {
        this.clearPreview3D();
        this.previewModel = Character3DFactory.create(charKey, false);
        this.previewModel.root.position.set(0, 0, 0);
        this.previewModel.root.rotation.y = 0;
        this.scene.add(this.previewModel.root);
    }

    clearPreview3D() {
        if (this.previewModel) {
            this.scene.remove(this.previewModel.root);
            this.previewModel = null;
        }
    }

    // ----------------------------------------------------
    // 3D PROJECTILE SIMULATION
    // ----------------------------------------------------
    updateProjectiles() {
        for (let i = this.projectiles3D.length - 1; i >= 0; i--) {
            const p = this.projectiles3D[i];
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            p.life--;

            if (p.mesh) p.mesh.position.set(p.x, p.y, p.z);
            if (p.light) p.light.position.set(p.x, p.y, p.z);

            // Hit Detection against Target
            const target = (p.owner === this.p1) ? this.p2 : this.p1;
            if (target && target.state !== 'dead') {
                const dist = Math.hypot(target.x - p.x, target.z - p.z);
                if (dist < p.radius + 1.2 && Math.abs(target.y - p.y) < 2.5) {
                    target.takeDamage(p.damage, p.owner, p.type, 0.5);
                    this.particles.createHitSparks(p.x, p.y, p.z, 16, p.color);
                    if (p.owner && p.owner.gainEnergy) {
                        p.owner.gainEnergy(14);
                    }
                    p.life = 0;
                }
            }

            // Expiry or out of bounds
            if (p.life <= 0 || Math.abs(p.x) > 95 || Math.abs(p.z) > 95) {
                if (p.mesh) {
                    this.scene.remove(p.mesh);
                    p.mesh.geometry.dispose();
                    p.mesh.material.dispose();
                }
                if (p.light) this.scene.remove(p.light);
                this.projectiles3D.splice(i, 1);
            }
        }
    }

    // ----------------------------------------------------
    // DYNAMIC 3D COMBAT CAMERA
    // ----------------------------------------------------
    updateCamera() {
        // Compute Camera Shake
        if (this.particles.screenShake > 0) {
            const intensity = this.particles.screenShakeIntensity * 0.05;
            this.camShakeX = (Math.random() - 0.5) * intensity;
            this.camShakeY = (Math.random() - 0.5) * intensity;
        } else {
            this.camShakeX = 0;
            this.camShakeY = 0;
        }

        if (this.state === 'fighting' || this.state === 'round_over' || this.state === 'match_over') {
            if (!this.p1 || !this.p2) return;

            const midX = (this.p1.x + this.p2.x) / 2;
            const midZ = (this.p1.z + this.p2.z) / 2;
            const dist = Math.hypot(this.p1.x - this.p2.x, this.p1.z - this.p2.z);

            if (this.cameraMode === 'action') {
                // Dynamic Arena Orbit: Smoothly tracks midpoint with smart distance framing
                const targetDist = Math.max(14, dist * 1.35 + 8);
                const targetY = Math.max(7, 6 + dist * 0.35);

                this.camera.position.x += (midX - this.camera.position.x) * 0.08 + this.camShakeX;
                this.camera.position.y += (targetY - this.camera.position.y) * 0.08 + this.camShakeY;
                this.camera.position.z += ((midZ + targetDist) - this.camera.position.z) * 0.08;
                this.camera.lookAt(midX, 2.2, midZ);

            } else if (this.cameraMode === 'follow') {
                // Third-person over-the-shoulder behind Player 1
                const fwdX = Math.sin(this.p1.rotationY);
                const fwdZ = Math.cos(this.p1.rotationY);
                const camX = this.p1.x - fwdX * 9 + this.camShakeX;
                const camZ = this.p1.z - fwdZ * 9;
                const camY = this.p1.y + 5.5 + this.camShakeY;

                this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.1);
                this.camera.lookAt(this.p1.x + fwdX * 8, this.p1.y + 2.5, this.p1.z + fwdZ * 8);

            } else if (this.cameraMode === 'overview') {
                // High-angle bird's eye view
                this.camera.position.set(midX, 32, midZ + 24);
                this.camera.lookAt(midX, 0, midZ);
            }
        } else {
            // Idle Menu Camera Orbit around Grand Sorcerer Ring
            this.menuOrbitAngle += 0.003;
            const radius = 34;
            this.camera.position.set(
                Math.cos(this.menuOrbitAngle) * radius,
                14,
                Math.sin(this.menuOrbitAngle) * radius
            );
            this.camera.lookAt(0, 3, 0);
        }
    }

    // ----------------------------------------------------
    // MAIN GAME LOOP
    // ----------------------------------------------------
    loop(time) {
        this.animId = requestAnimationFrame((t) => this.loop(t));

        if (this.state === 'fighting') {
            // 1. Process Continuous 3D Inputs for Player 1 (WASD + Arrow keys in solo play)
            if (this.p1 && this.p1.canAct()) {
                let dx = 0;
                let dz = 0;
                if (this.keys['KeyW']) dz -= 1;
                if (this.keys['KeyS']) dz += 1;
                if (this.keys['KeyA']) dx -= 1;
                if (this.keys['KeyD']) dx += 1;

                // Support Arrow Keys for Player 1 in non-PvP modes
                if (!this.isPvPMode()) {
                    if (this.keys['ArrowUp']) dz -= 1;
                    if (this.keys['ArrowDown']) dz += 1;
                    if (this.keys['ArrowLeft']) dx -= 1;
                    if (this.keys['ArrowRight']) dx += 1;
                }

                if (dx !== 0 || dz !== 0) {
                    this.p1.move3D(dx, dz);
                } else {
                    this.p1.stopMoving();
                }

                if (this.keys['ShiftLeft'] || (!this.isPvPMode() && (this.keys['NumpadPeriod'] || this.keys['ShiftRight']))) {
                    this.p1.startBlock();
                }
            }

            // 2. Process Continuous 3D Inputs for Player 2 (Local PvP & Play vs Friend)
            if (this.isPvPMode() && this.p2 && this.p2.canAct()) {
                let dx = 0;
                let dz = 0;
                if (this.keys['ArrowUp']) dz -= 1;
                if (this.keys['ArrowDown']) dz += 1;
                if (this.keys['ArrowLeft']) dx -= 1;
                if (this.keys['ArrowRight']) dx += 1;

                if (dx !== 0 || dz !== 0) {
                    this.p2.move3D(dx, dz);
                } else {
                    this.p2.stopMoving();
                }

                if (this.keys['NumpadPeriod'] || this.keys['Slash'] || this.keys['ShiftRight'] || this.keys['Semicolon']) {
                    this.p2.startBlock();
                }
            }

            // 3. Process 3D AI Decisions
            if (this.p2AI) {
                this.p2AI.update();
            }

            // 4. Update 3D Fighters
            if (this.p1) this.p1.update();
            if (this.p2) this.p2.update();

            // 5. Death Checks
            if (this.p1 && this.p1.state === 'dead') {
                this.handleRoundEnd(false);
            } else if (this.p2 && this.p2.state === 'dead') {
                this.handleRoundEnd(false);
            }

            // 6. Update Projectiles
            this.updateProjectiles();
        }

        // Always update particle effects & floating text in all states
        this.particles.update();

        // Animate 3D Character Preview in menus
        if (this.previewModel) {
            this.previewModel.root.rotation.y += 0.015;
            this.previewModel.update('idle', 0, 0, 0, 0, true, false, 0);
        }

        // Update 3D Environment (Sky, Petals, Cursed Wisps)
        if (this.world3d) this.world3d.update();

        // Update Dynamic Camera
        this.updateCamera();

        // 7. Render 3D WebGL Scene
        this.renderer.render(this.scene, this.camera);

        // 8. Render Sleek 2D Arcade HUD
        this.drawHUD();
    }

    // ----------------------------------------------------
    // ARCADE HUD OVERLAY RENDERING
    // ----------------------------------------------------
    drawHUD() {
        const ctx = this.hudCtx;
        ctx.clearRect(0, 0, this.width, this.height);

        // Always render 3D-projected floating text & screen flashes
        this.particles.drawHUDOverlay(ctx, this.camera, this.width, this.height);

        if (this.state !== 'fighting' && this.state !== 'round_over' && this.state !== 'paused') {
            return;
        }
        if (!this.p1 || !this.p2) return;

        // 1. Health Bars (Responsive Definition)
        const barW = Math.min(680, Math.floor(this.width * 0.38));
        const barH = Math.max(26, Math.min(34, Math.floor(this.height * 0.035)));
        const barY = Math.max(28, Math.min(36, Math.floor(this.height * 0.038)));
        const padX = Math.max(20, Math.min(50, Math.floor(this.width * 0.026)));

        // Player 1 Health Bar (Left to Right)
        const p1Ratio = Math.max(0, this.p1.displayedHp / this.p1.maxHp);
        const p1GhostRatio = Math.max(0, this.p1.ghostHp / this.p1.maxHp);

        ctx.fillStyle = 'rgba(10, 12, 20, 0.88)';
        ctx.fillRect(padX, barY, barW, barH);

        // Ghost HP (White/Yellow drain)
        ctx.fillStyle = '#ffaa33';
        ctx.fillRect(padX, barY, barW * p1GhostRatio, barH);

        // Current HP Gradient
        const p1Grad = ctx.createLinearGradient(padX, 0, padX + barW, 0);
        p1Grad.addColorStop(0, '#00e5ff');
        p1Grad.addColorStop(1, '#0088cc');
        ctx.fillStyle = p1Grad;
        ctx.fillRect(padX, barY, barW * p1Ratio, barH);

        // Border Glow
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(padX, barY, barW, barH);

        // P1 Name & Grade Tag (Shows Custom Sorcerer Name & Character)
        const p1DisplayName = (this.p1CustomName || 'PLAYER 1').toUpperCase();
        ctx.font = "900 24px 'Cinzel', serif";
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${p1DisplayName} [${this.p1.data.name.toUpperCase()}]`, padX + 5, barY - 10);

        ctx.font = "700 16px 'Rajdhani', sans-serif";
        ctx.fillStyle = '#00e5ff';
        ctx.fillText(`${this.p1.data.grade} • HP: ${Math.round(this.p1.hp)}/${this.p1.maxHp}`, padX + 5, barY + barH + 20);

        // Player 2 Health Bar (Right to Left)
        const p2Ratio = Math.max(0, this.p2.displayedHp / this.p2.maxHp);
        const p2GhostRatio = Math.max(0, this.p2.ghostHp / this.p2.maxHp);
        const p2X = this.width - padX - barW;

        ctx.fillStyle = 'rgba(10, 12, 20, 0.88)';
        ctx.fillRect(p2X, barY, barW, barH);

        ctx.fillStyle = '#ffaa33';
        ctx.fillRect(p2X + barW * (1 - p2GhostRatio), barY, barW * p2GhostRatio, barH);

        const p2Grad = ctx.createLinearGradient(p2X, 0, p2X + barW, 0);
        p2Grad.addColorStop(0, '#ff0055');
        p2Grad.addColorStop(1, '#ff6600');
        ctx.fillStyle = p2Grad;
        ctx.fillRect(p2X + barW * (1 - p2Ratio), barY, barW * p2Ratio, barH);

        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(p2X, barY, barW, barH);

        // P2 Name & Grade Tag (Shows Friend / CPU Name & Character)
        const isPvP = this.isPvPMode();
        const p2DisplayName = (this.p2CustomName || (isPvP ? 'FRIEND' : 'CPU')).toUpperCase();
        ctx.font = "900 24px 'Cinzel', serif";
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'right';
        ctx.fillText(`${p2DisplayName} [${this.p2.data.name.toUpperCase()}]`, this.width - padX - 5, barY - 10);

        ctx.font = "700 16px 'Rajdhani', sans-serif";
        ctx.fillStyle = '#ff2a5f';
        ctx.fillText(`${this.p2.data.grade} • HP: ${Math.round(this.p2.hp)}/${this.p2.maxHp}`, this.width - padX - 5, barY + barH + 20);
        ctx.textAlign = 'left';

        // 2. Central Round Timer
        ctx.font = "900 16px 'Rajdhani', sans-serif";
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = 'center';
        ctx.fillText(`ROUND ${this.currentRound}`, this.width / 2, 24);

        ctx.fillStyle = 'rgba(15, 18, 30, 0.9)';
        ctx.beginPath();
        ctx.arc(this.width / 2, 54, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.font = "900 40px 'Rajdhani', sans-serif";
        ctx.fillStyle = this.roundTimer <= 10 ? '#ff0044' : '#ffd700';
        ctx.textAlign = 'center';
        ctx.fillText(this.roundTimer.toString(), this.width / 2, 68);
        ctx.textAlign = 'left';

        // 3. Round Win Counters (Orbs)
        for (let i = 0; i < 2; i++) {
            // P1 Orbs
            ctx.fillStyle = (i < this.p1RoundsWon) ? '#00e5ff' : '#222636';
            ctx.beginPath();
            ctx.arc(this.width / 2 - 70 - (i * 24), 54, 8, 0, Math.PI * 2);
            ctx.fill();

            // P2 Orbs
            ctx.fillStyle = (i < this.p2RoundsWon) ? '#ff0055' : '#222636';
            ctx.beginPath();
            ctx.arc(this.width / 2 + 70 + (i * 24), 54, 8, 0, Math.PI * 2);
            ctx.fill();
        }

        // 4. Cursed Energy Meters (Bottom Screen)
        const nrgW = 420;
        const nrgH = 20;
        const nrgY = this.height - 48;

        // P1 Energy
        ctx.fillStyle = 'rgba(15, 18, 30, 0.88)';
        ctx.fillRect(50, nrgY, nrgW, nrgH);
        ctx.fillStyle = (this.p1.energy >= 100) ? '#ffd700' : '#9d4edd';
        ctx.fillRect(50, nrgY, nrgW * (this.p1.energy / 100), nrgH);
        ctx.strokeStyle = '#9d4edd';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, nrgY, nrgW, nrgH);

        ctx.font = "700 15px 'Rajdhani', sans-serif";
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`CURSED ENERGY: ${Math.round(this.p1.energy)}% ${this.p1.energy >= 100 ? '[ULTIMATE READY!]' : ''}`, 52, nrgY - 7);

        // P2 Energy
        ctx.fillStyle = 'rgba(15, 18, 30, 0.88)';
        ctx.fillRect(this.width - 50 - nrgW, nrgY, nrgW, nrgH);
        ctx.fillStyle = (this.p2.energy >= 100) ? '#ffd700' : '#9d4edd';
        ctx.fillRect(this.width - 50 - nrgW, nrgY, nrgW * (this.p2.energy / 100), nrgH);
        ctx.strokeStyle = '#9d4edd';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.width - 50 - nrgW, nrgY, nrgW, nrgH);

        ctx.textAlign = 'right';
        ctx.fillText(`CURSED ENERGY: ${Math.round(this.p2.energy)}% ${this.p2.energy >= 100 ? '[ULTIMATE READY!]' : ''}`, this.width - 52, nrgY - 7);
        ctx.textAlign = 'left';
        ctx.textAlign = 'left';
    }
}

// Global Game Singleton Instance
window.GameInstance = new BattleArenaGame();

