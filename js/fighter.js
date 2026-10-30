// 3D Fighter Engine: Physics, 3D Skeletal Animation, 16 JJK Sorcerers & Cursed Spirits
// Battle Arena: Clash of Sorcerors (Open World 3D)

class Fighter {
    constructor(charKey, x, z = 0, isPlayer2 = false, scene, particleEngine, soundEngine) {
        this.data = CHARACTERS_DATA[charKey] || CHARACTERS_DATA.yuji;
        this.charKey = charKey;
        this.isPlayer2 = isPlayer2;
        this.scene = scene;
        this.particles = particleEngine;
        this.sound = soundEngine;

        // 3D Spatial Coordinates & Physics
        this.x = x;
        this.y = 0; // 0 = on ground
        this.z = z;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.rotationY = isPlayer2 ? -Math.PI / 2 : Math.PI / 2;
        this.gravity = 0.024;
        this.isGrounded = true;

        // Combat Stats (scaled for 3D arena units)
        this.maxHp = this.data.stats.hp;
        this.hp = this.maxHp;
        this.displayedHp = this.hp;
        this.ghostHp = this.hp;
        this.energy = 25;
        this.maxEnergy = 100;
        this.speed = (this.data.stats.speed || 5.0) * 0.055;
        this.jumpForce = (this.data.stats.jumpForce || 14) * 0.038;
        this.defense = this.data.stats.defense || 1.0;

        // States
        this.state = 'idle'; // idle, walk, jump, attack1, attack2, attack3, ultimate, block, hurt, dead
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

        // Passives & Status Effects
        this.statusEffects = [];
        this.hasInfinityShield = (charKey === 'gojo');
        this.infinityCooldown = 0;
        this.isJackpotActive = false;
        this.jackpotTimer = 0;
        this.hasPandaRevived = false;

        // 3D Model Instance from Factory
        if (this.scene) {
            this.model3D = Character3DFactory.create(charKey, isPlayer2);
            this.scene.add(this.model3D.root);
            this.updateModelTransform();
        } else {
            this.model3D = null;
        }

        // Active Attack Hitbox
        this.currentHitbox = null;
        this.hasHitOpponent = false;
        this.opponent = null;
    }

    setOpponent(opponent) {
        this.opponent = opponent;
        if (this.opponent) {
            this.turnTowards(this.opponent.x, this.opponent.z);
            this.updateModelTransform();
        }
    }

    updateModelTransform() {
        if (!this.model3D) return;
        this.model3D.root.position.set(this.x, this.y, this.z);
        this.model3D.root.rotation.y = this.rotationY;
    }

    canAct() {
        return !['attack1', 'attack2', 'attack3', 'ultimate', 'hurt', 'dead'].includes(this.state);
    }

    // ----------------------------------------------------
    // 3D MOVEMENT & NAVIGATION
    // ----------------------------------------------------
    move3D(dx, dz) {
        if (!this.canAct()) return;

        const len = Math.hypot(dx, dz);
        if (len > 0.001) {
            const ndx = dx / len;
            const ndz = dz / len;

            this.vx = ndx * this.speed;
            this.vz = ndz * this.speed;

            // Face movement direction
            this.rotationY = Math.atan2(ndx, ndz);

            if (this.isGrounded && this.state !== 'walk') {
                this.state = 'walk';
            }
        }
    }

    stopMoving() {
        this.vx = 0;
        this.vz = 0;
        if (this.state === 'walk') {
            this.state = 'idle';
        }
        if (this.opponent && this.opponent.state !== 'dead') {
            this.turnTowards(this.opponent.x, this.opponent.z);
        }
    }

    turnTowards(targetX, targetZ, smoothRate = 1.0) {
        const dx = targetX - this.x;
        const dz = targetZ - this.z;
        if (Math.hypot(dx, dz) > 0.15) {
            const targetAngle = Math.atan2(dx, dz);
            if (smoothRate >= 1.0) {
                this.rotationY = targetAngle;
            } else {
                let diff = targetAngle - this.rotationY;
                while (diff < -Math.PI) diff += Math.PI * 2;
                while (diff > Math.PI) diff -= Math.PI * 2;
                this.rotationY += diff * smoothRate;
            }
        }
    }

