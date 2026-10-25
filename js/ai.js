// Intelligent Combat AI Controller for Battle Arena: Clash of Sorcerors
// Supports Easy, Medium, Hard, and Deity difficulty modes with specialized JJK playstyles

class AIController {
    constructor(fighter, difficulty = 'medium') {
        this.fighter = fighter;
        this.difficulty = difficulty;
        this.decisionTimer = 0;
        this.actionQueue = null;

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

        // 2. Ultimate Execution: If 100 energy or Jackpot, unleash Domain Finisher!
        if (f.energy >= 100 && f.cooldowns.ultimate === 0) {
            if (['gojo', 'sukuna', 'yuta', 'hakari', 'jogo', 'mahito'].includes(f.charKey) || dist < 320) {
                f.triggerUltimate();
                return;
            }
        }

        // 3. Character-Specific Tactical Playstyles
        // SATORU GOJO: Limitless Spatial Dominance
        if (f.charKey === 'gojo') {
            if (dist > 280 && f.cooldowns.skill1 === 0 && f.energy >= 30) {
                f.triggerSkill1(); // Reversal Red Repulsion
                return;
            }
            if (dist > 180 && f.cooldowns.skill2 === 0 && f.energy >= 35 && Math.random() < 0.6) {
                f.triggerSkill2(); // Teleport Axe Kick
                return;
            }
            if (dist <= 140 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Lapse Blue Attraction punch
                return;
            }
        }

        // RYOMEN SUKUNA: Calamity Slashes & Flames
        else if (f.charKey === 'sukuna') {
            if (dist > 260 && f.cooldowns.skill2 === 0 && f.energy >= 45 && Math.random() < 0.7) {
                f.triggerSkill2(); // Fuga flame arrow
                return;
            }
            if (dist > 180 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Dismantle
                return;
            }
            if (dist <= 130 && f.cooldowns.skill1 === 0 && f.energy >= 30) {
                f.triggerSkill1(); // Cleave
                return;
            }
        }

        // YUTA OKKOTSU: Cursed Speech & Rika Smash
        else if (f.charKey === 'yuta') {
            if (dist > 160 && f.cooldowns.skill1 === 0 && f.energy >= 30 && Math.random() < 0.75) {
                f.triggerSkill1(); // "DON'T MOVE" Stun
                return;
            }
            if (dist <= 150 && f.cooldowns.skill2 === 0 && f.energy >= 40) {
                f.triggerSkill2(); // Rika Smash
                return;
            }
            if (dist <= 110 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
                return;
            }
        }

        // TOJI FUSHIGURO: High Speed Hunter
        else if (f.charKey === 'toji') {
            if (dist > 200 && f.cooldowns.skill1 === 0 && f.energy >= 20) {
                f.triggerSkill1(); // Fly Head Blind
                return;
            }
            if (dist <= 120 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2(); // Playful Cloud Smash
                return;
            }
            if (dist <= 95 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Inverted Spear
                return;
            }
        }

        // MAKI ZENIN: Extreme Speed & True Damage
        else if (f.charKey === 'maki') {
            if (dist > 160 && f.cooldowns.skill2 === 0 && f.energy >= 30) {
                f.triggerSkill2(); // Air Step Blitz
                return;
            }
            if (dist <= 140 && f.cooldowns.skill1 === 0 && f.energy >= 20) {
                f.triggerSkill1(); // Dragon Bone Blast
                return;
            }
            if (dist <= 100 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Split Soul Slash
                return;
            }
        }

        // AOI TODO: Boogie Woogie Mindgames
        else if (f.charKey === 'todo') {
            if (dist > 140 && f.cooldowns.skill1 === 0 && f.energy >= 20 && Math.random() < 0.8) {
                f.triggerSkill1(); // Clap and Swap behind opponent!
                return;
            }
            if (dist <= 130 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2(); // Playful Cloud
                return;
            }
            if (dist <= 85 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
                return;
            }
        }

        // CHOSO: Long-range Blood Piercing
        else if (f.charKey === 'choso') {
            if (dist > 240 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1(); // Piercing Blood
                return;
            }
            if (dist > 120 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2(); // Supernova
                return;
            }
            if (dist <= 90 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
                return;
            }
        }

        // KINJI HAKARI: Aggressive Street Brawler
        else if (f.charKey === 'hakari') {
            if (dist > 180 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2(); // Pachinko Balls
                return;
            }
            if (dist <= 140 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1(); // Shutter Slam
                return;
            }
            if (dist <= 85 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
                return;
            }
        }

        // YUJI ITADORI: Rushdown Brawler
        else if (f.charKey === 'yuji') {
            if (dist > 180 && f.cooldowns.skill1 === 0 && f.energy >= 20) {
                f.triggerSkill1(); // Cursed Rush
                return;
            }
            if (dist <= 100 && f.cooldowns.skill2 === 0 && f.energy >= 35 && Math.random() < 0.5) {
                f.triggerSkill2(); // Manji Kick
                return;
            }
            if (dist <= 85 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Divergent Fist
                return;
            }
        }

        // NOBARA KUGISAKI: Spacing & Hairpin Traps
        else if (f.charKey === 'nobara') {
            if (dist > 200 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Nail Hurl
                return;
            }
            if (dist > 120 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1(); // Hairpin
                return;
            }
            if (dist <= 85 && f.cooldowns.skill2 === 0 && f.energy >= 30) {
                f.triggerSkill2(); // Hammer Smash
                return;
            }
        }

        // MEGUMI FUSHIGURO: Shikigami Summoning
        else if (f.charKey === 'megumi') {
            if (dist > 200 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1(); // Nue
                return;
            }
            if (dist > 120 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2(); // Shadow Sink
                return;
            }
            if (dist <= 100 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Divine Dog
                return;
            }
        }

        // JOGO: Disaster Flames Pyromancy
        else if (f.charKey === 'jogo') {
            if (dist > 220 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Ember Insects
                return;
            }
            if (dist > 140 && f.cooldowns.skill1 === 0 && f.energy >= 30) {
                f.triggerSkill1(); // Magma Geyser
                return;
            }
            if (dist <= 140 && f.cooldowns.skill2 === 0 && f.energy >= 40) {
                f.triggerSkill2(); // Disaster Flames
                return;
            }
        }

        // MAHITO: Soul Morphing
        else if (f.charKey === 'mahito') {
            if (dist > 180 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1(); // Body Repel
                return;
            }
            if (dist <= 150 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2(); // Soul Whip
                return;
            }
            if (dist <= 95 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Soul Drill
                return;
            }
        }

        // KENTO NANAMI: 7:3 Ratio Precision
        else if (f.charKey === 'nanami') {
            if (dist > 140 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1(); // Collapse
                return;
            }
            if (dist <= 120 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2(); // Overtime Cleave
                return;
            }
            if (dist <= 85 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack(); // Ratio Cut
                return;
            }
        }

        // PANDA: Heavy Armor Brawler
        else if (f.charKey === 'panda') {
            if (dist > 140 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2(); // Cannonball Slam
                return;
            }
            if (dist <= 110 && f.cooldowns.skill1 === 0 && f.energy >= 30) {
                f.triggerSkill1(); // Gorilla Mode
                return;
            }
            if (dist <= 80 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
                return;
            }
        }

        // SUGURU GETO: Curse Swarms & Antigravity
        else if (f.charKey === 'geto') {
            if (dist > 220 && f.cooldowns.skill1 === 0 && f.energy >= 25) {
                f.triggerSkill1(); // Curse Swarm
                return;
            }
            if (dist > 120 && f.cooldowns.skill2 === 0 && f.energy >= 35) {
                f.triggerSkill2(); // Antigravity System
                return;
            }
            if (dist <= 100 && f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
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
            if (f.cooldowns.basic === 0) {
                f.triggerBasicAttack();
            }
        }
    }
}
