# ⚔️ Battle Arena: Clash of Sorcerors

An adrenaline-pumping 2D fighting arena game featuring 16 legendary characters from **Jujutsu Kaisen**, ranked and balanced according to their canonical power levels, grades, and domain expansions. Built with pure HTML5 Canvas, modern JavaScript (ES6+), procedural Web Audio synthesis, and dynamic particle systems.

---

## 🎮 Playable Jujutsu Kaisen Roster & Power Scaling

The game features **16 iconic Jujutsu Kaisen sorcerers and special grade cursed spirits**, organized strictly by their canonical power hierarchy. Players start with two free characters (**Yuji Itadori** and **Nobara Kugisaki**), and can unlock more powerful sorcerers and curses using battle points earned in combat.

### 🌟 Tier 1: Starters (Grade 3 & Grade 1 Vessel)
1. **🥊 Yuji Itadori** (*The Divine Vessel*) — Free Starter
   * **Power Level**: Grade 1 / Awakened Vessel &bull; Rushdown Brawler
   * **Moves**: Divergent Fist (delayed curse impact), Cursed Rush, Manji Kick, Black Flash (Kokusen).
   * **Passive**: *Unbreakable Resolve* (30% damage reduction below 35% HP).

2. **🔨 Nobara Kugisaki** (*Straw Doll Sorcerer*) — Free Starter
   * **Power Level**: Grade 3 Sorcerer &bull; Zoner & Trap Specialist
   * **Moves**: Cursed Nail Hurl, Hairpin (Kanzashi detonation), Iron Hammer Smash, Resonance: Black Flash.
   * **Passive**: *Cursed Nail Embed* (Lodged nails inflict bleed damage).

---

### 🌙 Tier 2: Up-and-Coming Prodigies (Grade 2 & Semi-Grade 1)
3. **🐺 Megumi Fushiguro** (*Ten Shadows Prodigy*) — 200 Points
   * **Power Level**: Grade 2 Sorcerer &bull; Shikigami Summoner
   * **Moves**: Divine Dog Totality, Nue Thunder Wings, Shadow Submerge & Toad, Chimera Shadow Garden.
   * **Passive**: *Shadow Evasion* (Dashing into shadow grants invulnerability).

4. **🐼 Panda** (*Mutant Cursed Corpse*) — 350 Points
   * **Power Level**: Semi-Grade 1 Sorcerer &bull; Heavy Armor Tank
   * **Moves**: Heavy Boxing Hook, Gorilla Mode: Drumming Beat (Unblockable), Cannonball Slam, Gorilla Beatdown.
   * **Passive**: *Three Cores* (Survives lethal blow once with 140 HP).

---

### ⚡ Tier 3: Elite Sorcerers & Curse Brother (Grade 1 & Special Grade Womb)
5. **📐 Kento Nanami** (*7:3 Ratio Master*) — 500 Points
   * **Power Level**: Grade 1 Sorcerer &bull; Precision Critical Striker
   * **Moves**: Ratio Technique: 7:3 Cut, Collapse (Kawarawari), Overtime Cleave, Consecutive Black Flash (x4).
   * **Passive**: *Overtime Shift* (+35% damage boost below 40% HP).

6. **👏 Aoi Todo** (*Boogie Woogie Virtuoso*) — 700 Points
   * **Power Level**: Grade 1 Sorcerer &bull; 530,000 IQ Mindgames
   * **Moves**: Brute Force Straight, Boogie Woogie (instant position clap-swap!), Playful Cloud, Brotherly Black Flash.
   * **Passive**: *530,000 IQ* (Critical damage bonus after position swap).

7. **🩸 Choso** (*Blood Manipulation Elder*) — 900 Points
   * **Power Level**: Special Grade Cursed Womb #1 &bull; Long-Range Piercer
   * **Moves**: Blood Edge, Piercing Blood (supersonic laser), Supernova, Flowing Red Scale: Piercing Meteor.
   * **Passive**: *Toxic Blood* (All blood skills poison the enemy).

---

### 🗡️ Tier 4: Disaster Curses & Heavenly Restrictions (Special Grade)
8. **🗡️ Maki Zenin** (*The Demonic Monster*) — 1,100 Points
   * **Power Level**: Awakened Heavenly Restriction &bull; True Damage Blade
   * **Moves**: Split Soul Katana (true damage ignoring defense), Dragon Bone Blast, Air Surface Blitz, Carnage of the Zenin.
   * **Passive**: *Zero Cursed Energy* (Immune to lock-on, takes 25% less domain damage).

9. **⛓️ Toji Fushiguro** (*The Sorcerer Killer*) — 1,350 Points
   * **Power Level**: Special Grade Hunter &bull; Anti-Mage Assassin
   * **Moves**: Inverted Spear of Heaven (drains cursed energy & nullifies buffs), Fly Head Swarm, Playful Cloud Smash, Ghost Execution.
   * **Passive**: *Heavenly Restriction* (Blinding movement speed and high defense).

