// Procedural Web Audio API Sound Engine for Battle Arena: Clash of Sorcerors
// Zero external assets required - 100% reliable sound effects and ambient combat audio

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.volume = 0.65;
        this.bgmPlaying = false;
        this.bgmInterval = null;
        this.init();
    }

    init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        } catch (e) {
            console.warn("AudioContext not supported or blocked", e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.bgmInterval) {
            this.stopBGM();
        } else if (!this.isMuted) {
            this.startBGM();
        }
        return this.isMuted;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    // --- Sound Generators ---

    // Standard punch / hit impact
    playHit(type = 'medium') {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        let startFreq = 160;
        let endFreq = 40;
        let duration = 0.12;
        let peakVol = 0.7 * this.volume;

        if (type === 'light') {
            startFreq = 220;
            endFreq = 80;
            duration = 0.08;
            peakVol = 0.5 * this.volume;
            osc.type = 'triangle';
        } else if (type === 'heavy') {
            startFreq = 110;
            endFreq = 25;
            duration = 0.22;
            peakVol = 0.9 * this.volume;
            osc.type = 'sawtooth';
        } else if (type === 'crit') {
            startFreq = 300;
            endFreq = 30;
            duration = 0.35;
            peakVol = 1.0 * this.volume;
            osc.type = 'sawtooth';
        } else {
            osc.type = 'sine';
        }

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), now + duration);

        gain.gain.setValueAtTime(peakVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);

        // Add noise crunch for heavy or critical
        if (type === 'heavy' || type === 'crit') {
            this.playNoise(duration * 0.8, peakVol * 0.5, 600);
        }
    }

    // White/Pink noise burst for explosions, sword slashes, crunch
    playNoise(duration = 0.15, vol = 0.4, cutoff = 1000) {
        if (this.isMuted || !this.ctx) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = cutoff;

        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(vol * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
    }

    // Whoosh / Swing
    playWhoosh() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.14);

        gain.gain.setValueAtTime(0.25 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
    }

    // Dash / Teleport
    playDash() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);

        gain.gain.setValueAtTime(0.3 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    // Black Flash - Iconic spatial distortion rumble + explosive detonation
    playBlackFlash() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        // Sub-bass rumble
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(90, now);
        sub.frequency.exponentialRampToValueAtTime(18, now + 0.5);
        subGain.gain.setValueAtTime(1.0 * this.volume, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        sub.connect(subGain);
        subGain.connect(this.ctx.destination);
        sub.start(now);
        sub.stop(now + 0.5);

        // High crackle spark
        const spark = this.ctx.createOscillator();
        const sparkGain = this.ctx.createGain();
        spark.type = 'sawtooth';
        spark.frequency.setValueAtTime(950, now);
        spark.frequency.exponentialRampToValueAtTime(110, now + 0.35);
        sparkGain.gain.setValueAtTime(0.6 * this.volume, now);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        spark.connect(sparkGain);
        sparkGain.connect(this.ctx.destination);
        spark.start(now);
        spark.stop(now + 0.35);

        this.playNoise(0.4, 0.7 * this.volume, 1800);
    }

    // Zeus Thunder / Lightning Bolt
    playThunder() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        // Zap buzz
        const zap = this.ctx.createOscillator();
        const zapGain = this.ctx.createGain();
        zap.type = 'sawtooth';
        zap.frequency.setValueAtTime(1200, now);
        zap.frequency.exponentialRampToValueAtTime(70, now + 0.28);
        zapGain.gain.setValueAtTime(0.8 * this.volume, now);
        zapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        zap.connect(zapGain);
        zapGain.connect(this.ctx.destination);
        zap.start(now);
        zap.stop(now + 0.28);

        // Thunder crack
        this.playNoise(0.5, 0.8 * this.volume, 900);
    }

    // Anubis Soul Drain / Dark Curse
    playSoulDrain() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(660, now + 0.35);

        gain.gain.setValueAtTime(0.5 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    }

    // Wukong Staff Extension & Somersault
    playStaffExtend() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

        gain.gain.setValueAtTime(0.5 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
    }

    // Sukuna Slash / Dismantle (Metallic blade slicing through air)
    playSlash() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);

        gain.gain.setValueAtTime(0.6 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);

        this.playNoise(0.1, 0.4 * this.volume, 3000);
    }

    // Sukuna Fire Arrow (Fuga)
    playFireExplosion() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);

        gain.gain.setValueAtTime(0.8 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);

        this.playNoise(0.6, 0.9 * this.volume, 800);
    }

    // Domain Expansion / Ultimate Activation Sound
    playDomainExpansion() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        // Ominous resonant bass sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(70, now);
        osc.frequency.linearRampToValueAtTime(45, now + 1.2);

        gain.gain.setValueAtTime(0.9 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);

        // Echoing bell chime
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(523.25, now); // C5
        chimeGain.gain.setValueAtTime(0.5 * this.volume, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start(now);
        chime.stop(now + 1.5);
    }

    // Shield / Block
    playBlock() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);

        gain.gain.setValueAtTime(0.5 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    // UI Chimes: Click, Purchase, Victory, Defeat
    playClick() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    playUnlock() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime + idx * 0.09;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.35 * this.volume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        });
    }

    playVictory() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime + idx * 0.14;
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.4 * this.volume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
        });
    }

    playKO() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        // Deep gong
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 1.2);
        gain.gain.setValueAtTime(0.9 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);

        this.playNoise(0.8, 0.7 * this.volume, 500);
    }

    // Aoi Todo Boogie Woogie: Crisp Hand Clap
    playClap() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
        gain.gain.setValueAtTime(0.5 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        this.playNoise(0.06, 0.45 * this.volume, 3200);
    }

    // Yuta Cursed Speech: "DON'T MOVE"
    playCursedSpeech() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.35);
        gain.gain.setValueAtTime(0.7 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        this.playNoise(0.2, 0.3 * this.volume, 800);
    }

    // Gojo Hollow Purple: Spatial imaginary mass collision sub-bass
    playHollowPurple() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        // Dual oscillator binaural collision drone
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(65, now);
        osc1.frequency.exponentialRampToValueAtTime(20, now + 0.8);
        osc2.frequency.setValueAtTime(430, now);
        osc2.frequency.exponentialRampToValueAtTime(50, now + 0.8);
        gain.gain.setValueAtTime(0.85 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.8);
        osc2.stop(now + 0.8);
        this.playNoise(0.5, 0.6 * this.volume, 1200);
    }

    // Choso Piercing Blood
    playBloodShot() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
        gain.gain.setValueAtTime(0.55 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Hakari Jackpot Chime
    playJackpot() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + idx * 0.1;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.4 * this.volume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        });
    }

    // Round Start Gong & Thunder
    playRoundStart() {
        this.playThunder();
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);
        gain.gain.setValueAtTime(0.5 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
    }

    // Laser / High-velocity Beam (Reversal Red, Piercing Blood)
    playLaser() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.4 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        this.playNoise(0.12, 0.35 * this.volume, 2500);
    }

    // Fireball (Fuga, Ember Insects)
    playFireball() {
        this.playFireExplosion();
    }

    // Ultimate / Domain Finisher
    playUltimate() {
        this.playDomainExpansion();
    }

    // Nobara Hammer
    playHammer() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.1);
        gain.gain.setValueAtTime(0.5 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        this.playNoise(0.08, 0.4 * this.volume, 2200);
    }

    // Dynamic procedural synth combat BGM loop
    startBGM() {
        if (this.isMuted || !this.ctx || this.bgmPlaying) return;
        this.resume();
        this.bgmPlaying = true;
        let step = 0;
        const scale = [110, 130.81, 146.83, 164.81, 196, 220]; // A minor pentatonic bass

        this.bgmInterval = setInterval(() => {
            if (this.isMuted || !this.ctx || !this.bgmPlaying) return;
            try {
                const now = this.ctx.currentTime;
                // Bass note
                const bassOsc = this.ctx.createOscillator();
                const bassGain = this.ctx.createGain();
                bassOsc.type = 'triangle';
                const freq = scale[step % scale.length];
                bassOsc.frequency.setValueAtTime(freq, now);
                bassGain.gain.setValueAtTime(0.08 * this.volume, now);
                bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                bassOsc.connect(bassGain);
                bassGain.connect(this.ctx.destination);
                bassOsc.start(now);
                bassOsc.stop(now + 0.22);

                // Hi-hat / pulse
                if (step % 2 === 0) {
                    this.playNoise(0.04, 0.04 * this.volume, 4000);
                }

                step++;
            } catch (err) {
                console.error("BGM error", err);
            }
        }, 220); // 136 BPM feel
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }
}

// Global audio singleton with safe fallback proxy to guarantee no missing audio call ever crashes combat
const soundEngineInstance = new SoundEngine();
const Sound = new Proxy(soundEngineInstance, {
    get(target, prop) {
        if (prop in target) {
            const val = target[prop];
            return (typeof val === 'function') ? val.bind(target) : val;
        }
        if (typeof prop === 'string' && prop.startsWith('play')) {
            return (...args) => {
                target.playHit('medium');
            };
        }
        return target[prop];
    }
});
