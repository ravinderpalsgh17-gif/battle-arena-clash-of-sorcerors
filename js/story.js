// ============================================================================
// BATTLE ARENA: CLASH OF SORCERORS - CANONICAL JUJUTSU KAISEN STORY SAGA
// Exact Manga & Anime Dialogue • Multi-Turn Checkpoints • 3D Voice Engine
// ============================================================================

const STORY_CHAPTERS = [
    {
        id: 1,
        arc: "Fearsome Womb Arc (呪胎戴天編)",
        title: "Chapter 1: The Cursed Vessel's Awakening",
        subtitle: "Sugisawa High School to Eishu Detention Center",
        battlefield: "jjk_high",
        bossKey: "megumi",
        playerKey: "yuji",
        reward: 1500,
        summary: "When a Special Grade cursed object is unsealed at Sugisawa High, ordinary athlete Yuji Itadori swallows the sealed finger of Ryomen Sukuna to save Megumi Fushiguro. Thrust into the Jujutsu world, Yuji must control the ancient King of Curses within his soul.",
        prologue: [
            {
                speaker: "Megumi Fushiguro",
                charKey: "megumi",
                avatar: "🐺",
                title: "Ten Shadows Heir / 伏黒恵",
                side: "left",
                text: "Don't eat it, Itadori! That's a Special Grade cursed object—Ryomen Sukuna's sealed finger! Swallowing it means guaranteed death!"
            },
            {
                speaker: "Yuji Itadori",
                charKey: "yuji",
                avatar: "🥊",
                title: "Vessel of Sukuna / 虎杖悠仁",
                side: "left",
                text: "If I don't swallow it right now, that cursed spirit will kill you and everyone else! Bottoms up!"
            },
            {
                speaker: "Ryomen Sukuna",
                charKey: "sukuna",
                avatar: "👁️",
                title: "King of Curses / 両面宿儺",
                side: "right",
                text: "AHAHAHAHA! I knew it! The moonlight feels best on true flesh! A cursed spirit's flesh is no fun. Where are the people?! Where are the women?! What a magnificent era of slaughter!"
            },
            {
                speaker: "Yuji Itadori",
                charKey: "yuji",
                avatar: "🥊",
                title: "Vessel of Sukuna / 虎杖悠仁",
                side: "left",
                text: "Hey! What do you think you're doing with someone else's body?! Give it back, you creep!"
            },
            {
                speaker: "Megumi Fushiguro",
                charKey: "megumi",
                avatar: "🐺",
                title: "Ten Shadows Heir / 伏黒恵",
                side: "left",
                text: "He's suppressing Sukuna with sheer physical willpower...?! Under Jujutsu regulations, Itadori Yuji, I must exorcise you as a curse!"
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: The Vessel's Evaluation",
                battlefield: "jjk_high",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "megumi",
                enemyName: "Megumi Fushiguro",
                difficulty: "easy",
                objective: "Defeat Megumi in an evaluation duel to prove you can maintain control over Sukuna's cursed energy!",
                midBattleQuotes: [
                    { hpThreshold: 70, speaker: "Megumi", charKey: "megumi", text: "His raw physical speed is inhuman... How is he suppressing Sukuna's malice without sorcery training?!", color: "#00e5ff" },
                    { hpThreshold: 35, speaker: "Yuji", charKey: "yuji", text: "I made a promise to my grandpa on his deathbed! I will save whoever I can, so don't you dare give up on me!", color: "#ff2a5f" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: Mountain of Skulls (Innate Domain)",
                battlefield: "heian_necropolis",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "sukuna",
                enemyName: "Ryomen Sukuna",
                difficulty: "medium",
                objective: "Confront the King of Curses atop his mountain of skulls inside his Innate Domain!",
                midBattleQuotes: [
                    { hpThreshold: 75, speaker: "Sukuna", charKey: "sukuna", text: "Know your place, fool. (身の程をわきまえろ、痴れ者が) A brat like you dares to demand terms from me?!", color: "#ff0055" },
                    { hpThreshold: 40, speaker: "Yuji", charKey: "yuji", text: "I'll never accept your binding vow! Restore my heart and let me protect Fushiguro!", color: "#ffd700" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Satoru Gojo",
                charKey: "gojo",
                avatar: "👁️",
                title: "The Strongest / 五条悟",
                side: "right",
                text: "Yo, Yuji! Good news: your immediate secret execution has been suspended! Bad news: you have to locate and consume all twenty of Sukuna's fingers first."
            },
            {
                speaker: "Yuji Itadori",
                charKey: "yuji",
                avatar: "🥊",
                title: "Tokyo Jujutsu High / 虎杖悠仁",
                side: "left",
                text: "If eating every finger destroys this curse forever so innocent people can live... then count me in!"
            },
            {
                speaker: "Satoru Gojo",
                charKey: "gojo",
                avatar: "👁️",
                title: "The Strongest / 五条悟",
                side: "right",
                text: "That's the spirit! Welcome to Tokyo Metropolitan Magic Technical College."
            }
        ]
    },
    {
        id: 2,
        arc: "Vs. Mahito Arc (幼魚と逆罰編)",
        title: "Chapter 2: The Shape of the Soul",
        subtitle: "Tokyo Sewer Underpass to Satozakura High School",
        battlefield: "tokyo_subway",
        bossKey: "mahito",
        playerKey: "nanami",
        reward: 2000,
        summary: "A human-born curse named Mahito transfigures innocent teenagers in Kawasaki. Grade 1 sorcerer Kento Nanami and Yuji Itadori investigate the killings, uncovering Mahito's twisted philosophy that the soul precedes and shapes the body.",
        prologue: [
            {
                speaker: "Kento Nanami",
                charKey: "nanami",
                avatar: "👔",
                title: "Grade 1 Sorcerer / 七海建人",
                side: "left",
                text: "Working is shit! Having to deal with people is shit! So as long as both are shit, I chose the one that I am better suited for as a sorcerer."
            },
            {
                speaker: "Mahito",
                charKey: "mahito",
                avatar: "🧵",
                title: "Curse of Humanity / 真人",
                side: "right",
                text: "Humans always wonder what comes first, the body or the soul? The soul comes first! The body is merely shaped by the contour of the soul. Idle Transfiguration!"
            },
            {
                speaker: "Kento Nanami",
                charKey: "nanami",
                avatar: "👔",
                title: "Grade 1 Sorcerer / 七海建人",
                side: "left",
                text: "The time is currently 17:30. My scheduled shift ended at 17:00. Starting now... I will be working overtime. (ここからは、時間外労働です)"
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: Overtime in the Underpass",
                battlefield: "tokyo_subway",
                playerChar: "nanami",
                playerName: "Kento Nanami",
                enemyChar: "mahito",
                enemyName: "Mahito",
                difficulty: "medium",
                objective: "Unleash 7:3 Ratio Technique against Mahito in the underground sewer tunnels before your overtime runs out!",
                midBattleQuotes: [
                    { hpThreshold: 70, speaker: "Nanami", charKey: "nanami", text: "Ratio Technique: Collapse! By creating a weak point at the 7 to 3 ratio, even curses without physical cores can be severed!", color: "#fbbf24" },
                    { hpThreshold: 35, speaker: "Mahito", charKey: "mahito", text: "Fascinating! You can damage my soul contour! But my soul has infinite variations!", color: "#c084fc" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: Satozakura High Climax",
                battlefield: "jjk_high",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "mahito",
                enemyName: "Mahito",
                difficulty: "hard",
                objective: "Deliver justice for Junpei Yoshino and strike Mahito's soul with unyielding Divergent Fists!",
                midBattleQuotes: [
                    { hpThreshold: 80, speaker: "Mahito", charKey: "mahito", text: "Domain Expansion: Self-Embodiment of Perfection! (自閉円頓裹) Within my palm, your souls are mine!", color: "#a855f7" },
                    { hpThreshold: 50, speaker: "Sukuna", charKey: "sukuna", text: "I warned you once, patchface. Touch my soul a second time and you die.", color: "#ef4444" },
                    { hpThreshold: 25, speaker: "Yuji", charKey: "yuji", text: "I will never forgive you, Mahito! Even if you run, even if you change your name and form, I will kill you!", color: "#38bdf8" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Kento Nanami",
                charKey: "nanami",
                avatar: "👔",
                title: "Grade 1 Sorcerer / 七海建人",
                side: "left",
                text: "Itadori-kun. You saved my life today. You don't have to force yourself to become an adult too quickly... but today, you were a true Jujutsu sorcerer."
            },
            {
                speaker: "Yuji Itadori",
                charKey: "yuji",
                avatar: "🥊",
                title: "Vessel of Sukuna / 虎杖悠仁",
                side: "left",
                text: "I couldn't save Junpei... but I swear on my life, I will never let another person be murdered by a curse in front of me again."
            }
        ]
    },
    {
        id: 3,
        arc: "Kyoto Goodwill Event Arc (京都姉妹校交流会編)",
        title: "Chapter 3: Brotherly Synchrony & Black Flash",
        subtitle: "Jujutsu High Sacred Woods & Forest Boundary",
        battlefield: "jjk_high",
        bossKey: "jogo",
        playerKey: "yuji",
        reward: 2500,
        summary: "The annual sister-school goodwill event descends into chaos when Special Grade disaster curses breach the sacred barrier. Aoi Todo discovers his true soul brother in Yuji Itadori, guiding him to unlock the legendary Black Flash.",
        prologue: [
            {
                speaker: "Aoi Todo",
                charKey: "todo",
                avatar: "💪",
                title: "Kyoto Grade 1 / 東堂葵",
                side: "left",
                text: "Answer me one question, Itadori! What is your type of woman?! If you give me a boring answer, I'll beat you half to death right here!"
            },
            {
                speaker: "Yuji Itadori",
                charKey: "yuji",
                avatar: "🥊",
                title: "Tokyo Jujutsu High / 虎杖悠仁",
                side: "left",
                text: "What kind of question is that right now?! Well... a tall girl with a big ass... like Jennifer Lawrence, I guess?"
            },
            {
                speaker: "Aoi Todo",
                charKey: "todo",
                avatar: "💪",
                title: "Kyoto Grade 1 / 東堂葵",
                side: "left",
                text: "Takada-chan... It's him. MY BEST FRIEND! (親友 - Burazā!) We walked through middle school together! Our youth was radiant!"
            },
            {
                speaker: "Jogo",
                charKey: "jogo",
                avatar: "🌋",
                title: "Disaster Curse / 漏瑚",
                side: "right",
                text: "Insolent brats chatting like fools! The earth boils beneath our feet! Die in flames!"
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: Brotherly Evaluation",
                battlefield: "jjk_high",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "todo",
                enemyName: "Aoi Todo",
                difficulty: "medium",
                objective: "Spar with Aoi Todo in the sacred courtyard to master the rhythm of cursed energy!",
                midBattleQuotes: [
                    { hpThreshold: 65, speaker: "Todo", charKey: "todo", text: "Listen well, brother! Divergent Fist is a failure born from your cursed energy lagging behind. Unleash impact and energy simultaneously!", color: "#fbbf24" },
                    { hpThreshold: 30, speaker: "Yuji", charKey: "yuji", text: "I can feel it... the delay between my fist and my cursed energy is vanishing!", color: "#38bdf8" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: The Sparks of Black Flash",
                battlefield: "dagon_beach",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "jogo",
                enemyName: "Jogo",
                difficulty: "hard",
                objective: "Team up with Todo's Boogie Woogie and strike the volcanic curse with consecutive Black Flashes!",
                midBattleQuotes: [
                    { hpThreshold: 75, speaker: "Jogo", charKey: "jogo", text: "Insects! Coffin of the Iron Mountain! Molten rock shall incinerate your bones!", color: "#ef4444" },
                    { hpThreshold: 45, speaker: "Todo", charKey: "todo", text: "Clap! Boogie Woogie! The sound of the Gion Shoja bells echoes the impermanence of all things... but we are the exception!", color: "#fbbf24" },
                    { hpThreshold: 20, speaker: "Yuji", charKey: "yuji", text: "Space distorts... physical impact and cursed energy collide within 0.000001 seconds... BLACK FLASH! (黒閃!)", color: "#38bdf8" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Aoi Todo",
                charKey: "todo",
                avatar: "💪",
                title: "Kyoto Grade 1 / 東堂葵",
                side: "left",
                text: "Four consecutive Black Flashes! Brother, you have crossed the threshold into the realm of the chosen!"
            },
            {
                speaker: "Satoru Gojo",
                charKey: "gojo",
                avatar: "👁️",
                title: "The Strongest / 五条悟",
                side: "right",
                text: "Hollow Technique: Purple! Look at that massive forest crater. Whoops, did I overdo it again?"
            }
        ]
    },
    {
        id: 4,
        arc: "Hidden Inventory / Premature Death Arc (懐玉・玉折編)",
        title: "Chapter 4: The Honored One",
        subtitle: "Tomb of the Star Sanctum to Jujutsu High",
        battlefield: "star_tomb",
        bossKey: "toji",
        playerKey: "gojo",
        reward: 3500,
        summary: "In 2006, Second-Year Satoru Gojo and Suguru Geto are tasked with protecting the Star Plasma Vessel Riko Amanai. The Sorcerer Killer Toji Fushiguro ambushes them, piercing Gojo's brain and triggering the most legendary spiritual awakening in sorcery history.",
        prologue: [
            {
                speaker: "Teen Satoru Gojo",
                charKey: "gojo",
                avatar: "👁️",
                title: "Second Year / 五条悟",
                side: "left",
                text: "Suguru and I are the strongest. Don't worry, Riko-chan. No bounty hunter in Japan can pierce my Infinity."
            },
            {
                speaker: "Toji Fushiguro",
                charKey: "toji",
                avatar: "🗡️",
                title: "Sorcerer Killer / 伏黒甚爾",
                side: "right",
                text: "Gojo Satoru... the first person in four hundred years born with both Six Eyes and Limitless. You've kept your technique active for three straight days without sleep. Your senses are completely dull."
            },
            {
                speaker: "Teen Satoru Gojo",
                charKey: "gojo",
                avatar: "👁️",
                title: "Second Year / 五条悟",
                side: "left",
                text: "A monkey without cursed energy? You think that rusty dagger can touch me?"
            },
            {
                speaker: "Toji Fushiguro",
                charKey: "toji",
                avatar: "🗡️",
                title: "Sorcerer Killer / 伏黒甚爾",
                side: "right",
                text: "The Inverted Spear of Heaven forcefully nullifies any cursed technique. Let's see your Infinity bend to this!"
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: Ambush at the Sanctum",
                battlefield: "star_tomb",
                playerChar: "gojo",
                playerName: "Teen Satoru Gojo",
                enemyChar: "toji",
                enemyName: "Toji Fushiguro",
                difficulty: "hard",
                objective: "Defend against Toji's blinding zero-cursed-energy speed and the Inverted Spear of Heaven!",
                midBattleQuotes: [
                    { hpThreshold: 70, speaker: "Toji", charKey: "toji", text: "Zero cursed energy makes me completely invisible to your Six Eyes! You're relying entirely on your eyes, boy!", color: "#94a3b8" },
                    { hpThreshold: 35, speaker: "Gojo", charKey: "gojo", text: "Limitless Lapse: Blue! Max output! I'll crush you into the ground!", color: "#38bdf8" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: Throughout Heaven and Earth",
                battlefield: "jjk_high",
                playerChar: "gojo",
                playerName: "Awakened Satoru Gojo",
                enemyChar: "toji",
                enemyName: "Toji Fushiguro",
                difficulty: "master",
                objective: "Awaken the Reverse Cursed Technique and unleash the secret imaginary mass Hollow Purple!",
                midBattleQuotes: [
                    { hpThreshold: 85, speaker: "Toji", charKey: "toji", text: "Gojo Satoru...?! You're alive?! My blade pierced your carotid artery and drove into your skull!", color: "#ef4444" },
                    { hpThreshold: 60, speaker: "Gojo", charKey: "gojo", text: "Yo. It's been a while. When you stabbed my brain, I poured 100% of my consciousness into the Reverse Cursed Technique! Negative times negative creates positive energy! I get it now... I finally understand everything!", color: "#c084fc" },
                    { hpThreshold: 35, speaker: "Gojo", charKey: "gojo", text: "Throughout heaven and earth, I alone am the honored one. (天上天下唯我独尊)", color: "#fbbf24" },
                    { hpThreshold: 15, speaker: "Gojo", charKey: "gojo", text: "Take the amplified Blue and the reversal Red... Push out an imaginary mass... Hollow Technique: Purple! (虚式「茈」)", color: "#a855f7" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Toji Fushiguro",
                charKey: "toji",
                avatar: "🗡️",
                title: "Sorcerer Killer / 伏黒甚爾",
                side: "right",
                text: "Something felt off... In the end, I wanted to deny everything the Zen'in clan stood for. In two or three years... my kid will be sold to the Zen'in clan. Do whatever you want with him."
            },
            {
                speaker: "Suguru Geto",
                charKey: "geto",
                avatar: "☸️",
                title: "Special Grade / 夏油傑",
                side: "left",
                text: "Satoru... Are you the strongest because you're Satoru Gojo? Or are you Satoru Gojo because you're the strongest?"
            }
        ]
    },
    {
        id: 5,
        arc: "Shibuya Incident — Part 1: Seal the Strongest (渋谷事変 - 降霊・封印)",
        title: "Chapter 5: The 0.2 Second Domain",
        subtitle: "Tokyo Metro B5F Platform to Shibuya Station",
        battlefield: "tokyo_subway",
        bossKey: "jogo",
        playerKey: "gojo",
        reward: 4500,
        summary: "October 31st, 19:00. The curtain drops over Shibuya, trapping hundreds of thousands of civilians. Satoru Gojo descends alone into the packed B5F subway platform, facing an ambush designed specifically to neutralize him through the cursed artifact Prison Realm.",
        prologue: [
            {
                speaker: "Jogo",
                charKey: "jogo",
                avatar: "🌋",
                title: "Disaster Curse / 漏瑚",
                side: "right",
                text: "October 31st, 19:00, Shibuya. The curtain has fallen! We packed thousands of non-sorcerers onto the B5F platform! You cannot expand your domain or use Hollow Purple without turning all of Tokyo into ground meat, Gojo Satoru!"
            },
            {
                speaker: "Satoru Gojo",
                charKey: "gojo",
                avatar: "👁️",
                title: "The Strongest / 五条悟",
                side: "left",
                text: "You really think surrounding me with civilians is enough to hold me back? You're underestimating the Six Eyes. Next."
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: Bloodbath on B5F",
                battlefield: "tokyo_subway",
                playerChar: "gojo",
                playerName: "Satoru Gojo",
                enemyChar: "jogo",
                enemyName: "Jogo & Disaster Curses",
                difficulty: "hard",
                objective: "Exorcise the disaster curse vanguard using pure cursed energy reinforcement without hurting innocent civilians!",
                midBattleQuotes: [
                    { hpThreshold: 70, speaker: "Jogo", charKey: "jogo", text: "Domain Amplification! If we coat our bodies in empty domains, we can neutralize his Limitless barrier!", color: "#ef4444" },
                    { hpThreshold: 35, speaker: "Gojo", charKey: "gojo", text: "You think that pathetic mist can stop me? You're out of your league, volcanic head.", color: "#38bdf8" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: The Prison Realm Clasp",
                battlefield: "tokyo_subway",
                playerChar: "gojo",
                playerName: "Satoru Gojo",
                enemyChar: "geto",
                enemyName: "Kenjaku (Pseudo-Geto)",
                difficulty: "master",
                objective: "Deploy the legendary 0.2-second Unlimited Void to paralyze transfigured humans before the Prison Realm opens!",
                midBattleQuotes: [
                    { hpThreshold: 80, speaker: "Gojo", charKey: "gojo", text: "Domain Expansion: 0.2 Second Unlimited Void! (0.2秒の無量空処) In 0.2 seconds, 299 seconds of infinite information flooded every civilian's brain! That gives me 299 seconds to slaughter every curse!", color: "#38bdf8" },
                    { hpThreshold: 45, speaker: "Kenjaku", charKey: "geto", text: "Good evening, Satoru. (よお、悟)", color: "#a855f7" },
                    { hpThreshold: 20, speaker: "Gojo", charKey: "gojo", text: "Suguru...?! No... My Six Eyes tell me your body, your cursed energy is Suguru Geto... but my soul knows otherwise! WHO THE HELL ARE YOU?!", color: "#ef4444" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Kenjaku",
                charKey: "geto",
                avatar: "🧠",
                title: "Ancient Curse User / 羂索",
                side: "right",
                text: "My name is Kenjaku. The Prison Realm is sealed. Sleep well, Satoru Gojo. The new era will be born without the Strongest."
            },
            {
                speaker: "Satoru Gojo",
                charKey: "gojo",
                avatar: "👁️",
                title: "The Strongest (Sealed) / 五条悟",
                side: "left",
                text: "I have faith in my students. You will regret this, Kenjaku."
            }
        ]
    },
    {
        id: 6,
        arc: "Shibuya Incident — Part 2: King of Curses (渋谷事変 - 業火・変身)",
        title: "Chapter 6: Stand Proud",
        subtitle: "Shibuya Ground Zero Crater to Dogenzaka",
        battlefield: "shibuya_crater",
        bossKey: "jogo",
        playerKey: "sukuna",
        reward: 5500,
        summary: "Force-fed fifteen fingers, Ryomen Sukuna awakens in Shibuya. After effortlessly obliterating Jogo with his own flame technique, the King of Curses levels Shibuya with Malevolent Shrine, while Yuji faces Mahito in their climactic philosophical showdown.",
        prologue: [
            {
                speaker: "Jogo",
                charKey: "jogo",
                avatar: "🌋",
                title: "Disaster Curse / 漏瑚",
                side: "right",
                text: "Sukuna-sama! You have ingested fifteen fingers! Please lead the curses to our rightful kingdom!"
            },
            {
                speaker: "Ryomen Sukuna",
                charKey: "sukuna",
                avatar: "👁️",
                title: "King of Curses / 両面宿儺",
                side: "left",
                text: "Stand up, Jogo. If you can land a single blow on me, I will do as you say and slaughter every human in Shibuya."
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: The Fire Arrow (Fūga)",
                battlefield: "shibuya_crater",
                playerChar: "sukuna",
                playerName: "Ryomen Sukuna",
                enemyChar: "jogo",
                enemyName: "Jogo",
                difficulty: "hard",
                objective: "Toy with Jogo's maximum output Maximum: Meteor before incinerating him with the divine flame arrow!",
                midBattleQuotes: [
                    { hpThreshold: 75, speaker: "Jogo", charKey: "jogo", text: "Maximum: Meteor! (極ノ番「隕石」) If this strikes Shibuya, nothing will remain!", color: "#ef4444" },
                    { hpThreshold: 40, speaker: "Sukuna", charKey: "sukuna", text: "The moonlight is radiant tonight. Let me show you what real flames look like. Open. (■ 開 - Fūga)", color: "#fbbf24" },
                    { hpThreshold: 15, speaker: "Sukuna", charKey: "sukuna", text: "Stand proud, Jogo. You are strong. (誇れ、オマエは強い)", color: "#ffd700" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: The 'I'm You' Clash",
                battlefield: "shibuya_crater",
                playerChar: "yuji",
                playerName: "Yuji Itadori",
                enemyChar: "mahito",
                enemyName: "Mahito (Instant Spirit Body)",
                difficulty: "master",
                objective: "Exorcise Mahito's ultimate evolved form Instant Spirit Body of Distorted Killing!",
                midBattleQuotes: [
                    { hpThreshold: 80, speaker: "Mahito", charKey: "mahito", text: "I have arrived at the truth! The true essence of the soul! Instant Spirit Body of Distorted Killing! (遍殺即霊体)", color: "#a855f7" },
                    { hpThreshold: 45, speaker: "Yuji", charKey: "yuji", text: "I'm you, Mahito. I didn't want to admit it. But now I understand. I don't need a grand reason to kill you.", color: "#38bdf8" },
                    { hpThreshold: 15, speaker: "Yuji", charKey: "yuji", text: "If you're reborn in a hundred years, I'll kill you. If you change your name and form, I'll kill you again. That is my role in this story.", color: "#38bdf8" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Jogo",
                charKey: "jogo",
                avatar: "🌋",
                title: "Disaster Curse / 漏瑚",
                side: "right",
                text: "What is this...? Curses don't cry tears..."
            },
            {
                speaker: "Ryomen Sukuna",
                charKey: "sukuna",
                avatar: "👁️",
                title: "King of Curses / 両面宿儺",
                side: "left",
                text: "Don't ask me. I don't know either."
            },
            {
                speaker: "Kenjaku",
                charKey: "geto",
                avatar: "🧠",
                title: "Ancient Curse User / 羂索",
                side: "right",
                text: "Thank you for cultivating such a marvelous cursed spirit for me, Itadori-kun. Uzumaki extraction complete."
            }
        ]
    },
    {
        id: 7,
        arc: "Culling Game Arc (死滅回游編)",
        title: "Chapter 7: Idle Death Gamble & Sendai Colony",
        subtitle: "Tokyo No. 1 Colony to Sendai Barrier Colosseum",
        battlefield: "culling_barrier",
        bossKey: "mahito",
        playerKey: "hakari",
        reward: 7000,
        summary: "Kenjaku activates the Culling Game across ten barrier colonies. Third-year Kinji Hakari rides infinite Jackpot immortality in Tokyo No. 1, while Special Grade Yuta Okkotsu tears through a four-way deadlocked colony in Sendai to free Gojo.",
        prologue: [
            {
                speaker: "Kogane",
                charKey: "sukuna",
                avatar: "🐝",
                title: "Culling Game Arbiter / コガネ",
                side: "right",
                text: "Attention Players Kinji Hakari and Yuta Okkotsu! You have entered the Culling Game colonies! The survival deathmatch has begun!"
            },
            {
                speaker: "Kinji Hakari",
                charKey: "hakari",
                avatar: "🎰",
                title: "Jackpot Gambler / 秤金次",
                side: "left",
                text: "You feel that pulse?! In life, it's all about FEVER! If you don't gamble your soul, you're already dead! Domain Expansion: Idle Death Gamble! (坐殺博徒)"
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: 4 Minutes & 11 Seconds of Immortality",
                battlefield: "culling_barrier",
                playerChar: "hakari",
                playerName: "Kinji Hakari",
                enemyChar: "toji",
                enemyName: "Colony Sorcerer Assassin",
                difficulty: "hard",
                objective: "Hit the 777 Jackpot and unleash infinite cursed energy overflow during the immortal music phase!",
                midBattleQuotes: [
                    { hpThreshold: 75, speaker: "Hakari", charKey: "hakari", text: "JACKPOT 777! The romance theme song is blasting! Infinite cursed energy is flooding every cell of my body!", color: "#fbbf24" },
                    { hpThreshold: 35, speaker: "Hakari", charKey: "hakari", text: "For 4 minutes and 11 seconds, Kinji Hakari is completely immortal! Your attacks can't scratch me!", color: "#ffd700" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: Authentic Mutual Love in Sendai",
                battlefield: "sendai_colosseum",
                playerChar: "yuta",
                playerName: "Yuta Okkotsu",
                enemyChar: "geto",
                enemyName: "Sendai Colony Champions",
                difficulty: "master",
                objective: "Unleash Queen of Curses Rika and Authenticate Mutual Love with an arsenal of copied cursed techniques!",
                midBattleQuotes: [
                    { hpThreshold: 80, speaker: "Yuta", charKey: "yuta", text: "Sensei had to kill his best friend with his own hands... I won't let him bear that loneliness ever again. I will get all 400 points myself.", color: "#38bdf8" },
                    { hpThreshold: 45, speaker: "Yuta", charKey: "yuta", text: "Come, Rika! Don't hold back! Domain Expansion: Authentic Mutual Love! (真贋相愛)", color: "#c084fc" },
                    { hpThreshold: 20, speaker: "Yuta", charKey: "yuta", text: "Every katana planted in this soil carries a copied cursed technique! Thin-Ice Missile Strike!", color: "#00e5ff" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Yuta Okkotsu",
                charKey: "yuta",
                avatar: "💍",
                title: "Special Grade / 乙骨憂太",
                side: "left",
                text: "We secured the points and rules. Hana Kurusu and Angel have joined us. The back of the Prison Realm is ready to be opened."
            },
            {
                speaker: "Kinji Hakari",
                charKey: "hakari",
                avatar: "🎰",
                title: "Jackpot Gambler / 秤金次",
                side: "left",
                text: "The fever is boiling over! When Gojo-sensei steps out of that box, Sukuna and Kenjaku won't know what hit 'em!"
            }
        ]
    },
    {
        id: 8,
        arc: "Shinjuku Showdown — Battle of the Strongest (人魔境新宿決戦)",
        title: "Chapter 8: The Battle of the Strongest",
        subtitle: "Shinjuku Zenith Skyscraper to Ground Zero",
        battlefield: "shinjuku_zenith",
        bossKey: "sukuna",
        playerKey: "gojo",
        reward: 10000,
        summary: "December 24th, Shinjuku. The Prison Realm is shattered and Satoru Gojo returns. Facing twenty-finger Ryomen Sukuna armed with the Ten Shadows technique, the two godlike titans clash in the greatest battle in the history of Jujutsu sorcery.",
        prologue: [
            {
                speaker: "Yuji Itadori",
                charKey: "yuji",
                avatar: "🥊",
                title: "Student of Gojo / 虎杖悠仁",
                side: "left",
                text: "Gojo-sensei... Sukuna has all twenty fingers and Megumi's Ten Shadows technique. Can you win?"
            },
            {
                speaker: "Satoru Gojo",
                charKey: "gojo",
                avatar: "👁️",
                title: "The Strongest / 五条悟",
                side: "left",
                text: "Nah, I'd win. (勝つさ)"
            },
            {
                speaker: "Satoru Gojo",
                charKey: "gojo",
                avatar: "👁️",
                title: "The Strongest / 五条悟",
                side: "left",
                text: "Let's get this party started, Sukuna! 200% Hollow Technique: PURPLE!"
            },
            {
                speaker: "Ryomen Sukuna",
                charKey: "sukuna",
                avatar: "👁️",
                title: "King of Curses / 両面宿儺",
                side: "right",
                text: "You're merely a fish on my cutting board that wriggles slightly more than the others. Domain Expansion: Malevolent Shrine!"
            },
            {
                speaker: "Satoru Gojo",
                charKey: "gojo",
                avatar: "👁️",
                title: "The Strongest / 五条悟",
                side: "left",
                text: "Domain Expansion: Unlimited Void!"
            }
        ],
        turns: [
            {
                turnNumber: 1,
                name: "Turn 1: Unlimited Void vs Malevolent Shrine",
                battlefield: "shinjuku_zenith",
                playerChar: "gojo",
                playerName: "Satoru Gojo",
                enemyChar: "sukuna",
                enemyName: "Ryomen Sukuna",
                difficulty: "master",
                objective: "Survive the domain clashes, compress your barrier to a basketball size, and land Black Flash on Sukuna!",
                midBattleQuotes: [
                    { hpThreshold: 75, speaker: "Sukuna", charKey: "sukuna", text: "My domain has no barrier! The sure-hit extends up to 200 meters, cleaving the exterior of your sphere to dust!", color: "#ef4444" },
                    { hpThreshold: 50, speaker: "Gojo", charKey: "gojo", text: "Simple Domain! Falling Blossom Emotion! Flip the barrier conditions! Inside is soft, outside is unbreakable!", color: "#38bdf8" },
                    { hpThreshold: 25, speaker: "Gojo", charKey: "gojo", text: "Black Flash! The sparks of black do not choose who to bless... but today they answer the Strongest!", color: "#00e5ff" }
                ]
            },
            {
                turnNumber: 2,
                name: "Turn 2: The World-Cutting Slash & True Heian Form",
                battlefield: "shinjuku_zenith",
                playerChar: "gojo",
                playerName: "Awakened Satoru Gojo",
                enemyChar: "sukuna",
                enemyName: "Ryomen Sukuna (Heian Form)",
                difficulty: "master",
                objective: "Face the King of Curses as he deploys the space-cutting slash and transforms into his 4-armed Heian Era True Form!",
                midBattleQuotes: [
                    { hpThreshold: 80, speaker: "Sukuna", charKey: "sukuna", text: "Mahoraga's wheel adapted to your Infinity! The target was not you, Gojo Satoru. The target was space itself, the very fabric of existence! The World-Cutting Slash (世界を断つ斬撃)!", color: "#ef4444" },
                    { hpThreshold: 45, speaker: "Sukuna", charKey: "sukuna", text: "You were magnificent, Gojo Satoru. I shall never forget you as long as I live. (天晴れだ、五条悟。生涯貴様を忘れることはあるまい)", color: "#fbbf24" },
                    { hpThreshold: 20, speaker: "Sukuna", charKey: "sukuna", text: "I revert to my true four-armed Heian King of Curses form! The age of sorcery is dead. Bow before the King!", color: "#ef4444" }
                ]
            }
        ],
        epilogue: [
            {
                speaker: "Yuji Itadori",
                charKey: "yuji",
                avatar: "🥊",
                title: "Student of Gojo / 虎杖悠仁",
                side: "left",
                text: "Gojo-sensei's will lives on in all of us. Even if you cut through space, our bonds can never be severed! Sukuna, you are going down!"
            },
            {
                speaker: "Ryomen Sukuna",
                charKey: "sukuna",
                avatar: "👁️",
                title: "True Heian Form / 両面宿儺",
                side: "right",
                text: "Fascinating, brat. Let us see if your newborn soul can withstand the eternal wrath of the Heian Era!"
            }
        ]
    }
];

// Helper methods for Story Mode Manager
class StoryManager {
    static getChapters() {
        return STORY_CHAPTERS;
    }

    static getChapter(id) {
        if (!id) return STORY_CHAPTERS[0];
        const numId = parseInt(id.toString().replace(/\D/g, ''), 10);
        return STORY_CHAPTERS.find(c => c.id === id || c.id === numId) || STORY_CHAPTERS[0];
    }

    static getTurn(chapterId, turnIndex = 0) {
        const chapter = this.getChapter(chapterId);
        if (!chapter || !chapter.turns || !chapter.turns[turnIndex]) {
            return chapter ? chapter.turns[0] : null;
        }
        return chapter.turns[turnIndex];
    }

    static getNextChapterId(chapterId) {
        const chapter = this.getChapter(chapterId);
        if (!chapter) return null;
        const nextId = chapter.id + 1;
        const nextChap = STORY_CHAPTERS.find(c => c.id === nextId);
        return nextChap ? nextChap.id : null;
    }

    static getTotalChapters() {
        return STORY_CHAPTERS.length;
    }
}

if (typeof window !== 'undefined') {
    window.STORY_CHAPTERS = STORY_CHAPTERS;
    window.StoryManager = StoryManager;
}
