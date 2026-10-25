// Fighter Class: Physics, Combat State Machine, Unique Character Attacks & Procedural Canvas Rendering
// Battle Arena: Clash of Sorcerors (16 Jujutsu Kaisen Sorcerers & Special Grade Curses)

class Fighter {
    constructor(charKey, x, isPlayer2 = false, particleEngine, soundEngine) {
        this.data = CHARACTERS_DATA[charKey] || CHARACTERS_DATA.yuji;
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
        this.direction = isPlayer2 ? -1 : 1; // 1 = right, -1 = left

        // Combat Stats
        this.maxHp = this.data.stats.hp;
        this.hp = this.maxHp;
        this.displayedHp = this.hp;
        this.ghostHp = this.hp;
        this.energy = 25;
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

        // Status Effects & Passives
        this.statusEffects = []; // { type: 'bleed'/'stun'/'poison'/'burn', duration: frames, dps: dmg }
        this.delayedAttacks = [];
        this.infinityCooldown = 0; // Gojo passive
        this.hasInfinityShield = (charKey === 'gojo');
        this.jackpotTimer = 0; // Hakari Jackpot duration in frames
        this.isJackpotActive = false;
        this.hasPandaRevived = false;

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
        return !['attack1', 'attack2', 'attack3', 'ultimate', 'hurt', 'knockdown', 'dead'].includes(this.state);
    }

