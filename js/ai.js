// Intelligent Combat AI Controller for Battle Arena: Clash of Sorcerors
// Supports Easy, Medium, Hard, and Deity difficulty modes

class AIController {
    constructor(fighter, difficulty = 'medium') {
        this.fighter = fighter;
        this.difficulty = difficulty;
        this.decisionTimer = 0;
        this.actionQueue = null;

        // Configuration based on difficulty
        const configs = {
            easy: { reactionDelay: 25, blockChance: 0.15, aggressiveChance: 0.40, comboSkill: 0.25 },
            medium: { reactionDelay: 15, blockChance: 0.45, aggressiveChance: 0.65, comboSkill: 0.55 },
            hard: { reactionDelay: 8, blockChance: 0.70, aggressiveChance: 0.82, comboSkill: 0.85 },
            deity: { reactionDelay: 4, blockChance: 0.90, aggressiveChance: 0.95, comboSkill: 0.98 }
        };

        this.cfg = configs[difficulty] || configs.medium;
    }

    setDifficulty(diff) {
        this.difficulty = diff;
        const configs = {
            easy: { reactionDelay: 25, blockChance: 0.15, aggressiveChance: 0.40, comboSkill: 0.25 },
            medium: { reactionDelay: 15, blockChance: 0.45, aggressiveChance: 0.65, comboSkill: 0.55 },
            hard: { reactionDelay: 8, blockChance: 0.70, aggressiveChance: 0.82, comboSkill: 0.85 },
            deity: { reactionDelay: 4, blockChance: 0.90, aggressiveChance: 0.95, comboSkill: 0.98 }
        };
        this.cfg = configs[diff] || configs.medium;
    }

    update() {
        const f = this.fighter;
        const opp = f.opponent;
        if (!opp || f.state === 'dead') return;

        this.decisionTimer++;
        if (this.decisionTimer < this.cfg.reactionDelay) {
            return;
        }
        this.decisionTimer = 0;

        const dist = Math.abs(opp.x - f.x);
        const oppIsAttacking = ['attack1', 'attack2', 'attack3', 'ultimate'].includes(opp.state);

        // 1. Defensive reaction: Block or Jump if opponent is attacking nearby
        if (oppIsAttacking && dist < 220) {
            if (Math.random() < this.cfg.blockChance) {
                f.startBlock();
                setTimeout(() => {
                    if (f && f.state === 'block') f.stopBlock();
                }, 350 + Math.random() * 250);
                return;
            } else if (Math.random() < 0.35 && f.isGrounded) {
                f.jump();
                return;
            }
        } else if (f.isBlocking) {
            f.stopBlock();
        }

        // 2. Ultimate Execution: If 100 energy, unleash God Finisher!
        if (f.energy >= 100 && f.cooldowns.ultimate === 0) {
            if (f.charKey === 'sukuna' || f.charKey === 'zeus' || dist < 320) {
                f.triggerUltimate();
                return;
            }
        }

        // 3. Character-Specific Tactical Playstyles

        // A. ZEUS: Zoner / Spacing
        if (f.charKey === 'zeus') {
            if (dist < 120 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2(); // Aegis Storm defensive shield
                return;
            }
            if (dist > 300 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Thunder Lance beam
                return;
            }
            if (dist > 180 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1(); // Chain Spark
                return;
            }
            // Maintain mid-to-long distance
            if (dist < 180 && Math.random() < 0.6) {
                if (f.x < opp.x) f.moveLeft(); else f.moveRight();
                return;
            }
        }

        // B. YUJI: Aggressive Rushdown
        if (f.charKey === 'yuji') {
            if (dist > 200 && f.cooldowns.skill1 === 0 && f.energy >= 20 && Math.random() < this.cfg.aggressiveChance) {
                f.triggerSkill1(); // Cursed Rush forward gap-closer
                return;
            }
            if (dist <= 85) {
                if (Math.random() < 0.65) {
                    f.triggerBasicAttack(); // Divergent Fist
                } else if (f.cooldowns.skill2 === 0 && f.energy >= 35) {
                    f.triggerSkill2(); // Slaughter Demon
                }
                return;
            }
        }

        // C. ANUBIS: Life Drain & Hexes
        if (f.charKey === 'anubis') {
            if (f.hp < f.maxHp * 0.7 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Soul Siphon healing orb
                return;
            }
            if (dist > 160 && f.cooldowns.skill2 === 0 && f.energy >= 30) {
                f.triggerSkill2(); // Quicksand trap under enemy
                return;
            }
            if (dist <= 130 && f.cooldowns.skill1 === 0 && f.energy >= 20) {
                f.triggerSkill1(); // Jackal Claws shadow leap
                return;
            }
        }

        // D. WUKONG: High Mobility & Clones
        if (f.charKey === 'wukong') {
            if (dist > 220 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Staff Extension across arena
                return;
            }
            if (dist > 150 && f.cooldowns.skill1 === 0 && f.energy >= 25 && Math.random() < 0.7) {
                f.triggerSkill1(); // Nimbus Somersault
                return;
            }
            if (dist <= 150 && f.cooldowns.skill2 === 0 && f.energy >= 30 && Math.random() < 0.5) {
                f.triggerSkill2(); // Hair Clone Decoy
                return;
            }
        }

        // E. SUKUNA: Calamity Slashes & Explosions
        if (f.charKey === 'sukuna') {
            if (dist > 260 && f.cooldowns.skill2 === 0 && f.energy >= 45 && Math.random() < 0.65) {
                f.triggerSkill2(); // Fuga fire arrow
                return;
            }
            if (dist > 180 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Dismantle invisible flying cut
                return;
            }
            if (dist <= 120 && f.cooldowns.skill1 === 0 && f.energy >= 30) {
                f.triggerSkill1(); // Cleave head grab
                return;
            }
        }

        // 4. Movement: Advance towards or jump over
        if (dist > 100) {
            if (opp.x > f.x) {
                f.moveRight();
            } else {
                f.moveLeft();
            }
            if (Math.random() < 0.12 && f.isGrounded) {
                f.jump();
            }
        } else {
            f.stopMoving();
            // Close-range basic trading
            if (f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
            }
        }
    }
}
