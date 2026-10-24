# ⚔️ Battle Arena: Clash of Sorcerors

An adrenaline-pumping 2D fighting arena game featuring mythological and cursed deities battling for cosmic supremacy. Built with pure HTML5 Canvas, modern JavaScript (ES6+), procedural Web Audio synthesis, and dynamic particle systems.

---

## 🎮 Playable Characters & Unique Combat Kits

The game features **5 distinct combatants**, starting with the default free character **Yuji**, while the remaining four gods can be unlocked using in-game battle points earned from victories, combos, and tournament runs.

### 1. 🥊 Yuji Itadori — *The Divine Vessel* (FREE / Default)
> Superhuman martial artist channeling lethal divergent cursed energy.
* **Basic Attack (`J` / `Z`)**: **Divergent Fist** — Heavy martial strike followed a fraction of a second later by a delayed cursed shockwave that detonates for bonus burst damage and knockback.
* **Skill 1 (`K` / `X`)**: **Cursed Rush** — High-speed blur dash delivering a rapid-fire 4-punch combo.
* **Skill 2 (`L` / `C`)**: **Slaughter Demon** — Forward aerial somersault knife carving that inflicts bleeding.
* **Ultimate (`U` / `V`)**: **Black Flash (Kokusen)** — Warps space within 0.000001 seconds, generating jagged black and crimson lightning for an earth-shattering critical blow (2.5x damage + screen shake).
* **Passive — *Unbreakable Resolve***: When health drops below 35%, automatically gains +30% armor damage reduction and +20% movement speed.

---

### 2. ⚡ Zeus — *Lord of Olympus* (1,000 Points)
> Supreme Greek sky father commanding piercing lightning and divine thunderbolts.
* **Basic Attack (`J` / `Z`)**: **Thunder Lance** — Hurls a piercing bolt of lightning across the entire screen.
* **Skill 1 (`K` / `X`)**: **Chain Spark** — Discharges a homing electrical orb that seeks out and stuns the opponent.
* **Skill 2 (`L` / `C`)**: **Aegis Storm** — Surrounds Zeus in a 360-degree rotating electrical cyclone that deflects projectiles and electrocutes rushers.
* **Ultimate (`U` / `V`)**: **Wrath of Olympus** — Calls down 5 consecutive titanic thunderbolts that crash across the arena.
* **Passive — *Static Overcharge***: Every 4th attack inflicts a temporary paralyzing stun.

---

### 3. 🐺 Anubis — *Judge of Souls* (2,200 Points)
> Jackal-headed Egyptian deity of the Underworld and guardian of the Scales of Ma'at.
* **Basic Attack (`J` / `Z`)**: **Soul Siphon** — Fires a ghostly jackal skull that absorbs enemy life force and heals Anubis for 40% of the damage dealt.
* **Skill 1 (`K` / `X`)**: **Jackal Claws** — A low shadow sweep that shreds the opponent and inflicts lingering decay curse damage.
* **Skill 2 (`L` / `C`)**: **Tomb Quicksand** — Opens a swirling vortex of underworld sand beneath the opponent that slows, grounds, and damages them.
* **Ultimate (`U` / `V`)**: **Judgment of Ma'at** — Summons the golden Scales of Truth; reaps the opponent's soul, dealing massive true damage and restoring Anubis's health.
* **Passive — *Soul Siphon Aura***: Restores 25% of all damage dealt directly back into Anubis's health pool.

---

### 4. 🐵 Sun Wukong — *The Great Sage Heaven's Equal* (3,800 Points)
> The mythical Monkey King with 72 earthly transformations and the legendary Ruyi staff.
* **Basic Attack (`J` / `Z`)**: **Ruyi Expansion** — Thrusts his golden staff, extending it dynamically across 70% of the arena with heavy knockback.
* **Skill 1 (`K` / `X`)**: **Nimbus Somersault** — Flips high into the air on a golden cloud before crashing down with a downward staff slam.
* **Skill 2 (`L` / `C`)**: **Hair Clone Decoy** — Leaves a fighting shadow clone while Wukong dashes unseen behind the enemy.
* **Ultimate (`U` / `V`)**: **Heaven Havoc (72 Styles)** — Summons three illusionary clones that converge from all angles in a synchronized frenzy.
* **Passive — *Immortal Stone Body***: Immune to flinching or knockback while executing attacks, plus constant 1.5% max HP regeneration every 2 seconds.

