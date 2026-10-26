// Character Definitions, Unique Attack Kits, Stats & Archetypes
// Battle Arena: Clash of Sorcerors (Jujutsu Kaisen Roster - Ordered by Canon Power Level)

const CHARACTERS_DATA = {
    // ----------------------------------------------------
    // TIER 1: STARTER GRADE 3 & 1 SORCERERS
    // ----------------------------------------------------
    yuji: {
        id: 'yuji',
        name: 'Yuji Itadori',
        title: 'The Divine Vessel',
        grade: 'Grade 1 / Vessel',
        powerTier: 1,
        cost: 0, // Default Free Starter
        unlocked: true,
        tagline: 'Superhuman martial artist housing ancient cursed power. Devastating close-range brawler.',
        color: '#ff2a5f',
        accentColor: '#111116',
        auraColor: 'rgba(255, 42, 95, 0.4)',
        stats: {
            hp: 1000,
            speed: 5.8,
            jumpForce: 15,
            defense: 1.05,
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
                desc: 'A martial arts punch followed 0.25s later by a delayed cursed energy shockwave for bonus 35 damage!'
            },
            skill1: {
                id: 'cursed_rush',
                name: 'Cursed Rush',
                key: 'K / X',
                cooldown: 3.8,
                energyCost: 20,
                damage: 115,
                range: 160,
                type: 'dash_multihit',
                desc: 'Dashes forward in a blur, delivering a 4-hit rapid-fire cursed fist barrage.'
            },
            skill2: {
                id: 'manji_kick',
                name: 'Manji Kick & Knee Strike',
                key: 'L / C',
                cooldown: 5.5,
                energyCost: 35,
                damage: 140,
                range: 95,
                type: 'heavy_launch',
                desc: 'Somersault axe-kick and rising knee strike that knocks enemies flying.'
            },
            ultimate: {
                id: 'black_flash',
                name: 'Black Flash (Kokusen)',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 340,
                range: 180,
                type: 'spatial_crit',
                desc: 'Sparks black lightning, bending space to deliver a cataclysmic 2.5x critical strike!'
            }
        }
    },

    nobara: {
        id: 'nobara',
        name: 'Nobara Kugisaki',
        title: 'Straw Doll Sorcerer',
        grade: 'Grade 3 Sorcerer',
        powerTier: 1,
        cost: 0, // Default Free Starter
        unlocked: true,
        tagline: 'Feisty Tokyo first-year using hammer, metal nails, and remote Straw Doll curse resonance.',
        color: '#ff7733',
        accentColor: '#4a2511',
        auraColor: 'rgba(255, 119, 51, 0.4)',
        stats: {
            hp: 880,
            speed: 5.3,
            jumpForce: 14,
            defense: 0.95,
            energyGain: 1.15
        },
        passive: {
            name: 'Cursed Nail Embed',
            desc: 'Basic nail hits lodge into the opponent, causing 15 bleed damage over 3 seconds.'
        },
        attacks: {
            basic: {
                id: 'nail_hurl',
                name: 'Cursed Nail Hurl',
                key: 'J / Z',
                cooldown: 0.45,
                energyCost: 0,
                damage: 50,
                range: 480,
                type: 'projectile',
                desc: 'Strikes metal nails with her hammer, firing high-speed glowing cursed spikes.'
            },
            skill1: {
                id: 'hairpin',
                name: 'Hairpin (Kanzashi)',
                key: 'K / X',
                cooldown: 4.0,
                energyCost: 25,
                damage: 120,
                range: 220,
                type: 'burst_aoe',
                desc: 'Snaps fingers to detonate cursed energy inside lodged nails, blasting the enemy backward.'
            },
            skill2: {
                id: 'hammer_smash',
                name: 'Iron Hammer Smash',
                key: 'L / C',
                cooldown: 5.0,
                energyCost: 30,
                damage: 130,
                range: 85,
                type: 'overhead_crush',
                desc: 'Heavy two-handed metal hammer swing that grounds the enemy and cracks armor.'
            },
            ultimate: {
                id: 'resonance',
                name: 'Resonance: Black Flash',
                key: 'U / V',
                cooldown: 13.0,
                energyCost: 100,
                damage: 310,
                range: 300,
                type: 'soul_shock',
                desc: 'Drives a nail through the Straw Doll with Black Flash, transmitting unavoidable soul damage!'
            }
        }
    },

    // ----------------------------------------------------
    // TIER 2: GRADE 2 & SEMI-GRADE 1 SORCERERS
    // ----------------------------------------------------
    megumi: {
        id: 'megumi',
        name: 'Megumi Fushiguro',
        title: 'Ten Shadows Prodigy',
        grade: 'Grade 2 Sorcerer',
        powerTier: 2,
        cost: 400,
        unlocked: false,
        tagline: 'Zenin clan heir wielding the sacred Ten Shadows Technique to summon ferocious shikigami beasts.',
        color: '#3a7bd5',
        accentColor: '#1a2a44',
        auraColor: 'rgba(58, 123, 213, 0.4)',
        stats: {
            hp: 920,
            speed: 5.5,
            jumpForce: 15,
            defense: 1.0,
            energyGain: 1.2
        },
        passive: {
            name: 'Shadow Evasion',
            desc: 'Dashing into shadows grants 0.3s of invulnerability and slightly recovers energy.'
        },
        attacks: {
            basic: {
                id: 'divine_dog',
                name: 'Divine Dog: Totality',
                key: 'J / Z',
                cooldown: 0.4,
                energyCost: 0,
                damage: 60,
                range: 110,
                type: 'shadow_slash',
                desc: 'Summons the ferocious twin-fanged shadow hound to lunge and tear the opponent.'
            },
            skill1: {
                id: 'nue_dive',
                name: 'Nue: Thunder Wings',
                key: 'K / X',
                cooldown: 4.2,
                energyCost: 25,
                damage: 125,
                range: 380,
                type: 'homing_electric',
                desc: 'Summons the winged beast Nue to swoop down, shocking the target with electricity.'
            },
            skill2: {
                id: 'shadow_sink',
                name: 'Shadow Submerge & Toad',
                key: 'L / C',
                cooldown: 5.5,
                energyCost: 35,
                damage: 135,
                range: 200,
                type: 'teleport_strike',
                desc: 'Sinks into the shadow floor and re-emerges behind opponent with Toad tongue lash.'
            },
            ultimate: {
                id: 'chimera_garden',
                name: 'Chimera Shadow Garden',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 330,
                range: 350,
                type: 'domain_swarm',
                desc: 'Floods the arena ground with liquid darkness, unleashing a multi-beast shikigami ambush!'
            }
        }
    },

    panda: {
        id: 'panda',
        name: 'Panda',
        title: 'Mutant Cursed Corpse',
        grade: 'Semi-Grade 1 Sorcerer',
        powerTier: 2,
        cost: 700,
        unlocked: false,
        tagline: 'Principal Yaga’s greatest creation housing 3 distinct biological cores: Panda, Gorilla, and Triceratops.',
        color: '#43a047',
        accentColor: '#1b3b1e',
        auraColor: 'rgba(67, 160, 71, 0.4)',
        stats: {
            hp: 1100,
            speed: 5.1,
            jumpForce: 14,
            defense: 1.15,
            energyGain: 1.1
        },
        passive: {
            name: 'Three Independent Cores',
            desc: 'Survives lethal damage once per match with 120 HP and instantly gains 35 energy.'
        },
        attacks: {
            basic: {
                id: 'panda_hook',
                name: 'Heavy Boxing Hook',
                key: 'J / Z',
                cooldown: 0.45,
                energyCost: 0,
                damage: 65,
                range: 80,
                type: 'heavy_blunt',
                desc: 'A heavy-weight boxing paw strike packing tremendous raw kinetic force.'
            },
            skill1: {
                id: 'gorilla_drumming',
                name: 'Gorilla Mode: Drumming Beat',
                key: 'K / X',
                cooldown: 4.5,
                energyCost: 30,
                damage: 130,
                range: 100,
                type: 'unblockable_strike',
                desc: 'Shifts into menacing Gorilla form: sound wave punches that bypass enemy block.'
            },
            skill2: {
                id: 'cannon_slam',
                name: 'Cannonball Body Slam',
                key: 'L / C',
                cooldown: 6.0,
                energyCost: 35,
                damage: 145,
                range: 150,
                type: 'ground_pound',
                desc: 'Leaps high into the air and crashes down, sending rolling seismic shockwaves.'
            },
            ultimate: {
                id: 'unblockable_beatdown',
                name: 'Gorilla Resonance Beatdown',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 340,
                range: 160,
                type: 'kinetic_shockwave',
                desc: 'Unleashes devastating full-power drumming beats that rattle the opponent to their core.'
            }
        }
    },

    // ----------------------------------------------------
    // TIER 3: GRADE 1 SORCERERS & CURSE BROTHER
    // ----------------------------------------------------
    nanami: {
        id: 'nanami',
        name: 'Kento Nanami',
        title: '7:3 Ratio Master',
        grade: 'Grade 1 Sorcerer',
        powerTier: 3,
        cost: 1000,
        unlocked: false,
        tagline: 'Stoic ex-salaryman Grade 1 sorcerer who forcibly creates a weak point at the 7:3 ratio line.',
        color: '#e6b800',
        accentColor: '#2b2608',
        auraColor: 'rgba(230, 184, 0, 0.4)',
        stats: {
            hp: 980,
            speed: 5.6,
            jumpForce: 14.5,
            defense: 1.05,
            energyGain: 1.25
        },
        passive: {
            name: 'Overtime Shift',
            desc: 'When HP drops below 40%, attack damage is boosted by +35% with golden ratio aura.'
        },
        attacks: {
            basic: {
                id: 'ratio_slash',
                name: 'Ratio Technique: 7:3 Cut',
                key: 'J / Z',
                cooldown: 0.38,
                energyCost: 0,
                damage: 70,
                range: 85,
                type: 'precision_crit',
                desc: 'Slashes with his fabric-wrapped blunt blade, hitting the 7:3 point for guaranteed critical!'
            },
            skill1: {
                id: 'collapse',
                name: 'Collapse (Kawarawari)',
                key: 'K / X',
                cooldown: 4.5,
                energyCost: 25,
                damage: 130,
                range: 180,
                type: 'ground_collapse',
                desc: 'Strikes the ground ratio point, causing the concrete stage to violently erupt upward.'
            },
            skill2: {
                id: 'tie_loosen',
                name: 'Overtime Activation',
                key: 'L / C',
                cooldown: 7.0,
                energyCost: 35,
                damage: 140,
                range: 120,
                type: 'empowered_cleave',
                desc: 'Loosens tie and surges cursed energy forward in an explosive horizontal cleave.'
            },
            ultimate: {
                id: 'fourfold_black_flash',
                name: 'Consecutive Black Flash (x4)',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 360,
                range: 190,
                type: 'consecutive_crit',
                desc: 'Channels his historic four consecutive Black Flashes into the 7:3 division!'
            }
        }
    },

    todo: {
        id: 'todo',
        name: 'Aoi Todo',
        title: 'Boogie Woogie Virtuoso',
        grade: 'Grade 1 Sorcerer',
        powerTier: 3,
        cost: 1400,
        unlocked: false,
        tagline: '530,000 IQ heavyweight brute who swaps positions of anything with cursed energy with a single clap.',
        color: '#ff4081',
        accentColor: '#3d1222',
        auraColor: 'rgba(255, 64, 129, 0.4)',
        stats: {
            hp: 1060,
            speed: 5.7,
            jumpForce: 15,
            defense: 1.1,
            energyGain: 1.25
        },
        passive: {
            name: '530,000 IQ Mindgames',
            desc: 'Successfully dodging or swapping behind the opponent grants a 20% critical damage boost.'
        },
        attacks: {
            basic: {
                id: 'gorilla_fist',
                name: 'Brute Force Straight',
                key: 'J / Z',
                cooldown: 0.38,
                energyCost: 0,
                damage: 68,
                range: 85,
                type: 'heavy_punch',
                desc: 'A bone-shattering straight punch backed by monstrous physical strength.'
            },
            skill1: {
                id: 'boogie_woogie',
                name: 'Boogie Woogie (Clap Swap)',
                key: 'K / X',
                cooldown: 3.5,
                energyCost: 20,
                damage: 85,
                range: 600,
                type: 'swap_teleport',
                desc: 'Claps hands: instantly swaps locations with opponent, disorienting them and hitting their back!'
            },
            skill2: {
                id: 'playful_cloud_todo',
                name: 'Playful Cloud Triple Strike',
                key: 'L / C',
                cooldown: 5.5,
                energyCost: 35,
                damage: 145,
                range: 130,
                type: 'staff_barrage',
                desc: 'Swings the three-section special grade staff with superhuman muscle power.'
            },
            ultimate: {
                id: 'brotherly_black_flash',
                name: 'Brotherly Sync: Black Flash',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 360,
                range: 180,
                type: 'tag_black_flash',
                desc: 'Performs a clap-feint into an earth-shattering synchronized Black Flash strike!'
            }
        }
    },

    choso: {
        id: 'choso',
        name: 'Choso',
        title: 'Blood Manipulation Elder',
        grade: 'Special Grade Cursed Womb #1',
        powerTier: 3,
        cost: 1800,
        unlocked: false,
        tagline: 'Eldest Death Painting brother using Blood Manipulation to snipe and shred targets with toxic blood.',
        color: '#b71c1c',
        accentColor: '#300505',
        auraColor: 'rgba(183, 28, 28, 0.4)',
        stats: {
            hp: 990,
            speed: 5.6,
            jumpForce: 15,
            defense: 1.05,
            energyGain: 1.3
        },
        passive: {
            name: 'Toxic Blood',
            desc: 'All blood skills inflict toxic poison on the enemy, dealing 20 damage over 4 seconds.'
        },
        attacks: {
            basic: {
                id: 'blood_edge',
                name: 'Blood Edge Blade',
                key: 'J / Z',
                cooldown: 0.36,
                energyCost: 0,
                damage: 64,
                range: 90,
                type: 'blood_slash',
                desc: 'Solidifies his blood into razor scythe blades to slice through armor.'
            },
            skill1: {
                id: 'piercing_blood',
                name: 'Piercing Blood',
                key: 'K / X',
                cooldown: 4.2,
                energyCost: 25,
                damage: 135,
                range: 650,
                type: 'piercing_beam',
                desc: 'Compresses blood between palms and fires a supersonic high-pressure crimson laser.'
            },
            skill2: {
                id: 'supernova',
                name: 'Supernova',
                key: 'L / C',
                cooldown: 6.0,
                energyCost: 35,
                damage: 145,
                range: 220,
                type: 'orb_cluster_aoe',
                desc: 'Releases suspended orbs of blood that detonate simultaneously in all directions.'
            },
            ultimate: {
                id: 'flowing_red_meteor',
                name: 'Flowing Red Scale: Stack & Piercing Meteor',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 370,
                range: 400,
                type: 'supersonic_execution',
                desc: 'Pumps blood circulation to absolute peak, executing an unavoidable supersonic blood bombardment!'
            }
        }
    },

    // ----------------------------------------------------
    // TIER 4: SPECIAL GRADE CURSES & HEAVENLY RESTRICTIONS
    // ----------------------------------------------------
    maki: {
        id: 'maki',
        name: 'Maki Zenin',
        title: 'The Demonic Monster',
        grade: 'Awakened Heavenly Restriction',
        powerTier: 4,
        cost: 2200,
        unlocked: false,
        tagline: 'Awakened demon possessing zero cursed energy and superhuman sensory acuity equivalent to Toji Fushiguro.',
        color: '#00bfa5',
        accentColor: '#00362f',
        auraColor: 'rgba(0, 191, 165, 0.4)',
        stats: {
            hp: 1040,
            speed: 6.3,
            jumpForce: 16.5,
            defense: 1.15,
            energyGain: 1.25
        },
        passive: {
            name: 'Zero Cursed Energy',
            desc: 'Cannot be locked onto by homing projectiles and takes 25% less damage from domain attacks.'
        },
        attacks: {
            basic: {
                id: 'split_soul_slash',
                name: 'Split Soul Katana Slash',
                key: 'J / Z',
                cooldown: 0.32,
                energyCost: 0,
                damage: 72,
                range: 100,
                type: 'true_damage',
                desc: 'Directly cuts the contour of the enemy soul, bypassing physical durability.'
            },
            skill1: {
                id: 'dragon_bone',
                name: 'Dragon Bone Kinetic Blast',
                key: 'K / X',
                cooldown: 4.0,
                energyCost: 20,
                damage: 140,
                range: 170,
                type: 'kinetic_thrust',
                desc: 'Releases accumulated kinetic force from the weapon in an explosive forward thrust.'
            },
            skill2: {
                id: 'air_step',
                name: 'Air Surface Blitz',
                key: 'L / C',
                cooldown: 5.2,
                energyCost: 30,
                damage: 155,
                range: 220,
                type: 'aerial_dive',
                desc: 'Steps on atmospheric resistance to double-jump and crash downward with blade force.'
            },
            ultimate: {
                id: 'carnage_zenin',
                name: 'Carnage of the Zenin Clan',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 380,
                range: 240,
                type: 'screen_slice',
                desc: 'A lightning-speed flurry of soul-carving katana strikes turning the arena to ribbons.'
            }
        }
    },

    toji: {
        id: 'toji',
        name: 'Toji Fushiguro',
        title: 'The Sorcerer Killer',
        grade: 'Special Grade Hunter',
        powerTier: 4,
        cost: 2700,
        unlocked: false,
        tagline: 'The man who left jujutsu behind. Pinnacle physical god armed with the Inverted Spear of Heaven.',
        color: '#78909c',
        accentColor: '#1c2833',
        auraColor: 'rgba(120, 144, 156, 0.4)',
        stats: {
            hp: 1060,
            speed: 6.5,
            jumpForce: 17,
            defense: 1.2,
            energyGain: 1.3
        },
        passive: {
            name: 'Heavenly Physical Pinnacle',
            desc: 'Possesses immune resistance to cursed energy drain and moves 20% faster than standard sorcerers.'
        },
        attacks: {
            basic: {
                id: 'isoh_stab',
                name: 'Inverted Spear of Heaven',
                key: 'J / Z',
                cooldown: 0.32,
                energyCost: 0,
                damage: 75,
                range: 95,
                type: 'technique_nullifier',
                desc: 'A piercing stab that drains 15 energy from the target and nullifies ongoing enemy buffs.'
            },
            skill1: {
                id: 'fly_head_swarm',
                name: 'Fly-Head Swarm Blind',
                key: 'K / X',
                cooldown: 4.2,
                energyCost: 20,
                damage: 90,
                range: 360,
                type: 'blinding_smoke',
                desc: 'Releases a cloud of low-grade fly curses that slows and obscures the opponent.'
            },
            skill2: {
                id: 'playful_cloud_slam',
                name: 'Playful Cloud: Pure Impact',
                key: 'L / C',
                cooldown: 5.5,
                energyCost: 35,
                damage: 160,
                range: 120,
                type: 'colossal_crush',
                desc: 'Brings Playful Cloud down with pure physical horsepower, cracking the ground in half.'
            },
            ultimate: {
                id: 'invisible_execution',
                name: 'Invisible Hunter: Ghost Execution',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 390,
                range: 280,
                type: 'phantom_teleport',
                desc: 'Varp-speed vanish and instantaneous decapitation sequence that leaves no trace.'
            }
        }
    },

    jogo: {
        id: 'jogo',
        name: 'Jogo',
        title: 'The Calamitous Volcano',
        grade: 'Special Grade Disaster Curse',
        powerTier: 4,
        cost: 3200,
        unlocked: false,
        tagline: 'Disaster Curse born from human fear of the earth and volcanoes. Wields scorching magma and ember swarms.',
        color: '#ff5722',
        accentColor: '#3d1406',
        auraColor: 'rgba(255, 87, 34, 0.4)',
        stats: {
            hp: 960,
            speed: 5.9,
            jumpForce: 15.5,
            defense: 0.95,
            energyGain: 1.35
        },
        passive: {
            name: 'Disaster Heat Aura',
            desc: 'Enemies standing within close proximity take 8 continuous burn damage every second.'
        },
        attacks: {
            basic: {
                id: 'ember_insects',
                name: 'Ember Insects',
                key: 'J / Z',
                cooldown: 0.42,
                energyCost: 0,
                damage: 66,
                range: 420,
                type: 'homing_insect',
                desc: 'Summons sonic stinger insects that fly toward target and explode on contact.'
            },
            skill1: {
                id: 'volcano_geyser',
                name: 'Volcanic Magma Geyser',
                key: 'K / X',
                cooldown: 4.5,
                energyCost: 30,
                damage: 140,
                range: 280,
                type: 'ground_eruption',
                desc: 'Causes a pillar of molten lava to erupt directly beneath the opponent.'
            },
            skill2: {
                id: 'disaster_flames',
                name: 'Disaster Flames Palm',
                key: 'L / C',
                cooldown: 5.8,
                energyCost: 40,
                damage: 160,
                range: 220,
                type: 'flamethrower_burst',
                desc: 'Twin palms incinerator jet blasting 3,000°C fire across the field.'
            },
            ultimate: {
                id: 'maximum_meteor',
                name: 'Maximum: Meteor & Iron Mountain',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 410,
                range: 500,
                type: 'cataclysm_meteor',
                desc: 'Summons a gargantuan flaming meteor from the sky that obliterates the entire arena!'
            }
        }
    },

    mahito: {
        id: 'mahito',
        name: 'Mahito',
        title: 'The Shape of the Soul',
        grade: 'Special Grade Disaster Curse',
        powerTier: 4,
        cost: 3700,
        unlocked: false,
        tagline: 'Cruel Disaster Curse born from human hatred. Transfigures human souls and mutates his own body at will.',
        color: '#8e24aa',
        accentColor: '#25082e',
        auraColor: 'rgba(142, 36, 170, 0.4)',
        stats: {
            hp: 1000,
            speed: 5.8,
            jumpForce: 16,
            defense: 1.1,
            energyGain: 1.3
        },
        passive: {
            name: 'Idle Transfiguration Flesh',
            desc: 'Regenerates 20 HP every 2 seconds when not actively taking damage by altering his soul shape.'
        },
        attacks: {
            basic: {
                id: 'soul_drill',
                name: 'Soul Blade & Drill Arm',
                key: 'J / Z',
                cooldown: 0.35,
                energyCost: 0,
                damage: 68,
                range: 95,
                type: 'morphing_blade',
                desc: 'Morphs his arm into a razor spiked drill blade to pierce the target.'
            },
            skill1: {
                id: 'body_repel',
                name: 'Soul Multiplicity: Body Repel',
                key: 'K / X',
                cooldown: 4.2,
                energyCost: 25,
                damage: 135,
                range: 450,
                type: 'projectile_swarm',
                desc: 'Combines two transfigured souls to fire high-speed fleshy projectile spears.'
            },
            skill2: {
                id: 'polymorphic_lash',
                name: 'Polymorphic Soul Whip',
                key: 'L / C',
                cooldown: 5.8,
                energyCost: 35,
                damage: 155,
                range: 190,
                type: 'whip_aoe',
                desc: 'Elongates his torso and arms into a whipping snake tail that sweeps the ground.'
            },
            ultimate: {
                id: 'self_embodiment',
                name: 'Domain: Self-Embodiment of Perfection',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 400,
                range: 320,
                type: 'soul_domain',
                desc: 'Traps opponent in a web of gigantic hands, touching and reshaping their soul from within.'
            }
        }
    },

    // ----------------------------------------------------
    // TIER 5: SPECIAL GRADE SORCERERS & ANOMALIES
    // ----------------------------------------------------
    hakari: {
        id: 'hakari',
        name: 'Kinji Hakari',
        title: 'The Undying Gambler',
        grade: 'Special Grade Potential',
        powerTier: 5,
        cost: 4200,
        unlocked: false,
        tagline: 'High school outlaw whose Restless Gambler Domain Expansion awards temporary infinite cursed energy immortality.',
        color: '#ab47bc',
        accentColor: '#2b0d31',
        auraColor: 'rgba(171, 71, 188, 0.4)',
        stats: {
            hp: 1050,
            speed: 5.7,
            jumpForce: 15,
            defense: 1.1,
            energyGain: 1.4
        },
        passive: {
            name: 'Rough Cursed Edge',
            desc: 'Punches possess sandpaper-rough cursed energy that reduces enemy block absorption by 30%.'
        },
        attacks: {
            basic: {
                id: 'rough_strike',
                name: 'Rough Cursed Fist',
                key: 'J / Z',
                cooldown: 0.35,
                energyCost: 0,
                damage: 70,
                range: 85,
                type: 'rough_blunt',
                desc: 'Aggressive street fighting blow infused with abrasive, barbed cursed energy.'
            },
            skill1: {
                id: 'subway_doors',
                name: 'Train Shutter Slam',
                key: 'K / X',
                cooldown: 4.5,
                energyCost: 25,
                damage: 140,
                range: 160,
                type: 'shutter_clamp',
                desc: 'Manifests metal train carriage doors that clamp shut on the opponent.'
            },
            skill2: {
                id: 'pachinko_balls',
                name: 'Pachinko Ball Shot',
                key: 'L / C',
                cooldown: 5.5,
                energyCost: 35,
                damage: 150,
                range: 460,
                type: 'steel_bouncing_projectile',
                desc: 'Fires heavy cursed steel pachinko balls that bounce and hammer into the enemy.'
            },
            ultimate: {
                id: 'idle_death_gamble',
                name: 'Domain Expansion: Idle Death Gamble (JACKPOT!)',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 370,
                range: 220,
                type: 'immortality_jackpot',
                desc: 'Spins slots and hits 777 Jackpot! Grants 6s of instant 100 HP/s regeneration and infinite energy!'
            }
        }
    },

    geto: {
        id: 'geto',
        name: 'Suguru Geto (Kenjaku)',
        title: 'Master of Curses',
        grade: 'Special Grade Sorcerer',
        powerTier: 5,
        cost: 4800,
        unlocked: false,
        tagline: 'Ancient sorcerer occupying Geto’s body, wielding Cursed Spirit Manipulation and Antigravity System.',
        color: '#673ab7',
        accentColor: '#1a0b33',
        auraColor: 'rgba(103, 58, 183, 0.4)',
        stats: {
            hp: 1040,
            speed: 5.6,
            jumpForce: 15,
            defense: 1.1,
            energyGain: 1.35
        },
        passive: {
            name: 'Curse Absorption',
            desc: 'Absorbs 10 energy each time the enemy executes a special skill or projectile.'
        },
        attacks: {
            basic: {
                id: 'playful_cloud_geto',
                name: 'Cursed Staff Arc',
                key: 'J / Z',
                cooldown: 0.36,
                energyCost: 0,
                damage: 72,
                range: 100,
                type: 'heavy_arc_melee',
                desc: 'Wields Playful Cloud in a fluid martial arts sweep with tremendous poise.'
            },
            skill1: {
                id: 'curse_swarm',
                name: 'Cursed Spirit Swarm',
                key: 'K / X',
                cooldown: 4.2,
                energyCost: 25,
                damage: 140,
                range: 480,
                type: 'homing_curses',
                desc: 'Releases a swarm of flying cursed spirits that track down and bite the opponent.'
            },
            skill2: {
                id: 'antigravity_launch',
                name: 'Antigravity System',
                key: 'L / C',
                cooldown: 5.8,
                energyCost: 35,
                damage: 160,
                range: 180,
                type: 'gravity_inversion',
                desc: 'Inverts gravity in an area, catapulting the opponent sky-high into a crushing ground landing.'
            },
            ultimate: {
                id: 'maximum_uzumaki',
                name: 'Maximum: Uzumaki',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 420,
                range: 700,
                type: 'colossal_beam',
                desc: 'Condenses countless curses into a colossal apocalyptic spiral beam tearing through the screen.'
            }
        }
    },

    yuta: {
        id: 'yuta',
        name: 'Yuta Okkotsu',
        title: 'The Prodigy of Curses',
        grade: 'Special Grade Sorcerer',
        powerTier: 5,
        cost: 5400,
        unlocked: false,
        tagline: 'Modern anomaly possessing boundless cursed energy and accompanied by the Queen of Curses, Rika.',
        color: '#00e5ff',
        accentColor: '#002533',
        auraColor: 'rgba(0, 229, 255, 0.4)',
        stats: {
            hp: 1100,
            speed: 6.0,
            jumpForce: 16,
            defense: 1.15,
            energyGain: 1.4
        },
        passive: {
            name: 'Reverse Cursed Technique',
            desc: 'Passively heals 12 HP per second while maintaining at least 50 energy.'
        },
        attacks: {
            basic: {
                id: 'boundless_katana',
                name: 'Boundless Katana Cleave',
                key: 'J / Z',
                cooldown: 0.34,
                energyCost: 0,
                damage: 75,
                range: 105,
                type: 'energy_blade',
                desc: 'A katana slash saturated with an overflowing cascade of blue-white cursed energy.'
            },
            skill1: {
                id: 'cursed_speech',
                name: 'Cursed Speech: "DON\'T MOVE"',
                key: 'K / X',
                cooldown: 5.0,
                energyCost: 30,
                damage: 110,
                range: 400,
                type: 'freeze_stun',
                desc: 'Speaks into a cursed megaphone: "DON\'T MOVE!" Freezes the opponent in complete stun for 1.2s!'
            },
            skill2: {
                id: 'rika_smash',
                name: 'Queen of Curses: Rika Smash',
                key: 'L / C',
                cooldown: 6.0,
                energyCost: 40,
                damage: 175,
                range: 160,
                type: 'monstrous_overhead',
                desc: 'Manifests Rika’s colossal claws overhead to pound the ground and flatten the target.'
            },
            ultimate: {
                id: 'love_beam',
                name: 'Pure Love Beam & Domain Swords',
                key: 'U / V',
                cooldown: 14.0,
                energyCost: 100,
                damage: 440,
                range: 650,
                type: 'pure_love_colossus',
                desc: 'Summons Rika to unleash the full-power Pure Love Cursed Cannon across the stage!'
            }
        }
    },

    // ----------------------------------------------------
    // TIER 6: PINNACLE OF THE VERSE (BOSS TIER)
    // ----------------------------------------------------
    sukuna: {
        id: 'sukuna',
        name: 'Ryomen Sukuna',
        title: 'King of Curses',
        grade: 'The Strongest in History',
        powerTier: 6,
        cost: 6000,
        unlocked: false,
        tagline: 'The undisputed King of Curses. Sovereign of slashes, flames, and the open-barrier Malevolent Shrine.',
        color: '#ff0033',
        accentColor: '#30000a',
        auraColor: 'rgba(255, 0, 51, 0.4)',
        stats: {
            hp: 1200,
            speed: 6.3,
            jumpForce: 16.5,
            defense: 1.2,
            energyGain: 1.5
        },
        passive: {
            name: 'King of Curses Aura',
            desc: 'Aura inflicts constant 10 bleed ticks to close foes, and reduces all incoming hitstun by 30%.'
        },
        attacks: {
            basic: {
                id: 'dismantle',
                name: 'Dismantle (Kai)',
                key: 'J / Z',
                cooldown: 0.35,
                energyCost: 0,
                damage: 82,
                range: 480,
                type: 'flying_slashes',
                desc: 'Fires an invisible supersonic slashing blade that carves through targets and projectiles.'
            },
            skill1: {
                id: 'cleave',
                name: 'Cleave (Hachi)',
                key: 'K / X',
                cooldown: 4.5,
                energyCost: 30,
                damage: 175,
                range: 125,
                type: 'durability_cut',
                desc: 'Dashes forward, clutches opponent by the face, and slices according to their toughness.'
            },
            skill2: {
                id: 'fuga',
                name: 'Fūga (Divine Flame Arrow)',
                key: 'L / C',
                cooldown: 7.0,
                energyCost: 45,
                damage: 210,
                range: 600,
                type: 'incineration_arrow',
                desc: 'Opens the furnace: fires a blistering arrow of sacred cursed flame causing massive fiery explosion!'
            },
            ultimate: {
                id: 'malevolent_shrine',
                name: 'Domain: Malevolent Shrine',
                key: 'U / V',
                cooldown: 15.0,
                energyCost: 100,
                damage: 460,
                range: 750,
                type: 'open_barrier_domain',
                desc: 'Brings forth the open-barrier Buddhist shrine, shredding everything in the arena into dust!'
            }
        }
    },

    gojo: {
        id: 'gojo',
        name: 'Satoru Gojo',
        title: 'The Honored One',
        grade: 'The Strongest Modern Sorcerer',
        powerTier: 6,
        cost: 6000,
        unlocked: false,
        tagline: 'Wielder of the Limitless and Six Eyes. Untouchable, unrivaled, and crowned throughout heaven and earth.',
        color: '#00b0ff',
        accentColor: '#001e33',
        auraColor: 'rgba(0, 176, 255, 0.4)',
        stats: {
            hp: 1200,
            speed: 6.5,
            jumpForce: 17,
            defense: 1.25,
            energyGain: 1.5
        },
        passive: {
            name: 'Limitless Infinity Barrier',
            desc: 'Infinity barrier completely blocks 1 attack every 6 seconds and slows enemy projectiles.'
        },
        attacks: {
            basic: {
                id: 'lapse_blue',
                name: 'Cursed Lapse: Blue (Attraction)',
                key: 'J / Z',
                cooldown: 0.35,
                energyCost: 0,
                damage: 82,
                range: 260,
                type: 'vacuum_pull_strike',
                desc: 'Infuses fist with Blue vacuum, pulling the opponent directly into a crushing point-blank blow!'
            },
            skill1: {
                id: 'reversal_red',
                name: 'Cursed Reversal: Red (Repulsion)',
                key: 'K / X',
                cooldown: 4.5,
                energyCost: 30,
                damage: 170,
                range: 520,
                type: 'kinetic_shockwave_blast',
                desc: 'Fires an explosive orb of positive cursed repulsion that blasts opponents across the screen!'
            },
            skill2: {
                id: 'teleport_blitz',
                name: 'Limitless Space Teleport Kick',
                key: 'L / C',
                cooldown: 5.5,
                energyCost: 35,
                damage: 165,
                range: 400,
                type: 'instant_transmission',
                desc: 'Bends space to teleport instantly behind the opponent, delivering a thunderous downward axe kick.'
            },
            ultimate: {
                id: 'hollow_purple',
                name: 'Hollow Technique: Purple & Unlimited Void',
                key: 'U / V',
                cooldown: 15.0,
                energyCost: 100,
                damage: 480,
                range: 750,
                type: 'imaginary_mass_colossus',
                desc: 'Collides Red and Blue to fire an unstoppable sphere of imaginary mass erasing all matter in its path!'
            }
        }
    }
};

// ----------------------------------------------------
// PERSISTENCE HELPER (Local Storage & Player Progression)
// ----------------------------------------------------
class StorageManager {
    static STORAGE_KEY = 'battle_arena_clashofsorcerors_save_v1';

    static load() {
        const defaultData = {
            points: 0,
            unlocked: ['yuji', 'nobara'],
            battlesWon: 0,
            battlesLost: 0,
            arcadeCompleted: false
        };

        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
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

    static resetPoints() {
        const data = this.load();
        data.points = 0;
        this.save(data);
        return data;
    }

    static reset() {
        const defaultData = {
            points: 0,
            unlocked: ['yuji', 'nobara'],
            battlesWon: 0,
            battlesLost: 0,
            arcadeCompleted: false
        };
        this.save(defaultData);
        return defaultData;
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
        if (charId === 'yuji' || charId === 'nobara') return true;
        const data = this.load();
        return data.unlocked && data.unlocked.includes(charId);
    }
}
