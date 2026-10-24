// Character Definitions, Unique Attack Kits, Stats & Archetypes
// Battle Arena: Clash of Sorcerors

const CHARACTERS_DATA = {
    yuji: {
        id: 'yuji',
        name: 'Yuji Itadori',
        title: 'The Divine Vessel',
        cost: 0, // Default Free character!
        unlocked: true,
        tagline: 'Superhuman martial artist housing ancient divine cursed power.',
        color: '#ff2a5f',
        accentColor: '#111116',
        auraColor: 'rgba(255, 42, 95, 0.4)',
        stats: {
            hp: 1000,
            speed: 5.8,
            jumpForce: 15,
            defense: 1.0,
            energyGain: 1.2
        },
        passive: {
            name: 'Unbreakable Resolve',
            desc: 'When HP drops below 35%, gains 30% damage resistance and +20% move speed.'
        },
        attacks: {
            basic: {
                id: 'divergent_fist',
                name: 'Divergent Fist',
                key: 'J / Z',
                cooldown: 0.35,
                energyCost: 0,
                damage: 55,
                range: 75,
                type: 'melee_delayed',
                desc: 'A martial arts blow followed 0.25s later by a delayed cursed energy shockwave for bonus 35 damage!'
            },
            skill1: {
                id: 'cursed_rush',
                name: 'Cursed Rush',
                key: 'K / X',
                cooldown: 4.0,
                energyCost: 20,
                damage: 110,
                range: 160,
                type: 'dash_multihit',
                desc: 'Dashes forward in a blur, delivering a 4-hit rapid-fire cursed fist barrage.'
            },
            skill2: {
                id: 'slaughter_demon',
                name: 'Slaughter Demon',
                key: 'L / C',
                cooldown: 6.0,
                energyCost: 35,
                damage: 135,
                range: 90,
                type: 'heavy_slash',
                desc: 'Somersault leap with cursed slaughter knife that carves the enemy, inflicting bleed.'
            },
            ultimate: {
                id: 'black_flash',
                name: 'Black Flash (Kokusen)',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 320,
                range: 180,
                type: 'spatial_crit',
                desc: 'Sparks black lightning, bending space to deliver a cataclysmic 2.5x critical strike!'
            }
        }
    },

    zeus: {
        id: 'zeus',
        name: 'Zeus',
        title: 'Lord of Olympus',
        cost: 1000,
        unlocked: false,
        tagline: 'Supreme Greek deity wielding blinding lightning and thunderbolts.',
        color: '#00e5ff',
        accentColor: '#ffd700',
        auraColor: 'rgba(0, 229, 255, 0.4)',
        stats: {
            hp: 950,
            speed: 5.2,
            jumpForce: 14,
            defense: 0.95,
            energyGain: 1.1
        },
        passive: {
            name: 'Static Overcharge',
            desc: 'Every 4th attack shocks the enemy, causing a 0.75s stun lock.'
        },
        attacks: {
            basic: {
                id: 'thunder_lance',
                name: 'Thunder Lance',
                key: 'J / Z',
                cooldown: 0.55,
                energyCost: 0,
                damage: 50,
                range: 500,
                type: 'projectile_beam',
                desc: 'Hurls an electric lance across the entire screen, piercing through defenses.'
            },
            skill1: {
                id: 'chain_spark',
                name: 'Chain Spark',
                key: 'K / X',
                cooldown: 4.5,
                energyCost: 25,
                damage: 95,
                range: 350,
                type: 'homing_shock',
                desc: 'Fires an electric orb that tracks the opponent and delivers a paralyzing shock.'
            },
            skill2: {
                id: 'aegis_storm',
                name: 'Aegis Storm',
                key: 'L / C',
                cooldown: 7.0,
                energyCost: 35,
                damage: 120,
                range: 120,
                type: 'barrier_shock',
                desc: 'Surrounds Zeus with a rotating electrical cyclone, deflecting projectiles and zapping foes.'
            },
            ultimate: {
                id: 'wrath_of_olympus',
                name: 'Wrath of Olympus',
                key: 'U / V',
                cooldown: 15.0,
                energyCost: 100,
                damage: 340,
                range: 700,
                type: 'aoe_lightning_rain',
                desc: 'Summons 5 colossal thunderbolts that crash from the heavens across the arena.'
            }
        }
    },

    anubis: {
        id: 'anubis',
        name: 'Anubis',
        title: 'Judge of Souls',
        cost: 2200,
        unlocked: false,
        tagline: 'Ancient Egyptian god of embalming and guardian of the underworld.',
        color: '#9d4edd',
        accentColor: '#e0aaff',
        auraColor: 'rgba(157, 78, 221, 0.4)',
        stats: {
            hp: 920,
            speed: 5.4,
            jumpForce: 14.5,
            defense: 0.9,
            energyGain: 1.3
        },
        passive: {
            name: 'Soul Siphon Aura',
            desc: 'Restores 25% of all damage dealt directly back into Anubis’s health pool.'
        },
        attacks: {
            basic: {
                id: 'soul_siphon',
                name: 'Soul Siphon',
                key: 'J / Z',
                cooldown: 0.45,
                energyCost: 0,
                damage: 48,
                range: 320,
                type: 'lifesteal_orb',
                desc: 'Launches a ghostly jackal skull that drains enemy HP and heals Anubis.'
            },
            skill1: {
                id: 'jackal_claws',
                name: 'Jackal Claws',
                key: 'K / X',
                cooldown: 4.2,
                energyCost: 20,
                damage: 100,
                range: 130,
                type: 'shadow_leap_curse',
                desc: 'Teleports into a low shadow sweep, lacerating the foe and inflicting death decay.'
            },
            skill2: {
                id: 'tomb_quicksand',
                name: 'Tomb Quicksand',
                key: 'L / C',
                cooldown: 6.5,
                energyCost: 30,
                damage: 115,
                range: 220,
                type: 'ground_trap',
                desc: 'Opens a swirling vortex of underworld sand that slows and traps the enemy.'
            },
            ultimate: {
                id: 'judgment_of_maat',
                name: 'Judgment of Ma’at',
                key: 'U / V',
                cooldown: 16.0,
                energyCost: 100,
                damage: 310,
                range: 240,
                type: 'soul_execution',
                desc: 'Summons the golden Scales of Truth; reaps the enemy soul, dealing huge true damage.'
            }
        }
    },

    wukong: {
        id: 'wukong',
        name: 'Sun Wukong',
        title: 'The Great Sage',
        cost: 3800,
        unlocked: false,
        tagline: 'The Monkey King with 72 earthly transformations and the golden Ruyi staff.',
        color: '#ff9f1c',
        accentColor: '#2ec4b6',
        auraColor: 'rgba(255, 159, 28, 0.4)',
        stats: {
            hp: 980,
            speed: 6.2,
            jumpForce: 16,
            defense: 1.05,
            energyGain: 1.15
        },
        passive: {
            name: 'Immortal Stone Body',
            desc: 'Immune to flinching/knockback while attacking, plus constant 1% HP regen every 2s.'
        },
        attacks: {
            basic: {
                id: 'ruyi_expansion',
                name: 'Ruyi Expansion',
                key: 'J / Z',
                cooldown: 0.4,
                energyCost: 0,
                damage: 58,
                range: 280,
                type: 'extending_staff',
                desc: 'Thrusts the golden Ruyi Jingu Bang staff, elongating it rapidly across the arena.'
            },
            skill1: {
                id: 'nimbus_somersault',
                name: 'Nimbus Somersault',
                key: 'K / X',
                cooldown: 4.8,
                energyCost: 25,
                damage: 125,
                range: 150,
                type: 'aerial_dive_slam',
                desc: 'Leaps high on a golden nimbus cloud and crashes down with a massive staff slam.'
            },
            skill2: {
                id: 'hair_clone_decoy',
                name: 'Hair Clone Decoy',
                key: 'L / C',
                cooldown: 6.0,
                energyCost: 30,
                damage: 90,
                range: 140,
                type: 'clone_counter',
                desc: 'Leaves a fighting illusion clone while Wukong dashes unseen behind the enemy.'
            },
            ultimate: {
                id: 'heaven_havoc',
                name: 'Heaven Havoc (72 Styles)',
                key: 'U / V',
                cooldown: 15.0,
                energyCost: 100,
                damage: 350,
                range: 300,
                type: 'multi_clone_barrage',
                desc: 'Summons three illusionary clones that converge from all angles in a synchronized frenzy.'
            }
        }
    },

    sukuna: {
        id: 'sukuna',
        name: 'Ryomen Sukuna',
        title: 'King of Curses',
        cost: 5500,
        unlocked: false,
        tagline: 'The undisputed calamity god of jujutsu, cutting everything into pieces.',
        color: '#ff0033',
        accentColor: '#ff7700',
        auraColor: 'rgba(255, 0, 51, 0.45)',
        stats: {
            hp: 1050,
            speed: 5.9,
            jumpForce: 15,
            defense: 1.1,
            energyGain: 1.25
        },
        passive: {
            name: 'Reverse Cursed Technique',
            desc: 'Critical strikes and special moves restore 20% of dealt damage as health.'
        },
        attacks: {
            basic: {
                id: 'dismantle',
                name: 'Dismantle (Kai)',
                key: 'J / Z',
                cooldown: 0.38,
                energyCost: 0,
                damage: 62,
                range: 360,
                type: 'invisible_slash',
                desc: 'Fires swift, invisible spatial slashes flying across the screen in an X-formation.'
            },
            skill1: {
                id: 'cleave',
                name: 'Cleave (Hachi)',
                key: 'K / X',
                cooldown: 4.5,
                energyCost: 30,
                damage: 130,
                range: 100,
                type: 'armor_pierce_grab',
                desc: 'Teleports into face contact, executing an armor-piercing slash scaled to enemy max HP.'
            },
            skill2: {
                id: 'fuga',
                name: 'Fuga (Divine Flame Arrow)',
                key: 'L / C',
                cooldown: 7.5,
                energyCost: 45,
                damage: 155,
                range: 480,
                type: 'explosive_arrow',
                desc: 'Draws a blazing fire arrow that creates a massive fiery detonation upon impact.'
            },
            ultimate: {
                id: 'malevolent_shrine',
                name: 'Malevolent Shrine (Fukuma Mizushi)',
                key: 'U / V',
                cooldown: 18.0,
                energyCost: 100,
                damage: 380,
                range: 800,
                type: 'domain_infinite_slash',
                desc: 'Expands the barrier-less domain; relentless slashes carve the entire arena for 3.5 seconds!'
            }
        }
    }
};

// Persistence helper for player progression and in-game points
class StorageManager {
    static STORAGE_KEY = 'battle_arena_clashofsorcerors_save';

    static load() {
        const defaultData = {
            points: 0,
            unlocked: ['yuji'],
            battlesWon: 0,
            battlesLost: 0,
            arcadeCompleted: false
        };

        try {
            const raw = localStorage.getItem(this.STORAGE_KEY) || localStorage.getItem('battle_arena_clashofgods_save');
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...defaultData, ...parsed };
            }
        } catch (e) {
            console.warn('Could not read localStorage', e);
        }
        return defaultData;
    }

    static save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Could not write to localStorage', e);
        }
    }

    static addPoints(amt) {
        const data = this.load();
        data.points = Math.max(0, (data.points || 0) + amt);
        this.save(data);
        return data.points;
    }

    static unlockCharacter(charId) {
        const data = this.load();
        if (!data.unlocked.includes(charId)) {
            data.unlocked.push(charId);
            this.save(data);
        }
        return data.unlocked;
    }

    static isUnlocked(charId) {
        if (charId === 'yuji') return true;
        const data = this.load();
        return data.unlocked && data.unlocked.includes(charId);
    }
}