---

### 5. ⛩️ Ryomen Sukuna — *King of Curses* (5,500 Points)
> The undisputed calamity god of jujutsu, cutting all existence into ribbons.
* **Basic Attack (`J` / `Z`)**: **Dismantle (Kai)** — Fires swift, invisible flying spatial slashes in an X-pattern.
* **Skill 1 (`K` / `X`)**: **Cleave (Hachi)** — Teleports directly in front of the enemy, grabbing them and executing an armor-piercing slash scaled to the opponent's maximum HP.
* **Skill 2 (`L` / `C`)**: **Fuga (Divine Flame Arrow)** — Draws and shoots a thermal fire arrow that triggers an incinerating explosion upon impact.
* **Ultimate (`U` / `V`)**: **Malevolent Shrine (Fukuma Mizushi)** — Expands an open barrier domain; blood moon rises and relentless slashes carve the entire arena for 3.5 seconds.
* **Passive — *Reverse Cursed Technique***: Critical strikes and special attacks restore 20% of damage dealt when under 40% HP.

---

## 🕹️ Controls

### Player 1 (Default / Solo)
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

### Player 2 (Local PvP)
| Action | Keybinding |
|---|---|
| **Move Left / Right** | `←` / `→` (Arrow Keys) |
| **Jump** | `↑` (Up Arrow) |
| **Block / Guard** | `↓` (Down Arrow) |
| **Basic Attack** | `Numpad 1` or `1` |
| **Skill 1** | `Numpad 2` or `2` |
| **Skill 2** | `Numpad 3` or `3` |
| **Ultimate** | `Numpad 5` or `5` / `0` |

### 📱 Mobile & Touch Controls (Play Without a Keyboard!)
The game includes a full built-in virtual arcade controller overlay that activates on touchscreens and mobile devices (or can be toggled using the **📱 Touch: ON** button in the top navigation bar):

| On-Screen Button | Action | Description |
|---|---|---|
| **`◀` / `▶`** | **Move Left / Right** | Smooth directional thumb movement |
| **`▲ JUMP`** | **Jump** | Aerial somersault leap |
| **`[S]`** | **Guard / Block** | Hold to guard against enemy combos |
| **`[J]`** | **Basic Attack** | Primary martial strike / ranged projectile |
| **`[K]`** | **Skill 1** | First unique combat technique |
| **`[L]`** | **Skill 2** | Second unique combat technique |
| **`[U]`** | **Ultimate (100 Energy)** | Cataclysmic finisher (glows with gold flames when ready!) |
| **`⏸`** | **Pause** | Access pause & restart options |

---

## 🪙 Economy & In-Game Points

* **Starter Points**: New players start with **0 Battle Points** (Start strictly at 0 coins; earn all points through combat!).
* **Earn Points**:
  * Match Victory: **300 – 600 Points** (scales with difficulty: Easy, Medium, Hard, Deity).
  * Combo Bonuses: Up to **+200 Points** for high hit chains.
  * Time Bonus: Bonus points for finishing rounds fast.
* **Persistent Save**: Points, unlocked deities, and match records are saved automatically to `localStorage`.
* **Fair Economy**: Points are earned strictly through skill in combat, tournament ladders, and combo execution (no cheat exploits).

---

## 🚀 How to Run Locally

No external build tools or installations are required! Simply:

1. Clone or download this repository:
   ```bash
   git clone https://github.com/<your-username>/battle-arena-clash-of-sorcerors.git
   cd battle-arena-clash-of-sorcerors
   ```
2. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Brave, Safari).
3. (Optional) Run via a local web server:
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   Then open `http://localhost:8000`.

---

## 🌟 Built With
* **HTML5 Canvas**: 60 FPS smooth rendering with dynamic letterbox scaling.
* **Web Audio API**: Procedural sound effects and synthesizer (zero external audio file dependency).
* **Vanilla JavaScript (ES6+)**: Modular physics, particle effects, and AI state machines.
* **CSS3 Flexbox & Grid**: Responsive arcade-styled UI with glowing cyberpunk/mythic aesthetics.