10. **🌋 Jogo** (*The Calamitous Volcano*) — 1,600 Points
    * **Power Level**: Special Grade Disaster Curse &bull; Pyromancy Zoner
    * **Moves**: Ember Insects (homing fireflies), Volcanic Geyser, Disaster Flames Palm, Maximum: Meteor.
    * **Passive**: *Disaster Heat Aura* (Continuous burning aura to nearby enemies).

11. **🪡 Mahito** (*The Shape of the Soul*) — 1,850 Points
    * **Power Level**: Special Grade Disaster Curse &bull; Soul Shaper
    * **Moves**: Soul Drill Arm, Body Repel, Polymorphic Soul Whip, Domain: Self-Embodiment of Perfection.
    * **Passive**: *Idle Transfiguration* (Rapid health regeneration between hits).

---

### 👑 Tier 5: Modern Monsters & Cursed Anomalies (Special Grade Sorcerers)
12. **🎰 Kinji Hakari** (*The Undying Gambler*) — 2,100 Points
    * **Power Level**: Special Grade Tier &bull; Restless Gambler
    * **Moves**: Rough Cursed Fist, Train Shutter Slam, Pachinko Ball Shot, Idle Death Gamble (JACKPOT!).
    * **Passive**: *Rough Cursed Edge* (Punches shred block) + *Jackpot Immortality* (6 seconds of infinite energy and 100 HP/s regeneration!).

13. **🌀 Suguru Geto (Kenjaku)** (*Master of Curses*) — 2,400 Points
    * **Power Level**: Special Grade Sorcerer &bull; Curse Manipulator
    * **Moves**: Cursed Staff Arc, Cursed Spirit Swarm, Antigravity System, Maximum: Uzumaki.
    * **Passive**: *Curse Absorption* (Absorbs energy whenever enemy uses a skill).

14. **💍 Yuta Okkotsu** (*The Prodigy of Curses*) — 2,700 Points
    * **Power Level**: Special Grade Sorcerer &bull; Boundless Energy & Rika
    * **Moves**: Boundless Katana Cleave, Cursed Speech ("DON'T MOVE!"), Rika Smash, Pure Love Beam.
    * **Passive**: *Reverse Cursed Output* (Passive health regeneration when energy > 50%).

---

### 🌌 Tier 6: Pinnacle of the Verse (The Strongest)
15. **👑 Ryomen Sukuna** (*King of Curses*) — 3,000 Points
    * **Power Level**: The Strongest in History &bull; Raid Boss Zoner
    * **Moves**: Dismantle (flying invisible cut), Cleave (durability grab), Fūga (Divine Flame Arrow), Domain: Malevolent Shrine.
    * **Passive**: *King's Aura* (Surrounding bleed aura + 30% hitstun resistance).

16. **👁️ Satoru Gojo** (*The Honored One*) — 3,000 Points
    * **Power Level**: The Strongest Modern Sorcerer &bull; Spatial Dominator
    * **Moves**: Lapse: Blue (vacuum attraction punch), Reversal: Red (repulsion blast), Teleport Axe Kick, Hollow Technique: Purple & Unlimited Void.
    * **Passive**: *Limitless Infinity Barrier* (Completely absorbs 1 hit every 6 seconds and slows enemy projectiles).

---

## 🕹️ Controls Guide

### Keyboard (Player 1)
| Action | Keybinding |
|---|---|
| **Move Left / Right** | `A` / `D` |
| **Jump** | `W` or `Space` |
| **Block / Guard** | `S` |
| **Basic Attack** | `J` or `Z` |
| **Skill 1** | `K` or `X` |
| **Skill 2** | `L` or `C` |
| **Ultimate (100 Energy)** | `U` or `V` |
| **Pause** | `Escape` or `P` |

### Keyboard (Player 2 Local PvP)
| Action | Keybinding |
|---|---|
| **Move Left / Right** | `←` / `→` (Arrow Keys) |
| **Jump** | `↑` (Up Arrow) |
| **Block / Guard** | `↓` (Down Arrow) |
| **Basic Attack** | `Numpad 1` or `1` |
| **Skill 1** | `Numpad 2` or `2` |
| **Skill 2** | `Numpad 3` or `3` |
| **Ultimate** | `Numpad 5` or `5` / `0` |

### 📱 Mobile On-Screen Touch Controls
The game features built-in virtual arcade buttons:
* **`◀` / `▶`**: Left / Right Movement D-Pad
* **`▲ JUMP`**: Jump
* **`[S]`**: Guard / Block
* **`[J]`**: Basic Attack
* **`[K]`**: Skill 1
* **`[L]`**: Skill 2
* **`[U]`**: Ultimate (Glows with energy when charged!)
* **`⏸`**: Pause Match
