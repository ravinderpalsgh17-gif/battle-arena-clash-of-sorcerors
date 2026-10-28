# Project: Battle Arena: Clash of Sorcerors

## Project Links & Paths
- **Live Deployment (GitHub Pages)**: https://ravinderpalsgh17-gif.github.io/battle-arena-clash-of-sorcerors/
- **GitHub Repository**: https://github.com/ravinderpalsgh17-gif/battle-arena-clash-of-sorcerors.git
- **Local Project Path**: `C:\Users\W11\battle-arena-clash-of-sorcerors`
- **Main Entrypoint**: `index.html` (Launcher: `play_game.bat`, Push Script: `push_to_github.bat`)

## Overview & Architecture
4K Ultra 3D Open World WebGL Jujutsu Kaisen fighting arena game built with Three.js:
- 16 canonical characters with procedural anime rigs and custom mudras/stances.
- Real-time Domain Expansions (Unlimited Void, Malevolent Shrine, Chimera Shadow Garden, Coffin of the Iron Mountain).
- Dynamic 3D Combat Camera system (Action Orbit, Third-Person, Overview).
- Local 2-Player Split Duel PvP mode & shareable room challenge invites.

## Latest Update Log
- **Commit `b9ecbed` (2026-10-28 20:05:38 +0530)**:
  - **Message**: *Fix character arm direction: correct elbow bends and shoulder rotations to point forward across idle, run, guard, attacks, and mudras*
  - **Modified**: `js/character3d.js`
  - **Summary**:
    - **Guard Stance**: Implemented forward crossed X-Guard protecting chest and face, plus Sukuna's lower arms double X-barrier.
    - **Combat Stances & Mudras**: Re-oriented upper arm and forearm rotations across idle breathing stance, run pump, punches, skills, domain mudras, and jump cycles so elbows bend naturally forward toward the enemy.