    jump() {
        if (this.canAct() && this.isGrounded) {
            this.vy = this.jumpForce;
            this.isGrounded = false;
            this.state = 'jump';
            this.sound.playWhoosh();
        }
    }

    startBlock() {
        if (this.canAct() && this.isGrounded) {
            this.isBlocking = true;
            this.state = 'block';
            this.vx = 0;
            this.vz = 0;
            if (this.opponent && this.opponent.state !== 'dead') {
                this.turnTowards(this.opponent.x, this.opponent.z);
            }
        }
    }

    stopBlock() {
        if (this.isBlocking) {
            this.isBlocking = false;
            if (this.state === 'block') this.state = 'idle';
        }
    }

    // ----------------------------------------------------
    // 3D COMBAT ATTACK SUITE (All 16 Sorcerers)
    // ----------------------------------------------------
    triggerBasicAttack() {
        if (!this.canAct() || this.cooldowns.basic > 0) return;
        this.state = 'attack1';
        this.stateTimer = 22;
        this.hasHitOpponent = false;
        this.cooldowns.basic = Math.floor(this.data.attacks.basic.cooldown * 60);

        if (this.opponent) this.turnTowards(this.opponent.x, this.opponent.z);
        const atk = this.data.attacks.basic;

        if (this.charKey === 'nobara') {
            // Cursed Nail Hurl Projectile
            this.sound.playHammer();
            this.spawn3DProjectile('nail', atk.damage, 0.7, 0.15, '#ff7733');
        } else if (this.charKey === 'sukuna') {
            // Dismantle Spatial Slash
            this.sound.playSlash();
            this.spawn3DProjectile('slash', atk.damage, 0.85, 0.2, '#ff0033');
        } else if (this.charKey === 'jogo') {
            // Ember Insects
            this.sound.playWhoosh();
            this.spawn3DProjectile('fireball', atk.damage, 0.65, 0.2, '#ff5500');
        } else {
            // Melee Strike Hitbox
            this.sound.playWhoosh();
            this.currentHitbox = {
                range: 4.5,
                angle: 1.2,
                damage: atk.damage,
                knockback: 0.35,
                type: `${this.charKey}_basic`,
                activeFrames: [5, 15]
            };
        }
    }

    triggerSkill1() {
        if (!this.canAct() || this.cooldowns.skill1 > 0) return;
        const atk = this.data.attacks.skill1;
        if (this.energy < atk.energyCost) return;
        this.energy -= atk.energyCost;

        this.state = 'attack2';
        this.stateTimer = 34;
        this.hasHitOpponent = false;
        this.cooldowns.skill1 = Math.floor(atk.cooldown * 60);

        if (this.opponent) this.turnTowards(this.opponent.x, this.opponent.z);

        if (this.charKey === 'gojo') {
            // Reversal Red: Repulsive Gravitational Blast
            this.sound.playLaser();
            this.spawn3DProjectile('red', atk.damage, 0.95, 0.4, '#ff0044');
        } else if (this.charKey === 'choso') {
            // Piercing Blood: High-Velocity Stream
            this.sound.playLaser();
            this.spawn3DProjectile('blood_beam', atk.damage, 1.2, 0.25, '#bb0022');
        } else if (this.charKey === 'megumi') {
            // Nue Thunder Wings
            this.sound.playThunder();
            this.spawn3DProjectile('lightning', atk.damage, 0.75, 0.3, '#00e5ff');
        } else if (this.charKey === 'yuta') {
            // Cursed Speech: "DON'T MOVE"
            this.sound.playHit('heavy');
            if (this.opponent) {
                this.opponent.applyStatus('stun', 90);
                this.particles.addFloatingText("DON'T MOVE!", this.opponent.x, this.opponent.y + 3, '#00e5ff', 24);
            }
        } else {
            // Dash Attack or Heavy Hitbox
            this.sound.playWhoosh();
            const fwdX = Math.sin(this.rotationY);
            const fwdZ = Math.cos(this.rotationY);
            this.vx = fwdX * 0.35;
            this.vz = fwdZ * 0.35;

            this.currentHitbox = {
                range: 6.2,
                angle: 1.4,
                damage: atk.damage,
                knockback: 0.55,
                type: `${this.charKey}_skill1`,
                activeFrames: [8, 22]
            };
        }
    }

