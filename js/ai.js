// Intelligent 3D Combat AI Controller for Battle Arena: Clash of Sorcerors
// Supports 3D Open World Flanking, Dodging, Tactical Ranging, and 16 JJK Playstyles

class AIController {
    constructor(fighter, difficulty = 'medium') {
        this.fighter = fighter;
        this.difficulty = difficulty;
        this.decisionTimer = 0;
        this.strafeDirection = Math.random() < 0.5 ? 1 : -1;
        this.strafeTimer = 0;

        const configs = {
            easy: { reactionDelay: 22, blockChance: 0.15, aggressiveChance: 0.40, strafeSpeed: 0.4 },
            medium: { reactionDelay: 14, blockChance: 0.45, aggressiveChance: 0.65, strafeSpeed: 0.7 },
            hard: { reactionDelay: 7, blockChance: 0.70, aggressiveChance: 0.82, strafeSpeed: 1.0 },
            deity: { reactionDelay: 3, blockChance: 0.90, aggressiveChance: 0.95, strafeSpeed: 1.2 }
        };

        this.cfg = configs[difficulty] || configs.medium;
    }

    setDifficulty(diff) {
        this.difficulty = diff;
        const configs = {
            easy: { reactionDelay: 22, blockChance: 0.15, aggressiveChance: 0.40, strafeSpeed: 0.4 },
            medium: { reactionDelay: 14, blockChance: 0.45, aggressiveChance: 0.65, strafeSpeed: 0.7 },
            hard: { reactionDelay: 7, blockChance: 0.70, aggressiveChance: 0.82, strafeSpeed: 1.0 },
            deity: { reactionDelay: 3, blockChance: 0.90, aggressiveChance: 0.95, strafeSpeed: 1.2 }
        };
        this.cfg = configs[diff] || configs.medium;
    }

    update() {
        const f = this.fighter;
        const opp = f.opponent;
        if (!opp || f.state === 'dead' || !f.canAct()) return;

        this.decisionTimer++;
        if (this.decisionTimer < this.cfg.reactionDelay) {
            return;
        }
        this.decisionTimer = 0;

        const dx = opp.x - f.x;
        const dz = opp.z - f.z;
        const dist = Math.hypot(dx, dz);

        // Always face towards opponent in 3D
        f.turnTowards(opp.x, opp.z);

        const oppIsAttacking = ['attack1', 'attack2', 'attack3', 'ultimate'].includes(opp.state);

        // 1. Defensive reaction in 3D: Block, Jump, or Side-step Dodge
        if (oppIsAttacking && dist < 7.5) {
            if (Math.random() < this.cfg.blockChance) {
                f.startBlock();
                setTimeout(() => {
                    if (f && f.state === 'block') f.stopBlock();
                }, 300 + Math.random() * 250);
                return;
            } else if (Math.random() < 0.35 && f.isGrounded) {
                f.jump();
                return;
            }
        } else if (f.isBlocking) {
            f.stopBlock();
        }

        // 2. Ultimate / Domain Execution: If 100 energy or Jackpot ready
        if (f.energy >= 100 && f.cooldowns.ultimate === 0) {
            if (['gojo', 'sukuna', 'yuta', 'hakari', 'jogo', 'mahito'].includes(f.charKey) || dist < 12.0) {
                f.triggerUltimate();
                return;
            }
        }

        // 3. Character-Specific Tactical Playstyles in 3D
        if (f.charKey === 'gojo') {
            if (dist > 12.0 && f.cooldowns.skill1 === 0 && f.energy >= 30) {
                f.triggerSkill1(); // Reversal Red
                return;
            }
            if (dist > 7.0 && f.cooldowns.skill2 === 0 && f.energy >= 35 && Math.random() < 0.6) {
                f.triggerSkill2(); // Teleport strike
                return;
            }
            if (dist <= 5.0 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Lapse Blue melee
                return;
            }
        } else if (f.charKey === 'sukuna') {
            if (dist > 10.0 && f.cooldowns.skill2 === 0 && f.energy >= 45 && Math.random() < 0.7) {
                f.triggerSkill2(); // Fuga flame arrow
                return;
            }
            if (dist > 6.0 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Dismantle
                return;
            }
            if (dist <= 5.0 && f.cooldowns.skill1 === 0 && f.energy >= 30) {
                f.triggerSkill1(); // Cleave
                return;
            }
        } else if (f.charKey === 'yuta') {
            if (dist > 7.0 && f.cooldowns.skill1 === 0 && f.energy >= 30 && Math.random() < 0.75) {
                f.triggerSkill1(); // Cursed Speech
                return;
            }
            if (dist <= 6.0 && f.cooldowns.skill2 === 0 && f.energy >= 40) {
                f.triggerSkill2(); // Rika Smash
                return;
            }
            if (dist <= 4.5 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
                return;
            }
        } else if (f.charKey === 'toji') {
            if (dist > 8.0 && f.cooldowns.skill1 === 0 && f.energy >= 20) {
                f.triggerSkill1();
                return;
            }
            if (dist <= 5.5 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2();
                return;
            }
            if (dist <= 4.5 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
                return;
            }
        } else if (f.charKey === 'nobara') {
            if (dist > 6.0 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Cursed Nails
                return;
            }
            if (dist > 5.0 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1(); // Hairpin
                return;
            }
            if (dist <= 4.5 && f.cooldowns.skill2 === 0 && f.energy >= 30) {
                f.triggerSkill2(); // Hammer Smash
                return;
            }
        } else if (f.charKey === 'megumi') {
            if (dist > 8.0 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1(); // Nue Lightning
                return;
            }
            if (dist <= 4.5 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Divine Dog Totality
                return;
            }
        } else if (f.charKey === 'todo') {
            if (dist > 8.0 && f.cooldowns.skill2 === 0 && f.energy >= 35 && Math.random() < 0.8) {
                f.triggerSkill2(); // Boogie Woogie swap
                return;
            }
            if (dist <= 4.8 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
                return;
            }
        } else {
            // General 3D Combat Behavior
            if (dist <= 4.5 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
                return;
            } else if (dist <= 5.5 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1();
                return;
            } else if (dist <= 6.0 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2();
                return;
            }
        }

        // 4. 3D Open World Navigation: Approach & Flanking Orbit
        this.strafeTimer++;
        if (this.strafeTimer > 40) {
            this.strafeTimer = 0;
            if (Math.random() < 0.4) this.strafeDirection *= -1;
        }

        if (dist > 4.5) {
            // Move towards opponent with a subtle 3D strafe flank
            const normX = dx / dist;
            const normZ = dz / dist;

            // Perpendicular vector for strafing
            const perpX = -normZ * this.strafeDirection * 0.45;
            const perpZ = normX * this.strafeDirection * 0.45;

            f.move3D(normX + perpX, normZ + perpZ);

            if (Math.random() < 0.08 && f.isGrounded) {
                f.jump();
            }
        } else {
            // In close combat range
            f.stopMoving();
            if (f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
            }
        }
    }
}
