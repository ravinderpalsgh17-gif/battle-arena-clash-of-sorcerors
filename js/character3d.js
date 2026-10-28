// Master 4K Ultra 3D Character Rigging & Animation Engine
// Battle Arena: Clash of Sorcerors (4K Ultra Open World 3D)
// Features: True Heian 4-Armed Ryomen Sukuna, Six Eyes Gojo, Divine Dog Companion,
// Coiled Cursed Worm Toji, 3D Panda, Volcano Jogo, Transfigured Mahito, and 16 High-Fidelity JJK Rigs

// ====================================================
// PROCEDURAL 4K ULTRA TEXTURE GENERATOR
// ====================================================
class ProceduralTextureFactory {
    static cache = {};

    // 1. Ryomen Sukuna 4K Skin with Authentic Cursed Seals & Muscle Shading
    static createSukunaSkinTexture() {
        if (this.cache.sukunaSkin) return this.cache.sukunaSkin;
        const size = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Warm porcelain skin tone with subtle subsurface hue
        ctx.fillStyle = '#ffdfca';
        ctx.fillRect(0, 0, size, size);

        // Chiseled abdominal & pectoral shadows
        const grad = ctx.createLinearGradient(0, 0, 0, size);
        grad.addColorStop(0, 'rgba(210, 160, 130, 0.45)');
        grad.addColorStop(0.35, 'rgba(255, 230, 210, 0.15)');
        grad.addColorStop(0.7, 'rgba(190, 140, 110, 0.45)');
        grad.addColorStop(1, 'rgba(160, 110, 80, 0.6)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        // Draw Anatomical Muscle Definition (Abs & Pecs)
        ctx.strokeStyle = 'rgba(160, 100, 75, 0.55)';
        ctx.lineWidth = 7;
        // Pectoral cleft
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.12);
        ctx.lineTo(size * 0.5, size * 0.90);
        ctx.stroke();

        // Deep pectoral arches
        ctx.beginPath();
        ctx.arc(size * 0.34, size * 0.32, size * 0.17, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(size * 0.66, size * 0.32, size * 0.17, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // 8-Pack cuts
        for (let y of [0.44, 0.56, 0.68, 0.80]) {
            ctx.beginPath();
            ctx.moveTo(size * 0.28, size * y);
            ctx.quadraticCurveTo(size * 0.5, size * (y - 0.02), size * 0.72, size * y);
            ctx.stroke();
        }

        // --- AUTHENTIC HEIAN CURSED TATTOOS (Pitch-Black & Crimson undertone) ---
        ctx.fillStyle = '#0f050b';
        ctx.strokeStyle = '#0f050b';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';

        // Center Solar Plexus Diamond
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.28);
        ctx.lineTo(size * 0.56, size * 0.35);
        ctx.lineTo(size * 0.5, size * 0.42);
        ctx.lineTo(size * 0.44, size * 0.35);
        ctx.closePath();
        ctx.fill();

        // Collarbone Arches stretching outwards
        ctx.beginPath();
        ctx.moveTo(size * 0.2, size * 0.18);
        ctx.quadraticCurveTo(size * 0.5, size * 0.24, size * 0.8, size * 0.18);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(size * 0.24, size * 0.24);
        ctx.quadraticCurveTo(size * 0.5, size * 0.30, size * 0.76, size * 0.24);
        ctx.stroke();

        // Rib / Abdominal Curved Slashes
        for (let side of [-1, 1]) {
            const cx = size * 0.5 + side * size * 0.3;
            ctx.beginPath();
            ctx.arc(cx, size * 0.55, size * 0.12, 0, Math.PI * 2);
            ctx.stroke();

            // Dual wrist / bicep stripe lines (for wrap texture)
            ctx.beginPath();
            ctx.moveTo(size * 0.5 + side * (size * 0.2), size * 0.8);
            ctx.lineTo(size * 0.5 + side * (size * 0.45), size * 0.8);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(size * 0.5 + side * (size * 0.2), size * 0.86);
            ctx.lineTo(size * 0.5 + side * (size * 0.45), size * 0.86);
            ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        if (THREE.LinearMipmapLinearFilter) tex.minFilter = THREE.LinearMipmapLinearFilter;
        this.cache.sukunaSkin = tex;
        return tex;
    }

    // 1B. Anatomical Muscle Definition Texture (High-Def Pectorals, Abs, Obliques, Serratus)
    static createAnatomicalMuscleTexture(skinHex = '#ffdfca', isHeavy = false) {
        const key = `muscle_${skinHex}_${isHeavy}`;
        if (this.cache[key]) return this.cache[key];
        const size = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Base skin tone
        ctx.fillStyle = skinHex;
        ctx.fillRect(0, 0, size, size);

        // Subsurface gradient and depth
        const grad = ctx.createLinearGradient(0, 0, 0, size);
        grad.addColorStop(0, 'rgba(200, 150, 120, 0.35)');
        grad.addColorStop(0.3, 'rgba(255, 230, 210, 0.15)');
        grad.addColorStop(0.7, 'rgba(180, 130, 100, 0.35)');
        grad.addColorStop(1, 'rgba(160, 110, 80, 0.5)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        // Striated muscle cuts (Pecs, Abs, Obliques, Serratus)
        ctx.strokeStyle = 'rgba(140, 85, 65, 0.45)';
        ctx.lineWidth = isHeavy ? 8 : 5;
        ctx.lineCap = 'round';

        // Sternal groove / center line
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.12);
        ctx.lineTo(size * 0.5, size * 0.90);
        ctx.stroke();

        // Lower pectoral arches
        ctx.beginPath();
        ctx.arc(size * 0.35, size * 0.34, size * 0.16, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(size * 0.65, size * 0.34, size * 0.16, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // 6-Pack / 8-Pack horizontal intersections
        const rows = isHeavy ? [0.44, 0.56, 0.68, 0.80] : [0.46, 0.58, 0.70];
        for (let y of rows) {
            ctx.beginPath();
            ctx.moveTo(size * 0.30, size * y);
            ctx.quadraticCurveTo(size * 0.5, size * (y - 0.02), size * 0.70, size * y);
            ctx.stroke();
        }

        // Serratus Anterior & Obliques (rib cuts & V-line)
        for (let s of [-1, 1]) {
            const cx = size * 0.5 + s * size * 0.32;
            for (let r = 0.38; r <= 0.54; r += 0.06) {
                ctx.beginPath();
                ctx.moveTo(cx - s * 20, size * r);
                ctx.lineTo(cx + s * 45, size * (r + 0.03));
                ctx.stroke();
            }
            // Inguinal ligament / Adonis V-line
            ctx.beginPath();
            ctx.moveTo(size * 0.5 + s * size * 0.12, size * 0.86);
            ctx.lineTo(size * 0.5 + s * size * 0.38, size * 0.72);
            ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        this.cache[key] = tex;
        return tex;
    }

    // 1C. Toji Fushiguro Heavenly Restriction Athletic Compression Shirt Texture
    static createTojiCompressionShirtTexture() {
        if (this.cache.tojiShirt) return this.cache.tojiShirt;
        const size = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Dark charcoal athletic technical fabric
        ctx.fillStyle = '#121218';
        ctx.fillRect(0, 0, size, size);

        // High-contrast muscle highlight mapping (shows chiseled pecs & 8-pack stretching through fabric)
        const rad1 = ctx.createRadialGradient(size * 0.35, size * 0.28, 20, size * 0.35, size * 0.28, size * 0.18);
        rad1.addColorStop(0, 'rgba(55, 55, 75, 0.85)');
        rad1.addColorStop(1, 'rgba(18, 18, 24, 0)');
        ctx.fillStyle = rad1;
        ctx.fillRect(0, 0, size, size);

        const rad2 = ctx.createRadialGradient(size * 0.65, size * 0.28, 20, size * 0.65, size * 0.28, size * 0.18);
        rad2.addColorStop(0, 'rgba(55, 55, 75, 0.85)');
        rad2.addColorStop(1, 'rgba(18, 18, 24, 0)');
        ctx.fillStyle = rad2;
        ctx.fillRect(0, 0, size, size);

        // Compression seams and muscle grooves
        ctx.strokeStyle = '#050508';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.12);
        ctx.lineTo(size * 0.5, size * 0.90);
        ctx.stroke();

        // 8-pack cuts
        for (let y of [0.44, 0.56, 0.68, 0.80]) {
            ctx.beginPath();
            ctx.moveTo(size * 0.28, size * y);
            ctx.quadraticCurveTo(size * 0.5, size * (y - 0.02), size * 0.72, size * y);
            ctx.stroke();
        }

        // Ergonomic athletic compression seams
        ctx.strokeStyle = 'rgba(75, 75, 105, 0.45)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(size * 0.15, size * 0.18);
        ctx.lineTo(size * 0.35, size * 0.36);
        ctx.lineTo(size * 0.30, size * 0.85);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(size * 0.85, size * 0.18);
        ctx.lineTo(size * 0.65, size * 0.36);
        ctx.lineTo(size * 0.70, size * 0.85);
        ctx.stroke();

        const tex = new THREE.CanvasTexture(canvas);
        this.cache.tojiShirt = tex;
        return tex;
    }

    // 1D. Aoi Todo 4K Heavyweight Bodybuilder Skin Texture
    static createTodoSkinTexture() {
        if (this.cache.todoSkin) return this.cache.todoSkin;
        const size = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Deep bronze athletic bodybuilder tone
        ctx.fillStyle = '#d49b74';
        ctx.fillRect(0, 0, size, size);

        // Heavy musculature shadows
        const grad = ctx.createLinearGradient(0, 0, 0, size);
        grad.addColorStop(0, 'rgba(160, 100, 70, 0.45)');
        grad.addColorStop(0.5, 'rgba(240, 190, 150, 0.2)');
        grad.addColorStop(1, 'rgba(130, 80, 50, 0.6)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = 'rgba(110, 65, 45, 0.65)';
        ctx.lineWidth = 9;
        // Sternal cleft
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.12);
        ctx.lineTo(size * 0.5, size * 0.90);
        ctx.stroke();

        // Massive pectoral cuts
        ctx.beginPath();
        ctx.arc(size * 0.34, size * 0.34, size * 0.17, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(size * 0.66, size * 0.34, size * 0.17, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // 8-pack cuts
        for (let y of [0.44, 0.56, 0.68, 0.80]) {
            ctx.beginPath();
            ctx.moveTo(size * 0.28, size * y);
            ctx.quadraticCurveTo(size * 0.5, size * (y - 0.02), size * 0.72, size * y);
            ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(canvas);
        this.cache.todoSkin = tex;
        return tex;
    }

    // 2. Ryomen Sukuna 4K Heian Kimono Fabric & Gold Embroidery
    static createSukunaKimonoTexture() {
        if (this.cache.sukunaKimono) return this.cache.sukunaKimono;
        const size = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Pristine Silk Off-White
        ctx.fillStyle = '#faf8f2';
        ctx.fillRect(0, 0, size, size);

        // Fine Woven Silk Microtexture
        ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
        for (let i = 0; i < size; i += 6) {
            ctx.fillRect(i, 0, 2, size);
            ctx.fillRect(0, i, size, 2);
        }

        // Deep Carmine / Wine Collar Borders
        ctx.fillStyle = '#55081b';
        ctx.fillRect(0, 0, size * 0.18, size);
        ctx.fillRect(size * 0.82, 0, size * 0.18, size);

        // Gold Leaf Diamond Embroidery
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#dfb135';
        ctx.lineWidth = 3;
        for (let y = 16; y < size; y += 48) {
            for (let x of [size * 0.09, size * 0.91]) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 12, y + 16);
                ctx.lineTo(x, y + 32);
                ctx.lineTo(x - 12, y + 16);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        this.cache.sukunaKimono = tex;
        return tex;
    }

    // 3. Satoru Gojo: Luminous Six Eyes Celestial Starburst Iris Texture
    static createGojoSixEyesTexture() {
        if (this.cache.sixEyes) return this.cache.sixEyes;
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const cx = size / 2;
        const cy = size / 2;

        // Outer Sclera / Abyss
        ctx.fillStyle = '#010514';
        ctx.fillRect(0, 0, size, size);

        // Deep Azure Iris
        const irisGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, cx * 0.9);
        irisGrad.addColorStop(0, '#ffffff');
        irisGrad.addColorStop(0.18, '#70f3ff');
        irisGrad.addColorStop(0.45, '#00b4d8');
        irisGrad.addColorStop(0.75, '#005b96');
        irisGrad.addColorStop(0.95, '#031b4e');
        irisGrad.addColorStop(1.0, '#000000');
        ctx.fillStyle = irisGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, cx * 0.92, 0, Math.PI * 2);
        ctx.fill();

        // 6-Pointed Starlight Celestial Filaments
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const r = (i % 2 === 0) ? cx * 0.82 : cx * 0.6;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
            ctx.stroke();
        }

        // Diamond Pupil Core
        ctx.fillStyle = '#020b24';
        ctx.beginPath();
        ctx.arc(cx, cy, cx * 0.22, 0, Math.PI * 2);
        ctx.fill();

        const tex = new THREE.CanvasTexture(canvas);
        this.cache.sixEyes = tex;
        return tex;
    }

    // 4. Ultra-4K Weathered Stone Arena Ground & Arcane Seals
    static createArenaGround4KTexture() {
        if (this.cache.arenaGround) return this.cache.arenaGround;
        const size = 2048;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Dark Slate Weathered Basalt Base
        ctx.fillStyle = '#141824';
        ctx.fillRect(0, 0, size, size);

        // Stone Block Grid with Varied Shading
        const block = 128;
        for (let y = 0; y < size; y += block) {
            for (let x = 0; x < size; x += block) {
                const shift = ((x * 13 + y * 29) % 30) - 15;
                const r = 20 + shift;
                const g = 24 + shift;
                const b = 36 + shift;
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x + 2, y + 2, block - 4, block - 4);

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + 10, y + 15);
                ctx.lineTo(x + block - 15, y + block - 20);
                ctx.stroke();
            }
        }

        // Concentric Golden Arcane Jujutsu Rings
        const cx = size / 2;
        const cy = size / 2;

        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(cx, cy, cx * 0.94, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cx, cy, cx * 0.75, 0, Math.PI * 2);
        ctx.stroke();

        // Crimson Cardinal Trigram Glyphs
        ctx.strokeStyle = '#ff0055';
        ctx.fillStyle = '#ff0055';
        ctx.lineWidth = 8;
        for (let i = 0; i < 8; i++) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((i * Math.PI) / 4);
            ctx.beginPath();
            ctx.moveTo(0, -cx * 0.72);
            ctx.lineTo(35, -cx * 0.6);
            ctx.lineTo(0, -cx * 0.45);
            ctx.lineTo(-35, -cx * 0.6);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        this.cache.arenaGround = tex;
        return tex;
    }
}

// ====================================================
// 3D CHARACTER FACTORY & PROCEDURAL RIGS
// ====================================================
class Character3DFactory {
    static create(charKey, isPlayer2 = false) {
        const charData = CHARACTERS_DATA[charKey] || CHARACTERS_DATA.yuji;
        const group = new THREE.Group();
        group.name = `char_${charKey}_${isPlayer2 ? 'p2' : 'p1'}`;

        const parts = {};
        const materials = [];

        function regMat(mat) {
            materials.push(mat);
            return mat;
        }

        // ----------------------------------------------------
        // MUSCULAR PHYSIQUE & ANATOMICAL PROPORTIONS MATRIX
        // ----------------------------------------------------
        const isHeavy = (charKey === 'sukuna' || charKey === 'toji' || charKey === 'todo' || charKey === 'panda');
        const isPanda = (charKey === 'panda');

        let torsoWidth = 1.06;
        let torsoHeight = 1.32;
        let torsoDepth = 0.68;
        let armThickness = 0.21;
        let legThickness = 0.23;
        let headSize = 0.54;

        if (charKey === 'panda') {
            torsoWidth = 1.65;
            torsoHeight = 1.48;
            torsoDepth = 1.40;
            armThickness = 0.35;
            legThickness = 0.36;
            headSize = 0.72;
        } else if (charKey === 'sukuna') {
            torsoWidth = 1.34;
            torsoHeight = 1.40;
            torsoDepth = 0.82;
            armThickness = 0.25;
            legThickness = 0.27;
            headSize = 0.56;
        } else if (charKey === 'todo') {
            torsoWidth = 1.36;
            torsoHeight = 1.40;
            torsoDepth = 0.82;
            armThickness = 0.26;
            legThickness = 0.28;
            headSize = 0.56;
        } else if (charKey === 'toji') {
            torsoWidth = 1.28;
            torsoHeight = 1.36;
            torsoDepth = 0.78;
            armThickness = 0.25;
            legThickness = 0.27;
            headSize = 0.54;
        } else if (charKey === 'hakari' || charKey === 'nanami') {
            torsoWidth = 1.20;
            torsoHeight = 1.35;
            torsoDepth = 0.72;
            armThickness = 0.23;
            legThickness = 0.25;
            headSize = 0.55;
        } else if (charKey === 'yuji') {
            torsoWidth = 1.14;
            torsoHeight = 1.30;
            torsoDepth = 0.70;
            armThickness = 0.22;
            legThickness = 0.24;
            headSize = 0.53;
        } else if (charKey === 'gojo') {
            torsoWidth = 1.10;
            torsoHeight = 1.38;
            torsoDepth = 0.68;
            armThickness = 0.21;
            legThickness = 0.23;
            headSize = 0.53;
        } else if (charKey === 'nobara' || charKey === 'maki') {
            torsoWidth = 0.96;
            torsoHeight = 1.25;
            torsoDepth = 0.60;
            armThickness = 0.17;
            legThickness = 0.20;
            headSize = 0.50;
        }

        // ----------------------------------------------------
        // HIGH-FIDELITY PBR ANATOMICAL MATERIALS
        // ----------------------------------------------------
        const skinMat = regMat(new THREE.MeshStandardMaterial({
            color: 0xffdfc4,
            roughness: 0.42,
            metalness: 0.05,
            map: ProceduralTextureFactory.createAnatomicalMuscleTexture('#ffdfca', isHeavy)
        }));

        const darkSkinMat = regMat(new THREE.MeshStandardMaterial({
            color: 0xd49b74,
            roughness: 0.44,
            metalness: 0.05,
            map: ProceduralTextureFactory.createTodoSkinTexture()
        }));

        const tojiSkinMat = regMat(new THREE.MeshStandardMaterial({
            color: 0xd8b598,
            roughness: 0.38,
            metalness: 0.06,
            map: ProceduralTextureFactory.createAnatomicalMuscleTexture('#d8b598', true)
        }));

        const uniformDarkMat = regMat(new THREE.MeshStandardMaterial({ color: 0x111422, roughness: 0.55 }));
        const metalMat = regMat(new THREE.MeshStandardMaterial({ color: 0xe0e0ea, metalness: 0.95, roughness: 0.15 }));
        const goldMat = regMat(new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.92, roughness: 0.18 }));
        const cursedTattooMat = regMat(new THREE.MeshBasicMaterial({ color: 0x0f050b }));
        const bootMat = regMat(new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.5 }));
        const clawMat = regMat(new THREE.MeshStandardMaterial({
            color: 0x140c16,
            roughness: 0.2,
            metalness: 0.7,
            emissive: 0x330008,
            emissiveIntensity: 0.4
        }));

        // Determine Torso & Chest Materials based on Character Costume
        let torsoMat = uniformDarkMat;
        let chestMat = skinMat;
        let pantsMat = uniformDarkMat;

        if (charKey === 'panda') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf5f5fa, roughness: 0.85 }));
            chestMat = torsoMat;
            pantsMat = regMat(new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.8 }));
        } else if (charKey === 'todo') {
            torsoMat = darkSkinMat;
            chestMat = darkSkinMat;
            pantsMat = regMat(new THREE.MeshStandardMaterial({ color: 0x3d4a36, roughness: 0.6 }));
        } else if (charKey === 'sukuna') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({
                map: ProceduralTextureFactory.createSukunaKimonoTexture(),
                roughness: 0.5,
                metalness: 0.08
            }));
            chestMat = regMat(new THREE.MeshStandardMaterial({
                map: ProceduralTextureFactory.createSukunaSkinTexture(),
                roughness: 0.45,
                metalness: 0.05
            }));
            pantsMat = regMat(new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.5 }));
        } else if (charKey === 'toji') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({
                map: ProceduralTextureFactory.createTojiCompressionShirtTexture(),
                roughness: 0.35,
                metalness: 0.08
            }));
            chestMat = torsoMat;
            pantsMat = regMat(new THREE.MeshStandardMaterial({ color: 0xdad4c8, roughness: 0.65 }));
        } else if (charKey === 'nanami') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xd8caa8, roughness: 0.55 }));
            chestMat = torsoMat;
            pantsMat = regMat(new THREE.MeshStandardMaterial({ color: 0xc8ba96, roughness: 0.55 }));
        } else if (charKey === 'geto') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0x181822, roughness: 0.65 }));
            chestMat = torsoMat;
            pantsMat = regMat(new THREE.MeshStandardMaterial({ color: 0x181822, roughness: 0.65 }));
        } else if (charKey === 'yuta') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf8f8fc, roughness: 0.55 }));
            chestMat = torsoMat;
            pantsMat = uniformDarkMat;
        } else if (charKey === 'jogo') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0x486042, roughness: 0.85 }));
            chestMat = torsoMat;
            pantsMat = regMat(new THREE.MeshStandardMaterial({ color: 0x384c34, roughness: 0.85 }));
        } else if (charKey === 'choso') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xdcd6cb, roughness: 0.65 }));
            chestMat = torsoMat;
            pantsMat = regMat(new THREE.MeshStandardMaterial({ color: 0x221c22, roughness: 0.65 }));
        } else if (charKey === 'hakari') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0x242a26, roughness: 0.55 }));
            chestMat = skinMat; // Open jacket showing muscular chest
            pantsMat = regMat(new THREE.MeshStandardMaterial({ color: 0x333b35, roughness: 0.6 }));
        }

        // ----------------------------------------------------
        // 1. TORSO RIGGING & ANATOMY (REAL-LIFE MUSCULAR V-TAPER)
        // ----------------------------------------------------
        const torsoGroup = new THREE.Group();
        torsoGroup.position.y = 1.9;
        group.add(torsoGroup);
        parts.torso = torsoGroup;

        // A. Upper Chest & Ribcage Core (Broad Athletic Upper Torso)
        const upperTorso = new THREE.Mesh(
            new THREE.BoxGeometry(torsoWidth, torsoHeight * 0.54, torsoDepth),
            torsoMat
        );
        upperTorso.position.set(0, 0.28, 0);
        upperTorso.castShadow = true;
        upperTorso.receiveShadow = true;
        torsoGroup.add(upperTorso);

        // B. Tapered Athletic Waist & Abdominal Core (V-Taper)
        const lowerTorso = new THREE.Mesh(
            new THREE.BoxGeometry(torsoWidth * 0.82, torsoHeight * 0.48, torsoDepth * 0.86),
            torsoMat
        );
        lowerTorso.position.set(0, -0.32, -0.01);
        lowerTorso.castShadow = true;
        lowerTorso.receiveShadow = true;
        torsoGroup.add(lowerTorso);

        // C. Sculpted Muscular Pectorals (Pectoralis Major Left & Right Slabs)
        const pecW = torsoWidth * 0.45;
        const pecH = torsoHeight * 0.32;
        const pecD = isHeavy ? 0.20 : 0.16;
        for (let s of [-1, 1]) {
            const pec = new THREE.Mesh(
                new THREE.BoxGeometry(pecW, pecH, pecD),
                chestMat
            );
            pec.position.set(s * (pecW * 0.54), 0.28, torsoDepth / 2 + 0.04);
            pec.rotation.z = s * -0.06;
            pec.rotation.y = s * 0.08;
            pec.castShadow = true;
            torsoGroup.add(pec);
        }

        // D. Latissimus Dorsi (Lats / Flaring V-Taper Wings)
        for (let s of [-1, 1]) {
            const lat = new THREE.Mesh(
                new THREE.BoxGeometry(0.18, torsoHeight * 0.52, torsoDepth * 0.74),
                torsoMat
            );
            lat.position.set(s * (torsoWidth * 0.52), 0.22, -0.04);
            lat.rotation.z = s * -0.16;
            lat.castShadow = true;
            torsoGroup.add(lat);
        }

        // E. Trapezius Muscle Slopes (Shoulder-to-Neck Muscular Collar)
        for (let s of [-1, 1]) {
            const trap = new THREE.Mesh(
                new THREE.BoxGeometry(torsoWidth * 0.28, 0.22, torsoDepth * 0.60),
                torsoMat
            );
            trap.position.set(s * (torsoWidth * 0.32), 0.58, -0.06);
            trap.rotation.z = s * -0.28;
            torsoGroup.add(trap);
        }

        // F. Chiseled 6-Pack / 8-Pack Abdominal Rectus Muscle Blocks
        const abRows = isHeavy ? 4 : 3;
        const abW = torsoWidth * 0.34;
        const abH = torsoHeight * 0.10;
        for (let r = 0; r < abRows; r++) {
            const yPos = 0.06 - r * (abH + 0.035);
            for (let s of [-1, 1]) {
                const ab = new THREE.Mesh(
                    new THREE.BoxGeometry(abW * 0.46, abH, 0.09),
                    chestMat
                );
                ab.position.set(s * (abW * 0.26), yPos, torsoDepth * 0.43 + 0.04);
                ab.rotation.y = s * 0.06;
                torsoGroup.add(ab);
            }
        }

        // G. External Obliques (V-Cut Adonis Belt Flank Ridges)
        for (let s of [-1, 1]) {
            const oblique = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, torsoHeight * 0.36, 0.14),
                chestMat
            );
            oblique.position.set(s * (torsoWidth * 0.42), -0.24, torsoDepth * 0.36);
            oblique.rotation.z = s * 0.18;
            torsoGroup.add(oblique);
        }

        // H. Pelvis & Athletic Waist Base
        const pelvis = new THREE.Mesh(
            new THREE.BoxGeometry(torsoWidth * 0.82, 0.28, torsoDepth * 0.86),
            pantsMat
        );
        pelvis.position.set(0, -0.60, 0);
        torsoGroup.add(pelvis);

        // --- RYOMEN SUKUNA: 4K HEIAN DETAILED CHEST & SASH ---
        if (charKey === 'sukuna') {
            // 3D Relief Cursed Tattoo Center Medallion & Rib Slashes
            const tattoo1 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.07, 0.06), cursedTattooMat);
            tattoo1.position.set(0, 0.42, torsoDepth / 2 + 0.14);
            torsoGroup.add(tattoo1);

            const tattoo2 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.06), cursedTattooMat);
            tattoo2.position.set(0, 0.24, torsoDepth / 2 + 0.14);
            torsoGroup.add(tattoo2);

            const tattooCircle = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 8, 20), cursedTattooMat);
            tattooCircle.position.set(0, 0.06, torsoDepth / 2 + 0.14);
            torsoGroup.add(tattooCircle);

            // Shimenawa-Style Dual-Cord Woven Rope Belt (Obi)
            const obiMat = regMat(new THREE.MeshStandardMaterial({ color: 0x121216, roughness: 0.4 }));
            const obiGoldMat = regMat(new THREE.MeshStandardMaterial({ color: 0xdfb135, roughness: 0.3, metalness: 0.8 }));

            const obi = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth + 0.14, 0.32, torsoDepth + 0.14), obiMat);
            obi.position.set(0, -0.42, 0);
            torsoGroup.add(obi);

            // Gold accent cord
            const obiCord = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth + 0.16, 0.08, torsoDepth + 0.16), obiGoldMat);
            obiCord.position.set(0, -0.42, 0);
            torsoGroup.add(obiCord);

            // Hanging Knot Tassels
            for (let side of [-0.15, 0.15]) {
                const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.65, 8), obiMat);
                tassel.position.set(side, -0.72, torsoDepth / 2 + 0.08);
                tassel.rotation.z = side * -0.2;
                torsoGroup.add(tassel);
            }

            // Flowing Kimono Skirt Pleats
            const skirtMat = regMat(new THREE.MeshStandardMaterial({
                map: ProceduralTextureFactory.createSukunaKimonoTexture(),
                roughness: 0.5
            }));
            const skirt = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth + 0.1, 0.75, torsoDepth + 0.1), skirtMat);
            skirt.position.set(0, -0.85, 0);
            torsoGroup.add(skirt);
            parts.skirt = skirt;

        } else if (charKey === 'yuji') {
            // Bright Red Cowl Hood folded around neck
            const hoodGeo = new THREE.TorusGeometry(0.58, 0.18, 10, 24);
            hoodGeo.rotateX(Math.PI / 2);
            const hoodMat = regMat(new THREE.MeshStandardMaterial({ color: 0xff2a5f, roughness: 0.55 }));
            const hood = new THREE.Mesh(hoodGeo, hoodMat);
            hood.position.set(0, 0.62, 0);
            torsoGroup.add(hood);

            // Gold Jujutsu High Emblem Button
            const button = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 14), goldMat);
            button.position.set(0.18, 0.35, torsoDepth / 2 + 0.06);
            button.rotation.x = Math.PI / 2;
            torsoGroup.add(button);

        } else if (charKey === 'toji') {
            // Realistic Coiled 3D Cursed Spirit Inventory Worm
            const wormGroup = new THREE.Group();
            const wormSkinMat = regMat(new THREE.MeshStandardMaterial({
                color: 0x614f73,
                roughness: 0.45,
                metalness: 0.1
            }));
            for (let i = 0; i < 14; i++) {
                const seg = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), wormSkinMat);
                const t = (i / 13) * Math.PI * 1.35 - 0.3;
                seg.position.set(Math.cos(t) * 0.72, Math.sin(t) * 0.58 - 0.1, Math.sin(t) * 0.45 + 0.1);
                wormGroup.add(seg);
            }
            // Worm Head with demonic eye and toothy jaw
            const wHead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), regMat(new THREE.MeshStandardMaterial({ color: 0x7c6591 })));
            wHead.position.set(0.64, 0.52, 0.32);
            const wEye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), regMat(new THREE.MeshBasicMaterial({ color: 0xff1144 })));
            wEye.position.set(0.74, 0.58, 0.40);
            wormGroup.add(wHead);
            wormGroup.add(wEye);
            torsoGroup.add(wormGroup);

        } else if (charKey === 'nanami') {
            const tieGeo = new THREE.BoxGeometry(0.16, 0.78, 0.06);
            const tieMat = regMat(new THREE.MeshStandardMaterial({ color: 0x224499, roughness: 0.4 }));
            const tie = new THREE.Mesh(tieGeo, tieMat);
            tie.position.set(0, 0.12, torsoDepth / 2 + 0.06);
            torsoGroup.add(tie);

        } else if (charKey === 'geto') {
            const sashGeo = new THREE.BoxGeometry(0.26, 1.38, 0.08);
            const sash = new THREE.Mesh(sashGeo, goldMat);
            sash.position.set(-0.25, 0.05, torsoDepth / 2 + 0.06);
            sash.rotation.z = -0.15;
            torsoGroup.add(sash);
        } else if (charKey === 'hakari') {
            // Gold Chain & Open Brawler Collar
            const chain = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.035, 8, 16), goldMat);
            chain.position.set(0, 0.32, torsoDepth / 2 + 0.04);
            chain.rotation.x = Math.PI / 4;
            torsoGroup.add(chain);
        }

        // ----------------------------------------------------
        // 2. HEAD & NECK RIGGING (CHISELED SCULPTED JAW & NECK)
        // ----------------------------------------------------
        const headGroup = new THREE.Group();
        headGroup.position.y = (charKey === 'panda' ? 0.80 : 0.88);
        torsoGroup.add(headGroup);
        parts.head = headGroup;

        const headMat = (charKey === 'panda' ? torsoMat : (charKey === 'todo' ? darkSkinMat : (charKey === 'jogo' ? regMat(new THREE.MeshStandardMaterial({ color: 0xa4b89b })) : skinMat)));

        // A. Sturdy Muscular Neck
        const neckRadius = headSize * 0.40;
        const neckMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(neckRadius * 0.90, neckRadius * 1.10, 0.42, 12),
            headMat
        );
        neckMesh.position.y = -0.21;
        neckMesh.castShadow = true;
        headGroup.add(neckMesh);

        // Sternocleidomastoid Muscle Pillars on Neck
        for (let s of [-1, 1]) {
            const scm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.07), headMat);
            scm.position.set(s * 0.10, -0.21, 0.08);
            scm.rotation.set(-0.2, 0, s * 0.22);
            headGroup.add(scm);
        }

        // B. Anatomical Cranium (Upper Skull)
        const craniumGeo = new THREE.SphereGeometry(headSize * 0.65, 14, 14);
        craniumGeo.scale(1.0, 1.14, 1.05);
        const cranium = new THREE.Mesh(craniumGeo, headMat);
        cranium.position.set(0, 0.08, 0);
        cranium.castShadow = true;
        headGroup.add(cranium);

        // C. Chiseled Jaw & Mandible
        const jaw = new THREE.Mesh(
            new THREE.BoxGeometry(headSize * 0.88, headSize * 0.45, headSize * 0.78),
            headMat
        );
        jaw.position.set(0, -0.06, 0.05);
        headGroup.add(jaw);

        // D. Defined Fighter Chin
        const chin = new THREE.Mesh(
            new THREE.BoxGeometry(headSize * 0.42, 0.22, 0.26),
            headMat
        );
        chin.position.set(0, -0.21, headSize * 0.38);
        headGroup.add(chin);

        // E. Brow Ridge
        const brow = new THREE.Mesh(
            new THREE.BoxGeometry(headSize * 0.90, 0.11, 0.20),
            headMat
        );
        brow.position.set(0, 0.12, headSize * 0.40);
        headGroup.add(brow);

        // F. Nose Bridge
        const nose = new THREE.Mesh(
            new THREE.ConeGeometry(0.055, 0.20, 4),
            headMat
        );
        nose.position.set(0, 0.01, headSize * 0.52);
        nose.rotation.x = Math.PI / 10;
        headGroup.add(nose);

        // G. Ears
        for (let s of [-1, 1]) {
            const ear = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.20, 0.13), headMat);
            ear.position.set(s * (headSize * 0.50), 0.04, -0.02);
            ear.rotation.y = s * 0.2;
            headGroup.add(ear);
        }

        // --- RYOMEN SUKUNA: TRUE HEIAN 4-EYE DEMONIC HEAD ---
        if (charKey === 'sukuna') {
            // Slicked-back Spiky Dark Wine Hair
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0x240b13, roughness: 0.5 }));
            for (let i = 0; i < 14; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.45, 6), hairMat);
                const a = (i / 14) * Math.PI * 2;
                spike.position.set(Math.cos(a) * 0.3, 0.36, Math.sin(a) * 0.3 - 0.05);
                spike.rotation.set(Math.sin(a) * 0.4 - 0.2, 0, -Math.cos(a) * 0.4);
                headGroup.add(spike);
            }

            // Demonic Carapace Mask over right eye side with bone horn spur
            const maskMat = regMat(new THREE.MeshStandardMaterial({ color: 0x2b0a14, roughness: 0.65, metalness: 0.2 }));
            const maskPlate = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 0.14), maskMat);
            maskPlate.position.set(0.19, 0.05, 0.38);
            headGroup.add(maskPlate);

            // Horn Spur on mask
            const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.32, 6), maskMat);
            horn.position.set(0.32, 0.28, 0.35);
            horn.rotation.z = -0.4;
            headGroup.add(horn);

            // 4 GLOWING CRIMSON EYES (2 on left, 2 on right demonic plate)
            const eyeGlowMat = regMat(new THREE.MeshBasicMaterial({ color: 0xff002b }));
            const eyes = [];

            // Left Upper & Lower Eyes
            const eLeftUp = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.045, 0.03), eyeGlowMat);
            eLeftUp.position.set(-0.14, 0.08, 0.41);
            headGroup.add(eLeftUp);
            eyes.push(eLeftUp);

            const eLeftLow = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.035, 0.03), eyeGlowMat);
            eLeftLow.position.set(-0.14, -0.04, 0.40);
            headGroup.add(eLeftLow);
            eyes.push(eLeftLow);

            // Right Upper & Lower Eyes (embedded in mask)
            const eRightUp = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.045, 0.03), eyeGlowMat);
            eRightUp.position.set(0.18, 0.09, 0.44);
            headGroup.add(eRightUp);
            eyes.push(eRightUp);

            const eRightLow = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.035, 0.03), eyeGlowMat);
            eRightLow.position.set(0.18, -0.03, 0.43);
            headGroup.add(eRightLow);
            eyes.push(eRightLow);

            parts.sukunaEyes = eyes;

            // Fanged Menacing Mouth Slit
            const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.03), regMat(new THREE.MeshBasicMaterial({ color: 0x110204 })));
            mouth.position.set(0.02, -0.22, 0.41);
            headGroup.add(mouth);

            // Forehead Cursed Crest Markings
            const crest = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.03), cursedTattooMat);
            crest.position.set(0, 0.22, 0.41);
            headGroup.add(crest);

        } else if (charKey === 'gojo') {
            // Satoru Gojo: Layered Snow-White Spiky Hair with Shimmer
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf6f9ff, roughness: 0.25 }));
            for (let i = 0; i < 18; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.52, 6), hairMat);
                const angle = (i / 18) * Math.PI * 2;
                spike.position.set(Math.cos(angle) * 0.32, 0.36 + Math.sin(i) * 0.08, Math.sin(angle) * 0.32);
                spike.rotation.set(Math.sin(angle) * 0.5, 0, -Math.cos(angle) * 0.5);
                headGroup.add(spike);
            }

            // Black Sorcerer Blindfold (Animates downward to reveal Six Eyes!)
            const blindfold = new THREE.Mesh(
                new THREE.BoxGeometry(0.70, 0.26, 0.70),
                regMat(new THREE.MeshStandardMaterial({ color: 0x101116, roughness: 0.35 }))
            );
            blindfold.position.set(0, 0.04, 0);
            headGroup.add(blindfold);
            parts.blindfold = blindfold;

            // SIX EYES (Luminous 4K Celestial Starburst Irises)
            const sixEyesMat = regMat(new THREE.MeshBasicMaterial({
                map: ProceduralTextureFactory.createGojoSixEyesTexture()
            }));
            for (let side of [-0.15, 0.15]) {
                const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), sixEyesMat);
                eye.position.set(side, 0.04, 0.40);
                headGroup.add(eye);
            }

        } else if (charKey === 'toji') {
            // Toji Black Tousled Hair
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0x0c0e14, roughness: 0.5 }));
            for (let i = 0; i < 14; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.48, 5), hairMat);
                const a = (i / 14) * Math.PI * 2;
                spike.position.set(Math.cos(a) * 0.31, 0.36, Math.sin(a) * 0.30);
                spike.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4);
                headGroup.add(spike);
            }
            // Signature Lip Scar on right side of mouth
            const scar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.04), regMat(new THREE.MeshBasicMaterial({ color: 0x6e3b3b })));
            scar.position.set(0.12, -0.16, headSize * 0.42);
            scar.rotation.z = -0.3;
            headGroup.add(scar);

        } else if (charKey === 'todo') {
            // Todo Topknot & Battle Scar across left eye
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0x0c0e14, roughness: 0.6 }));
            const topknot = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.44, 8), hairMat);
            topknot.position.set(0, 0.65, -0.1);
            headGroup.add(topknot);

            const scar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.38, 0.05), regMat(new THREE.MeshBasicMaterial({ color: 0x6e2828 })));
            scar.position.set(-0.16, 0.06, headSize * 0.41);
            scar.rotation.z = 0.25;
            headGroup.add(scar);

        } else if (charKey === 'megumi') {
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0x0c0e16, roughness: 0.6 }));
            for (let i = 0; i < 15; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.56, 5), hairMat);
                const a = (i / 15) * Math.PI * 2;
                spike.position.set(Math.cos(a) * 0.32, 0.38, Math.sin(a) * 0.32);
                spike.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6);
                headGroup.add(spike);
            }

        } else if (charKey === 'panda') {
            const darkPandaMat = regMat(new THREE.MeshStandardMaterial({ color: 0x111116 }));
            for (let side of [-1, 1]) {
                const ear = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), darkPandaMat);
                ear.position.set(side * 0.46, 0.50, 0);
                headGroup.add(ear);

                const patch = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.06), darkPandaMat);
                patch.position.set(side * 0.22, 0.06, 0.5);
                headGroup.add(patch);
            }
            const snout = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10), darkPandaMat);
            snout.position.set(0, -0.08, 0.54);
            headGroup.add(snout);

        } else if (charKey === 'jogo') {
            const volcMat = regMat(new THREE.MeshStandardMaterial({ color: 0x241811, roughness: 0.95 }));
            const crater = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.44, 0.58, 12), volcMat);
            crater.position.set(0, 0.50, 0);
            headGroup.add(crater);

            const lavaCore = new THREE.Mesh(new THREE.SphereGeometry(0.20, 10, 10), regMat(new THREE.MeshBasicMaterial({ color: 0xff3b00 })));
            lavaCore.position.set(0, 0.74, 0);
            headGroup.add(lavaCore);
            parts.lavaCore = lavaCore;

            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 12), regMat(new THREE.MeshBasicMaterial({ color: 0xffbb00 })));
            eye.position.set(0, 0.04, 0.42);
            headGroup.add(eye);
            const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.03), regMat(new THREE.MeshBasicMaterial({ color: 0x000000 })));
            pupil.position.set(0, 0.04, 0.56);
            headGroup.add(pupil);

        } else if (charKey === 'maki') {
            // Maki High Ponytail & Sorcerer Glasses
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0x162c1e, roughness: 0.5 }));
            const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.50, 14, 12), hairMat);
            hairCap.position.set(0, 0.12, -0.04);
            headGroup.add(hairCap);

            const ponytail = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.65, 8), hairMat);
            ponytail.position.set(0, 0.52, -0.32);
            ponytail.rotation.x = -0.5;
            headGroup.add(ponytail);

            const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.04), regMat(new THREE.MeshStandardMaterial({ color: 0x992222 })));
            glasses.position.set(0, 0.08, headSize * 0.44);
            headGroup.add(glasses);

        } else if (charKey === 'nanami') {
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0xe6c86e, roughness: 0.5 }));
            const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.50, 14, 12), hairMat);
            hairCap.position.set(0, 0.14, -0.04);
            headGroup.add(hairCap);

            // Nanami signature spectacles
            const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.10, 0.05), regMat(new THREE.MeshStandardMaterial({ color: 0x444455, metalness: 0.8 })));
            glasses.position.set(0, 0.08, headSize * 0.44);
            headGroup.add(glasses);

        } else {
            const defHairMat = regMat(new THREE.MeshStandardMaterial({
                color: (charKey === 'nobara' ? 0xd9682b : (charKey === 'mahito' ? 0x8a9ba8 : 0x11131a)),
                roughness: 0.6
            }));
            const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.50, 14, 12), defHairMat);
            hairCap.position.set(0, 0.12, -0.04);
            headGroup.add(hairCap);

            if (charKey === 'geto') {
                const topknot = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.40, 8), defHairMat);
                topknot.position.set(0, 0.62, -0.1);
                headGroup.add(topknot);
            }
            if (charKey === 'choso') {
                for (let side of [-0.3, 0.3]) {
                    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.58, 8), defHairMat);
                    tail.position.set(side, 0.45, -0.15);
                    headGroup.add(tail);
                }
                const bloodBar = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.04), regMat(new THREE.MeshBasicMaterial({ color: 0x770a1a })));
                bloodBar.position.set(0, 0.02, 0.42);
                headGroup.add(bloodBar);
            }
            if (charKey === 'yuji') {
                // Spiky pink/black top spikes
                const pinkHairMat = regMat(new THREE.MeshStandardMaterial({ color: 0xeb6b8b, roughness: 0.5 }));
                for (let i = 0; i < 12; i++) {
                    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.38, 5), pinkHairMat);
                    const a = (i / 12) * Math.PI * 2;
                    spike.position.set(Math.cos(a) * 0.28, 0.36, Math.sin(a) * 0.28);
                    spike.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4);
                    headGroup.add(spike);
                }
            }
        }

        // ----------------------------------------------------
        // 3. ARMS RIGGING (BOULDER SHOULDERS, BICEPS, TRICEPS, FOREARMS, FISTS)
        // ----------------------------------------------------
        const sleeveMat = (charKey === 'todo' ? darkSkinMat : (charKey === 'sukuna' ? skinMat : torsoMat));

        function createArm(side, shoulderY, shoulderZ, isLower = false) {
            const shoulderGroup = new THREE.Group();
            shoulderGroup.position.set(side * (torsoWidth / 2 + 0.16), shoulderY, shoulderZ);
            torsoGroup.add(shoulderGroup);

            const thisArmMat = (isLower ? skinMat : sleeveMat);

            // A. 3-Headed Boulder Deltoid (Shoulder Cap)
            // Lateral Deltoid (Outward flair)
            const latDelt = new THREE.Mesh(
                new THREE.BoxGeometry(armThickness * 1.25, armThickness * 1.45, armThickness * 1.15),
                thisArmMat
            );
            latDelt.position.set(side * (armThickness * 0.15), -0.06, 0);
            latDelt.rotation.z = side * -0.15;
            latDelt.castShadow = true;
            shoulderGroup.add(latDelt);

            // Anterior Deltoid (Front head)
            const antDelt = new THREE.Mesh(
                new THREE.BoxGeometry(armThickness * 0.88, armThickness * 1.05, armThickness * 0.72),
                thisArmMat
            );
            antDelt.position.set(side * (armThickness * 0.05), -0.08, armThickness * 0.35);
            shoulderGroup.add(antDelt);

            // Posterior Deltoid (Rear head)
            const postDelt = new THREE.Mesh(
                new THREE.BoxGeometry(armThickness * 0.88, armThickness * 1.05, armThickness * 0.72),
                thisArmMat
            );
            postDelt.position.set(side * (armThickness * 0.05), -0.08, -armThickness * 0.35);
            shoulderGroup.add(postDelt);

            // B. Upper Arm Core
            const upperArm = new THREE.Mesh(
                new THREE.CylinderGeometry(armThickness * 0.95, armThickness * 0.82, 0.65, 12),
                thisArmMat
            );
            upperArm.position.y = -0.34;
            upperArm.castShadow = true;
            shoulderGroup.add(upperArm);

            // Bicep Muscle Peak
            const bicep = new THREE.Mesh(
                new THREE.BoxGeometry(armThickness * 0.82, 0.38, armThickness * 0.48),
                thisArmMat
            );
            bicep.position.set(0, -0.32, armThickness * 0.44);
            bicep.castShadow = true;
            shoulderGroup.add(bicep);

            // Tricep Horseshoe
            const tricep = new THREE.Mesh(
                new THREE.BoxGeometry(armThickness * 0.92, 0.44, armThickness * 0.52),
                thisArmMat
            );
            tricep.position.set(0, -0.28, -armThickness * 0.42);
            tricep.castShadow = true;
            shoulderGroup.add(tricep);

            // C. Forearm Group (Elbow joint pivot)
            const forearmGroup = new THREE.Group();
            forearmGroup.position.set(0, -0.68, 0);
            shoulderGroup.add(forearmGroup);

            // Elbow Joint Plate
            const elbow = new THREE.Mesh(
                new THREE.BoxGeometry(armThickness * 0.82, 0.16, armThickness * 0.82),
                thisArmMat
            );
            elbow.position.set(0, 0, 0);
            forearmGroup.add(elbow);

            // Muscular Forearm Core
            const thisForearmMat = (charKey === 'panda' ? regMat(new THREE.MeshStandardMaterial({ color: 0x111116 })) : skinMat);
            const forearm = new THREE.Mesh(
                new THREE.CylinderGeometry(armThickness * 0.98, armThickness * 0.68, 0.65, 12),
                thisForearmMat
            );
            forearm.position.y = -0.34;
            forearm.castShadow = true;
            forearmGroup.add(forearm);

            // Brachioradialis Muscle Sweep (Outer forearm flare)
            const brachy = new THREE.Mesh(
                new THREE.BoxGeometry(armThickness * 0.46, 0.38, armThickness * 0.68),
                thisForearmMat
            );
            brachy.position.set(side * (armThickness * 0.44), -0.24, 0.04);
            forearmGroup.add(brachy);

            // D. Fighter Clenched Fist
            const handMesh = new THREE.Group();
            handMesh.position.set(0, -0.68, 0);
            forearmGroup.add(handMesh);

            const palm = new THREE.Mesh(
                new THREE.BoxGeometry(armThickness * 0.88, 0.24, armThickness * 0.78),
                skinMat
            );
            palm.position.y = -0.06;
            palm.castShadow = true;
            handMesh.add(palm);

            const knuckles = new THREE.Mesh(
                new THREE.BoxGeometry(armThickness * 0.86, 0.08, 0.12),
                regMat(new THREE.MeshStandardMaterial({ color: 0xcc9977, roughness: 0.5 }))
            );
            knuckles.position.set(0, -0.16, armThickness * 0.28);
            handMesh.add(knuckles);

            const thumb = new THREE.Mesh(
                new THREE.BoxGeometry(armThickness * 0.32, 0.16, armThickness * 0.32),
                skinMat
            );
            thumb.position.set(side * (armThickness * 0.44), -0.05, armThickness * 0.18);
            handMesh.add(thumb);

            // Sukuna Obsidian Black Claws on Fingers with Glowing Tips!
            if (charKey === 'sukuna') {
                for (let f = -0.07; f <= 0.07; f += 0.035) {
                    const claw = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.15, 6), clawMat);
                    claw.position.set(f, -0.18, armThickness * 0.28);
                    claw.rotation.x = Math.PI;
                    handMesh.add(claw);
                }
            }

            return { shoulder: shoulderGroup, forearm: forearmGroup, hand: handMesh };
        }

        // Standard Upper Pair of Arms
        const leftUpper = createArm(-1, 0.48, 0);
        const rightUpper = createArm(1, 0.48, 0);
        parts.leftShoulder = leftUpper.shoulder;
        parts.leftForearm = leftUpper.forearm;
        parts.leftHand = leftUpper.hand;
        parts.rightShoulder = rightUpper.shoulder;
        parts.rightForearm = rightUpper.forearm;
        parts.rightHand = rightUpper.hand;

        // --- RYOMEN SUKUNA: 4 FULLY FUNCTIONAL MUSCULAR ARMS ---
        if (charKey === 'sukuna') {
            const leftLower = createArm(-1, -0.06, 0.08, true);
            const rightLower = createArm(1, -0.06, 0.08, true);
            parts.leftLowerShoulder = leftLower.shoulder;
            parts.leftLowerForearm = leftLower.forearm;
            parts.leftLowerHand = leftLower.hand;
            parts.rightLowerShoulder = rightLower.shoulder;
            parts.rightLowerForearm = rightLower.forearm;
            parts.rightLowerHand = rightLower.hand;
        }

        // ----------------------------------------------------
        // 4. LEGS RIGGING (QUADS, KNEECAPS, CALVES, COMBAT BOOTS)
        // ----------------------------------------------------
        for (let side of [-1, 1]) {
            const hipGroup = new THREE.Group();
            hipGroup.position.set(side * (torsoWidth / 4), -0.62, 0);
            torsoGroup.add(hipGroup);

            // A. Thigh Core (Tapered Athletic Femur)
            const thigh = new THREE.Mesh(
                new THREE.CylinderGeometry(legThickness * 1.05, legThickness * 0.82, 0.72, 12),
                pantsMat
            );
            thigh.position.y = -0.36;
            thigh.castShadow = true;
            hipGroup.add(thigh);

            // Vastus Lateralis (Outer quad sweep)
            const quadSweep = new THREE.Mesh(
                new THREE.BoxGeometry(legThickness * 0.52, 0.52, legThickness * 0.82),
                pantsMat
            );
            quadSweep.position.set(side * (legThickness * 0.54), -0.32, 0.02);
            hipGroup.add(quadSweep);

            // Vastus Medialis (Teardrop quad above inner knee)
            const quadTeardrop = new THREE.Mesh(
                new THREE.BoxGeometry(legThickness * 0.44, 0.28, legThickness * 0.62),
                pantsMat
            );
            quadTeardrop.position.set(-side * (legThickness * 0.36), -0.52, legThickness * 0.26);
            hipGroup.add(quadTeardrop);

            // Hamstrings (Back of thigh curve)
            const hamstring = new THREE.Mesh(
                new THREE.BoxGeometry(legThickness * 0.82, 0.46, legThickness * 0.48),
                pantsMat
            );
            hamstring.position.set(0, -0.36, -legThickness * 0.42);
            hipGroup.add(hamstring);

            // B. Knee Joint & Calf Group
            const calfGroup = new THREE.Group();
            calfGroup.position.set(0, -0.72, 0);
            hipGroup.add(calfGroup);

            // Patella (Kneecap plate)
            const kneeCap = new THREE.Mesh(
                new THREE.BoxGeometry(legThickness * 0.72, 0.22, legThickness * 0.48),
                pantsMat
            );
            kneeCap.position.set(0, 0, legThickness * 0.38);
            calfGroup.add(kneeCap);

            // Calf Core
            const calf = new THREE.Mesh(
                new THREE.CylinderGeometry(legThickness * 0.92, legThickness * 0.68, 0.72, 12),
                pantsMat
            );
            calf.position.y = -0.36;
            calf.castShadow = true;
            calfGroup.add(calf);

            // Gastrocnemius (Muscular Diamond Calf Bulge)
            const calfMuscle = new THREE.Mesh(
                new THREE.BoxGeometry(legThickness * 0.82, 0.38, legThickness * 0.56),
                pantsMat
            );
            calfMuscle.position.set(0, -0.22, -legThickness * 0.38);
            calfGroup.add(calfMuscle);

            // C. Heavy Sorcerer Combat Boot
            const bootGroup = new THREE.Group();
            bootGroup.position.set(0, -0.72, 0);
            calfGroup.add(bootGroup);

            const bootAnkle = new THREE.Mesh(
                new THREE.BoxGeometry(legThickness * 1.35, 0.24, legThickness * 1.55),
                bootMat
            );
            bootAnkle.position.set(0, 0.08, 0.02);
            bootGroup.add(bootAnkle);

            const bootFoot = new THREE.Mesh(
                new THREE.BoxGeometry(legThickness * 1.45, 0.22, legThickness * 2.2),
                bootMat
            );
            bootFoot.position.set(0, -0.06, 0.24);
            bootFoot.castShadow = true;
            bootGroup.add(bootFoot);

            const bootSole = new THREE.Mesh(
                new THREE.BoxGeometry(legThickness * 1.55, 0.10, legThickness * 2.35),
                regMat(new THREE.MeshStandardMaterial({ color: 0x08080c, roughness: 0.9 }))
            );
            bootSole.position.set(0, -0.18, 0.24);
            bootGroup.add(bootSole);

            if (side === -1) {
                parts.leftHip = hipGroup;
                parts.leftCalf = calfGroup;
            } else {
                parts.rightHip = hipGroup;
                parts.rightCalf = calfGroup;
            }
        }

        // ----------------------------------------------------
        // 5. SIGNATURE WEAPONS & COMPANIONS
        // ----------------------------------------------------
        if (charKey === 'nobara') {
            const hammerGroup = new THREE.Group();
            const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.95, 8), regMat(new THREE.MeshStandardMaterial({ color: 0x6e4a2c })));
            handle.position.y = 0.22;
            hammerGroup.add(handle);
            const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.16), metalMat);
            hammerHead.position.set(0, 0.65, 0);
            hammerGroup.add(hammerHead);
            parts.rightHand.add(hammerGroup);
            parts.weapon = hammerGroup;

        } else if (charKey === 'nanami') {
            const cleaverGroup = new THREE.Group();
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.95, 0.04), regMat(new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.85 })));
            blade.position.y = 0.48;
            cleaverGroup.add(blade);
            parts.rightHand.add(cleaverGroup);
            parts.weapon = cleaverGroup;

        } else if (charKey === 'toji') {
            const daggerGroup = new THREE.Group();
            const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.38, 8), regMat(new THREE.MeshStandardMaterial({ color: 0x111116 })));
            daggerGroup.add(hilt);
            const dBlade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.03), metalMat);
            dBlade.position.y = 0.48;
            daggerGroup.add(dBlade);
            parts.rightHand.add(daggerGroup);
            parts.weapon = daggerGroup;

        } else if (charKey === 'maki') {
            const naginataGroup = new THREE.Group();
            const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.8, 8), regMat(new THREE.MeshStandardMaterial({ color: 0x5a2d18 })));
            staff.position.y = 0.2;
            naginataGroup.add(staff);
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.03), metalMat);
            blade.position.set(0, 1.2, 0);
            naginataGroup.add(blade);
            parts.rightHand.add(naginataGroup);
            parts.weapon = naginataGroup;

        } else if (charKey === 'yuta') {
            const katanaGroup = new THREE.Group();
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.35, 0.02), metalMat);
            blade.position.y = 0.68;
            katanaGroup.add(blade);
            parts.rightHand.add(katanaGroup);
            parts.weapon = katanaGroup;

            // Rika Spectral Companion floating behind Yuta
            const rikaGroup = new THREE.Group();
            rikaGroup.position.set(0, 2.3, -1.3);
            const rikaHead = new THREE.Mesh(
                new THREE.SphereGeometry(0.7, 12, 12),
                regMat(new THREE.MeshStandardMaterial({ color: 0xe0e5ea, transparent: true, opacity: 0.65 }))
            );
            rikaGroup.add(rikaHead);
            group.add(rikaGroup);
            parts.rika = rikaGroup;

        } else if (charKey === 'megumi') {
            // 3D Divine Dog (Totality) Companion Wolf!
            const dogGroup = new THREE.Group();
            dogGroup.position.set(1.4, 0, 0.5);
            const wolfMat = regMat(new THREE.MeshStandardMaterial({ color: 0x181a24, roughness: 0.65 }));
            const dogBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 1.2), wolfMat);
            dogBody.position.y = 0.6;
            dogGroup.add(dogBody);

            const dogHead = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.5), wolfMat);
            dogHead.position.set(0, 0.85, 0.75);
            dogGroup.add(dogHead);
            const dogSnout = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.35), wolfMat);
            dogSnout.position.set(0, 0.78, 1.05);
            dogGroup.add(dogSnout);

            const dogEyeMat = regMat(new THREE.MeshBasicMaterial({ color: 0xff0033 }));
            for (let side of [-0.14, 0.14]) {
                const eye = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.03), dogEyeMat);
                eye.position.set(side, 0.92, 0.98);
                dogGroup.add(eye);
            }
            group.add(dogGroup);
            parts.divineDog = dogGroup;

        } else if (charKey === 'gojo') {
            // 3D Shimmering Infinity Barrier Sphere
            const barrierGeo = new THREE.SphereGeometry(1.7, 28, 20);
            const barrierMat = regMat(new THREE.MeshBasicMaterial({
                color: 0x00b0ff,
                transparent: true,
                opacity: 0.28,
                wireframe: true
            }));
            const barrier = new THREE.Mesh(barrierGeo, barrierMat);
            torsoGroup.add(barrier);
            parts.infinityBarrier = barrier;

            // Rotating Lapse Blue & Reversal Red Orbs
            const blueOrb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), regMat(new THREE.MeshBasicMaterial({ color: 0x00e5ff })));
            const redOrb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), regMat(new THREE.MeshBasicMaterial({ color: 0xff0044 })));
            torsoGroup.add(blueOrb);
            torsoGroup.add(redOrb);
            parts.blueOrb = blueOrb;
            parts.redOrb = redOrb;
        }

        // Cursed Energy Ground Halo
        const auraGeo = new THREE.RingGeometry(0.85, 1.45, 24);
        auraGeo.rotateX(-Math.PI / 2);
        const auraMat = regMat(new THREE.MeshBasicMaterial({
            color: new THREE.Color(charData.color || '#00e5ff'),
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide
        }));
        const auraMesh = new THREE.Mesh(auraGeo, auraMat);
        auraMesh.position.y = 0.05;
        group.add(auraMesh);
        parts.aura = auraMesh;

        return new CharacterModel3D(charKey, group, parts, materials, charData);
    }
}