    triggerSkill2() {
        if (!this.canAct() || this.cooldowns.skill2 > 0) return;
        const atk = this.data.attacks.skill2;
        if (this.energy < atk.energyCost) return;
        this.energy -= atk.energyCost;

        this.state = 'attack3';
        this.stateTimer = 36;
        this.hasHitOpponent = false;
        this.cooldowns.skill2 = Math.floor(atk.cooldown * 60);

        if (this.opponent) this.turnTowards(this.opponent.x, this.opponent.z);

        if (this.charKey === 'gojo') {
            // Satoru Gojo: Hollow Technique: Purple (Kyoshiki: Murasaki)
            if (this.sound.playHollowPurple) {
                this.sound.playHollowPurple();
            } else {
                this.sound.playLaser();
            }
            this.particles.shake(18, 26);
            this.particles.createCursedBurst(this.x, this.y + 1.8, this.z, '#9d4edd', 40);
            this.particles.addFloatingText('HOLLOW PURPLE!', this.x, this.y + 3.5, '#9d4edd', 28, true);
            this.spawn3DProjectile('purple', atk.damage, 0.85, 0.95, '#9d4edd');
        } else if (this.charKey === 'sukuna') {
            // Divine Flame (Fuga) Arrow
            this.sound.playFireball();
            this.spawn3DProjectile('fuga', atk.damage, 0.9, 0.5, '#ff4400');
        } else if (this.charKey === 'todo') {
            // Boogie Woogie: Claps and swaps 3D positions with opponent!
            this.sound.playHit('heavy');
            if (this.opponent) {
                const tempX = this.x;
                const tempZ = this.z;
                this.x = this.opponent.x;
                this.z = this.opponent.z;
                this.opponent.x = tempX;
                this.opponent.z = tempZ;
                this.particles.createCursedBurst(this.x, this.y + 1.5, this.z, '#ab47bc', 25);
                this.particles.createCursedBurst(this.opponent.x, this.opponent.y + 1.5, this.opponent.z, '#ab47bc', 25);
                this.particles.addFloatingText('BOOGIE WOOGIE!', this.x, this.y + 3, '#ab47bc', 22);
            }
        } else {
            // High Impact Melee Launch
            this.sound.playSlash();
            this.currentHitbox = {
                range: 5.5,
                angle: 1.3,
                damage: atk.damage,
                knockback: 0.75,
                type: `${this.charKey}_skill2`,
                activeFrames: [8, 24]
            };
        }
    }

    triggerUltimate() {
        if (!this.canAct() || this.cooldowns.ultimate > 0) return;
        const atk = this.data.attacks.ultimate;
        if (this.energy < atk.energyCost) return;
        this.energy = 0;

        this.state = 'ultimate';
        this.stateTimer = 55;
        this.hasHitOpponent = false;
        this.cooldowns.ultimate = Math.floor(atk.cooldown * 60);

        if (this.opponent) this.turnTowards(this.opponent.x, this.opponent.z);

        this.sound.playUltimate();
        this.particles.shake(14, 25);
        this.particles.addFloatingText(atk.name.toUpperCase(), this.x, this.y + 3.5, this.data.color, 26, true);

        // Live 3D Domain Expansion Activation in Open World
        if (window.GameInstance && window.GameInstance.world3d) {
            const domainType = this.getDomainType();
            if (domainType) {
                window.GameInstance.world3d.activateDomain(domainType, this);
            }
        }

        // Projectile or Massive Cataclysmic Strike
        if (this.charKey === 'gojo') {
            // Satoru Gojo: Domain Expansion: Unlimited Void (Ryōiki Tenkai: Muryōkūsho)
            // Floods opponent's consciousness with infinite stimuli, applying 2.5s stun and sure-hit barrier pressure
            this.sound.playLaser();
            this.particles.createCursedBurst(this.x, this.y + 1.8, this.z, '#00b0ff', 45);
            this.particles.addFloatingText('UNLIMITED VOID!', this.x, this.y + 3.8, '#00b0ff', 30, true);
            this.currentHitbox = {
                range: 12.0,
                angle: Math.PI * 2, // 360-degree sure-hit domain radius
                damage: atk.damage,
                knockback: 1.5,
                type: 'gojo_unlimited_void',
                activeFrames: [15, 60]
            };
            if (this.opponent && this.opponent.applyStatusEffect) {
                this.opponent.applyStatusEffect('stun', 150); // 2.5s brain overload stun
            }
        } else if (this.charKey === 'hakari') {
            // Idle Death Gamble Jackpot: 20 Seconds Infinite Cursed Energy & Immortality!
            this.isJackpotActive = true;
            this.jackpotTimer = 60 * 20;
            this.particles.addFloatingText('JACKPOT ACTIVE!', this.x, this.y + 3.5, '#ffd700', 26);
        } else {
            // Direct Spatial Domain / Critical Blast
            this.currentHitbox = {
                range: 9.0,
                angle: Math.PI * 2, // 360-degree radius!
                damage: atk.damage,
                knockback: 1.2,
                type: `${this.charKey}_ultimate`,
                activeFrames: [15, 45]
            };
        }
    }

