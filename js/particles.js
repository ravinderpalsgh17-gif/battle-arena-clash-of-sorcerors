// Particle Engine & Visual Effects for Battle Arena: Clash of Sorcerors

class ParticleEngine {
    constructor() {
        this.particles = [];
        this.projectiles = [];
        this.floatingTexts = [];
        this.shockwaves = [];
        this.screenShake = 0;
        this.screenShakeIntensity = 0;
        this.flashAlpha = 0;
        this.flashColor = '#ffffff';
        this.darkOverlayAlpha = 0;
    }

    reset() {
        this.particles = [];
        this.projectiles = [];
        this.floatingTexts = [];
        this.shockwaves = [];
        this.screenShake = 0;
        this.flashAlpha = 0;
        this.darkOverlayAlpha = 0;
    }

    // Trigger dynamic camera shake
    shake(intensity = 10, duration = 12) {
        this.screenShake = duration;
        this.screenShakeIntensity = intensity;
    }

    // Full screen color flash
    flash(color = '#ffffff', duration = 0.4) {
        this.flashColor = color;
        this.flashAlpha = 1.0;
    }

    // Add shockwave ring
    addShockwave(x, y, maxRadius = 80, color = '#ffffff', lineWidth = 4) {
        this.shockwaves.push({
            x, y,
            radius: 5,
            maxRadius,
            color,
            lineWidth,
            alpha: 1.0,
            growth: maxRadius / 15
        });
    }

    // Add floating combat numbers (Damage, CRITICAL!, etc.)
    addFloatingText(text, x, y, color = '#fff', size = 22, isCrit = false) {
        this.floatingTexts.push({
            text,
            x: x + (Math.random() * 20 - 10),
            y: y - 10,
            vy: -2.4,
            alpha: 1.0,
            color,
            size,
            isCrit,
            life: 45
        });
    }

    // Particle emitter for impacts, bursts, slashes
    createHitSparks(x, y, count = 15, color = '#ffcc00') {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 7;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                color,
                size: 2 + Math.random() * 4,
                alpha: 1.0,
                decay: 0.03 + Math.random() * 0.04,
                type: 'spark',
                gravity: 0.2
            });
        }
    }

    // Cursed Energy / Blood droplet effects
    createCursedBurst(x, y, color = '#ff0055', count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 8;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                color,
                size: 3 + Math.random() * 5,
                alpha: 1.0,
                decay: 0.02 + Math.random() * 0.03,
                type: 'curse',
                gravity: 0.25
            });
        }
    }

    // Lightning discharge particles (Zeus)
    createLightningSparks(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: Math.random() > 0.4 ? '#00f0ff' : '#ffffff',
                size: 2 + Math.random() * 3,
                alpha: 1.0,
                decay: 0.06 + Math.random() * 0.05,
                type: 'lightning',
                gravity: 0
            });
        }
    }

    // Soul orbs / Shadow particles (Anubis)
    createSoulSparks(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 2,
                vy: -1 - Math.random() * 3,
                color: Math.random() > 0.5 ? '#b5179e' : '#7209b7',
                size: 3 + Math.random() * 6,
                alpha: 0.8,
                decay: 0.02 + Math.random() * 0.02,
                type: 'soul',
                gravity: -0.05
            });
        }
    }

    // Flame burst (Sukuna Fuga)
    createFireBurst(x, y, count = 30) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 9;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                color: ['#ffdd00', '#ff6600', '#ff0033'][Math.floor(Math.random() * 3)],
                size: 4 + Math.random() * 8,
                alpha: 1.0,
                decay: 0.02 + Math.random() * 0.03,
                type: 'fire',
                gravity: 0.1
            });
        }
    }

    // Black Flash spatial sparks (Black and crimson jagged lightning)
    createBlackFlashSparks(x, y) {
        this.flash('#ff0033', 0.2);
        this.shake(25, 20);
        this.addShockwave(x, y, 160, '#ff0044', 8);
        this.addShockwave(x, y, 110, '#000000', 10);

        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 12;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: i % 2 === 0 ? '#ff003b' : '#000000',
                size: 4 + Math.random() * 6,
                alpha: 1.0,
                decay: 0.025,
                type: 'black_flash',
                gravity: 0.15
            });
        }
    }

    // Update all entities
    update() {
        // Screen shake decay
        if (this.screenShake > 0) {
            this.screenShake--;
        }

        // Screen flash decay
        if (this.flashAlpha > 0) {
            this.flashAlpha -= 0.06;
            if (this.flashAlpha < 0) this.flashAlpha = 0;
        }

        // Particles update
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= p.decay;

            if (p.type === 'spark') {
                p.size = Math.max(0.5, p.size * 0.96);
            }

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Shockwaves update
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            sw.radius += sw.growth;
            sw.alpha = 1.0 - (sw.radius / sw.maxRadius);
            if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
                this.shockwaves.splice(i, 1);
            }
        }

        // Floating combat texts update
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy;
            ft.life--;
            if (ft.life < 15) {
                ft.alpha -= 0.07;
            }
            if (ft.life <= 0 || ft.alpha <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    // Render all particles and screen overlays
    draw(ctx) {
        ctx.save();

        // 1. Draw Shockwaves
        for (const sw of this.shockwaves) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, sw.alpha);
            ctx.strokeStyle = sw.color;
            ctx.lineWidth = sw.lineWidth;
            ctx.shadowBlur = 15;
            ctx.shadowColor = sw.color;
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 2. Draw Particles
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;

            if (p.type === 'black_flash') {
                ctx.strokeStyle = p.color;
                ctx.lineWidth = p.size;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
                ctx.stroke();
            } else if (p.type === 'lightning') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // 3. Draw Floating Combat Text
        for (const ft of this.floatingTexts) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, ft.alpha);
            ctx.font = `900 ${ft.size}px 'Cinzel', 'Impact', sans-serif`;
            ctx.fillStyle = ft.color;
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 8;
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
            if (ft.isCrit) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.strokeText(ft.text, ft.x, ft.y);
            }
            ctx.restore();
        }

        // 4. Draw Fullscreen Flash
        if (this.flashAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = this.flashAlpha;
            ctx.fillStyle = this.flashColor;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
        }

        ctx.restore();
    }
}