// ----------------------------------------------------
// PROCEDURAL ANIMATOR CONTROLLER (4-ARM SUPPORT FOR SUKUNA)
// ----------------------------------------------------
class CharacterModel3D {
    constructor(charKey, rootGroup, parts, materials, data) {
        this.charKey = charKey;
        this.root = rootGroup;
        this.parts = parts;
        this.materials = materials;
        this.data = data;
        this.animTime = Math.random() * 10;
        this.originalColors = materials.map(m => m.color ? m.color.clone() : null);
        this.flashCounter = 0;
    }

    flashHurt() {
        this.flashCounter = 8;
        this.materials.forEach(m => {
            if (m.color) m.color.setHex(0xff3344);
        });
    }

    update(state, stateTimer, vx, vz, vy, isGrounded, isBlocking, animFrame, isJackpot = false) {
        this.animTime += 0.05;
        const t = this.animTime;

        // Reset Hurt Flash
        if (this.flashCounter > 0) {
            this.flashCounter--;
            if (this.flashCounter === 0) {
                this.materials.forEach((m, idx) => {
                    if (m.color && this.originalColors[idx]) {
                        m.color.copy(this.originalColors[idx]);
                    }
                });
            }
        }

        // Sukuna 4-Eyes Animated Crimson Pulse
        if (this.parts.sukunaEyes) {
            const glow = 0.8 + Math.sin(t * 5) * 0.2;
            this.parts.sukunaEyes.forEach(eye => {
                eye.scale.set(glow, glow, 1);
            });
        }

        // Gojo Six Eyes Reveal: Blindfold slips down during Ultimate/Domain!
        if (this.parts.blindfold) {
            if (state === 'ultimate' || state === 'attack1') {
                this.parts.blindfold.position.y = -0.25; // Slipped down to reveal Six Eyes!
            } else {
                this.parts.blindfold.position.y = 0.04;
            }
        }

        // Jogo Volcanic Molten Core Pulse
        if (this.parts.lavaCore) {
            const s = 1.0 + Math.sin(t * 6) * 0.15;
            this.parts.lavaCore.scale.set(s, s, s);
        }

        // Aura pulse
        if (this.parts.aura) {
            this.parts.aura.rotation.z += 0.03;
            const s = 1.0 + Math.sin(t * 3) * 0.12;
            this.parts.aura.scale.set(s, s, s);
        }

        // Gojo Infinity Barrier & Orbs
        if (this.parts.infinityBarrier) {
            this.parts.infinityBarrier.rotation.y += 0.02;
            if (this.parts.blueOrb && this.parts.redOrb) {
                const orbDist = 1.45;
                this.parts.blueOrb.position.set(Math.cos(t * 2.5) * orbDist, 0.2 + Math.sin(t * 2.5) * 0.25, Math.sin(t * 2.5) * orbDist);
                this.parts.redOrb.position.set(Math.cos(t * 2.5 + Math.PI) * orbDist, 0.2 + Math.sin(t * 2.5 + Math.PI) * 0.25, Math.sin(t * 2.5 + Math.PI) * orbDist);
            }
        }

        // Divine Dog tracking
        if (this.parts.divineDog) {
            this.parts.divineDog.position.y = Math.abs(Math.sin(t * 4)) * 0.08;
        }

        // Rika floating sway
        if (this.parts.rika) {
            this.parts.rika.position.y = 2.3 + Math.sin(t * 2) * 0.25;
        }

        const isMoving = (Math.abs(vx) > 0.05 || Math.abs(vz) > 0.05);

        // ----------------------------------------------------
        // SKELETAL STATES & 4-ARM ANIMATIONS
        // ----------------------------------------------------
        if (state === 'dead') {
            this.parts.torso.position.y = 0.4;
            this.parts.torso.rotation.x = -Math.PI / 2;
            this.parts.torso.rotation.y = 0;
            this.parts.torso.rotation.z = 0;
            return;
        }

        if (isBlocking) {
            // Guard Stance
            this.parts.torso.position.y = 1.8;
            this.parts.torso.rotation.set(0.15, 0, 0);

            // Upper Arms X-Guard
            this.parts.leftShoulder.rotation.set(0.9, 0.6, -0.4);
            this.parts.rightShoulder.rotation.set(0.9, -0.6, 0.4);
            this.parts.leftForearm.rotation.set(0.8, 0, 0);
            this.parts.rightForearm.rotation.set(0.8, 0, 0);

            // Sukuna Lower Arms Double X-Barrier!
            if (this.parts.leftLowerShoulder && this.parts.rightLowerShoulder) {
                this.parts.leftLowerShoulder.rotation.set(0.6, 0.4, -0.3);
                this.parts.rightLowerShoulder.rotation.set(0.6, -0.4, 0.3);
                this.parts.leftLowerForearm.rotation.set(0.9, 0, 0);
                this.parts.rightLowerForearm.rotation.set(0.9, 0, 0);
            }
            return;
        }

        if (!isGrounded) {
            // In-air Jump Pose
            this.parts.torso.position.y = 1.9;
            this.parts.torso.rotation.set(-0.2, 0, 0);

            this.parts.leftShoulder.rotation.set(-0.8, 0, -0.5);
            this.parts.rightShoulder.rotation.set(-0.8, 0, 0.5);
            this.parts.leftHip.rotation.set(-0.6, 0, 0);
            this.parts.rightHip.rotation.set(-0.3, 0, 0);
            this.parts.leftCalf.rotation.set(0.8, 0, 0);
            this.parts.rightCalf.rotation.set(0.5, 0, 0);

            if (this.parts.leftLowerShoulder && this.parts.rightLowerShoulder) {
                this.parts.leftLowerShoulder.rotation.set(-0.5, 0.3, -0.3);
                this.parts.rightLowerShoulder.rotation.set(-0.5, -0.3, 0.3);
            }
            return;
        }

        if (state === 'attack1') {
            // Basic Attack: Dismantle / Fist Strike
            const progress = (22 - stateTimer) / 22;
            const strike = Math.sin(progress * Math.PI);

            this.parts.torso.rotation.y = strike * 0.45;
            this.parts.rightShoulder.rotation.set(-1.2 * strike, 0, 0);
            this.parts.rightForearm.rotation.set(-0.3 * strike, 0, 0);
            this.parts.leftShoulder.rotation.set(0.4 * strike, 0, -0.2);

            // Sukuna: Lower Left Arm strikes forward in sync!
            if (this.parts.leftLowerShoulder && this.parts.rightLowerShoulder) {
                this.parts.leftLowerShoulder.rotation.set(-1.1 * strike, 0.2, 0);
                this.parts.rightLowerShoulder.rotation.set(0.3 * strike, 0, 0);
            }
            return;
        }

        if (state === 'attack2') {
            // Skill 1: Cleave / Flurry
            const progress = (34 - stateTimer) / 34;
            const spin = Math.sin(progress * Math.PI);

            this.parts.torso.rotation.y = spin * 1.2;
            this.parts.rightHip.rotation.set(-1.4 * spin, 0, 0.3 * spin);
            this.parts.rightCalf.rotation.set(0.8 * spin, 0, 0);
            this.parts.leftShoulder.rotation.set(0.6 * spin, 0, -0.6 * spin);
            this.parts.rightShoulder.rotation.set(-0.8 * spin, 0, 0.4 * spin);

            // Sukuna: Lower Arms spin in cutting whirlwind!
            if (this.parts.leftLowerShoulder && this.parts.rightLowerShoulder) {
                this.parts.leftLowerShoulder.rotation.set(-0.9 * spin, 0, -0.5 * spin);
                this.parts.rightLowerShoulder.rotation.set(0.7 * spin, 0, 0.5 * spin);
            }
            return;
        }

        if (state === 'attack3') {
            // Skill 2: Heavy Attack / Fuga Flame Arrow Draw
            const progress = (36 - stateTimer) / 36;
            const slam = Math.sin(progress * Math.PI);

            this.parts.torso.position.y = 1.9 + slam * 0.4;
            this.parts.torso.rotation.x = slam * 0.4;
            this.parts.rightShoulder.rotation.set(-1.8 * slam, 0, 0);
            this.parts.leftShoulder.rotation.set(-1.8 * slam, 0, 0);

            // Sukuna: Lower arms steady the flame arrow launch point!
            if (this.parts.leftLowerShoulder && this.parts.rightLowerShoulder) {
                this.parts.leftLowerShoulder.rotation.set(-1.4 * slam, 0.3, 0);
                this.parts.rightLowerShoulder.rotation.set(-1.4 * slam, -0.3, 0);
            }
            return;
        }

        if (state === 'ultimate') {
            // Domain Expansion: Signature Hand Signs & Levitation!
            this.parts.torso.position.y = 2.4 + Math.sin(t * 4) * 0.15;
            this.parts.torso.rotation.set(0, 0, 0);

            // Upper hands clasped in Domain Mudra
            this.parts.leftShoulder.rotation.set(-0.9, 0.7, -0.3);
            this.parts.rightShoulder.rotation.set(-0.9, -0.7, 0.3);
            this.parts.leftForearm.rotation.set(0.7, 0, 0);
            this.parts.rightForearm.rotation.set(0.7, 0, 0);

            // SUKUNA TRUE ENMATEN 4-ARM HAND SIGN
            if (this.parts.leftLowerShoulder && this.parts.rightLowerShoulder) {
                this.parts.leftLowerShoulder.rotation.set(-0.7, 0.5, -0.2);
                this.parts.rightLowerShoulder.rotation.set(-0.7, -0.5, 0.2);
                this.parts.leftLowerForearm.rotation.set(0.85, 0, 0);
                this.parts.rightLowerForearm.rotation.set(0.85, 0, 0);
            }

            this.parts.leftHip.rotation.set(0.2, 0, -0.2);
            this.parts.rightHip.rotation.set(0.2, 0, 0.2);
            return;
        }

        if (state === 'hurt') {
            // Hurt Recoil
            this.parts.torso.position.y = 1.8;
            this.parts.torso.rotation.set(-0.4, 0, (Math.random() - 0.5) * 0.2);
            this.parts.leftShoulder.rotation.set(0.6, 0, -0.5);
            this.parts.rightShoulder.rotation.set(0.6, 0, 0.5);

            if (this.parts.leftLowerShoulder && this.parts.rightLowerShoulder) {
                this.parts.leftLowerShoulder.rotation.set(0.4, 0, -0.3);
                this.parts.rightLowerShoulder.rotation.set(0.4, 0, 0.3);
            }
            return;
        }

        if (isMoving) {
            // 3D Run / Stride
            const runSpeed = 8.5;
            const swing = Math.sin(t * runSpeed);

            this.parts.torso.position.y = 1.9 + Math.abs(Math.sin(t * runSpeed)) * 0.12;
            this.parts.torso.rotation.set(0.18, 0, -swing * 0.05);

            // Legs
            this.parts.leftHip.rotation.set(swing * 0.8, 0, 0);
            this.parts.rightHip.rotation.set(-swing * 0.8, 0, 0);
            this.parts.leftCalf.rotation.set(Math.max(0, -swing * 0.9), 0, 0);
            this.parts.rightCalf.rotation.set(Math.max(0, swing * 0.9), 0, 0);

            // Upper Arms
            this.parts.leftShoulder.rotation.set(-swing * 0.7, 0, 0);
            this.parts.rightShoulder.rotation.set(swing * 0.7, 0, 0);
            this.parts.leftForearm.rotation.set(0.3, 0, 0);
            this.parts.rightForearm.rotation.set(0.3, 0, 0);

            // Sukuna Lower Arms Counter-Swing
            if (this.parts.leftLowerShoulder && this.parts.rightLowerShoulder) {
                this.parts.leftLowerShoulder.rotation.set(swing * 0.5, 0.2, 0);
                this.parts.rightLowerShoulder.rotation.set(-swing * 0.5, -0.2, 0);
                this.parts.leftLowerForearm.rotation.set(0.5, 0, 0);
                this.parts.rightLowerForearm.rotation.set(0.5, 0, 0);
            }
        } else {
            // Idle Breathing Stance
            const breath = Math.sin(t * 2);
            this.parts.torso.position.y = 1.9 + breath * 0.04;
            this.parts.torso.rotation.set(0, 0, 0);

            // Upper Arms
            this.parts.leftShoulder.rotation.set(0.1 + breath * 0.03, 0, -0.15);
            this.parts.rightShoulder.rotation.set(0.1 + breath * 0.03, 0, 0.15);
            this.parts.leftForearm.rotation.set(0.2, 0, 0);
            this.parts.rightForearm.rotation.set(0.2, 0, 0);

            // Sukuna Lower Arms: Poised Combat Mudra at mid-torso
            if (this.parts.leftLowerShoulder && this.parts.rightLowerShoulder) {
                this.parts.leftLowerShoulder.rotation.set(-0.25 + breath * 0.02, 0.35, -0.1);
                this.parts.rightLowerShoulder.rotation.set(-0.25 + breath * 0.02, -0.35, 0.1);
                this.parts.leftLowerForearm.rotation.set(0.65, 0, 0);
                this.parts.rightLowerForearm.rotation.set(0.65, 0, 0);
            }

            this.parts.leftHip.rotation.set(0, 0, -0.08);
            this.parts.rightHip.rotation.set(0, 0, 0.08);
            this.parts.leftCalf.rotation.set(0, 0, 0);
            this.parts.rightCalf.rotation.set(0, 0, 0);
        }
    }
}