    getDomainType() {
        switch (this.charKey) {
            case 'gojo': return 'unlimited_void';
            case 'sukuna': return 'malevolent_shrine';
            case 'megumi': return 'chimera_shadow';
            case 'jogo': return 'iron_mountain';
            case 'yuta': return 'authentic_mutual_love';
            case 'mahito': return 'self_embodiment';
            case 'hakari': return 'idle_death_gamble';
            case 'geto': return 'womb_profusion';
            case 'yuji': return 'memory_of_soul';
            case 'nobara': return 'straw_doll_domain';
            case 'nanami': return 'ratio_domain';
            case 'todo': return 'boogie_domain';
            case 'panda': return 'tri_core_domain';
            case 'choso': return 'flowing_red_domain';
            case 'toji':
            case 'maki':
            default:
                return null;
        }
    }

    // ----------------------------------------------------
    // 3D PROJECTILE SPAWNER
    // ----------------------------------------------------
    spawn3DProjectile(type, damage, speed, radius, color) {
        if (!window.GameInstance) return;

        const fwdX = Math.sin(this.rotationY);
        const fwdZ = Math.cos(this.rotationY);

        const proj = {
            type,
            damage,
            owner: this,
            x: this.x + fwdX * 2.0,
            y: this.y + 1.8,
            z: this.z + fwdZ * 2.0,
            vx: fwdX * speed,
            vy: 0,
            vz: fwdZ * speed,
            radius,
            color,
            life: 80,
            mesh: null,
            light: null
        };

        // Create 3D Mesh in Scene
        const pGeo = new THREE.SphereGeometry(radius, 12, 12);
        const pMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
        proj.mesh = new THREE.Mesh(pGeo, pMat);
        proj.mesh.position.set(proj.x, proj.y, proj.z);
        this.scene.add(proj.mesh);

        // Add dynamic light
        proj.light = new THREE.PointLight(new THREE.Color(color), 2.2, 12);
        proj.light.position.set(proj.x, proj.y, proj.z);
        this.scene.add(proj.light);

        window.GameInstance.projectiles3D.push(proj);
    }

