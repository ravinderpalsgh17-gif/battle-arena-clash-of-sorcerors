// Particle Engine & 3D Visual Effects for Battle Arena: Clash of Sorcerors
// Handles 3D-to-Screen Projected Damage Text, Hit Sparks, Cursed Bursts, and Camera Shakes

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
    }

    reset() {
        this.particles = [];
        this.projectiles = [];
        this.floatingTexts = [];
        this.shockwaves = [];
        this.screenShake = 0;
        this.flashAlpha = 0;
    }

    shake(intensity = 10, duration = 12) {
        this.screenShake = duration;
        this.screenShakeIntensity = intensity;
    }

    flash(color = '#ffffff', duration = 0.4) {
        this.flashColor = color;
        this.flashAlpha = 1.0;
    }

    // Add floating combat numbers (Damage, CRITICAL, Move names)
    addFloatingText(text, x, y, color = '#fff', size = 20, isCrit = false, z = 0) {
        this.floatingTexts.push({
            text,
            worldPos: { x, y: y || 2.5, z: z || 0 },
            screenOffset: 0,
            alpha: 1.0,
            color,
            size,
            isCrit,
            life: 48
        });
    }

    // Particle emitter for impacts, bursts, slashes
    createHitSparks(x, y, z = 0, count = 12, color = '#ffcc00') {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.05 + Math.random() * 0.15;
            this.particles.push({
                x, y, z,
                vx: Math.cos(angle) * speed,
                vy: (Math.random() * 0.1) + 0.05,
                vz: Math.sin(angle) * speed,
                color,
                size: 3 + Math.random() * 4,
                alpha: 1.0,
                life: 20 + Math.random() * 15
            });
        }
    }

    createCursedBurst(x, y, z = 0, color = '#9d4edd', count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.08 + Math.random() * 0.18;
            this.particles.push({
                x, y, z,
                vx: Math.cos(angle) * speed,
                vy: (Math.random() - 0.5) * 0.12,
                vz: Math.sin(angle) * speed,
                color,
                size: 4 + Math.random() * 6,
                alpha: 1.0,
                life: 30 + Math.random() * 20
            });
        }
    }

    createDomainShatter(x, y, z = 0, color = '#00e5ff', count = 55) {
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 0.15 + Math.random() * 0.35;
            this.particles.push({
                x, y, z,
                vx: Math.sin(phi) * Math.cos(theta) * speed,
                vy: Math.cos(phi) * speed + 0.12,
                vz: Math.sin(phi) * Math.sin(theta) * speed,
                color: (i % 2 === 0 ? color : '#ffffff'),
                size: 5 + Math.random() * 7,
                alpha: 1.0,
                life: 38 + Math.random() * 25
            });
        }
    }

    createDomainClashSparks(x, y, z = 0, count = 16) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.12 + Math.random() * 0.28;
            this.particles.push({
                x: x + (Math.random() - 0.5) * 1.5,
                y: y + (Math.random() - 0.5) * 6,
                z: z + (Math.random() - 0.5) * 1.5,
                vx: Math.cos(angle) * speed,
                vy: (Math.random() - 0.5) * 0.2,
                vz: Math.sin(angle) * speed,
                color: (Math.random() > 0.5 ? '#ff0055' : '#00e5ff'),
                size: 4 + Math.random() * 6,
                alpha: 1.0,
                life: 18 + Math.random() * 15
            });
        }
    }

    update() {
        if (this.screenShake > 0) this.screenShake--;
        if (this.flashAlpha > 0) this.flashAlpha -= 0.05;

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.screenOffset -= 1.4;
            ft.alpha = Math.max(0, ft.life / 48);
            ft.life--;
            if (ft.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }

        // Update 3D particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            p.vy -= 0.005; // gravity
            p.alpha -= 0.035;
            p.life--;
            if (p.life <= 0 || p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // Render 3D-projected floating text and flash over 2D HUD canvas
    drawHUDOverlay(ctx, camera, width, height) {
        if (!camera) return;

        ctx.save();

        // 1. Full Screen Flash
        if (this.flashAlpha > 0.02) {
            ctx.fillStyle = this.flashColor;
            ctx.globalAlpha = Math.min(1.0, this.flashAlpha);
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
        }

        // 2. Render 3D Floating Texts
        const tempVec = new THREE.Vector3();
        for (const ft of this.floatingTexts) {
            tempVec.set(ft.worldPos.x, ft.worldPos.y, ft.worldPos.z);
            tempVec.project(camera);

            // Check if within visible frustum
            if (tempVec.z < 1.0) {
                const screenX = (tempVec.x * 0.5 + 0.5) * width;
                const screenY = (-(tempVec.y * 0.5) + 0.5) * height + ft.screenOffset;

                ctx.save();
                ctx.globalAlpha = ft.alpha;
                ctx.font = `900 ${ft.isCrit ? ft.size * 1.3 : ft.size}px 'Rajdhani', sans-serif`;
                ctx.textAlign = 'center';

                // Text Outline
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 4;
                ctx.strokeText(ft.text, screenX, screenY);

                // Text Fill
                ctx.fillStyle = ft.color;
                ctx.fillText(ft.text, screenX, screenY);
                ctx.restore();
            }
        }

        ctx.restore();
    }
}
