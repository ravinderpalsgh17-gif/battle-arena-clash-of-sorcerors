# ⚔️ Battle Arena: Clash of Sorcerors — 3D Open World Edition

An adrenaline-pumping **3D Open World fighting arena game** featuring 16 legendary characters from **Jujutsu Kaisen**, ranked and balanced according to their canonical power levels, grades, and domain expansions. Built with **Three.js (WebGL 3D)**, hardware-accelerated procedural 3D character rigging, vast open-world environments, procedural Web Audio synthesis, and dynamic combat camera tracking.

---

## 🌟 Key 3D Features

### 🥋 Full 3D Characters with Procedural Anime Rigs
Every character in the 16-sorcerer roster is fully modeled and animated in 3D with distinct anime cel-shaded aesthetics, signature accessories, and hierarchical skeletal rigging:
* **Satoru Gojo**: 3D spiky white hair, blindfold (reveals Six Eyes during ultimate), shimmering translucent **Infinity Barrier sphere**, and rotating 3D **Lapse Blue** & **Reversal Red** energy orbs!
* **Ryomen Sukuna**: Open kimono with black obi sash, distinct facial & chest cursed tattoos, four glowing crimson eyes, and manifests 4 muscular arms in ultimate mode!
* **Yuji Itadori**: Athletic dark uniform with folded red hood, facial slit scars, and glowing pink Divergent Fist cursed knuckle trails!
* **Nobara Kugisaki**: Steel carpenter's claw hammer with wooden grip and flying 3D cursed nails!
* **Megumi Fushiguro**: Spiky sea-urchin hair, shadow puppet hand stances, and summoned 3D **Divine Dog (Totality)** shadow wolf companion!
* **Panda**: Giant 3D panda bear model with ears, snout, black eye patches, and brass knuckle armbands!
* **Kento Nanami**: Tan double-breasted suit, spotted blue tie, wire sunglasses, and 7:3 spotted cloth wrapped cleaver blade!
* **Toji Fushiguro**: Muscular physique in black compression shirt, coiled 3D **Cursed Spirit inventory worm** draped over shoulder, and the **Inverted Spear of Heaven**!
* **Aoi Todo**: Towering physique, samurai topknot hair, diagonal facial scar, and clapping stance!
* **Jogo**: Hunched cursed spirit robe, cyclops eye, and cone volcano chimney head spewing glowing molten lava and smoke!
* **Mahito**: Patchwork stitched skin, long grey twin-tail hair, and arm morphing into a curved 3D scythe blade!
* **Kinji Hakari**: Pompadour hairstyle, pachinko shutter doors, and prismatic Jackpot fever glow!
* **Suguru Geto**: Buddhist monk kesa robes, sweeping side fringe, and floating black/purple Uzumaki cursed sphere!
* **Yuta Okkotsu**: White Jujutsu High jacket, katana with scabbard, silver engagement ring, and the spectral Queen of Curses (Rika)!
* **Maki Zen'in**: Dark green high ponytail, glasses, and Dragon-Bone naginata spear!
* **Choso**: Dual twintails, dark blood stripe on nose bridge, and floating crimson blood convergence droplets!

### 🌍 Expansive 3D Open World Battleground
Fight across a continuous 3D open-world environment featuring distinct landmarks and zones:
1. **Central Sorcerer Grand Ring**: Paved stone arena circle with golden boundary and four-pointed Jujutsu arcane emblem.
2. **Jujutsu High Courtyard**: Massive scarlet Torii gates, glowing stone lanterns (*toro*), blooming Cherry Blossom (*sakura*) trees with drifting petals, and traditional dojo pagoda pavilions.
3. **Shinjuku Urban District**: Multi-story modern skyscrapers with illuminated window grids, asphalt streets with painted road lines, crosswalks, traffic barriers, and street lampposts with dynamic point lights.
4. **Shibuya Cursed Crater Ruins**: Blasted circular crater with glowing purple cursed fissure lines and shattered concrete slabs.
5. **Distant Tokyo Skyline**: Silhouetted skyscrapers along the perimeter horizon under an expansive starry sky dome with real-time shadow casting (`PCFSoftShadowMap`).