    // ----------------------------------------------------
    // DAMAGE, DEFENSE & STATUS EFFECTS
    // ----------------------------------------------------
    takeDamage(amount, attacker, hitType, knockback = 0.4) {
        if (this.state === 'dead' || this.isInvulnerable) return;

        // Gojo Limitless Infinity Barrier Passive
        if (this.hasInfinityShield && this.charKey === 'gojo') {
            this.hasInfinityShield = false;
            this.infinityCooldown = 360; // 6 seconds recharge
            this.particles.addFloatingText('BLOCKED BY INFINITY!', this.x, this.y + 3, '#00b0ff', 18);
            this.sound.playHit('medium');
            return;
        }

        // Guard Block Damage Reduction & Energy Gain
        let finalDamage = amount / this.defense;
        if (this.isBlocking) {
            finalDamage *= 0.25;
            this.gainEnergy(8);
            this.sound.playHit('light');
            this.particles.createCursedBurst(this.x, this.y + 1.5, this.z, '#00e5ff', 8);
            this.particles.addFloatingText('GUARD!', this.x, this.y + 2.8, '#00e5ff', 16);
            return;
        }

        // Toji Inverted Spear of Heaven CE Drain
        if (hitType && hitType.includes('toji')) {
            this.energy = Math.max(0, this.energy - 15);
            this.particles.addFloatingText('-15 CE DRAINED!', this.x, this.y + 3.2, '#78909c', 16);
        }

        // Apply Damage
        this.hp = Math.max(0, this.hp - finalDamage);
        this.state = 'hurt';
        this.stateTimer = 16;
        if (this.model3D) this.model3D.flashHurt();

        // Energy gain from taking damage (Adrenaline / Cursed Spark rush)
        this.gainEnergy(Math.min(18, finalDamage * 0.16 + 5));

        // 3D Knockback along attack vector & reorient towards attacker
        if (attacker) {
            const kx = this.x - attacker.x;
            const kz = this.z - attacker.z;
            const kLen = Math.hypot(kx, kz) || 1;
            this.vx = (kx / kLen) * knockback;
            this.vz = (kz / kLen) * knockback;
            if (this.state !== 'dead') {
                this.turnTowards(attacker.x, attacker.z);
            }
        }

        this.sound.playHit('heavy');
        this.particles.createHitSparks(this.x, this.y + 1.5, this.z, 14, '#ffcc00');
        this.particles.addFloatingText(`-${Math.round(finalDamage)}`, this.x, this.y + 3, '#ff2a5f', 20);

        // Domain Concentration & Barrier Stress Tracking
        if (window.GameInstance && window.GameInstance.world3d && window.GameInstance.world3d.domainState.active) {
            const ds = window.GameInstance.world3d.domainState;
            if (ds.isClashing) {
                if (this === ds.clashCasterA) ds.clashDamageA += finalDamage;
                if (this === ds.clashCasterB) ds.clashDamageB += finalDamage;
            } else if (this === ds.caster) {
                ds.casterDamageTaken = (ds.casterDamageTaken || 0) + finalDamage;
                if (ds.casterDamageTaken >= 65) {
                    window.GameInstance.world3d.collapseDomain('damage');
                }
            }
        }

        // Death Check & Panda Core Revive
        if (this.hp <= 0) {
            if (this.charKey === 'panda' && !this.hasPandaRevived) {
                this.hasPandaRevived = true;
                this.hp = 120;
                this.displayedHp = 120;
                this.ghostHp = 120;
                this.gainEnergy(35);
                this.particles.addFloatingText('GORILLA CORE REVIVE!', this.x, this.y + 3.2, '#ffd700', 24, true);
                this.sound.playUltimate();
                return;
            }
            this.hp = 0;
            this.state = 'dead';
            this.sound.playKO();

            // Collapse domain if caster dies
            if (window.GameInstance && window.GameInstance.world3d && window.GameInstance.world3d.domainState.active) {
                if (this === window.GameInstance.world3d.domainState.caster) {
                    window.GameInstance.world3d.collapseDomain('caster_dead');
                }
            }
        }
    }

    gainEnergy(amt) {
        if (this.state === 'dead' || this.isJackpotActive) return;
        const mult = (this.data.passive && this.data.passive.energyGain) ? this.data.passive.energyGain : 1.0;
        const oldEnergy = this.energy;
        this.energy = Math.min(this.maxEnergy, this.energy + amt * mult);

        // Notify when Ultimate is ready!
        if (this.energy >= 100 && oldEnergy < 100) {
            this.particles.addFloatingText('MAX CURSED ENERGY!', this.x, this.y + 3.2, '#ffd700', 22, true);
        }
    }

    applyStatus(type, duration) {
        this.statusEffects.push({ type, duration });
    }

    heal(amt) {
        this.hp = Math.min(this.maxHp, this.hp + amt);
    }