    // ----------------------------------------------------
    // ATTACK 1: BASIC UNIQUE ATTACK
    // ----------------------------------------------------
    triggerBasicAttack() {
        if (!this.canAct() || this.cooldowns.basic > 0) return;
        this.state = 'attack1';
        this.stateTimer = 22;
        this.hasHitOpponent = false;
        this.cooldowns.basic = Math.floor(this.data.attacks.basic.cooldown * 60);

        const atk = this.data.attacks.basic;

        if (this.charKey === 'yuji') {
            // Divergent Fist: Punch + delayed cursed detonation
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
        } else if (this.charKey === 'nobara') {
            // Nail Hurl: Glowing cursed nails
            this.sound.playHammer();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 60 : -20),
                y: this.y + 50,
                vx: this.direction * 15,
                vy: 0,
                width: 32,
                height: 12,
                damage: atk.damage,
                knockback: 5,
                owner: this,
                color: '#ff7733',
                type: 'nobara_nail',
                life: 60
            });
        } else if (this.charKey === 'megumi') {
            // Divine Dog: Totality shadow lunge
            this.sound.playSlash();
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 30 : -atk.range,
                yOffset: 35,
                width: atk.range,
                height: 60,
                damage: atk.damage,
                knockback: 7,
                type: 'megumi_dog',
                activeFrames: [5, 15]
            };
        } else if (this.charKey === 'panda') {
            // Heavy Boxing Hook
            this.sound.playHit('heavy');
            this.vx = this.direction * 3;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 30 : -atk.range,
                yOffset: 35,
                width: atk.range,
                height: 60,
                damage: atk.damage,
                knockback: 8,
                type: 'panda_hook',
                activeFrames: [6, 16]
            };
        } else if (this.charKey === 'nanami') {
            // 7:3 Ratio Slash: Critical strike
            this.sound.playSlash();
            this.vx = this.direction * 4;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 35 : -atk.range,
                yOffset: 35,
                width: atk.range,
                height: 55,
                damage: atk.damage,
                knockback: 8,
                type: 'nanami_ratio',
                isCrit: true,
                activeFrames: [5, 14]
            };
        } else if (this.charKey === 'todo') {
            // Brute Force Straight
            this.sound.playHit('heavy');
            this.vx = this.direction * 5;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 35 : -atk.range,
                yOffset: 35,
                width: atk.range,
                height: 55,
                damage: atk.damage,
                knockback: 8,
                type: 'todo_punch',
                activeFrames: [5, 14]
            };
        } else if (this.charKey === 'choso') {
            // Blood Edge Blade
            this.sound.playBloodShot();
            this.vx = this.direction * 3;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 35 : -atk.range,
                yOffset: 30,
                width: atk.range,
                height: 60,
                damage: atk.damage,
                knockback: 7,
                type: 'choso_edge',
                activeFrames: [5, 14]
            };
        } else if (this.charKey === 'maki') {
            // Split Soul Katana Slash (True damage)
            this.sound.playSlash();
            this.vx = this.direction * 6;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 35 : -atk.range,
                yOffset: 30,
                width: atk.range,
                height: 55,
                damage: atk.damage,
                knockback: 7,
                type: 'maki_true_slash',
                activeFrames: [4, 13]
            };
        } else if (this.charKey === 'toji') {
            // Inverted Spear of Heaven Stab (Drains 15 energy)
            this.sound.playSlash();
            this.vx = this.direction * 7;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 35 : -atk.range,
                yOffset: 35,
                width: atk.range,
                height: 50,
                damage: atk.damage,
                knockback: 7,
                type: 'toji_isoh',
                activeFrames: [4, 12]
            };
        } else if (this.charKey === 'jogo') {
            // Ember Insects: Exploding flying insects
            this.sound.playFireExplosion();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 55 : -20),
                y: this.y + 45,
                vx: this.direction * 10,
                vy: Math.sin(this.animFrame) * 1.5,
                width: 35,
                height: 25,
                damage: atk.damage,
                knockback: 6,
                owner: this,
                color: '#ff5722',
                type: 'jogo_insect',
                homing: true,
                life: 70
            });
        } else if (this.charKey === 'mahito') {
            // Soul Drill Arm
            this.sound.playSlash();
            this.vx = this.direction * 4;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 35 : -atk.range,
                yOffset: 35,
                width: atk.range,
                height: 50,
                damage: atk.damage,
                knockback: 7,
                type: 'mahito_drill',
                activeFrames: [5, 14]
            };
        } else if (this.charKey === 'hakari') {
            // Rough Cursed Fist
            this.sound.playHit('medium');
            this.vx = this.direction * 5;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 35 : -atk.range,
                yOffset: 35,
                width: atk.range,
                height: 50,
                damage: atk.damage,
                knockback: 7,
                type: 'hakari_rough',
                activeFrames: [5, 13]
            };
        } else if (this.charKey === 'geto') {
            // Playful Cloud Cursed Staff Arc
            this.sound.playStaffExtend();
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 35 : -atk.range,
                yOffset: 25,
                width: atk.range,
                height: 70,
                damage: atk.damage,
                knockback: 8,
                type: 'geto_staff',
                activeFrames: [5, 16]
            };
        } else if (this.charKey === 'yuta') {
            // Boundless Katana Cleave
            this.sound.playSlash();
            this.vx = this.direction * 5;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 35 : -atk.range,
                yOffset: 30,
                width: atk.range,
                height: 60,
                damage: atk.damage,
                knockback: 8,
                type: 'yuta_slash',
                activeFrames: [5, 14]
            };
        } else if (this.charKey === 'sukuna') {
            // Dismantle: Flying invisible spatial slash
            this.sound.playSlash();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 60 : -30),
                y: this.y + 40,
                vx: this.direction * 15,
                vy: 0,
                width: 45,
                height: 55,
                damage: atk.damage,
                knockback: 8,
                owner: this,
                color: '#ff0033',
                type: 'sukuna_dismantle',
                life: 55
            });
        } else if (this.charKey === 'gojo') {
            // Lapse: Blue (Attraction vacuum punch)
            this.sound.playWhoosh();
            if (this.opponent) {
                // Pull opponent toward Gojo
                this.opponent.vx = (this.x - this.opponent.x) * 0.15;
            }
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 25 : -atk.range,
                yOffset: 30,
                width: atk.range,
                height: 65,
                damage: atk.damage,
                knockback: 10,
                type: 'gojo_blue_pull',
                activeFrames: [5, 16]
            };
        }
    }

    // ----------------------------------------------------
    // SKILL 1: FIRST SPECIAL SKILL
    // ----------------------------------------------------
    triggerSkill1() {
        const atk = this.data.attacks.skill1;
        if (!this.canAct() || this.cooldowns.skill1 > 0) return;
        if (!this.isJackpotActive && this.energy < atk.energyCost) return;
        if (!this.isJackpotActive) this.energy = Math.max(0, this.energy - atk.energyCost);
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
                activeFrames: [5, 26]
            };
        } else if (this.charKey === 'nobara') {
            // Hairpin (Kanzashi)
            this.sound.playHammer();
            const targetX = this.opponent ? this.opponent.x : this.x + this.direction * 180;
            const targetY = this.opponent ? this.opponent.y : this.y;
            this.particles.createFireBurst(targetX, targetY, 25);
            this.particles.addShockwave(targetX, targetY, 90, '#ff7733', 6);
            if (this.opponent && Math.abs(this.opponent.x - targetX) < 120) {
                this.opponent.takeDamage(atk.damage, this, 'hairpin', 10);
            }
        } else if (this.charKey === 'megumi') {
            // Nue: Electric dive projectile
            this.sound.playThunder();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 50 : -20),
                y: this.y + 10,
                vx: this.direction * 12,
                vy: 2.5,
                width: 60,
                height: 35,
                damage: atk.damage,
                knockback: 9,
                owner: this,
                color: '#00e5ff',
                type: 'megumi_nue',
                homing: true,
                life: 65
            });
        } else if (this.charKey === 'panda') {
            // Gorilla Mode Drumming Beat (Unblockable)
            this.sound.playRoar ? this.sound.playRoar() : this.sound.playHit('heavy');
            this.vx = this.direction * 7;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 20 : -atk.range,
                yOffset: 25,
                width: atk.range,
                height: 70,
                damage: atk.damage,
                knockback: 12,
                type: 'unblockable_blunt',
                activeFrames: [6, 26]
            };
        } else if (this.charKey === 'nanami') {
            // Collapse (Kawarawari)
            this.sound.playHit('heavy');
            this.particles.addShockwave(this.x + this.direction * 90, this.groundY, 110, '#e6b800', 8);
            this.particles.shake(12, 15);
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 30 : -atk.range,
                yOffset: 20,
                width: atk.range,
                height: 80,
                damage: atk.damage,
                knockback: 14,
                type: 'ground_collapse',
                activeFrames: [8, 24]
            };
        } else if (this.charKey === 'todo') {
            // Boogie Woogie: CLAP & SWAP POSITIONS!
            this.sound.playClap();
            this.particles.addShockwave(this.x + 35, this.y + 50, 80, '#ff4081', 6);
            if (this.opponent) {
                const tempX = this.x;
                this.x = this.opponent.x;
                this.opponent.x = tempX;
                this.direction = (this.opponent.x > this.x) ? 1 : -1;
                this.opponent.direction = -this.direction;
                this.particles.addShockwave(this.x + 35, this.y + 50, 80, '#ff4081', 6);
                this.particles.addFloatingText('BOOGIE WOOGIE!', this.x + 35, this.y - 20, '#ff4081', 20);
                this.opponent.takeDamage(atk.damage, this, 'swap_strike', 6);
            }
        } else if (this.charKey === 'choso') {
            // Piercing Blood: Supersonic crimson beam
            this.sound.playBloodShot();
            this.particles.createBloodSparks(this.x + (this.direction === 1 ? 60 : -20), this.y + 40, 15);
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 60 : -20),
                y: this.y + 40,
                vx: this.direction * 22,
                vy: 0,
                width: 90,
                height: 18,
                damage: atk.damage,
                knockback: 12,
                owner: this,
                color: '#b71c1c',
                type: 'choso_beam',
                life: 50
            });
        } else if (this.charKey === 'maki') {
            // Dragon Bone Kinetic Blast
            this.sound.playSlash();
            this.vx = this.direction * 10;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 25 : -atk.range,
                yOffset: 25,
                width: atk.range,
                height: 65,
                damage: atk.damage,
                knockback: 14,
                type: 'kinetic_blast',
                activeFrames: [6, 22]
            };
        } else if (this.charKey === 'toji') {
            // Fly Head Swarm (Slows enemy)
            this.sound.playWhoosh();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 50 : -20),
                y: this.y + 30,
                vx: this.direction * 8,
                vy: 0,
                width: 80,
                height: 60,
                damage: atk.damage,
                knockback: 5,
                owner: this,
                color: '#555',
                type: 'fly_head',
                life: 65
            });
        } else if (this.charKey === 'jogo') {
            // Volcanic Magma Geyser
            this.sound.playFireExplosion();
            const targetX = this.opponent ? this.opponent.x : this.x + this.direction * 180;
            this.particles.createFireBurst(targetX, this.groundY - 30, 30);
            this.particles.addShockwave(targetX, this.groundY - 10, 100, '#ff5722', 8);
            if (this.opponent && Math.abs(this.opponent.x - targetX) < 90) {
                this.opponent.takeDamage(atk.damage, this, 'magma_geyser', 15);
            }
        } else if (this.charKey === 'mahito') {
            // Body Repel: Compressed soul projectiles
            this.sound.playSoulDrain();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 55 : -20),
                y: this.y + 35,
                vx: this.direction * 13,
                vy: 0,
                width: 50,
                height: 35,
                damage: atk.damage,
                knockback: 10,
                owner: this,
                color: '#8e24aa',
                type: 'mahito_repel',
                life: 60
            });
        } else if (this.charKey === 'hakari') {
            // Train Shutter Slam
            this.sound.playHit('heavy');
            const targetX = this.opponent ? this.opponent.x : this.x + this.direction * 100;
            this.particles.addShockwave(targetX, this.y + 40, 70, '#ab47bc', 8);
            if (this.opponent && Math.abs(this.opponent.x - targetX) < 110) {
                this.opponent.takeDamage(atk.damage, this, 'shutter_slam', 8);
            }
        } else if (this.charKey === 'geto') {
            // Cursed Spirit Swarm
            this.sound.playSoulDrain();
            for (let i = 0; i < 3; i++) {
                this.particles.projectiles.push({
                    x: this.x + (this.direction === 1 ? 50 : -20),
                    y: this.y + 20 + i * 25,
                    vx: this.direction * (9 + i * 2),
                    vy: (i - 1) * 1.5,
                    width: 35,
                    height: 25,
                    damage: Math.floor(atk.damage / 3),
                    knockback: 5,
                    owner: this,
                    color: '#673ab7',
                    type: 'geto_curse',
                    life: 60
                });
            }
        } else if (this.charKey === 'yuta') {
            // Cursed Speech: "DON'T MOVE!"
            this.sound.playCursedSpeech();
            this.particles.addShockwave(this.x + 35, this.y + 45, 180, '#00e5ff', 8);
            this.particles.addFloatingText("DON'T MOVE!", this.x + 35, this.y - 25, '#00e5ff', 24);
            if (this.opponent) {
                this.opponent.takeDamage(atk.damage, this, 'freeze_speech', 0);
                this.opponent.state = 'hurt';
                this.opponent.stateTimer = 65; // ~1.1s complete stun
                this.particles.addFloatingText('STUNNED!', this.opponent.x + 35, this.opponent.y - 15, '#00e5ff', 18);
            }
        } else if (this.charKey === 'sukuna') {
            // Cleave: Head grab & durability cut
            this.sound.playSlash();
            this.vx = this.direction * 12;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 25 : -atk.range,
                yOffset: 25,
                width: atk.range,
                height: 60,
                damage: atk.damage,
                knockback: 14,
                type: 'sukuna_cleave',
                activeFrames: [6, 22]
            };
        } else if (this.charKey === 'gojo') {
            // Reversal: Red (Repulsion cannon)
            this.sound.playWhoosh();
            this.particles.createFireBurst(this.x + (this.direction === 1 ? 60 : -20), this.y + 40, 20);
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 60 : -20),
                y: this.y + 40,
                vx: this.direction * 18,
                vy: 0,
                width: 60,
                height: 40,
                damage: atk.damage,
                knockback: 20,
                owner: this,
                color: '#ff1744',
                type: 'gojo_red',
                life: 55
            });
        }
    }

    // ----------------------------------------------------
    // SKILL 2: SECOND SPECIAL SKILL
    // ----------------------------------------------------
    triggerSkill2() {
        const atk = this.data.attacks.skill2;
        if (!this.canAct() || this.cooldowns.skill2 > 0) return;
        if (!this.isJackpotActive && this.energy < atk.energyCost) return;
        if (!this.isJackpotActive) this.energy = Math.max(0, this.energy - atk.energyCost);
        this.cooldowns.skill2 = Math.floor(atk.cooldown * 60);
        this.state = 'attack3';
        this.stateTimer = 36;
        this.hasHitOpponent = false;

        if (this.charKey === 'yuji') {
            // Manji Kick
            this.sound.playHit('heavy');
            this.vy = -8;
            this.vx = this.direction * 7;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 30 : -atk.range,
                yOffset: 20,
                width: atk.range,
                height: 65,
                damage: atk.damage,
                knockback: 14,
                type: 'manji_kick',
                activeFrames: [6, 24]
            };
        } else if (this.charKey === 'nobara') {
            // Iron Hammer Smash
            this.sound.playHammer();
            this.vx = this.direction * 4;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 30 : -atk.range,
                yOffset: 25,
                width: atk.range,
                height: 70,
                damage: atk.damage,
                knockback: 14,
                type: 'hammer_crush',
                activeFrames: [8, 26]
            };
        } else if (this.charKey === 'megumi') {
            // Shadow Sink & Toad Snare
            this.sound.playWhoosh();
            if (this.opponent) {
                this.x = this.opponent.x - this.direction * 80;
            }
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 20 : -atk.range,
                yOffset: 25,
                width: atk.range,
                height: 65,
                damage: atk.damage,
                knockback: 12,
                type: 'shadow_strike',
                activeFrames: [6, 22]
            };
        } else if (this.charKey === 'panda') {
            // Cannonball Body Slam
            this.sound.playHit('heavy');
            this.vy = -12;
            this.vx = this.direction * 8;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 20 : -atk.range,
                yOffset: 20,
                width: atk.range,
                height: 70,
                damage: atk.damage,
                knockback: 16,
                type: 'cannon_slam',
                activeFrames: [10, 28]
            };
        } else if (this.charKey === 'nanami') {
            // Overtime Cleave
            this.sound.playSlash();
            this.vx = this.direction * 8;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 25 : -atk.range,
                yOffset: 25,
                width: atk.range,
                height: 65,
                damage: atk.damage,
                knockback: 15,
                type: 'overtime_cleave',
                isCrit: true,
                activeFrames: [6, 24]
            };
        } else if (this.charKey === 'todo') {
            // Playful Cloud Triple-Section Swing
            this.sound.playStaffExtend();
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 25 : -atk.range,
                yOffset: 25,
                width: atk.range,
                height: 70,
                damage: atk.damage,
                knockback: 15,
                type: 'playful_todo',
                activeFrames: [6, 26]
            };
        } else if (this.charKey === 'choso') {
            // Supernova
            this.sound.playBloodShot();
            this.particles.addShockwave(this.x + 35, this.y + 40, 120, '#b71c1c', 8);
            this.particles.createBloodSparks(this.x + 35, this.y + 40, 30);
            if (this.opponent && Math.abs(this.opponent.x - this.x) < 200) {
                this.opponent.takeDamage(atk.damage, this, 'supernova', 14);
            }
        } else if (this.charKey === 'maki') {
            // Air Surface Blitz
            this.sound.playSlash();
            this.vy = -9;
            this.vx = this.direction * 11;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 20 : -atk.range,
                yOffset: 20,
                width: atk.range,
                height: 70,
                damage: atk.damage,
                knockback: 15,
                type: 'maki_blitz',
                activeFrames: [6, 24]
            };
        } else if (this.charKey === 'toji') {
            // Playful Cloud Pure Impact Smash
            this.sound.playHit('heavy');
            this.vx = this.direction * 9;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 25 : -atk.range,
                yOffset: 20,
                width: atk.range,
                height: 70,
                damage: atk.damage,
                knockback: 18,
                type: 'toji_crush',
                activeFrames: [6, 24]
            };
        } else if (this.charKey === 'jogo') {
            // Disaster Flames Twin Palms
            this.sound.playFireExplosion();
            this.particles.createFireBurst(this.x + this.direction * 70, this.y + 40, 35);
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 25 : -atk.range,
                yOffset: 25,
                width: atk.range,
                height: 60,
                damage: atk.damage,
                knockback: 15,
                type: 'disaster_flame',
                activeFrames: [6, 25]
            };
        } else if (this.charKey === 'mahito') {
            // Polymorphic Soul Whip
            this.sound.playSlash();
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 25 : -atk.range,
                yOffset: 30,
                width: atk.range,
                height: 65,
                damage: atk.damage,
                knockback: 14,
                type: 'soul_whip',
                activeFrames: [6, 26]
            };
        } else if (this.charKey === 'hakari') {
            // Pachinko Steel Balls
            this.sound.playHit('medium');
            for (let i = 0; i < 4; i++) {
                this.particles.projectiles.push({
                    x: this.x + (this.direction === 1 ? 55 : -20),
                    y: this.y + 35 + (i * 10),
                    vx: this.direction * (11 + i * 3),
                    vy: -2 + Math.random() * 4,
                    width: 20,
                    height: 20,
                    damage: Math.floor(atk.damage / 4),
                    knockback: 5,
                    owner: this,
                    color: '#ffd700',
                    type: 'pachinko_ball',
                    life: 55
                });
            }
        } else if (this.charKey === 'geto') {
            // Antigravity System
            this.sound.playWhoosh();
            const targetX = this.opponent ? this.opponent.x : this.x + this.direction * 150;
            this.particles.addShockwave(targetX, this.groundY, 110, '#673ab7', 8);
            if (this.opponent && Math.abs(this.opponent.x - targetX) < 140) {
                this.opponent.vy = -18;
                this.opponent.isGrounded = false;
                this.opponent.takeDamage(atk.damage, this, 'antigravity', 12);
            }
        } else if (this.charKey === 'yuta') {
            // Queen of Curses: Rika Smash
            this.sound.playHit('heavy');
            const smashX = this.x + this.direction * 90;
            this.particles.addShockwave(smashX, this.groundY - 10, 130, '#00e5ff', 10);
            this.particles.shake(16, 20);
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 30 : -atk.range,
                yOffset: 15,
                width: atk.range,
                height: 80,
                damage: atk.damage,
                knockback: 18,
                type: 'rika_smash',
                activeFrames: [8, 26]
            };
        } else if (this.charKey === 'sukuna') {
            // Fūga (Divine Flame Arrow)
            this.sound.playFireExplosion();
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 55 : -25),
                y: this.y + 40,
                vx: this.direction * 16,
                vy: 0,
                width: 75,
                height: 26,
                damage: atk.damage,
                knockback: 18,
                owner: this,
                color: '#ff5500',
                type: 'sukuna_fuga',
                life: 70
            });
        } else if (this.charKey === 'gojo') {
            // Limitless Teleport Axe Kick
            this.sound.playDash();
            if (this.opponent) {
                this.x = this.opponent.x - this.direction * 70;
            }
            this.vy = -6;
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 20 : -atk.range,
                yOffset: 15,
                width: atk.range,
                height: 70,
                damage: atk.damage,
                knockback: 16,
                type: 'gojo_teleport_kick',
                activeFrames: [6, 24]
            };
        }
    }

    // ----------------------------------------------------
    // ULTIMATE: DOMAIN EXPANSIONS & SPECIAL FINISHERS
    // ----------------------------------------------------
    triggerUltimate() {
        const atk = this.data.attacks.ultimate;
        if (!this.canAct() || this.energy < 100 || this.cooldowns.ultimate > 0) return;
        this.energy = 0;
        this.cooldowns.ultimate = Math.floor(atk.cooldown * 60);
        this.state = 'ultimate';
        this.stateTimer = 55;
        this.hasHitOpponent = false;

        this.particles.flash('#ffffff', 0.25);
        this.particles.shake(22, 25);

        if (this.charKey === 'yuji') {
            // Black Flash (Kokusen)
            this.sound.playBlackFlash();
            if (this.opponent) this.x = this.opponent.x - (this.direction * 60);
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
                activeFrames: [10, 36]
            };
        } else if (this.charKey === 'nobara') {
            // Resonance Black Flash
            this.sound.playBlackFlash();
            const targetX = this.opponent ? this.opponent.x : this.x + this.direction * 200;
            this.particles.createBlackFlashSparks(targetX, this.y + 50);
            if (this.opponent) {
                this.opponent.takeDamage(atk.damage, this, 'resonance_black_flash', 18);
            }
        } else if (this.charKey === 'megumi') {
            // Chimera Shadow Garden
            this.sound.playDomainExpansion();
            this.particles.flash('#1a2a44', 0.4);
            this.particles.addShockwave(640, 560, 400, '#00e5ff', 10);
            if (this.opponent) {
                this.opponent.takeDamage(atk.damage, this, 'chimera_shadow', 18);
            }
        } else if (this.charKey === 'panda') {
            // Gorilla Resonance Beatdown
            this.sound.playHit('heavy');
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 20 : -atk.range,
                yOffset: 15,
                width: atk.range,
                height: 80,
                damage: atk.damage,
                knockback: 22,
                type: 'panda_ultimate',
                activeFrames: [10, 38]
            };
        } else if (this.charKey === 'nanami') {
            // Consecutive Black Flash x4
            this.sound.playBlackFlash();
            if (this.opponent) this.x = this.opponent.x - this.direction * 60;
            this.particles.createBlackFlashSparks(this.x + 35, this.y + 50);
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 10 : -atk.range,
                yOffset: 20,
                width: atk.range,
                height: 80,
                damage: atk.damage,
                knockback: 24,
                type: 'nanami_black_flash',
                isCrit: true,
                activeFrames: [10, 38]
            };
        } else if (this.charKey === 'todo') {
            // Brotherly Black Flash Combo
            this.sound.playBlackFlash();
            this.sound.playClap();
            if (this.opponent) this.x = this.opponent.x - this.direction * 60;
            this.particles.createBlackFlashSparks(this.x + 35, this.y + 50);
            this.currentHitbox = {
                xOffset: this.direction === 1 ? 10 : -atk.range,
                yOffset: 20,
                width: atk.range,
                height: 80,
                damage: atk.damage,
                knockback: 24,
                type: 'todo_black_flash',
                isCrit: true,
                activeFrames: [10, 38]
            };
        } else if (this.charKey === 'choso') {
            // Flowing Red Scale: Piercing Meteor
            this.sound.playBloodShot();
            this.particles.createBloodSparks(this.x + 35, this.y + 50, 40);
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 60 : -20),
                y: this.y + 40,
                vx: this.direction * 26,
                vy: 0,
                width: 140,
                height: 25,
                damage: atk.damage,
                knockback: 22,
                owner: this,
                color: '#b71c1c',
                type: 'choso_meteor',
                life: 50
            });
        } else if (this.charKey === 'maki') {
            // Carnage of the Zenin Clan
            this.sound.playSlash();
            this.particles.flash('#00bfa5', 0.3);
            this.particles.shake(20, 25);
            if (this.opponent) {
                this.opponent.takeDamage(atk.damage, this, 'maki_carnage', 22);
            }
        } else if (this.charKey === 'toji') {
            // Ghost Execution
            this.sound.playSlash();
            this.particles.flash('#1c2833', 0.4);
            if (this.opponent) {
                this.opponent.takeDamage(atk.damage, this, 'toji_execution', 24);
            }
        } else if (this.charKey === 'jogo') {
            // Maximum: Meteor & Iron Mountain
            this.sound.playFireExplosion();
            this.particles.createFireBurst(640, 360, 60);
            this.particles.addShockwave(640, 560, 350, '#ff5722', 12);
            this.particles.shake(26, 30);
            if (this.opponent) {
                this.opponent.takeDamage(atk.damage, this, 'jogo_meteor', 24);
            }
        } else if (this.charKey === 'mahito') {
            // Self-Embodiment of Perfection
            this.sound.playDomainExpansion();
            this.particles.flash('#8e24aa', 0.4);
            this.particles.addShockwave(640, 400, 320, '#8e24aa', 10);
            if (this.opponent) {
                this.opponent.takeDamage(atk.damage, this, 'mahito_domain', 22);
            }
        } else if (this.charKey === 'hakari') {
            // Idle Death Gamble: JACKPOT!
            this.sound.playJackpot();
            this.sound.playDomainExpansion();
            this.jackpotTimer = 360; // 6 seconds at 60fps
            this.isJackpotActive = true;
            this.particles.flash('#ffd700', 0.5);
            this.particles.addShockwave(this.x + 35, this.y + 50, 160, '#ffd700', 10);
            this.particles.addFloatingText('777 JACKPOT! IMMORTALITY!', this.x + 35, this.y - 30, '#ffd700', 26, true);
        } else if (this.charKey === 'geto') {
            // Maximum: Uzumaki
            this.sound.playDomainExpansion();
            this.particles.flash('#673ab7', 0.4);
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 60 : -40),
                y: this.y + 30,
                vx: this.direction * 18,
                vy: 0,
                width: 160,
                height: 80,
                damage: atk.damage,
                knockback: 25,
                owner: this,
                color: '#673ab7',
                type: 'uzumaki_beam',
                life: 60
            });
        } else if (this.charKey === 'yuta') {
            // Pure Love Beam
            this.sound.playHollowPurple();
            this.particles.flash('#00e5ff', 0.4);
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 70 : -50),
                y: this.y + 20,
                vx: this.direction * 20,
                vy: 0,
                width: 180,
                height: 90,
                damage: atk.damage,
                knockback: 26,
                owner: this,
                color: '#00e5ff',
                type: 'love_beam',
                life: 60
            });
        } else if (this.charKey === 'sukuna') {
            // Malevolent Shrine
            this.sound.playDomainExpansion();
            this.particles.flash('#ff0033', 0.5);
            this.particles.shake(28, 30);
            this.particles.addShockwave(640, 560, 450, '#ff0033', 12);
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    if (this.opponent && this.opponent.state !== 'dead') {
                        this.sound.playSlash();
                        this.particles.createCursedBurst(this.opponent.x + 35, this.opponent.y + 50, '#ff0033', 20);
                        this.opponent.takeDamage(75, this, 'shrine_slice', 8);
                    }
                }, i * 160);
            }
        } else if (this.charKey === 'gojo') {
            // Hollow Purple & Unlimited Void
            this.sound.playHollowPurple();
            this.sound.playDomainExpansion();
            this.particles.createHollowPurpleBlast(this.x + (this.direction === 1 ? 70 : -30), this.y + 40);
            this.particles.projectiles.push({
                x: this.x + (this.direction === 1 ? 70 : -40),
                y: this.y + 20,
                vx: this.direction * 16,
                vy: 0,
                width: 120,
                height: 120,
                damage: atk.damage,
                knockback: 28,
                owner: this,
                color: '#a855f7',
                type: 'hollow_purple_sphere',
                life: 65
            });
        }
    }

    // ----------------------------------------------------
    // DAMAGE, HEAL & STATUS EFFECTS
    // ----------------------------------------------------
    takeDamage(amount, attacker, type = 'normal', knockback = 5) {
        if (this.state === 'dead' || this.isInvulnerable) return;

        // Gojo Limitless Infinity Barrier: Completely blocks 1 attack every 6 seconds!
        if (this.charKey === 'gojo' && this.hasInfinityShield) {
            this.hasInfinityShield = false;
            this.infinityCooldown = 360; // 6 seconds
            this.sound.playBlock();
            this.particles.addShockwave(this.x + 35, this.y + 50, 90, '#00b0ff', 6);
            this.particles.addFloatingText('INFINITY BLOCKED!', this.x + 35, this.y - 25, '#00b0ff', 20, true);
            return;
        }

        // Hakari Jackpot: Immortality active!
        if (this.isJackpotActive) {
            amount = Math.floor(amount * 0.15); // Takes negligible damage and instantly regens
            this.particles.addFloatingText('JACKPOT SHIELD!', this.x + 35, this.y - 20, '#ffd700', 16);
        }

        // Toji Inverted Spear: drains energy
        if (type === 'toji_isoh') {
            this.energy = Math.max(0, this.energy - 15);
            this.particles.addFloatingText('-15 CE DRAINED!', this.x + 35, this.y - 20, '#78909c', 16);
        }

        // Damage calculation & defense
        let effectiveDef = this.defense;
        if (this.isBlocking && type !== 'unblockable_strike' && type !== 'true_damage') {
            amount *= 0.25;
            this.sound.playBlock();
            this.particles.createHitSparks(this.x + (this.direction === 1 ? 10 : 60), this.y + 50, 8, '#3a7bd5');
            this.vx = -this.direction * (knockback * 0.4);
            this.particles.addFloatingText('BLOCKED!', this.x + 35, this.y - 20, '#3a7bd5', 16);
            return;
        }

        // True damage bypasses defense (Maki)
        if (type !== 'true_damage') {
            amount = amount / effectiveDef;
        }

        // Yuji passive: Resolve below 35% HP
        if (this.charKey === 'yuji' && this.hp < this.maxHp * 0.35) {
            amount *= 0.70;
        }

        const finalDamage = Math.max(1, Math.round(amount));
        this.hp -= finalDamage;
        this.lastHitTime = Date.now();

        // Energy gain from taking damage
        this.energy = Math.min(this.maxEnergy, this.energy + 6 * (this.data.stats.energyGain || 1.0));

        // Floating damage indicator
        const isCrit = (type === 'spatial_crit' || type === 'precision_crit' || type === 'consecutive_crit');
        this.particles.addFloatingText(
            isCrit ? `CRIT ${finalDamage}!` : `-${finalDamage}`,
            this.x + 35,
            this.y - 15,
            isCrit ? '#ff0033' : '#ffea00',
            isCrit ? 26 : 20,
            isCrit
        );

        // Sound & Particle feedback
        this.sound.playHit(isCrit ? 'heavy' : 'medium');
        this.particles.createHitSparks(this.x + 35, this.y + 55, 12, '#ffcc00');

        // Knockback & Hitstun
        const kbDir = attacker ? attacker.direction : -this.direction;
        this.vx = kbDir * knockback;

        // Death Check
        if (this.hp <= 0) {
            // Panda 3 cores passive revive check
            if (this.charKey === 'panda' && !this.hasPandaRevived) {
                this.hasPandaRevived = true;
                this.hp = 140;
                this.energy = 50;
                this.sound.playRoar ? this.sound.playRoar() : this.sound.playHit('heavy');
                this.particles.flash('#43a047', 0.4);
                this.particles.addFloatingText('GORILLA CORE REVIVE!', this.x + 35, this.y - 30, '#43a047', 22, true);
                return;
            }

            this.hp = 0;
            this.state = 'dead';
            this.sound.playKO();
            this.particles.shake(25, 30);
            this.particles.addFloatingText('KNOCKOUT!!', this.x + 35, this.y - 40, '#ff0033', 32, true);
        } else {
            this.state = 'hurt';
            this.stateTimer = 16;
        }
    }

    heal(amount) {
        if (this.state === 'dead') return;
        this.hp = Math.min(this.maxHp, this.hp + amount);
        this.particles.addFloatingText(`+${Math.round(amount)} HP`, this.x + 35, this.y - 20, '#00ff88', 18);
    }

    // ----------------------------------------------------
    // FRAME UPDATE (Physics, Timers, Passives)
    // ----------------------------------------------------
    update() {
        this.animFrame++;

        // Gojo Limitless Infinity Barrier Recharge
        if (this.charKey === 'gojo' && !this.hasInfinityShield) {
            this.infinityCooldown--;
            if (this.infinityCooldown <= 0) {
                this.hasInfinityShield = true;
                this.particles.addFloatingText('INFINITY ACTIVE!', this.x + 35, this.y - 25, '#00b0ff', 18);
            }
        }

        // Hakari Jackpot Immortality & Energy Surge
        if (this.isJackpotActive) {
            this.jackpotTimer--;
            this.heal(1.6); // ~100 HP per second
            this.energy = 100; // Infinite cursed energy!
            if (this.jackpotTimer <= 0) {
                this.isJackpotActive = false;
                this.particles.addFloatingText('JACKPOT ENDED', this.x + 35, this.y - 20, '#ab47bc', 18);
            }
        }

        // Mahito Idle Transfiguration Regeneration
        if (this.charKey === 'mahito' && this.animFrame % 120 === 0 && this.state !== 'dead' && this.state !== 'hurt') {
            this.heal(20);
        }

        // Yuta Reverse Cursed Technique Passive Regen above 50 Energy
        if (this.charKey === 'yuta' && this.energy >= 50 && this.animFrame % 60 === 0 && this.state !== 'dead') {
            this.heal(12);
        }

        // Jogo Burn Aura to nearby enemy
        if (this.charKey === 'jogo' && this.opponent && this.animFrame % 60 === 0 && this.state !== 'dead') {
            if (Math.abs(this.opponent.x - this.x) < 140) {
                this.opponent.takeDamage(8, this, 'burn_tick', 1);
            }
        }

        // Smooth health bar transitions
        if (this.displayedHp > this.hp) {
            this.displayedHp -= (this.displayedHp - this.hp) * 0.15;
        }
        if (this.ghostHp > this.hp) {
            this.ghostHp -= 0.6;
            if (this.ghostHp < this.hp) this.ghostHp = this.hp;
        }

        // Decrement cooldowns
        for (const k in this.cooldowns) {
            if (this.cooldowns[k] > 0) this.cooldowns[k]--;
        }

        // State timer & recovery
        if (this.stateTimer > 0) {
            this.stateTimer--;
            if (this.stateTimer <= 0) {
                if (this.state !== 'dead') {
                    this.state = this.isGrounded ? 'idle' : 'jump';
                    this.currentHitbox = null;
                }
            }
        }

        // Hitbox collision against opponent
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

                    // Yuji Divergent Fist secondary delayed impact
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
            if (this.state === 'jump') this.state = 'idle';
        } else {
            this.isGrounded = false;
        }

        // Friction / drag
        if (this.isGrounded && this.state !== 'walk' && this.state !== 'dash') {
            this.vx *= 0.82;
            if (Math.abs(this.vx) < 0.2) this.vx = 0;
        }

        // Arena boundary collision
        if (this.x < 30) this.x = 30;
        if (this.x > 1280 - this.width - 30) this.x = 1280 - this.width - 30;
    }

    // ----------------------------------------------------
    // PROCEDURAL CHARACTER CANVAS RENDERING (2D Vector Art)
    // ----------------------------------------------------
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height);
        ctx.scale(this.direction, 1);

        // Ground Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 36, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Aura Effects
        if (this.data.auraColor && (this.energy > 40 || this.state === 'ultimate' || this.isJackpotActive)) {
            ctx.save();
            ctx.shadowColor = this.data.auraColor;
            ctx.shadowBlur = this.state === 'ultimate' ? 25 : 14;
            ctx.strokeStyle = this.data.auraColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, -65, 45, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Gojo Infinity Barrier Visual
        if (this.charKey === 'gojo' && this.hasInfinityShield) {
            ctx.save();
            ctx.strokeStyle = 'rgba(0, 176, 255, 0.6)';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#00b0ff';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(0, -65, 52 + Math.sin(this.animFrame * 0.1) * 3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Render specific character model
        if (this.charKey === 'yuji') this.drawYuji(ctx);
        else if (this.charKey === 'nobara') this.drawNobara(ctx);
        else if (this.charKey === 'megumi') this.drawMegumi(ctx);
        else if (this.charKey === 'panda') this.drawPanda(ctx);
        else if (this.charKey === 'nanami') this.drawNanami(ctx);
        else if (this.charKey === 'todo') this.drawTodo(ctx);
        else if (this.charKey === 'choso') this.drawChoso(ctx);
        else if (this.charKey === 'maki') this.drawMaki(ctx);
        else if (this.charKey === 'toji') this.drawToji(ctx);
        else if (this.charKey === 'jogo') this.drawJogo(ctx);
        else if (this.charKey === 'mahito') this.drawMahito(ctx);
        else if (this.charKey === 'hakari') this.drawHakari(ctx);
        else if (this.charKey === 'geto') this.drawGeto(ctx);
        else if (this.charKey === 'yuta') this.drawYuta(ctx);
        else if (this.charKey === 'sukuna') this.drawSukuna(ctx);
        else if (this.charKey === 'gojo') this.drawGojo(ctx);
        else this.drawYuji(ctx);

        ctx.restore();
    }

    // 1. YUJI ITADORI
    drawYuji(ctx) {
        const bob = Math.sin(this.animFrame * 0.15) * 3;
        const isAttacking = ['attack1', 'attack2', 'attack3', 'ultimate'].includes(this.state);

        // Legs / Pants
        ctx.fillStyle = '#1c1b29';
        ctx.fillRect(-18, -48, 14, 48);
        ctx.fillRect(4, -48, 14, 48);
        // Red shoes
        ctx.fillStyle = '#cc1133';
        ctx.fillRect(-22, -8, 18, 8);
        ctx.fillRect(4, -8, 18, 8);

        // Torso / Navy Uniform
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
        ctx.fillStyle = '#fcd0a1';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        // Hair (Pink spiky with black undercut)
        ctx.fillStyle = '#1a1820';
        ctx.beginPath();
        ctx.arc(0, -112 + bob, 15, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff7597';
        for (let i = -14; i <= 14; i += 7) {
            ctx.beginPath();
            ctx.moveTo(i - 4, -114 + bob);
            ctx.lineTo(i, -128 + bob);
            ctx.lineTo(i + 4, -114 + bob);
            ctx.fill();
        }

        // Eyes
        ctx.fillStyle = '#222';
        ctx.fillRect(4, -110 + bob, 4, 3);

        // Arms & Cursed Fists
        ctx.fillStyle = '#1e1c2e';
        if (isAttacking) {
            ctx.fillRect(8, -88 + bob, 38, 14);
            ctx.save();
            ctx.fillStyle = (this.state === 'ultimate') ? '#000000' : '#ff0055';
            ctx.shadowColor = (this.state === 'ultimate') ? '#ff0033' : '#ff0055';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(46, -81 + bob, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            ctx.fillRect(6, -88 + bob, 16, 26);
            ctx.fillRect(-16, -88 + bob, 14, 26);
            ctx.fillStyle = '#fcd0a1';
            ctx.fillRect(14, -76 + bob, 10, 10);
            ctx.fillRect(-14, -76 + bob, 10, 10);
        }
    }

    // 2. NOBARA KUGISAKI
    drawNobara(ctx) {
        const bob = Math.sin(this.animFrame * 0.15) * 3;
        // Dark blue gakuran jacket & skirt
        ctx.fillStyle = '#1b2238';
        ctx.fillRect(-16, -50, 32, 28); // Skirt
        ctx.fillStyle = '#111';
        ctx.fillRect(-14, -22, 10, 22); // Tights
        ctx.fillRect(4, -22, 10, 22);
        ctx.fillStyle = '#4a2511';
        ctx.fillRect(-16, -6, 14, 6); // Brown shoes
        ctx.fillRect(4, -6, 14, 6);

        // Jacket / Torso
        ctx.fillStyle = '#1b2238';
        ctx.fillRect(-18, -96 + bob, 36, 48);
        // Belt with nail pouch
        ctx.fillStyle = '#8d4925';
        ctx.fillRect(-19, -58 + bob, 38, 8);

        // Head
        ctx.fillStyle = '#fcd0a1';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 13, 0, Math.PI * 2);
        ctx.fill();

        // Orange Bob Hair
        ctx.fillStyle = '#d96b27';
        ctx.beginPath();
        ctx.arc(0, -110 + bob, 15, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();
        ctx.fillRect(-14, -112 + bob, 8, 18);
        ctx.fillRect(6, -112 + bob, 8, 14);

        // Eyes
        ctx.fillStyle = '#8d4925';
        ctx.fillRect(3, -109 + bob, 4, 3);

        // Hammer & Nails in hand
        ctx.fillStyle = '#777';
        ctx.fillRect(12, -85 + bob, 22, 6); // Hammer handle
        ctx.fillStyle = '#bbb';
        ctx.fillRect(30, -92 + bob, 8, 20); // Hammer head
    }

    // 3. MEGUMI FUSHIGURO
    drawMegumi(ctx) {
        const bob = Math.sin(this.animFrame * 0.15) * 3;
        // Navy Jujutsu High uniform
        ctx.fillStyle = '#151b29';
        ctx.fillRect(-17, -48, 13, 48);
        ctx.fillRect(4, -48, 13, 48);
        ctx.fillRect(-19, -96 + bob, 38, 50);

        // Head
        ctx.fillStyle = '#fae1c3';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 13, 0, Math.PI * 2);
        ctx.fill();

        // Spiky jet black hair
        ctx.fillStyle = '#0f141d';
        ctx.beginPath();
        ctx.arc(0, -111 + bob, 15, Math.PI, Math.PI * 2);
        ctx.fill();
        for (let i = -16; i <= 16; i += 5) {
            ctx.beginPath();
            ctx.moveTo(i - 3, -112 + bob);
            ctx.lineTo(i + (i > 0 ? 6 : -6), -130 + bob);
            ctx.lineTo(i + 3, -112 + bob);
            ctx.fill();
        }

        // Shadow Shikigami Sign hands
        ctx.fillStyle = '#fae1c3';
        ctx.fillRect(6, -82 + bob, 14, 14);
        // Shadow mist around feet
        ctx.fillStyle = 'rgba(26, 42, 68, 0.7)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // 4. PANDA
    drawPanda(ctx) {
        const bob = Math.sin(this.animFrame * 0.12) * 2;
        // Big round Panda torso (White & Black fur)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(0, -65 + bob, 32, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        // Black fur chest & legs
        ctx.fillStyle = '#111';
        ctx.fillRect(-22, -45, 18, 45);
        ctx.fillRect(4, -45, 18, 45);

        // Big round Panda head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 20, 0, Math.PI * 2);
        ctx.fill();

        // Black Ears
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(-14, -126 + bob, 8, 0, Math.PI * 2);
        ctx.arc(14, -126 + bob, 8, 0, Math.PI * 2);
        ctx.fill();

        // Black Eye patches
        ctx.beginPath();
        ctx.ellipse(6, -108 + bob, 7, 5, 0.2, 0, Math.PI * 2);
        ctx.ellipse(-6, -108 + bob, 7, 5, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Panda Nose
        ctx.fillStyle = '#000';
        ctx.fillRect(-3, -100 + bob, 6, 4);

        // Red Boxing Wristbands
        ctx.fillStyle = '#e53935';
        ctx.fillRect(16, -78 + bob, 12, 16);
        ctx.fillRect(-28, -78 + bob, 12, 16);
    }

    // 5. KENTO NANAMI
    drawNanami(ctx) {
        const bob = Math.sin(this.animFrame * 0.14) * 2;
        // Tan suit trousers
        ctx.fillStyle = '#caba94';
        ctx.fillRect(-17, -48, 14, 48);
        ctx.fillRect(3, -48, 14, 48);

        // Tan suit jacket & blue shirt
        ctx.fillStyle = '#7ea5b8'; // Blue dress shirt
        ctx.fillRect(-18, -96 + bob, 36, 50);
        ctx.fillStyle = '#caba94'; // Suit jacket sides
        ctx.fillRect(-19, -96 + bob, 12, 50);
        ctx.fillRect(7, -96 + bob, 12, 50);

        // Spotted necktie
        ctx.fillStyle = '#f9d342';
        ctx.fillRect(-2, -92 + bob, 5, 30);

        // Head & Slick Blonde Hair
        ctx.fillStyle = '#fae1c3';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e8d47b';
        ctx.beginPath();
        ctx.arc(0, -112 + bob, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        // Wraparound Tinted Glasses
        ctx.fillStyle = '#333';
        ctx.fillRect(1, -110 + bob, 11, 4);

        // Fabric-wrapped Cleaver
        ctx.fillStyle = '#eee';
        ctx.fillRect(14, -85 + bob, 24, 10);
        ctx.fillStyle = '#111';
        ctx.fillRect(10, -82 + bob, 6, 4);
    }

    // 6. AOI TODO
    drawTodo(ctx) {
        const bob = Math.sin(this.animFrame * 0.15) * 3;
        // Dark martial arts pants with sash
        ctx.fillStyle = '#1c1b22';
        ctx.fillRect(-18, -48, 15, 48);
        ctx.fillRect(3, -48, 15, 48);
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(-20, -52, 40, 6); // Sash

        // Muscular shirtless torso
        ctx.fillStyle = '#d49b6a';
        ctx.fillRect(-22, -96 + bob, 44, 46);

        // Head
        ctx.fillStyle = '#d49b6a';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 15, 0, Math.PI * 2);
        ctx.fill();

        // Topknot black hair
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(0, -114 + bob, 15, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-2, -128 + bob, 6, 0, Math.PI * 2); // Topknot bun
        ctx.fill();

        // Eye Scar across left face
        ctx.strokeStyle = '#5a2d1d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-5, -115 + bob);
        ctx.lineTo(-2, -102 + bob);
        ctx.stroke();

        // Clapping hands pose
        ctx.fillStyle = '#d49b6a';
        ctx.fillRect(6, -84 + bob, 16, 16);
    }

    // 7. CHOSO
    drawChoso(ctx) {
        const bob = Math.sin(this.animFrame * 0.14) * 2;
        // White and purple robes
        ctx.fillStyle = '#f3f0f7';
        ctx.fillRect(-18, -48, 36, 48);
        ctx.fillStyle = '#4a154b';
        ctx.fillRect(-20, -96 + bob, 40, 50);

        // Head
        ctx.fillStyle = '#fcd0a1';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 13, 0, Math.PI * 2);
        ctx.fill();

        // Black nose stripe mark
        ctx.fillStyle = '#222';
        ctx.fillRect(0, -106 + bob, 10, 3);

        // Twin spiky pigtails
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(0, -111 + bob, 14, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-18, -126 + bob, 6, 18);
        ctx.fillRect(12, -126 + bob, 6, 18);

        // Blood blade on arms
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(10, -82 + bob, 22, 6);
    }

    // 8. MAKI ZENIN
    drawMaki(ctx) {
        const bob = Math.sin(this.animFrame * 0.16) * 3;
        // Dark athletic combat sleeveless gear
        ctx.fillStyle = '#151f1e';
        ctx.fillRect(-16, -48, 13, 48);
        ctx.fillRect(3, -48, 13, 48);
        ctx.fillRect(-18, -96 + bob, 36, 50);

        // Bare scarred arms
        ctx.fillStyle = '#e8b896';
        ctx.fillRect(-22, -92 + bob, 6, 32);
        ctx.fillRect(16, -92 + bob, 6, 32);

        // Head with burn scars
        ctx.fillStyle = '#e8b896';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 13, 0, Math.PI * 2);
        ctx.fill();

        // Short dark green hair
        ctx.fillStyle = '#16382b';
        ctx.beginPath();
        ctx.arc(0, -111 + bob, 14, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-14, -111 + bob, 28, 6);

        // Split Soul Katana
        ctx.save();
        ctx.strokeStyle = '#00bfa5';
        ctx.shadowColor = '#00bfa5';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(14, -70 + bob);
        ctx.lineTo(38, -95 + bob);
        ctx.stroke();
        ctx.restore();
    }

    // 9. TOJI FUSHIGURO
    drawToji(ctx) {
        const bob = Math.sin(this.animFrame * 0.16) * 3;
        // Loose cream trousers
        ctx.fillStyle = '#e8dec8';
        ctx.fillRect(-18, -48, 15, 48);
        ctx.fillRect(3, -48, 15, 48);

        // Black tight athletic shirt
        ctx.fillStyle = '#111417';
        ctx.fillRect(-22, -96 + bob, 44, 50);

        // Head
        ctx.fillStyle = '#dca67d';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        // Lip Scar
        ctx.fillStyle = '#552818';
        ctx.fillRect(4, -102 + bob, 3, 4);

        // Shaggy Black Hair
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(0, -112 + bob, 15, Math.PI, Math.PI * 2);
        ctx.fill();

        // Inventory Curse Worm coiled around shoulder
        ctx.fillStyle = '#4a235a';
        ctx.beginPath();
        ctx.ellipse(-6, -88 + bob, 14, 8, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Inverted Spear of Heaven
        ctx.strokeStyle = '#b0bec5';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(14, -80 + bob);
        ctx.lineTo(36, -80 + bob);
        ctx.stroke();
        // Two prongs
        ctx.beginPath();
        ctx.moveTo(36, -83 + bob);
        ctx.lineTo(44, -80 + bob);
        ctx.lineTo(36, -77 + bob);
        ctx.stroke();
    }

    // 10. JOGO
    drawJogo(ctx) {
        const bob = Math.sin(this.animFrame * 0.13) * 2;
        // Dark green-spotted robe
        ctx.fillStyle = '#2e3d2f';
        ctx.fillRect(-22, -80 + bob, 44, 80);

        // Volcanic Rock head with smoking cone top
        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.arc(0, -106 + bob, 18, 0, Math.PI * 2);
        ctx.fill();

        // Volcano Cone Top
        ctx.fillStyle = '#4e342e';
        ctx.beginPath();
        ctx.moveTo(-10, -118 + bob);
        ctx.lineTo(10, -118 + bob);
        ctx.lineTo(6, -132 + bob);
        ctx.lineTo(-6, -132 + bob);
        ctx.closePath();
        ctx.fill();

        // Lava glow from volcano cone
        ctx.fillStyle = '#ff5722';
        ctx.fillRect(-5, -134 + bob, 10, 4);

        // Single Giant Cyclops Eye
        ctx.fillStyle = '#ffd600';
        ctx.beginPath();
        ctx.arc(4, -106 + bob, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(5, -106 + bob, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // 11. MAHITO
    drawMahito(ctx) {
        const bob = Math.sin(this.animFrame * 0.14) * 2;
        // Dark trousers
        ctx.fillStyle = '#1c1b29';
        ctx.fillRect(-17, -48, 14, 48);
        ctx.fillRect(3, -48, 14, 48);

        // Patchwork Grey Skin & Dark Shawl
        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(-20, -96 + bob, 40, 50);

        // Head with Stitches
        ctx.fillStyle = '#cfd8dc';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        // Stitches across face
        ctx.strokeStyle = '#263238';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-4, -108 + bob);
        ctx.lineTo(8, -106 + bob);
        ctx.stroke();

        // Silver-blue hair with braids
        ctx.fillStyle = '#78909c';
        ctx.beginPath();
        ctx.arc(0, -112 + bob, 15, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-14, -110 + bob, 6, 26);
        ctx.fillRect(8, -110 + bob, 6, 26);

        // Morphing Drill Blade Arm
        ctx.fillStyle = '#8e24aa';
        ctx.beginPath();
        ctx.moveTo(10, -85 + bob);
        ctx.lineTo(38, -80 + bob);
        ctx.lineTo(10, -75 + bob);
        ctx.closePath();
        ctx.fill();
    }

    // 12. KINJI HAKARI
    drawHakari(ctx) {
        const bob = Math.sin(this.animFrame * 0.14) * 2;
        // Purple fur-lined trench coat
        ctx.fillStyle = '#4a148c';
        ctx.fillRect(-22, -96 + bob, 44, 96);
        // Fur trim collar
        ctx.fillStyle = '#ce93d8';
        ctx.fillRect(-24, -96 + bob, 48, 10);

        // Head
        ctx.fillStyle = '#d7a16d';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 13, 0, Math.PI * 2);
        ctx.fill();

        // Blonde dreadlock undercut
        ctx.fillStyle = '#fbc02d';
        for (let i = -12; i <= 12; i += 4) {
            ctx.fillRect(i, -124 + bob, 3, 14);
        }

        // Jackpot banner if active
        if (this.isJackpotActive) {
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 13px sans-serif';
            ctx.fillText('777', -12, -130 + bob);
        }
    }

    // 13. SUGURU GETO (KENJAKU)
    drawGeto(ctx) {
        const bob = Math.sin(this.animFrame * 0.13) * 2;
        // Buddhist monk robes (Kesa)
        ctx.fillStyle = '#1c1b29';
        ctx.fillRect(-22, -96 + bob, 44, 96);
        // Golden diagonal sash
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(-18, -96 + bob);
        ctx.lineTo(22, -45);
        ctx.lineTo(14, -45);
        ctx.lineTo(-22, -96 + bob);
        ctx.closePath();
        ctx.fill();

        // Head
        ctx.fillStyle = '#fae1c3';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 13, 0, Math.PI * 2);
        ctx.fill();

        // Forehead Stitch Scar (Kenjaku mark)
        ctx.strokeStyle = '#8d2b2b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-8, -114 + bob);
        ctx.lineTo(8, -114 + bob);
        ctx.stroke();

        // Sleek black hair with falling bang
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(0, -112 + bob, 14, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(4, -112 + bob, 4, 18); // Bang
    }

    // 14. YUTA OKKOTSU
    drawYuta(ctx) {
        const bob = Math.sin(this.animFrame * 0.15) * 3;
        // White Jujutsu High zip jacket & white pants
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-17, -48, 14, 48);
        ctx.fillRect(3, -48, 14, 48);
        ctx.fillRect(-20, -96 + bob, 40, 50);

        // Black belt
        ctx.fillStyle = '#222';
        ctx.fillRect(-20, -56 + bob, 40, 6);

        // Head & Dark Hair
        ctx.fillStyle = '#fce4c8';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1e242b';
        ctx.beginPath();
        ctx.arc(0, -111 + bob, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        // Katana with blue aura
        ctx.save();
        ctx.strokeStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(12, -75 + bob);
        ctx.lineTo(36, -95 + bob);
        ctx.stroke();
        ctx.restore();

        // Manifestation of Rika's Ethereal Claws behind him
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(-8, -125 + bob, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // 15. RYOMEN SUKUNA
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

        // Black Obi
        ctx.fillStyle = '#111116';
        ctx.fillRect(-22, -62 + bob, 44, 12);

        // Open Chest with Cursed Marks
        ctx.fillStyle = '#fcd0a1';
        ctx.beginPath();
        ctx.moveTo(-10, -96 + bob);
        ctx.lineTo(10, -96 + bob);
        ctx.lineTo(0, -74 + bob);
        ctx.closePath();
        ctx.fill();

        // Head
        ctx.fillStyle = '#fcd0a1';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        // Slicked light pink hair
        ctx.fillStyle = '#f77fbe';
        for (let i = -14; i <= 14; i += 6) {
            ctx.beginPath();
            ctx.moveTo(i - 4, -114 + bob);
            ctx.lineTo(i - 2, -127 + bob);
            ctx.lineTo(i + 4, -114 + bob);
            ctx.fill();
        }

        // Sukuna Tattoos
        ctx.fillStyle = '#111';
        ctx.fillRect(4, -108 + bob, 6, 2);
        ctx.fillRect(2, -103 + bob, 8, 2);
        ctx.fillRect(-1, -116 + bob, 3, 6);

        // 4 Glowing Red Cursed Eyes
        ctx.fillStyle = '#ff0033';
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 8;
        ctx.fillRect(3, -110 + bob, 4, 3);
        ctx.fillRect(3, -105 + bob, 3, 2);
    }

    // 16. SATORU GOJO
    drawGojo(ctx) {
        const bob = Math.sin(this.animFrame * 0.15) * 3;
        // High-collar black Jujutsu High uniform
        ctx.fillStyle = '#0f1118';
        ctx.fillRect(-17, -48, 14, 48);
        ctx.fillRect(3, -48, 14, 48);
        ctx.fillRect(-20, -96 + bob, 40, 50);

        // Head
        ctx.fillStyle = '#fae1c3';
        ctx.beginPath();
        ctx.arc(0, -108 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        // Spiky Snowy White Hair
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -112 + bob, 16, Math.PI, Math.PI * 2);
        ctx.fill();
        for (let i = -15; i <= 15; i += 5) {
            ctx.beginPath();
            ctx.moveTo(i - 3, -112 + bob);
            ctx.lineTo(i, -129 + bob);
            ctx.lineTo(i + 3, -112 + bob);
            ctx.fill();
        }

        // Iconic Black Blindfold (or Six Eyes glowing cyan)
        if (this.state === 'ultimate') {
            // Unveiled Six Eyes!
            ctx.fillStyle = '#00b0ff';
            ctx.shadowColor = '#00b0ff';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(4, -108 + bob, 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#111';
            ctx.fillRect(-1, -112 + bob, 15, 7);
        }

        // Swirling Blue & Red Infinity Orbs around Gojo
        ctx.save();
        const orbAngle = this.animFrame * 0.08;
        // Blue Orb
        ctx.fillStyle = '#00b0ff';
        ctx.shadowColor = '#00b0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(Math.cos(orbAngle) * 32, -65 + Math.sin(orbAngle) * 20, 5, 0, Math.PI * 2);
        ctx.fill();
        // Red Orb
        ctx.fillStyle = '#ff1744';
        ctx.shadowColor = '#ff1744';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(Math.cos(orbAngle + Math.PI) * 32, -65 + Math.sin(orbAngle + Math.PI) * 20, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
