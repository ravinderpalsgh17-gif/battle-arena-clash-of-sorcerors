// Fighter Class: Physics, Combat State Machine, Unique Character Attacks & Procedural Canvas Rendering
// Battle Arena: Clash of Sorcerors

class Fighter {
    constructor(charKey, x, isPlayer2 = false, particleEngine, soundEngine) {
        this.data = CHARACTERS_DATA[charKey];
        this.charKey = charKey;
        this.isPlayer2 = isPlayer2;
        this.particles = particleEngine;
        this.sound = soundEngine;

        // Position & Physics
        this.width = 70;
        this.height = 130;
        this.x = x;
        this.y = 420;
        this.vx = 0;
        this.vy = 0;
        this.gravity = 0.85;
        this.groundY = 560;
        this.isGrounded = false;
        this.direction = isPlayer2 ? -1 : 1; // 1 = facing right, -1 = facing left

        // Combat Stats
        this.maxHp = this.data.stats.hp;
        this.hp = this.maxHp;
        this.displayedHp = this.hp; // For smooth health bar drain
        this.ghostHp = this.hp;     // Arcade yellow trailing bar
        this.energy = 25;           // Ultimate meter (0 to 100)
        this.maxEnergy = 100;
        this.speed = this.data.stats.speed;
        this.jumpForce = this.data.stats.jumpForce;
        this.defense = this.data.stats.defense;

        // States
        this.state = 'idle'; // idle, walk, jump, dash, attack1, attack2, attack3, ultimate, block, hurt, knockdown, dead
        this.stateTimer = 0;
        this.animFrame = 0;
        this.isBlocking = false;
        this.isInvulnerable = false;
        this.comboCount = 0;
        this.lastHitTime = 0;

        // Cooldowns (in frames, 60fps)
        this.cooldowns = {
            basic: 0,
            skill1: 0,
            skill2: 0,
            ultimate: 0
        };

        // Status Effects
        this.statusEffects = []; // { type: 'bleed'/'stun'/'slow', duration: frames, dps: dmg }
        this.staticCharges = 0;   // For Zeus passive
        this.soulStacks = 0;      // For Anubis passive
        this.delayedAttacks = []; // e.g. Yuji Divergent Fist secondary impact

        // Attack Hitbox info
        this.currentHitbox = null;
        this.hasHitOpponent = false;

        // Target opponent reference
        this.opponent = null;
    }

    setOpponent(opponent) {
        this.opponent = opponent;
    }

    // Input handlers
    moveLeft() {
        if (this.canAct()) {
            this.vx = -this.speed;
            this.direction = -1;
            if (this.isGrounded && this.state !== 'walk') this.state = 'walk';
        }
    }

    moveRight() {
        if (this.canAct()) {
            this.vx = this.speed;
            this.direction = 1;
            if (this.isGrounded && this.state !== 'walk') this.state = 'walk';
        }
    }

    stopMoving() {
        if (this.state === 'walk') {
            this.state = 'idle';
        }
    }

    jump() {
        if (this.canAct() && this.isGrounded) {
            this.vy = -this.jumpForce;
            this.isGrounded = false;
            this.state = 'jump';
            this.sound.playWhoosh();
            this.particles.createHitSparks(this.x + this.width / 2, this.y + this.height, 6, '#888');
        }
    }

    startBlock() {
        if (this.canAct() && this.isGrounded) {
            this.isBlocking = true;
            this.state = 'block';
            this.vx = 0;
        }
    }

    stopBlock() {
        if (this.isBlocking) {
            this.isBlocking = false;
            if (this.state === 'block') this.state = 'idle';
        }
    }

    canAct() {
        const lockedStates = ['hurt', 'knockdown', 'dead', 'stunned', 'attack1', 'attack2', 'attack3', 'ultimate'];
        return !lockedStates.includes(this.state);
    }

    // ----------------------------------------------------
    // CHARACTER ATTACK DISPATCHERS
    // ----------------------------------------------------