    // ----------------------------------------------------
    // FRAME UPDATE & PHYSICS
    // ----------------------------------------------------
    update() {
        this.animFrame++;

        // Status Effects
        for (let i = this.statusEffects.length - 1; i >= 0; i--) {
            const st = this.statusEffects[i];
            st.duration--;
            if (st.duration <= 0) {
                this.statusEffects.splice(i, 1);
            }
        }

        // Gojo Infinity Barrier Recharge
        if (this.charKey === 'gojo' && !this.hasInfinityShield) {
            this.infinityCooldown--;
            if (this.infinityCooldown <= 0) {
                this.hasInfinityShield = true;
                this.particles.addFloatingText('INFINITY ACTIVE!', this.x, this.y + 3, '#00b0ff', 18);
            }
        }

        // Hakari Jackpot
        if (this.isJackpotActive) {
            this.jackpotTimer--;
            this.heal(1.6);
            this.energy = 100;
            if (this.jackpotTimer <= 0) {
                this.isJackpotActive = false;
            }
        }

        // Natural Cursed Energy Circulation during battle (~5 CE/sec)
        if (this.state !== 'dead' && !this.isJackpotActive) {
            const mult = (this.data.passive && this.data.passive.energyGain) ? this.data.passive.energyGain : 1.0;
            this.energy = Math.min(this.maxEnergy, this.energy + 0.085 * mult);
        }

        // Yuta Reverse Cursed Technique: Passively heals 12 HP/s when maintaining >= 50 CE
        if (this.charKey === 'yuta' && this.energy >= 50 && this.animFrame % 60 === 0 && this.state !== 'dead') {
            this.heal(12);
            this.particles.addFloatingText('+12 HP', this.x, this.y + 3.0, '#00e5ff', 16);
        }

        // Smooth Health Bar Transition
        if (this.displayedHp > this.hp) {
            this.displayedHp -= (this.displayedHp - this.hp) * 0.15;
        }
        if (this.ghostHp > this.hp) {
            this.ghostHp -= 0.6;
            if (this.ghostHp < this.hp) this.ghostHp = this.hp;
        }

        // Decrement Cooldowns
        for (const k in this.cooldowns) {
            if (this.cooldowns[k] > 0) this.cooldowns[k]--;
        }

        // State Timer Recovery
        if (this.stateTimer > 0) {
            this.stateTimer--;
            if (this.stateTimer <= 0 && this.state !== 'dead') {
                this.state = this.isGrounded ? 'idle' : 'jump';
                this.currentHitbox = null;
            }
        }

        // 3D Hitbox Collision Detection against Opponent
        if (this.currentHitbox && this.opponent && !this.hasHitOpponent) {
            const h = this.currentHitbox;
            const dist = Math.hypot(this.opponent.x - this.x, this.opponent.z - this.z);

            if (dist <= h.range) {
                this.hasHitOpponent = true;
                this.opponent.takeDamage(h.damage, this, h.type, h.knockback);

                // Attacker builds Cursed Energy on hit!
                const ceGain = (h.type && h.type.includes('basic')) ? 16 : 12;
                this.gainEnergy(ceGain);

                // Yuji Divergent Fist Delayed Impact
                if (h.type === 'yuji_basic') {
                    setTimeout(() => {
                        if (this.opponent && this.opponent.state !== 'dead') {
                            this.sound.playHit('heavy');
                            this.opponent.takeDamage(35, this, 'curse_detonation', 0.4);
                            this.particles.addFloatingText('DELAYED IMPACT!', this.opponent.x, this.opponent.y + 3, '#ff2a5f', 18);
                            this.gainEnergy(8);
                        }
                    }, 250);
                }
            }
        }

        // 3D Physics Integration
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        // Gravity & Ground Landing
        if (!this.isGrounded) {
            this.vy -= this.gravity;
            if (this.y <= 0) {
                this.y = 0;
                this.vy = 0;
                this.isGrounded = true;
                if (this.state === 'jump') this.state = 'idle';
            }
        }

        // Ground Friction
        if (this.isGrounded && this.state !== 'walk') {
            this.vx *= 0.82;
            this.vz *= 0.82;
            if (Math.abs(this.vx) < 0.005) this.vx = 0;
            if (Math.abs(this.vz) < 0.005) this.vz = 0;
        }

        // Open World Arena Boundary Clamping (-90 to 90)
        this.x = Math.max(-88, Math.min(88, this.x));
        this.z = Math.max(-88, Math.min(88, this.z));

        // Continuous combat auto-tracking: Face opponent during idle and block
        if (this.opponent && this.opponent.state !== 'dead' && (this.state === 'idle' || this.state === 'block')) {
            this.turnTowards(this.opponent.x, this.opponent.z, 0.25);
        }

        // Update 3D Model & Procedural Bones
        this.updateModelTransform();
        if (this.model3D) {
            this.model3D.update(
                this.state,
                this.stateTimer,
                this.vx,
                this.vz,
                this.vy,
                this.isGrounded,
                this.isBlocking,
                this.animFrame,
                this.isJackpotActive
            );
        }
    }

    cleanup() {
        if (this.model3D && this.scene) {
            this.scene.remove(this.model3D.root);
        }
    }
}