### 🌌 Live 3D Domain Expansions
When sorcerers unleash their Domain Expansions, the open world dynamically transforms in real-time:
* **Unlimited Void (Satoru Gojo)**: The world shifts into a cosmic starfield dome with deep blue celestial nebulae, orbiting gravitational rings, and an abyssal singularity.
* **Malevolent Shrine (Ryomen Sukuna)**: The sky turns blood-red, a crimson blood pool blankets the ground, and a giant horned demonic skull pagoda rises from the earth with floating dimensional cleave cuts.
* **Chimera Shadow Garden (Megumi Fushiguro)**: The earth melts into an abyssal shadow liquid pool with reaching shadow claws.
* **Coffin of the Iron Mountain (Jogo)**: The battlefield transforms into an active volcanic caldera with molten lava cracks and fiery rock spires.

### 🎥 Dynamic 3D Combat Camera System
Toggle between 3 distinct camera modes at any time with the `V` key or top-bar button:
1. **Action Orbit Cam (Default)**: Cinematic camera dynamically tracking the midpoint between both fighters in 3D space, intelligently zooming in during close melee combat and pulling back when fighters separate across the open arena.
2. **Third-Person Cam (Follow)**: Over-the-shoulder action RPG perspective following behind Player 1.
3. **Overview Cam (Bird's Eye)**: High-angle aerial view for tactical arena positioning.
* Features responsive camera shake during heavy hits, Black Flash critical strikes, and Domain Expansions!

---

## 🎮 Controls Guide

| Action | Player 1 (Solo / Versus) | Player 2 (Local PvP) | Mobile / Touch Virtual Controller |
|:---|:---:|:---:|:---:|
| **3D Movement** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> | <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | <kbd>▲</kbd> <kbd>▼</kbd> <kbd>◀</kbd> <kbd>▶</kbd> (3D D-Pad) |
| **Jump** | <kbd>Space</kbd> | <kbd>Numpad 0</kbd> | <kbd>⚡ JUMP</kbd> |
| **Guard / Block** | <kbd>Shift</kbd> | <kbd>Numpad .</kbd> | <kbd>S</kbd> (GUARD) |
| **Basic Attack** | <kbd>J</kbd> or <kbd>Z</kbd> | <kbd>Numpad 1</kbd> or <kbd>1</kbd> | <kbd>J</kbd> (ATK) |
| **Skill 1** | <kbd>K</kbd> or <kbd>X</kbd> | <kbd>Numpad 2</kbd> or <kbd>2</kbd> | <kbd>K</kbd> (SKILL 1) |
| **Skill 2** | <kbd>L</kbd> or <kbd>C</kbd> | <kbd>Numpad 3</kbd> or <kbd>3</kbd> | <kbd>L</kbd> (SKILL 2) |
| **Ultimate (100 Energy)** | <kbd>U</kbd> | <kbd>Numpad 5</kbd> or <kbd>5</kbd> | <kbd>U</kbd> (ULT) |
| **Toggle 3D Camera** | <kbd>V</kbd> | <kbd>V</kbd> | <kbd>🎥</kbd> (CAM) |
| **Pause Match** | <kbd>Esc</kbd> or <kbd>P</kbd> | <kbd>Esc</kbd> | <kbd>⏸</kbd> (PAUSE) |

---

## 🚀 How to Run

### Option 1: Quick Launch
Double-click `play_game.bat` in the repository root to launch immediately in your default browser.

### Option 2: Browser
Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
* Works 100% offline via local `js/lib/three.min.js` and includes automatic CDN fallback!

---

## 📦 Project Architecture

```
battle-arena-clash-of-sorcerors/
├── index.html            # Main HTML5 layout, UI screens & overlays
├── css/
│   └── style.css         # Cyberpunk/Arcade UI stylesheet & touch controller styles
├── js/
│   ├── lib/
│   │   └── three.min.js  # Local Three.js WebGL 3D engine (offline supported)
│   ├── character3d.js    # Procedural 3D character rigging, materials & animations
│   ├── world3d.js        # Open world 3D terrain, landmarks, lighting & live domains
│   ├── characters.js     # Character stats, move lore, power levels & passives
│   ├── fighter.js        # 3D Fighter physics, spatial hitboxes & state machine
│   ├── ai.js             # 3D combat AI with flanking, dodging & tactical ranging
│   ├── game.js           # Master 3D game loop, dynamic camera & 2D arcade HUD
│   ├── particles.js      # 3D-to-screen projected combat text, shockwaves & sparks
│   ├── audio.js          # Procedural Web Audio API sound effects & BGM
│   └── ui.js             # UI state manager, 3D character select preview & shop
├── play_game.bat         # One-click desktop launcher
└── README.md             # Documentation
```
