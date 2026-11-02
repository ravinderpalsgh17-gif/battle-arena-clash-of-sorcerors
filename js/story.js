// ============================================================================
// BATTLE ARENA: CLASH OF SORCERORS - CANONICAL JUJUTSU KAISEN STORY SAGA
// 8 Canonical Story Arcs • Multi-Turn Checkpoint Battles • Dialogue Cutscenes
// ============================================================================

const STORY_CHAPTERS = [
    {
        id: 1,
        arc: "Fearsome Womb Arc",
        title: "Chapter 1: The Cursed Vessel's Awakening",
        subtitle: "Sugisawa High School to Ryomen Sukuna's Innate Domain",
        battlefield: "jjk_high",
        bossKey: "sukuna",
        playerKey: "yuji",
        reward: 500,
        summary: "When Special Grade cursed spirits besiege Sugisawa High School, ordinary high schooler Yuji Itadori swallows the sealed finger of Ryomen Sukuna to save Megumi Fushiguro. Thrust into the brutal world of sorcery, Yuji must control the King of Curses within his own soul.",
        prologue: [
            {
                speaker: "Megumi Fushiguro",
                avatar: "🐺",
                side: "left",
                text: "Don't do it, Itadori! That's a Special Grade cursed object! Eating it means guaranteed death—you'll be possessed by the worst curse in history!"
            },
            {
                speaker: "Yuji Itadori",
                avatar: "🥊",
                side: "left",
                text: "If I don't swallow it right now, that monster will kill you and everyone else! Bottoms up!"
            },
            {
                speaker: "Ryomen Sukuna",
                avatar: "👁️",
                side: "right",
                text: "AHAHAHAHA! I knew it! The moonlight feels best on true flesh! Where are the women?! Where are the children?! A magnificent age of slaughter begins!"
            },
            {
                speaker: "Yuji Itadori",
                avatar: "🥊",
                side: "left",
                text: "Hey! What do you think you're doing with my body?! Give it back, you creep!"
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: The Vessel's Trial",
                battlefield: "jjk_high",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "megumi",
                enemyName: "Megumi Fushiguro",
                difficulty: "easy",
                objective: "Defeat Megumi in an evaluation bout to demonstrate control over your cursed energy!",
                midBattleQuotes: [
                    { hpThreshold: 60, speaker: "Megumi", text: "His raw physical power is inhuman... how is he suppressing Sukuna's malice?!", color: "#00e5ff" },
                    { hpThreshold: 30, speaker: "Yuji", text: "I made a promise to my grandpa! I will save whoever I can!", color: "#ff2a5f" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: Confronting the King of Curses",
                battlefield: "heian_necropolis",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "sukuna",
                enemyName: "Ryomen Sukuna",
                difficulty: "medium",
                objective: "Face the King of Curses atop his mountain of skulls inside his Innate Domain!",
                midBattleQuotes: [
                    { hpThreshold: 70, speaker: "Sukuna", text: "Know your place, fool. A brat like you dares to lecture me?", color: "#ff0055" },
                    { hpThreshold: 35, speaker: "Yuji", text: "I'll never accept your binding vow! Restore my heart, Sukuna!", color: "#ffd700" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Satoru Gojo",
                avatar: "👁️",
                side: "right",
                text: "Good news, Yuji! Your immediate secret execution has been suspended! Bad news: you have to locate and consume all twenty of Sukuna's fingers first."
            },
            {
                speaker: "Yuji Itadori",
                avatar: "🥊",
                side: "left",
                text: "If eating every finger means destroying this curse forever so innocent people can live... then I'm in!"
            },
            {
                speaker: "Satoru Gojo",
                avatar: "👁️",
                side: "right",
                text: "That's the spirit! Welcome to Tokyo Prefectural Jujutsu High School!"
            }
        ]
    },
    {
        id: 2,
        arc: "Vs. Mahito Arc",
        title: "Chapter 2: The Shape of the Soul",
        subtitle: "Tokyo Sewer Underpass to Satozakura High",
        battlefield: "tokyo_subway",
        bossKey: "mahito",
        playerKey: "nanami",
        reward: 750,
        summary: "A grotesque new Special Grade curse born from human hatred of other humans, Mahito, begins transfiguring innocent students. Grade 1 Sorcerer Kento Nanami and Yuji Itadori descend into the Tokyo underground sewers to sever Mahito's twisted transfiguration.",
        prologue: [
            {
                speaker: "Kento Nanami",
                avatar: "📐",
                side: "left",
                text: "Being a sorcerer is shit. Being a salaryman is shit. If both are shit, I chose the one I was better suited for. But I have one strict rule: no overtime."
            },
            {
                speaker: "Mahito",
                avatar: "🪡",
                side: "right",
                text: "You sorcerers think the body came first, but you're wrong! The soul precedes the body! By altering the soul's shape, the flesh is putty in my hands!"
            },
            {
                speaker: "Kento Nanami",
                avatar: "📐",
                side: "left",
                text: "My shift is nearly complete. I shall conclude this before 6:00 PM."
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: The 7:3 Ratio Underpass",
                battlefield: "tokyo_subway",
                playerChar: "nanami",
                playerName: "Kento Nanami",
                enemyChar: "mahito",
                enemyName: "Mahito",
                difficulty: "medium",
                objective: "Strike Mahito's 7:3 ratio critical point with blunt cleaver precision!",
                midBattleQuotes: [
                    { hpThreshold: 55, speaker: "Nanami", text: "6:00 PM has arrived. My cursed energy increases now. Overtime begins.", color: "#ffd700" },
                    { hpThreshold: 25, speaker: "Mahito", text: "Oho! Your cursed energy density just doubled! What an interesting technique!", color: "#00e5ff" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: The Soul Boundary Clash",
                battlefield: "tokyo_subway",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "mahito",
                enemyName: "Mahito",
                difficulty: "hard",
                objective: "Yuji arrives! Strike the boundary of Mahito's soul with Divergent Fist!",
                midBattleQuotes: [
                    { hpThreshold: 60, speaker: "Mahito", text: "Guh! Why does his strike damage my soul?! He shares a vessel with Sukuna, so he understands soul contours!", color: "#ff0055" },
                    { hpThreshold: 30, speaker: "Yuji", text: "You turned Junpei into a monster! I will never forgive you, Mahito!", color: "#ff2a5f" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Mahito",
                avatar: "🪡",
                side: "right",
                text: "Damn it! Two on one... and Sukuna slashed me when I touched his soul! We will meet again, Yuji Itadori!"
            },
            {
                speaker: "Kento Nanami",
                avatar: "📐",
                side: "left",
                text: "You did well, Itadori-kun. You saved my life. However, do not rush to discard your youth. There is still much you must learn."
            }
        ]
    },
    {
        id: 3,
        arc: "Kyoto Goodwill Event",
        title: "Chapter 3: The Kyoto Goodwill Brotherhood",
        subtitle: "Tokyo vs Kyoto Sister School Exchange & Curse Infiltration",
        battlefield: "jjk_high",
        bossKey: "jogo",
        playerKey: "yuji",
        reward: 1000,
        summary: "During the annual Sister School Exchange, Kyoto's powerhouse Aoi Todo challenges Yuji. In the heat of battle, Todo recognizes Yuji as his 'brother' and teaches him the secret of Black Flash, right as Disaster Curses breach the sacred academy barrier.",
        prologue: [
            {
                speaker: "Aoi Todo",
                avatar: "👏",
                side: "right",
                text: "Answer me one question, Itadori. What kind of woman is your type? Answer poorly, and I will pulverize you into the dirt."
            },
            {
                speaker: "Yuji Itadori",
                avatar: "🥊",
                side: "left",
                text: "My type? Uh... a tall woman with a big ass... like Jennifer Lawrence!"
            },
            {
                speaker: "Aoi Todo",
                avatar: "👏",
                side: "right",
                text: "*Flashback of memories that never occurred*... Brother! MY BEST FRIEND! We walked home from middle school together! Let me teach you the Black Flash!"
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: Best Friends Sparring",
                battlefield: "jjk_high",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "todo",
                enemyName: "Aoi Todo",
                difficulty: "medium",
                objective: "Spar with Aoi Todo to align your cursed energy with the microsecond timing of impact!",
                midBattleQuotes: [
                    { hpThreshold: 60, speaker: "Todo", text: "Your cursed energy lags behind your physical blow! You are relying on Divergent Fist! Awaken, brother!", color: "#9d4edd" },
                    { hpThreshold: 30, speaker: "Yuji", text: "Focus... apply cursed energy at 0.000001 seconds of physical collision!", color: "#ffd700" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: Boogie Woogie Clapping Duo",
                battlefield: "jjk_high",
                playerChar: "todo",
                playerName: "Aoi Todo",
                enemyChar: "jogo",
                enemyName: "Jogo",
                difficulty: "hard",
                objective: "Disaster Curse Jogo breaches the barrier! Coordinate Boogie Woogie swaps to overwhelm the volcano spirit!",
                midBattleQuotes: [
                    { hpThreshold: 65, speaker: "Jogo", text: "Impudent fledglings! You dare mock the flames of humanity's true successors?!", color: "#ff2a5f" },
                    { hpThreshold: 25, speaker: "Todo", text: "*CLAP*—Boogie Woogie! Our victory is a 530,000 IQ certainty, brother!", color: "#00e5ff" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Aoi Todo",
                avatar: "👏",
                side: "left",
                text: "Four consecutive Black Flashes! Magnificent, brother! You have tasted the blessing of the sparks!"
            },
            {
                speaker: "Yuji Itadori",
                avatar: "🥊",
                side: "left",
                text: "Thanks to you, Todo! Together, we can take on any curse in the world!"
            }
        ]
    },
    {
        id: 4,
        arc: "Hidden Inventory Arc",
        title: "Chapter 4: The Sorcerer Killer — Premonition",
        subtitle: "Tomb of the Star Corridor, 2006",
        battlefield: "star_tomb",
        bossKey: "toji",
        playerKey: "gojo",
        reward: 1500,
        summary: "Twelve years prior, Satoru Gojo and Suguru Geto are assigned to protect the Star Plasma Vessel Riko Amanai. The non-sorcerer assassin Toji Fushiguro breaches the barrier with zero cursed energy and the Inverted Spear of Heaven, pushing Gojo to the boundary between life and death.",
        prologue: [
            {
                speaker: "Toji Fushiguro",
                avatar: "🗡️",
                side: "right",
                text: "You sorcerers blessed with cursed energy are all the same: cocky, proud, and completely reliant on your precious techniques."
            },
            {
                speaker: "Suguru Geto",
                avatar: "🐉",
                side: "left",
                text: "A monkey with zero cursed energy... how dare you harm Satoru and Riko inside the sacred corridor!"
            },
            {
                speaker: "Toji Fushiguro",
                avatar: "🗡️",
                side: "right",
                text: "A monkey? Let me show you what a monkey with Heavenly Restriction can do to your special grade sorcery."
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: The Assassin in the Corridor",
                battlefield: "star_tomb",
                playerChar: "geto",
                playerName: "Suguru Geto",
                enemyChar: "toji",
                enemyName: "Toji Fushiguro",
                difficulty: "hard",
                objective: "Defend the Star Corridor against Toji's Inverted Spear of Heaven!",
                midBattleQuotes: [
                    { hpThreshold: 55, speaker: "Toji", text: "Too slow. Your cursed spirit manipulation is just target practice.", color: "#00e5ff" },
                    { hpThreshold: 20, speaker: "Geto", text: "His physical speed and stealth... I cannot track him with cursed sensory perception!", color: "#ff2a5f" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: The Honored One Awakens",
                battlefield: "star_tomb",
                playerChar: "gojo",
                playerName: "Satoru Gojo (Awakened)",
                enemyChar: "toji",
                enemyName: "Toji Fushiguro",
                difficulty: "deity",
                objective: "Tap into the core of Reverse Cursed Technique! Unleash Hollow Technique: Purple and defeat the Sorcerer Killer!",
                midBattleQuotes: [
                    { hpThreshold: 70, speaker: "Gojo", text: "Throughout Heaven and Earth... I alone am the honored one.", color: "#00e5ff" },
                    { hpThreshold: 35, speaker: "Toji", text: "Something is wrong... he isn't even touching the ground! He's running pure positive energy!", color: "#ff0055" },
                    { hpThreshold: 10, speaker: "Gojo", text: "Take the amplified and the reversal... and combine these two expressions of infinity. HOLLOW PURPLE!", color: "#9d4edd" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Toji Fushiguro",
                avatar: "🗡️",
                side: "right",
                text: "In two or three years... my kid will be sold to the Zen'in clan. His name is Megumi. Do whatever you want with him..."
            },
            {
                speaker: "Satoru Gojo",
                avatar: "👁️",
                side: "left",
                text: "Suguru... are you the strongest because you're Suguru Geto? Or are you Suguru Geto because you're the strongest?"
            }
        ]
    },
    {
        id: 5,
        arc: "Shibuya Incident: Part 1",
        title: "Chapter 5: The Shibuya Descent — Blood & Fire",
        subtitle: "October 31, 2018 — B5F Fukutoshin Platform",
        battlefield: "tokyo_subway",
        bossKey: "choso",
        playerKey: "yuji",
        reward: 2000,
        summary: "A colossal non-sorcerer barrier traps hundreds of thousands in Shibuya. Satoru Gojo descends into the crowded subway platform, while Yuji Itadori clashes with Death Painting Choso in the flooded restroom underpass.",
        prologue: [
            {
                speaker: "Choso",
                avatar: "🩸",
                side: "right",
                text: "You killed Eso and Kechizu. Even if they were curses, they were my beloved brothers! An elder brother must avenge his younger kin!"
            },
            {
                speaker: "Yuji Itadori",
                avatar: "🥊",
                side: "left",
                text: "I had no choice back then! But right now, people are dying all over Shibuya! I can't let you stop me here!"
            },
            {
                speaker: "Choso",
                avatar: "🩸",
                side: "right",
                text: "Then prepare to bleed. Blood Manipulation: Flowing Red Scale!"
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: Piercing Blood Duel",
                battlefield: "tokyo_subway",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "choso",
                enemyName: "Choso",
                difficulty: "hard",
                objective: "Evade Choso's supersonic Piercing Blood and close into melee range!",
                midBattleQuotes: [
                    { hpThreshold: 60, speaker: "Choso", text: "Piercing Blood compresses blood to its absolute limit! You cannot dodge sound itself!", color: "#ff0055" },
                    { hpThreshold: 20, speaker: "Choso", text: "*Synaptic flashback*... wait... memories flowing into my brain?! You... you are my brother?!", color: "#ffd700" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: Dagon's Horizon Beach",
                battlefield: "dagon_beach",
                playerChar: "maki",
                playerName: "Maki Zen'in",
                enemyChar: "jogo",
                enemyName: "Jogo",
                difficulty: "hard",
                objective: "Survive the boiling volcano inferno of Jogo inside the tropical barrier!",
                midBattleQuotes: [
                    { hpThreshold: 60, speaker: "Jogo", text: "A non-sorcerer with zero cursed energy dares face a disaster curse?!", color: "#ff2a5f" },
                    { hpThreshold: 25, speaker: "Maki", text: "Don't you dare mock me! I will destroy every curse and every Zen'in fool!", color: "#00ff88" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Choso",
                avatar: "🩸",
                side: "right",
                text: "Who are you, Yuji Itadori...? My blood resonates with yours... Kenjaku made us both!"
            },
            {
                speaker: "Kento Nanami",
                avatar: "📐",
                side: "left",
                text: "Attention all units... Satoru Gojo has been sealed inside the Prison Realm. I repeat: Satoru Gojo is sealed. Tokyo has fallen."
            }
        ]
    },
    {
        id: 6,
        arc: "Shibuya Incident: Part 2",
        title: "Chapter 6: The Climax of Despair — Malevolent Shibuya",
        subtitle: "Shibuya Ground Zero — The Fall of Humanity",
        battlefield: "shibuya_crater",
        bossKey: "mahito",
        playerKey: "yuji",
        reward: 2500,
        summary: "With Gojo sealed in the Prison Realm, 15-finger Sukuna awakens and levels Shibuya in a cataclysmic clash against Jogo. Amid the burning crater, Yuji Itadori and Aoi Todo stand alone against Mahito's final awakened form: The Instant Spirit of Distorted Killing.",
        prologue: [
            {
                speaker: "Kenjaku (Geto)",
                avatar: "🧠",
                side: "right",
                text: "Good evening, Satoru. Did you really think you could save everyone in the subway? In this world, ideals are a luxury."
            },
            {
                speaker: "Satoru Gojo",
                avatar: "👁️",
                side: "left",
                text: "My Six Eyes tell me you're Suguru Geto... but my soul knows you're a revolting imposter inhabiting my friend's corpse!"
            },
            {
                speaker: "Ryomen Sukuna",
                avatar: "👁️",
                side: "right",
                text: "Out of the way, worm. If you can land a single hit on me, Jogo, I'll agree to work under your curse collective."
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: The 0.2-Second Domain",
                battlefield: "shibuya_crater",
                playerChar: "gojo",
                playerName: "Satoru Gojo",
                enemyChar: "geto",
                enemyName: "Kenjaku (Geto)",
                difficulty: "hard",
                objective: "Deploy a 0.2-second Unlimited Void to paralyze transfigured spirits before the Prison Realm closes!",
                midBattleQuotes: [
                    { hpThreshold: 60, speaker: "Gojo", text: "0.2-second Unlimited Void! A gamble so normal humans don't suffer permanent brain death!", color: "#00e5ff" },
                    { hpThreshold: 20, speaker: "Kenjaku", text: "Gate open! Prison Realm, bind the strongest sorcerer in history!", color: "#9d4edd" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: Flame Arrow vs Meteor",
                battlefield: "shibuya_crater",
                playerChar: "sukuna",
                playerName: "Ryomen Sukuna",
                enemyChar: "jogo",
                enemyName: "Jogo",
                difficulty: "hard",
                objective: "Annihilate Jogo with Malevolent Shrine slashes and the Divine Flame Arrow!",
                midBattleQuotes: [
                    { hpThreshold: 60, speaker: "Jogo", text: "Maximum: Meteor! I will incinerate this entire ward to cinders!", color: "#ff2a5f" },
                    { hpThreshold: 20, speaker: "Sukuna", text: "Open (Fuga). Stand proud, Jogo. You were strong.", color: "#ffd700" }
                ]
            },
            {
                turnNumber: 3,
                name: "Turn 3: The Wolf and the Rabbit",
                battlefield: "shibuya_crater",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "mahito",
                enemyName: "Mahito (Final Form)",
                difficulty: "deity",
                objective: "Mahito awakens Instant Spirit of Distorted Killing! Deliver the final Black Flash of Shibuya!",
                midBattleQuotes: [
                    { hpThreshold: 65, speaker: "Mahito", text: "I have discovered the true shape of my soul! I am death itself!", color: "#ff0055" },
                    { hpThreshold: 25, speaker: "Yuji", text: "I am you, Mahito. Kill me, and another like me will take my place. I will hunt you down across a thousand reincarnations!", color: "#ffd700" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Mahito",
                avatar: "🪡",
                side: "right",
                text: "No... NO! Get away from me! SAVE ME, GETO!"
            },
            {
                speaker: "Kenjaku (Geto)",
                avatar: "🧠",
                side: "right",
                text: "Shall I save you, Mahito? *Absorbs Mahito via Cursed Spirit Manipulation*... What a useful technique Uzumaki is."
            },
            {
                speaker: "Yuji Itadori",
                avatar: "🥊",
                side: "left",
                text: "Nanami... Kugisaki... I will keep running. Even if my body breaks, I will destroy every curse Kenjaku leaves behind."
            }
        ]
    },
    {
        id: 7,
        arc: "Culling Game Arc",
        title: "Chapter 7: The Culling Game — Colony Deathmatches",
        subtitle: "Tokyo No. 1 Barrier & Sendai Colosseum",
        battlefield: "culling_barrier",
        bossKey: "choso",
        playerKey: "hakari",
        reward: 3500,
        summary: "Kenjaku initiates the Culling Game across ten domestic barriers to force the evolution of human cursed energy. Third-year Kinji Hakari unleashes his pachinko jackpot domain, while Special Grade Yuta Okkotsu sweeps the Sendai Colony with Rika.",
        prologue: [
            {
                speaker: "Kinji Hakari",
                avatar: "🎰",
                side: "left",
                text: "The rules of the Culling Game are simple: kill or be killed to rack up 100 points. But me? I'm chasing the fever! Let's spin the reels!"
            },
            {
                speaker: "Yuta Okkotsu",
                avatar: "🗡️",
                side: "left",
                text: "Gojo-sensei trusted us to protect the world while he's sealed. I won't let anyone else bear this terrible weight. Let's do this, Rika."
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: The Infinite 777 Jackpot",
                battlefield: "culling_barrier",
                playerChar: "hakari",
                playerName: "Kinji Hakari",
                enemyChar: "choso",
                enemyName: "Colony Sorcerer Choso",
                difficulty: "hard",
                objective: "Deploy Idle Death Gamble and maintain 777 Jackpot infinite cursed energy!",
                midBattleQuotes: [
                    { hpThreshold: 60, speaker: "Hakari", text: "Domain Expansion: Idle Death Gamble! Reach the probability change rush!", color: "#00e5ff" },
                    { hpThreshold: 20, speaker: "Hakari", text: "JACKPOT 777! Four minutes and eleven seconds of pure immortality! Let's dance!", color: "#ffd700" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: Sendai Colony Dominance",
                battlefield: "sendai_colosseum",
                playerChar: "yuta",
                playerName: "Yuta Okkotsu",
                enemyChar: "geto",
                enemyName: "Kenjaku",
                difficulty: "deity",
                objective: "Unleash Authentic Mutual Love and Rika's manifestation against ancient sorcerers!",
                midBattleQuotes: [
                    { hpThreshold: 60, speaker: "Yuta", text: "Rika... don't hurt them too badly. We need their 100 points to establish new rules!", color: "#ff0055" },
                    { hpThreshold: 25, speaker: "Kenjaku", text: "Okkotsu Yuta... his boundless cursed energy makes even Special Grades look like infants!", color: "#9d4edd" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Yuta Okkotsu",
                avatar: "🗡️",
                side: "left",
                text: "We have acquired the required points. Angel has agreed to use Jacob's Ladder. Satoru Gojo is about to be unsealed!"
            },
            {
                speaker: "Kinji Hakari",
                avatar: "🎰",
                side: "left",
                text: "The stage is set for the greatest show in jujutsu history. Let's go blow Sukuna to kingdom come!"
            }
        ]
    },
    {
        id: 8,
        arc: "Shinjuku Showdown Arc",
        title: "Chapter 8: Shinjuku Showdown — Battle of the Strongest",
        subtitle: "December 24, 2018 — The Climax of Jujutsu Sorcery",
        battlefield: "shinjuku_zenith",
        bossKey: "sukuna",
        playerKey: "gojo",
        reward: 5000,
        summary: "Satoru Gojo is unsealed from the Prison Realm and meets Ryomen Sukuna atop the Shinjuku Zenith skyscrapers on Christmas Eve. The strongest sorcerer of today clashes with the strongest sorcerer in history, followed by Yuji and Yuta's final stand to save humanity.",
        prologue: [
            {
                speaker: "Satoru Gojo",
                avatar: "👁️",
                side: "left",
                text: "Sukuna... you're looking a little worn down. Ready to face the real deal?"
            },
            {
                speaker: "Ryomen Sukuna",
                avatar: "👁️",
                side: "right",
                text: "You were just a fish on the chopping board, Gojo Satoru. A slightly lively one, that is all."
            },
            {
                speaker: "Satoru Gojo",
                avatar: "👁️",
                side: "left",
                text: "Students are watching. Nah, I'd win."
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: Clash of the Strongest",
                battlefield: "shinjuku_zenith",
                playerChar: "gojo",
                playerName: "Satoru Gojo",
                enemyChar: "sukuna",
                enemyName: "Ryomen Sukuna (Heian Form)",
                difficulty: "deity",
                objective: "The Battle of the Strongest! Match Malevolent Shrine with Unlimited Void and withstand Sukuna's slashes!",
                midBattleQuotes: [
                    { hpThreshold: 75, speaker: "Gojo", text: "Unlimited Void! Within this infinity, you cannot perceive or breathe!", color: "#00e5ff" },
                    { hpThreshold: 45, speaker: "Sukuna", text: "Domain Expansion: Malevolent Shrine! An open barrier of divine slaughter!", color: "#ff0055" },
                    { hpThreshold: 20, speaker: "Gojo", text: "Maximum Output: Hollow Purple! Tear through space and dismantle his domain!", color: "#9d4edd" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: The Next Generation Gauntlet",
                battlefield: "celestial_void",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "sukuna",
                enemyName: "Ryomen Sukuna (True King)",
                difficulty: "deity",
                objective: "The Final Gauntlet! Yuji Itadori strikes Sukuna's soul boundary with Black Flash to sever his connection!",
                midBattleQuotes: [
                    { hpThreshold: 60, speaker: "Sukuna", text: "You persistent brat! Why won't your soul shatter under my World Cutting Slash?!", color: "#ff0055" },
                    { hpThreshold: 30, speaker: "Yuji", text: "Every blow I land tears the barrier between your soul and Megumi! Divergent Soul Dismantle!", color: "#ffd700" },
                    { hpThreshold: 10, speaker: "Yuji", text: "BLACK FLASH! This is the collective soul of everyone you tried to extinguish!", color: "#ff2a5f" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Ryomen Sukuna",
                avatar: "👁️",
                side: "right",
                text: "I am a curse... a monstrosity born of the Heian era... to think I would fall to brats of this newborn age..."
            },
            {
                speaker: "Yuji Itadori",
                avatar: "🥊",
                side: "left",
                text: "It's over, Sukuna. Megumi is safe. The cycle of curses ends today."
            },
            {
                speaker: "Satoru Gojo",
                avatar: "👁️",
                side: "left",
                text: "Look at you all. My students surpassed me just as I always knew they would. Jujutsu sorcery has a bright tomorrow."
            }
        ]
    }
];

// Helper methods for the Story Mode Manager
class StoryManager {
    static getChapters() {
        return STORY_CHAPTERS;
    }

    static getChapter(id) {
        return STORY_CHAPTERS.find(c => c.id === parseInt(id, 10)) || STORY_CHAPTERS[0];
    }

    static getTurn(chapterId, turnIndex) {
        const chapter = this.getChapter(chapterId);
        if (!chapter || !chapter.turns || !chapter.turns[turnIndex]) {
            return chapter ? chapter.turns[0] : null;
        }
        return chapter.turns[turnIndex];
    }

    static getTotalChapters() {
        return STORY_CHAPTERS.length;
    }
}

if (typeof window !== 'undefined') {
    window.STORY_CHAPTERS = STORY_CHAPTERS;
    window.StoryManager = StoryManager;
}