    // Attack 1: Basic Unique Strike
    triggerBasicAttack() {
        if (!this.canAct() || this.cooldowns.basic > 0) return;
        this.state = 'attack1';
        this.stateTimer = 22;
        this.hasHitOpponent = false;
        this.cooldowns.basic = Math.floor(this.data.attacks.basic.cooldown * 60);

        const atk = this.data.attacks.basic;

        if (this.charKey === 'yuji') {
            // Divergent Fist: Punch + 0.25s delayed cursed explosion
            this.sound.playWhoosh();
            this.vx = this.direction * 4;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 40 : -atk.range,
                yOffset: 40,
                width: atk.range,
                height: 50,
                damage: atk.damage,
                knockback: 6,
                type: 'yuji_divergent',
                activeFrames: [6, 14]
            };
        } else if (this.charKey === 'zeus') {
            // Thunder Lance: High speed piercing projectile
            this.sound.playThunder();
            this.particles.createLightningSparks(this.x + (this.direction === 1 ? 60 : -10), this.y + 50, 15);
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 60 : -10),
                y: this.y + 55,
                vx: this.direction * 16,
                vy: 0,
                width: 65,
                height: 16,
                damage: atk.damage,
                knockback: 7,
                owner: this,
                color: '#00e5ff',
                type: 'zeus_lance',
                life: 60
            });
        } else if (this.charKey === 'anubis') {
            // Soul Siphon: Ghostly jackal projectile
            this.sound.playSoulDrain();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 50 : -20),
                y: this.y + 50,
                vx: this.direction * 9,
                vy: Math.sin(this.animFrame) * 1.5,
                width: 32,
                height: 32,
                damage: atk.damage,
                knockback: 4,
                owner: this,
                color: '#9d4edd',
                type: 'anubis_skull',
                life: 70
            });
        } else if (this.charKey === 'wukong') {
            // Ruyi Expansion: Staff extends dynamically across arena
            this.sound.playStaffExtend();
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 40 : -atk.range,
                yOffset: 35,
                width: atk.range,
                height: 45,
                damage: atk.damage,
                knockback: 11,
                type: 'wukong_staff',
                activeFrames: [4, 16]
            };
        } else if (this.charKey === 'sukuna') {
            // Dismantle: Flying invisible spatial slash X
            this.sound.playSlash();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 60 : -30),
                y: this.y + 40,
                vx: this.direction * 14,
                vy: 0,
                width: 45,
                height: 55,
                damage: atk.damage,
                knockback: 8,
                owner: this,
                color: '#ff0033',
                type: 'sukuna_dismantle',
                life: 50
            });
        }
    }

    // Skill 1: First Special Skill
    triggerSkill1() {
        const atk = this.data.attacks.skill1;
        if (!this.canAct() || this.cooldowns.skill1 > 0 || this.energy < atk.energyCost) return;
        this.energy = Math.max(0, this.energy - atk.energyCost);
        this.cooldowns.skill1 = Math.floor(atk.cooldown * 60);
        this.state = 'attack2';
        this.stateTimer = 34;
        this.hasHitOpponent = false;

        if (this.charKey === 'yuji') {
            // Cursed Rush: Blurring multi-hit dash
            this.sound.playDash();
            this.vx = this.direction * 13;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 20 : -atk.range,
                yOffset: 30,
                width: atk.range,
                height: 60,
                damage: atk.damage,
                knockback: 12,
                type: 'yuji_rush',
                multiHits: 4,
                activeFrames: [5, 26]
            };
        } else if (this.charKey === 'zeus') {
            // Chain Spark: Homing lightning ball
            this.sound.playThunder();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 60 : -10),
                y: this.y + 40,
                vx: this.direction * 7,
                vy: 0,
                width: 36,
                height: 36,
                damage: atk.damage,
                knockback: 8,
                owner: this,
                color: '#ffd700',
                type: 'zeus_chain',
                homing: true,
                life: 90
            });
        } else if (this.charKey === 'anubis') {
            // Jackal Claws: Shadow leap & sweep
            this.sound.playSlash();
            this.sound.playSoulDrain();
            this.vx = this.direction * 11;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 10 : -atk.range,
                yOffset: 50,
                width: atk.range,
                height: 60,
                damage: atk.damage,
                knockback: 8,
                type: 'anubis_claws',
                bleed: true,
                activeFrames: [6, 22]
            };
        } else if (this.charKey === 'wukong') {
            // Nimbus Somersault: Leap high into air, downward staff slam
            this.sound.playWhoosh();
            this.vy = -14;
            this.vx = this.direction * 9;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? -20 : -atk.range + 40,
                yOffset: 20,
                width: atk.range,
                height: 90,
                damage: atk.damage,
                knockback: 14,
                type: 'wukong_somersault',
                activeFrames: [14, 28]
            };
        } else if (this.charKey === 'sukuna') {
            // Cleave: Teleport grab and devastating armor cut
            this.sound.playDash();
            if (this.opponent) {
                this.x = this.opponent.x - (this.opponent.direction * 75);
                this.direction = (this.opponent.x > this.x) ? 1 : -1;
            }
            this.sound.playSlash();
            this.particles.createCursedBurst(this.x + 30, this.y + 40, '#ff0033', 25);
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 10 : -atk.range,
                yOffset: 30,
                width: atk.range,
                height: 70,
                damage: atk.damage,
                knockback: 10,
                type: 'sukuna_cleave',
                armorPierce: true,
                activeFrames: [6, 20]
            };
        }
    }

    // Skill 2: Second Special Skill
    triggerSkill2() {
        const atk = this.data.attacks.skill2;
        if (!this.canAct() || this.cooldowns.skill2 > 0 || this.energy < atk.energyCost) return;
        this.energy = Math.max(0, this.energy - atk.energyCost);
        this.cooldowns.skill2 = Math.floor(atk.cooldown * 60);
        this.state = 'attack3';
        this.stateTimer = 36;
        this.hasHitOpponent = false;

        if (this.charKey === 'yuji') {
            // Slaughter Demon: Knife flip slash
            this.sound.playSlash();
            this.vy = -7;
            this.vx = this.direction * 6;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 20 : -atk.range,
                yOffset: 25,
                width: atk.range,
                height: 75,
                damage: atk.damage,
                knockback: 11,
                type: 'yuji_knife',
                bleed: true,
                activeFrames: [8, 24]
            };
        } else if (this.charKey === 'zeus') {
            // Aegis Storm: 360 degree electric shield
            this.sound.playThunder();
            this.particles.addShockwave(this.x + this.width / 2, this.y + this.height / 2, 130, '#00e5ff', 5);
            this.currentHitbox = {
                xOffset: -45,
                yOffset: -10,
                width: 160,
                height: 150,
                damage: atk.damage,
                knockback: 14,
                type: 'zeus_barrier',
                activeFrames: [4, 28]
            };
        } else if (this.charKey === 'anubis') {
            // Tomb Quicksand: Ground vortex trap
            this.sound.playSoulDrain();
            const targetX = this.opponent ? this.opponent.x : this.x + this.direction * 150;
            this.particles.projectiles.push({
                x: targetX,
                y: this.groundY - 15,
                vx: 0,
                vy: 0,
                width: 140,
                height: 25,
                damage: atk.damage,
                knockback: 2,
                owner: this,
                color: '#7209b7',
                type: 'anubis_quicksand',
                life: 140
            });
        } else if (this.charKey === 'wukong') {
            // Hair Clone Decoy: Spawns clone and teleports behind enemy
            this.sound.playStaffExtend();
            // Clone projectile / decoy
            this.particles.projectiles.push({
                x: this.x,
                y: this.y,
                vx: this.direction * 3,
                vy: 0,
                width: 60,
                height: 120,
                damage: atk.damage * 0.7,
                knockback: 9,
                owner: this,
                color: '#ff9f1c',
                type: 'wukong_clone',
                life: 80
            });
            // Teleport Wukong behind opponent
            if (this.opponent) {
                this.x = this.opponent.x + (this.opponent.direction * 90);
                this.direction = (this.opponent.x > this.x) ? 1 : -1;
            }
            this.sound.playDash();
        } else if (this.charKey === 'sukuna') {
            // Fuga: Divine Flame Arrow
            this.sound.playFireExplosion();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 55 : -25),
                y: this.y + 40,
                vx: this.direction * 15,
                vy: 0,
                width: 60,
                height: 25,
                damage: atk.damage,
                knockback: 15,
                owner: this,
                color: '#ff5500',
                type: 'sukuna_fuga',
                life: 70
            });
        }
    }

    // Ultimate: God-tier finisher
    triggerUltimate() {
        const atk = this.data.attacks.ultimate;
        if (!this.canAct() || this.energy < 100 || this.cooldowns.ultimate > 0) return;
        this.energy = 0;
        this.cooldowns.ultimate = Math.floor(atk.cooldown * 60);
        this.state = 'ultimate';
        this.stateTimer = 55;
        this.hasHitOpponent = false;

        this.particles.flash('#ffffff', 0.25);
        this.particles.shake(20, 25);

        if (this.charKey === 'yuji') {
            // Black Flash: Spatial distortion counter / critical strike
            this.sound.playBlackFlash();
            if (this.opponent) {
                this.x = this.opponent.x - (this.direction * 60);
            }
            this.particles.createBlackFlashSparks(this.x + 30, this.y + 50);
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 0 : -atk.range,
                yOffset: 20,
                width: atk.range,
                height: 80,
                damage: atk.damage,
                knockback: 22,
                type: 'yuji_black_flash',
                isCrit: true,
                activeFrames: [12, 38]
            };
        } else if (this.charKey === 'zeus') {
            // Wrath of Olympus: 5 consecutive lightning pillars across the arena
            this.sound.playThunder();
            this.sound.playThunder();
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const boltX = 150 + i * 220;
                    this.particles.addShockwave(boltX, this.groundY, 120, '#00e5ff', 8);
                    this.particles.createLightningSparks(boltX, this.groundY - 100, 30);
                    this.sound.playThunder();
                    if (this.opponent && Math.abs(this.opponent.x + 35 - boltX) < 110) {
                        this.opponent.takeDamage(atk.damage * 0.28, this, 'lightning', 12);
                    }
                }, i * 200);
            }
        } else if (this.charKey === 'anubis') {
            // Judgment of Ma'at: Golden scales reap opponent soul
            this.sound.playDomainExpansion();
            this.sound.playSoulDrain();
            this.particles.addShockwave(this.x + 35, this.y + 60, 220, '#ffd700', 8);
            this.currentHitbox = {
                xOffset: this.direction === 1 ? -30 : -atk.range,
                yOffset: 0,
                width: atk.range + 60,
                height: 120,
                damage: atk.damage,
                knockback: 16,
                type: 'anubis_scales',
                activeFrames: [14, 45]
            };
        } else if (this.charKey === 'wukong') {
            // Heaven Havoc: 3 clones converge from all directions
            this.sound.playStaffExtend();
            this.sound.playWhoosh();
            for (let i = 0; i < 3; i++) {
                this.particles.projectiles.push({
                    x: (this.opponent ? this.opponent.x : this.x) + (i === 0 ? -180 : (i === 1 ? 180 : 0)),
                    y: (i === 2) ? 100 : this.groundY - 120,
                    vx: i === 0 ? 9 : (i === 1 ? -9 : 0),
                    vy: i === 2 ? 12 : 0,
                    width: 70,
                    height: 90,
                    damage: atk.damage * 0.35,
                    knockback: 14,
                    owner: this,
                    color: '#ff9f1c',
                    type: 'wukong_havoc_clone',
                    life: 60
                });
            }
        } else if (this.charKey === 'sukuna') {
            // Malevolent Shrine: Barrier-less domain cuts everything
            this.sound.playDomainExpansion();
            this.particles.flash('#ff0022', 0.5);
            this.particles.shake(30, 60);

            let shrineSlices = 0;
            const shrineInterval = setInterval(() => {
                if (shrineSlices > 10 || this.state === 'dead') {
                    clearInterval(shrineInterval);
                    return;
                }
                this.sound.playSlash();
                const randX = 100 + Math.random() * 1050;
                const randY = 150 + Math.random() * 380;
                this.particles.createHitSparks(randX, randY, 14, '#ff0033');
                this.particles.addShockwave(randX, randY, 80, '#ff0033', 3);

                if (this.opponent) {
                    this.opponent.takeDamage(35, this, 'domain_slash', 3);
                }
                shrineSlices++;
            }, 180);
        }
    }

    // ----------------------------------------------------
    // DAMAGE, KNOCKBACK & HIT DETECTION
    // ----------------------------------------------------
    takeDamage(amount, attacker, type = 'normal', knockback = 5) {
        if (this.state === 'dead' || this.isInvulnerable) return;

        // Passive Damage Reductions
        let finalDamage = amount;

        // Yuji passive: below 35% HP gains 30% damage reduction
        if (this.charKey === 'yuji' && this.hp < this.maxHp * 0.35) {
            finalDamage *= 0.70;
            this.particles.addFloatingText('IRON WILL', this.x + 35, this.y - 15, '#ff2a5f', 16);
        }

        // Blocking
        if (this.isBlocking && (attacker.x > this.x ? this.direction === 1 : this.direction === -1)) {
            finalDamage *= 0.25;
            this.sound.playBlock();
            this.particles.createHitSparks(this.x + (this.direction === 1 ? 50 : 10), this.y + 40, 10, '#00e5ff');
            this.particles.addFloatingText('GUARD!', this.x + 35, this.y - 10, '#00e5ff', 18);
            knockback *= 0.3;
        } else {
            // Unblocked hit
            if (finalDamage > 80) {
                this.sound.playHit('heavy');
                this.particles.shake(12, 10);
            } else {
                this.sound.playHit('medium');
            }

            this.state = 'hurt';
            this.stateTimer = 16;
            this.particles.createHitSparks(this.x + 35, this.y + 50, 15, '#ffcc00');

            // Float damage text
            const isCrit = type === 'spatial_crit' || type === 'yuji_black_flash';
            const textColor = isCrit ? '#ff003b' : (finalDamage > 70 ? '#ff8800' : '#ffffff');
            this.particles.addFloatingText(`-${Math.round(finalDamage)}`, this.x + 35, this.y + 10, textColor, isCrit ? 32 : 22, isCrit);
        }

        // Apply HP reduction
        this.hp = Math.max(0, this.hp - finalDamage);

        // Knockback physics
        const knockDir = (attacker.x < this.x) ? 1 : -1;
        this.vx = knockDir * knockback;
        this.vy = -knockback * 0.5;

        // Energy gain for both attacker and defender
        this.energy = Math.min(100, this.energy + 8 * this.data.stats.energyGain);
        if (attacker) {
            attacker.energy = Math.min(100, attacker.energy + 14 * attacker.data.stats.energyGain);
            attacker.comboCount++;
            attacker.lastHitTime = Date.now();

            // Attacker passives & lifesteals
            if (attacker.charKey === 'anubis') {
                const heal = finalDamage * 0.25;
                attacker.heal(heal);
            } else if (attacker.charKey === 'sukuna' && attacker.hp < attacker.maxHp * 0.40) {
                attacker.heal(finalDamage * 0.20);
            }
        }

        // Death check
        if (this.hp <= 0) {
            this.state = 'dead';
            this.sound.playKO();
            this.particles.flash('#ff0000', 0.4);
            this.particles.shake(25, 30);
            this.vx = knockDir * 12;
            this.vy = -10;
        }
    }

    heal(amount) {
        if (this.state === 'dead') return;
        this.hp = Math.min(this.maxHp, this.hp + amount);
        this.particles.addFloatingText(`+${Math.round(amount)}`, this.x + 35, this.y - 20, '#00ff88', 18);
        this.particles.createSoulSparks(this.x + 35, this.y + 50, 8);
    }

    // ----------------------------------------------------
    // MAIN UPDATE LOOP (PHYSICS, TIMERS, HITBOXES)
    // ----------------------------------------------------
    update() {
        this.animFrame++;

        // Passive HP regeneration for Wukong
        if (this.charKey === 'wukong' && this.animFrame % 120 === 0 && this.state !== 'dead') {
            this.heal(this.maxHp * 0.015);
        }

        // Smooth health bar transition
        if (this.displayedHp > this.hp) {
            this.displayedHp -= (this.displayedHp - this.hp) * 0.15;
        }
        if (this.ghostHp > this.hp) {
            this.ghostHp -= 0.6; // trailing delay
            if (this.ghostHp < this.hp) this.ghostHp = this.hp;
        }

        // Combo timeout reset
        if (Date.now() - this.lastHitTime > 1800) {
            this.comboCount = 0;
        }

        // Decrement cooldowns
        for (const k in this.cooldowns) {
            if (this.cooldowns[k] > 0) this.cooldowns[k]--;
        }

        // Handle state timer & recovery
        if (this.stateTimer > 0) {
            this.stateTimer--;
            if (this.stateTimer <= 0) {
                if (this.state !== 'dead') {
                    this.state = this.isGrounded ? 'idle' : 'jump';
                    this.currentHitbox = null;
                }
            }
        }

        // Check active hitboxes against opponent
        if (this.currentHitbox && this.opponent && !this.hasHitOpponent) {
            const h = this.currentHitbox;
            const currentFrame = (this.state === 'attack1' ? 22 : (this.state === 'attack2' ? 34 : (this.state === 'attack3' ? 36 : 55))) - this.stateTimer;

            if (currentFrame >= h.activeFrames[0] && currentFrame <= h.activeFrames[1]) {
                const boxX = this.x + h.xOffset;
                const boxY = this.y + h.yOffset;

                // AABB Collision
                if (
                    boxX < this.opponent.x + this.opponent.width &&
                    boxX + h.width > this.opponent.x &&
                    boxY < this.opponent.y + this.opponent.height &&
                    boxY + h.height > this.opponent.y
                ) {
                    this.hasHitOpponent = true;
                    this.opponent.takeDamage(h.damage, this, h.type, h.knockback);

                    // Yuji Divergent Fist: Schedule secondary delayed impact!
                    if (h.type === 'yuji_divergent') {
                        setTimeout(() => {
                            if (this.opponent && this.opponent.state !== 'dead') {
                                this.sound.playHit('heavy');
                                this.particles.createCursedBurst(this.opponent.x + 35, this.opponent.y + 50, '#ff2a5f', 20);
                                this.particles.addShockwave(this.opponent.x + 35, this.opponent.y + 50, 70, '#ff2a5f', 4);
                                this.opponent.takeDamage(35, this, 'curse_detonation', 8);
                                this.particles.addFloatingText('DELAYED IMPACT!', this.opponent.x + 35, this.opponent.y - 25, '#ff2a5f', 18);
                            }
                        }, 250);
                    }
                }
            }
        }

        // Process delayed attacks
        for (let i = this.delayedAttacks.length - 1; i >= 0; i--) {
            const da = this.delayedAttacks[i];
            da.delay--;
            if (da.delay <= 0) {
                da.callback();
                this.delayedAttacks.splice(i, 1);
            }
        }

        // Physics integration
        this.x += this.vx;
        this.y += this.vy;

        // Gravity
        if (!this.isGrounded) {
            this.vy += this.gravity;
        }

        // Ground landing
        if (this.y >= this.groundY - this.height) {
            this.y = this.groundY - this.height;
            this.vy = 0;
            this.isGrounded = true;
            if (this.state === 'jump') {
                this.state = 'idle';
            }
        } else {
            this.isGrounded = false;
        }

        // Friction / drag
        if (this.isGrounded && this.state !== 'walk' && this.state !== 'dash') {
            this.vx *= 0.82;
            if (Math.abs(this.vx) < 0.2) this.vx = 0;
        }

        // Arena boundary collisions
        if (this.x < 40) {
            this.x = 40;
            this.vx = 0;
        }
        if (this.x > 1240 - this.width) {
            this.x = 1240 - this.width;
            this.vx = 0;
        }

        // Auto-face opponent when idle or walking
        if (this.opponent && (this.state === 'idle' || this.state === 'walk')) {
            this.direction = (this.opponent.x > this.x) ? 1 : -1;
        }
    }

    // ----------------------------------------------------
    // PROCEDURAL CHARACTER CANVAS RENDERING
    // ----------------------------------------------------
    draw(ctx) {
        ctx.save();

        const centerX = this.x + this.width / 2;
        const groundBaseline = this.groundY;

        // 1. Ground Shadow
        ctx.save();
        const shadowScale = Math.max(0.3, 1 - (groundBaseline - (this.y + this.height)) / 300);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(centerX, groundBaseline - 4, (this.width / 1.6) * shadowScale, 9 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Character Sprite & Pose
        ctx.translate(centerX, this.y + this.height);
        if (this.direction === -1) {
            ctx.scale(-1, 1); // Flip horizontally when facing left
        }

        // Aura effect when Ultimate ready or during special moves
        if (this.energy >= 100 || this.state === 'ultimate') {
            ctx.save();
            ctx.strokeStyle = this.data.color;
            ctx.shadowColor = this.data.color;
            ctx.shadowBlur = 18;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(0, -this.height / 2, this.width * 0.75, this.height * 0.6, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Character-specific custom vector rendering
        if (this.charKey === 'yuji') {
            this.drawYuji(ctx);
        } else if (this.charKey === 'zeus') {
            this.drawZeus(ctx);
        } else if (this.charKey === 'anubis') {
            this.drawAnubis(ctx);
        } else if (this.charKey === 'wukong') {
            this.drawWukong(ctx);
        } else if (this.charKey === 'sukuna') {
            this.drawSukuna(ctx);
        }

        ctx.restore();
    }

    // YUJI ITADORI RENDERING
    drawYuji(ctx) {
        const bob = Math.sin(this.animFrame * 0.15) * 3;
        const isAttacking = ['attack1', 'attack2', 'attack3', 'ultimate'].includes(this.state);

        // Legs / Pants (Dark navy jujutsu uniform)
        ctx.fillStyle = '#1c1b29';
        ctx.fillRect(-18, -48, 14, 48); // Left leg
        ctx.fillRect(4, -48, 14, 48);   // Right leg
        // Red shoes
        ctx.fillStyle = '#cc1133';
        ctx.fillRect(-22, -8, 18, 8);
        ctx.fillRect(4, -8, 18, 8);

        // Torso / Jacket
        ctx.fillStyle = '#1e1c2e';
        ctx.fillRect(-20, -96 + bob, 40, 50);

        // Iconic Red Hood / Collar
        ctx.fillStyle = '#e6194b';
        ctx.beginPath();
        ctx.moveTo(-18, -96 + bob);
        ctx.lineTo(18, -96 + bob);
        ctx.lineTo(12, -72 + bob);
        ctx.lineTo(-12, -72 + bob);
        ctx.closePath();
        ctx.fill();

        // Head
        ctx.fillStyle = '#fcd0a1'; // Skin
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        // Spiky Hair (Pink top with black undercut)
        ctx.fillStyle = '#1a1820'; // Undercut
        ctx.beginPath();
        ctx.arc(0, -112 + bob, 15, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff7597'; // Pink spikes
        for (let i = -14; i <= 14; i += 7) {
            ctx.beginPath();
            ctx.moveTo(i - 4, -114 + bob);
            ctx.lineTo(i, -128 + bob);
            ctx.lineTo(i + 4, -114 + bob);
            ctx.fill();
        }

        // Eyes & Determined Expression
        ctx.fillStyle = '#222';
        ctx.fillRect(4, -110 + bob, 4, 3);

        // Arms & Cursed Fists
        ctx.fillStyle = '#1e1c2e';
        if (isAttacking) {
            // Forward punch pose
            ctx.fillRect(8, -88 + bob, 38, 14);
            // Glowing Cursed Fist (Blue/Crimson aura)
            ctx.save();
            ctx.fillStyle = (this.state === 'ultimate') ? '#000000' : '#ff0055';
            ctx.shadowColor = (this.state === 'ultimate') ? '#ff0033' : '#ff0055';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(46, -81 + bob, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            // Boxing guard pose
            ctx.fillRect(6, -88 + bob, 16, 26);
            ctx.fillRect(-16, -88 + bob, 14, 26);
            ctx.fillStyle = '#fcd0a1';
            ctx.fillRect(14, -76 + bob, 10, 10);
            ctx.fillRect(-14, -76 + bob, 10, 10);
        }
    }

    // ZEUS RENDERING
    drawZeus(ctx) {
        const float = Math.sin(this.animFrame * 0.1) * 4;

        // Flowing White Robe & Golden Trim
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-22, -90 + float);
        ctx.lineTo(22, -90 + float);
        ctx.lineTo(26, 0);
        ctx.lineTo(-26, 0);
        ctx.closePath();
        ctx.fill();

        // Golden Cuirass / Chestplate
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-18, -88 + float, 36, 42);
        ctx.fillStyle = '#b8860b';
        ctx.fillRect(-14, -84 + float, 28, 6);

        // Head & Regal Beard
        ctx.fillStyle = '#fcd0a1';
        ctx.beginPath();
        ctx.arc(0, -104 + float, 14, 0, Math.PI * 2);
        ctx.fill();

        // Massive White Hair & Beard
        ctx.fillStyle = '#f0f4f8';
        ctx.beginPath(); // Beard
        ctx.moveTo(-14, -104 + float);
        ctx.lineTo(14, -104 + float);
        ctx.lineTo(0, -74 + float);
        ctx.closePath();
        ctx.fill();
        // Hair & Crown
        ctx.arc(0, -112 + float, 17, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffd700'; // Laurel Wreath Crown
        ctx.fillRect(-14, -116 + float, 28, 4);

        // Glowing Lightning Eyes
        ctx.fillStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 8;
        ctx.fillRect(4, -106 + float, 4, 3);

        // Arm holding crackling Lightning Bolt
        ctx.save();
        ctx.strokeStyle = '#00ffff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 16;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(10, -78 + float);
        ctx.lineTo(38, -88 + float);
        ctx.lineTo(32, -72 + float);
        ctx.lineTo(60, -82 + float);
        ctx.stroke();
        ctx.restore();
    }

    // ANUBIS RENDERING
    drawAnubis(ctx) {
        const bob = Math.sin(this.animFrame * 0.12) * 2;

        // Dark Obsidian & Purple Kilt / Shendyt
        ctx.fillStyle = '#100e17';
        ctx.fillRect(-18, -48, 14, 48);
        ctx.fillRect(4, -48, 14, 48);
        ctx.fillStyle = '#7b2cbf';
        ctx.fillRect(-22, -60, 44, 25);
        ctx.fillStyle = '#ffd700'; // Gold Belt
        ctx.fillRect(-22, -62, 44, 5);

        // Muscular Dark Anubis Torso
        ctx.fillStyle = '#181520';
        ctx.fillRect(-18, -98 + bob, 36, 45);

        // Golden Egyptian Collar (Wesekh)
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, -96 + bob, 18, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#5a189a';
        ctx.beginPath();
        ctx.arc(0, -96 + bob, 12, 0, Math.PI);
        ctx.fill();

        // Sleek Jackal Head & Snout
        ctx.fillStyle = '#100e17';
        ctx.beginPath();
        ctx.ellipse(0, -108 + bob, 13, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        // Snout
        ctx.beginPath();
        ctx.moveTo(4, -104 + bob);
        ctx.lineTo(24, -100 + bob);
        ctx.lineTo(4, -94 + bob);
        ctx.closePath();
        ctx.fill();

        // Tall Jackal Ears with Gold Interior
        ctx.fillStyle = '#100e17';
        ctx.beginPath();
        ctx.moveTo(-10, -116 + bob);
        ctx.lineTo(-6, -144 + bob);
        ctx.lineTo(0, -116 + bob);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(2, -116 + bob);
        ctx.lineTo(8, -144 + bob);
        ctx.lineTo(14, -116 + bob);
        ctx.fill();

        // Glowing Purple Eye
        ctx.fillStyle = '#c77dff';
        ctx.shadowColor = '#9d4edd';
        ctx.shadowBlur = 10;
        ctx.fillRect(8, -105 + bob, 5, 3);

        // Holding Underworld Scythe
        ctx.save();
        ctx.strokeStyle = '#c77dff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(18, -12 + bob);
        ctx.lineTo(22, -125 + bob);
        ctx.stroke();
        // Curved Blade
        ctx.fillStyle = '#9d4edd';
        ctx.beginPath();
        ctx.arc(22, -125 + bob, 26, Math.PI * 1.2, Math.PI * 1.9);
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
    }

    // SUN WUKONG RENDERING
    drawWukong(ctx) {
        const bob = Math.sin(this.animFrame * 0.18) * 3;

        // Tiger pelt skirt & boots
        ctx.fillStyle = '#ff9f1c';
        ctx.fillRect(-16, -46, 13, 46);
        ctx.fillRect(3, -46, 13, 46);
        ctx.fillStyle = '#333';
        ctx.fillRect(-20, -10, 16, 10);
        ctx.fillRect(3, -10, 16, 10);

        // Golden Warrior Armour
        ctx.fillStyle = '#e85d04';
        ctx.fillRect(-18, -94 + bob, 36, 50);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-14, -90 + bob, 28, 40);

        // Flowing Red Cape
        ctx.fillStyle = '#d90429';
        ctx.beginPath();
        ctx.moveTo(-16, -92 + bob);
        ctx.lineTo(-38 - Math.abs(this.vx) * 3, -40 + bob);
        ctx.lineTo(-12, -45 + bob);
        ctx.closePath();
        ctx.fill();

        // Monkey Face & Fur
        ctx.fillStyle = '#b07d62';
        ctx.beginPath();
        ctx.arc(0, -106 + bob, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#eddcd2'; // Face mask
        ctx.beginPath();
        ctx.ellipse(3, -104 + bob, 9, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Golden Circlet (Fillet) on forehead
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-14, -114 + bob, 28, 4);

        // Wild Hair Spikes & Feather Plumes
        ctx.fillStyle = '#7f4f24';
        ctx.beginPath();
        ctx.arc(0, -112 + bob, 15, Math.PI, Math.PI * 2);
        ctx.fill();

        // Golden Ruyi Jingu Bang Staff
        ctx.save();
        ctx.strokeStyle = '#d90429';
        ctx.lineWidth = 5;
        ctx.beginPath();
        const staffLength = (this.state === 'attack1') ? 160 : 70;
        ctx.moveTo(12, -80 + bob);
        ctx.lineTo(12 + staffLength, -80 + bob);
        ctx.stroke();
        // Golden staff tips
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 6;
        ctx.strokeRect(12, -83 + bob, 12, 6);
        ctx.strokeRect(staffLength, -83 + bob, 12, 6);
        ctx.restore();
    }

    // RYOMEN SUKUNA RENDERING
    drawSukuna(ctx) {
        const bob = Math.sin(this.animFrame * 0.12) * 2;

        // White Loose Kimono with Black Collar
        ctx.fillStyle = '#f8f9fa';
        ctx.beginPath();
        ctx.moveTo(-22, -96 + bob);
        ctx.lineTo(22, -96 + bob);
        ctx.lineTo(26, 0);
        ctx.lineTo(-26, 0);
        ctx.closePath();
        ctx.fill();

        // Black Sash / Obi
        ctx.fillStyle = '#111116';
        ctx.fillRect(-22, -62 + bob, 44, 12);

        // Open Chest with Cursed Line Markings / Tattoos
        ctx.fillStyle = '#fcd0a1'; // Chest skin
        ctx.beginPath();
        ctx.moveTo(-10, -96 + bob);
        ctx.lineTo(10, -96 + bob);
        ctx.lineTo(0, -74 + bob);
        ctx.closePath();
        ctx.fill();
        // Black Cursed Marks
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-6, -92 + bob);
        ctx.lineTo(0, -82 + bob);
        ctx.lineTo(6, -92 + bob);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#fcd0a1';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        // Spiky Hair (Light Pink slicked back)
        ctx.fillStyle = '#f77fbe';
        for (let i = -14; i <= 14; i += 6) {
            ctx.beginPath();
            ctx.moveTo(i - 4, -114 + bob);
            ctx.lineTo(i - 2, -127 + bob);
            ctx.lineTo(i + 4, -114 + bob);
            ctx.fill();
        }

        // Sukuna Demonic Facial Tattoos
        ctx.fillStyle = '#111';
        ctx.fillRect(4, -108 + bob, 6, 2);  // Eye tattoo line
        ctx.fillRect(2, -103 + bob, 8, 2);  // Lower eye mark
        ctx.fillRect(-1, -116 + bob, 3, 6); // Forehead diamond mark

        // 4 Glowing Red Cursed Eyes
        ctx.fillStyle = '#ff0033';
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 8;
        ctx.fillRect(3, -110 + bob, 4, 3); // Upper right eye
        ctx.fillRect(3, -105 + bob, 3, 2); // Lower right eye

        // Terrifying Smug Smirk
        ctx.strokeStyle = '#400';
        ctx.beginPath();
        ctx.moveTo(3, -99 + bob);
        ctx.lineTo(9, -100 + bob);
        ctx.stroke();
    }
}
