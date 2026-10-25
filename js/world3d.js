// Open World 3D Environment Engine for Battle Arena: Clash of Sorcerors
// Features: Expansive multi-zone 3D terrain, Jujutsu High, Shinjuku Urban District, Cursed Crater,
// Dynamic Sky & Day/Night Atmosphere, Real-Time Shadows, and Live 3D Domain Expansions

class World3D {
    constructor(scene) {
        this.scene = scene;
        this.zones = {};
        this.landmarks = [];
        this.activeDomain = null;
        this.domainGroup = new THREE.Group();
        this.scene.add(this.domainGroup);

        this.bounds = {
            minX: -100,
            maxX: 100,
            minZ: -100,
            maxZ: 100
        };

        // Environmental Particle System
        this.envParticles = null;
        this.envParticleData = [];

        this.initLighting();
        this.initSky();
        this.initTerrain();
        this.initJujutsuHighZone();
        this.initShinjukuZone();
        this.initCursedCraterZone();
        this.initEnvironmentalParticles();
    }

    // ----------------------------------------------------
    // LIGHTING & ATMOSPHERE
    // ----------------------------------------------------
    initLighting() {
        // Ambient Light
        this.ambientLight = new THREE.AmbientLight(0xddeeff, 0.45);
        this.scene.add(this.ambientLight);

        // Hemisphere Light (Sky and Ground Bounce)
        this.hemiLight = new THREE.HemisphereLight(0xaaccff, 0x334422, 0.45);
        this.hemiLight.position.set(0, 50, 0);
        this.scene.add(this.hemiLight);

        // Main Sun / Moon Directional Light with Shadows
        this.dirLight = new THREE.DirectionalLight(0xfff5e6, 1.1);
        this.dirLight.position.set(45, 80, 40);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.near = 1;
        this.dirLight.shadow.camera.far = 250;

        const d = 75;
        this.dirLight.shadow.camera.left = -d;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = -d;
        this.dirLight.shadow.bias = -0.0008;
        this.scene.add(this.dirLight);

        // Atmospheric Fog
        this.scene.fog = new THREE.FogExp2(0x121422, 0.0075);
    }

    initSky() {
        // Celestial Sky Dome
        const skyGeo = new THREE.SphereGeometry(220, 32, 24);
        const skyMat = new THREE.MeshBasicMaterial({
            color: 0x14182e,
            side: THREE.BackSide
        });
        this.skyDome = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(this.skyDome);

        // Distant Stars
        const starGeo = new THREE.BufferGeometry();
        const starCount = 800;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 210;
            const sinPhi = Math.sin(phi);
            starPositions[i * 3] = r * sinPhi * Math.cos(theta);
            starPositions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 15; // Upper hemisphere
            starPositions[i * 3 + 2] = r * sinPhi * Math.sin(theta);
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.6,
            transparent: true,
            opacity: 0.85
        });
        this.stars = new THREE.Points(starGeo, starMat);
        this.scene.add(this.stars);

        // Distant Tokyo Skyline Silhouettes
        this.initDistantSkyline();
    }

    initDistantSkyline() {
        const skylineGroup = new THREE.Group();
        const buildingMat = new THREE.MeshLambertMaterial({
            color: 0x0c0f1a,
            emissive: 0x05070d
        });

        for (let i = 0; i < 48; i++) {
            const angle = (i / 48) * Math.PI * 2;
            const radius = 140 + (Math.random() * 25);
            const width = 8 + Math.random() * 14;
            const depth = 8 + Math.random() * 14;
            const height = 25 + Math.random() * 55;

            const bGeo = new THREE.BoxGeometry(width, height, depth);
            const bMesh = new THREE.Mesh(bGeo, buildingMat);
            bMesh.position.set(
                Math.cos(angle) * radius,
                height / 2 - 2,
                Math.sin(angle) * radius
            );
            bMesh.rotation.y = angle;
            skylineGroup.add(bMesh);
        }
        this.scene.add(skylineGroup);
    }

    // ----------------------------------------------------
    // VAST 3D OPEN TERRAIN
    // ----------------------------------------------------
    initTerrain() {
        // Base ground plane
        const groundGeo = new THREE.PlaneGeometry(280, 280, 32, 32);
        groundGeo.rotateX(-Math.PI / 2);

        // Procedural Grid Texture on Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Dark slate ground
        ctx.fillStyle = '#10131d';
        ctx.fillRect(0, 0, 512, 512);

        // Subtle paving lines
        ctx.strokeStyle = '#1b2234';
        ctx.lineWidth = 4;
        for (let i = 0; i <= 512; i += 64) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
        }

        // Texture with repeat
        const groundTex = new THREE.CanvasTexture(canvas);
        groundTex.wrapS = THREE.RepeatWrapping;
        groundTex.wrapT = THREE.RepeatWrapping;
        groundTex.repeat.set(24, 24);

        const groundMat = new THREE.MeshStandardMaterial({
            map: groundTex,
            roughness: 0.85,
            metalness: 0.12
        });

        this.ground = new THREE.Mesh(groundGeo, groundMat);
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);

        // Central Battle Arena Circle (The Sorcerer Grand Ring)
        const arenaGeo = new THREE.RingGeometry(0, 24, 64);
        arenaGeo.rotateX(-Math.PI / 2);

        const ringCanvas = document.createElement('canvas');
        ringCanvas.width = 512;
        ringCanvas.height = 512;
        const rCtx = ringCanvas.getContext('2d');
        rCtx.fillStyle = '#181e2e';
        rCtx.beginPath();
        rCtx.arc(256, 256, 250, 0, Math.PI * 2);
        rCtx.fill();

        rCtx.strokeStyle = '#ffd700';
        rCtx.lineWidth = 8;
        rCtx.beginPath();
        rCtx.arc(256, 256, 240, 0, Math.PI * 2);
        rCtx.stroke();

        rCtx.strokeStyle = '#00e5ff';
        rCtx.lineWidth = 4;
        rCtx.beginPath();
        rCtx.arc(256, 256, 180, 0, Math.PI * 2);
        rCtx.stroke();

        // Jujutsu Arcane Emblem
        rCtx.strokeStyle = '#ff0055';
        rCtx.lineWidth = 6;
        for (let i = 0; i < 4; i++) {
            rCtx.save();
            rCtx.translate(256, 256);
            rCtx.rotate((i * Math.PI) / 2);
            rCtx.beginPath();
            rCtx.moveTo(0, -140);
            rCtx.lineTo(35, -70);
            rCtx.lineTo(0, 0);
            rCtx.lineTo(-35, -70);
            rCtx.closePath();
            rCtx.stroke();
            rCtx.restore();
        }

        const ringTex = new THREE.CanvasTexture(ringCanvas);
        const ringMat = new THREE.MeshBasicMaterial({
            map: ringTex,
            transparent: true,
            opacity: 0.85
        });

        const arenaRing = new THREE.Mesh(arenaGeo, ringMat);
        arenaRing.position.y = 0.05;
        this.scene.add(arenaRing);
    }

    // ----------------------------------------------------
    // ZONE 1: JUJUTSU HIGH COURTYARD & TORII GATES
    // ----------------------------------------------------
    initJujutsuHighZone() {
        const jjkGroup = new THREE.Group();
        jjkGroup.position.set(-45, 0, -35);

        // 1. Massive Grand Torii Gate
        const toriiGroup = new THREE.Group();
        const pillarMat = new THREE.MeshStandardMaterial({
            color: 0xcc2222,
            roughness: 0.5,
            metalness: 0.1
        });
        const blackMat = new THREE.MeshStandardMaterial({
            color: 0x111116,
            roughness: 0.3
        });

        // Twin Torii Pillars
        const p1Geo = new THREE.CylinderGeometry(0.85, 1.1, 14, 16);
        const p1 = new THREE.Mesh(p1Geo, pillarMat);
        p1.position.set(-6, 7, 0);
        p1.castShadow = true;
        toriiGroup.add(p1);

        const p2 = p1.clone();
        p2.position.set(6, 7, 0);
        toriiGroup.add(p2);

        // Top Crossbeams (Kasagi and Shimaki)
        const topBarGeo = new THREE.BoxGeometry(17, 1.2, 1.8);
        const topBar = new THREE.Mesh(topBarGeo, blackMat);
        topBar.position.set(0, 14.2, 0);
        topBar.castShadow = true;
        toriiGroup.add(topBar);

        const subBarGeo = new THREE.BoxGeometry(15, 0.9, 1.2);
        const subBar = new THREE.Mesh(subBarGeo, pillarMat);
        subBar.position.set(0, 12.4, 0);
        toriiGroup.add(subBar);

        // Central plaque
        const plaqueGeo = new THREE.BoxGeometry(1.4, 2.2, 0.4);
        const plaque = new THREE.Mesh(plaqueGeo, blackMat);
        plaque.position.set(0, 12.4, 0.7);
        toriiGroup.add(plaque);

        jjkGroup.add(toriiGroup);

        // 2. Stone Lanterns (Toro) with warm glow
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x777f88, roughness: 0.9 });
        const lanternGlowMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });

        for (let i = -1; i <= 1; i += 2) {
            const lantern = new THREE.Group();
            lantern.position.set(i * 8.5, 0, 4);

            const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.6), stoneMat);
            base.position.y = 0.3;
            lantern.add(base);

            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 3.2, 8), stoneMat);
            stem.position.y = 2.0;
            stem.castShadow = true;
            lantern.add(stem);

            const lightBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), lanternGlowMat);
            lightBox.position.y = 4.0;
            lantern.add(lightBox);

            const roof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.9, 4), stoneMat);
            roof.position.y = 5.0;
            roof.rotation.y = Math.PI / 4;
            lantern.add(roof);

            // Point Light for nighttime ambiance
            const pLight = new THREE.PointLight(0xff9922, 1.2, 16);
            pLight.position.set(0, 4.0, 0);
            lantern.add(pLight);

            jjkGroup.add(lantern);
        }

        // 3. Cherry Blossom (Sakura) Trees
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2f1b, roughness: 0.9 });
        const sakuraMat = new THREE.MeshStandardMaterial({
            color: 0xffaacc,
            roughness: 0.7,
            emissive: 0x331122
        });

        const treeOffsets = [
            { x: -14, z: -8, s: 1.1 },
            { x: 14, z: -6, s: 0.9 },
            { x: -12, z: 12, s: 1.0 },
            { x: 15, z: 10, s: 1.2 }
        ];

        treeOffsets.forEach(pos => {
            const tree = new THREE.Group();
            tree.position.set(pos.x, 0, pos.z);
            tree.scale.set(pos.s, pos.s, pos.s);

            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.1, 8, 8), trunkMat);
            trunk.position.y = 4;
            trunk.castShadow = true;
            tree.add(trunk);

            // Foliage Clumps
            const f1 = new THREE.Mesh(new THREE.SphereGeometry(3.6, 8, 8), sakuraMat);
            f1.position.set(0, 8.5, 0);
            f1.castShadow = true;
            tree.add(f1);

            const f2 = new THREE.Mesh(new THREE.SphereGeometry(2.4, 8, 8), sakuraMat);
            f2.position.set(2.2, 7.5, 1.2);
            tree.add(f2);

            const f3 = new THREE.Mesh(new THREE.SphereGeometry(2.6, 8, 8), sakuraMat);
            f3.position.set(-2.2, 8.0, -1.0);
            tree.add(f3);

            jjkGroup.add(tree);
        });

        // 4. Traditional Dojo Pagoda Pavilion
        const dojo = new THREE.Group();
        dojo.position.set(0, 0, -22);

        const wallMat = new THREE.MeshStandardMaterial({ color: 0xddccaa, roughness: 0.8 });
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.6 });

        const walls = new THREE.Mesh(new THREE.BoxGeometry(18, 6, 12), wallMat);
        walls.position.y = 3;
        walls.castShadow = true;
        dojo.add(walls);

        const dojoRoof = new THREE.Mesh(new THREE.ConeGeometry(15, 4.5, 4), roofMat);
        dojoRoof.position.y = 8.2;
        dojoRoof.rotation.y = Math.PI / 4;
        dojoRoof.castShadow = true;
        dojo.add(dojoRoof);

        jjkGroup.add(dojo);
        this.scene.add(jjkGroup);
    }

    // ----------------------------------------------------
    // ZONE 2: SHINJUKU URBAN DISTRICT (MODERN SKYSCRAPERS)
    // ----------------------------------------------------
    initShinjukuZone() {
        const shinjukuGroup = new THREE.Group();
        shinjukuGroup.position.set(45, 0, 35);

        // Asphalt Road Plane with markings
        const roadGeo = new THREE.PlaneGeometry(36, 90);
        roadGeo.rotateX(-Math.PI / 2);
        const roadMat = new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.9 });
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.position.set(0, 0.08, 0);
        road.receiveShadow = true;
        shinjukuGroup.add(road);

        // White Road Lane Lines
        const lineGeo = new THREE.PlaneGeometry(1.0, 5);
        lineGeo.rotateX(-Math.PI / 2);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let z = -35; z <= 35; z += 10) {
            const laneLine = new THREE.Mesh(lineGeo, lineMat);
            laneLine.position.set(0, 0.1, z);
            shinjukuGroup.add(laneLine);
        }

        // Multi-Story Skyscrapers
        const bldgData = [
            { x: -18, z: -25, w: 16, d: 18, h: 48, col: 0x242d3d, winCol: 0xffeeaa },
            { x: -18, z: 15, w: 15, d: 18, h: 62, col: 0x1d2230, winCol: 0x66ccff },
            { x: 18, z: -20, w: 16, d: 16, h: 54, col: 0x283042, winCol: 0xffcc88 },
            { x: 18, z: 22, w: 15, d: 16, h: 44, col: 0x1e2533, winCol: 0xaaddff }
        ];

        bldgData.forEach(b => {
            const bldg = new THREE.Group();
            bldg.position.set(b.x, 0, b.z);

            const bMesh = new THREE.Mesh(
                new THREE.BoxGeometry(b.w, b.h, b.d),
                new THREE.MeshStandardMaterial({ color: b.col, roughness: 0.6 })
            );
            bMesh.position.y = b.h / 2;
            bMesh.castShadow = true;
            bMesh.receiveShadow = true;
            bldg.add(bMesh);

            // Glowing Windows Grid
            const winCanvas = document.createElement('canvas');
            winCanvas.width = 128;
            winCanvas.height = 256;
            const wCtx = winCanvas.getContext('2d');
            wCtx.fillStyle = '#111622';
            wCtx.fillRect(0, 0, 128, 256);

            wCtx.fillStyle = '#' + b.winCol.toString(16).padStart(6, '0');
            for (let wy = 8; wy < 250; wy += 20) {
                for (let wx = 8; wx < 120; wx += 16) {
                    if (Math.random() > 0.3) {
                        wCtx.fillRect(wx, wy, 9, 12);
                    }
                }
            }
            const winTex = new THREE.CanvasTexture(winCanvas);
            winTex.wrapS = THREE.RepeatWrapping;
            winTex.wrapT = THREE.RepeatWrapping;
            winTex.repeat.set(2, 4);

            const facadeGeo = new THREE.PlaneGeometry(b.w - 0.2, b.h - 4);
            const facadeMat = new THREE.MeshBasicMaterial({ map: winTex });

            // Front facade
            const facade = new THREE.Mesh(facadeGeo, facadeMat);
            facade.position.set(0, b.h / 2, (b.x > 0 ? -b.d / 2 - 0.1 : b.d / 2 + 0.1));
            if (b.x > 0) facade.rotation.y = Math.PI;
            bldg.add(facade);

            shinjukuGroup.add(bldg);
        });

        // Streetlights with Point Lights
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x556070 });
        for (let z of [-25, 0, 25]) {
            const pole = new THREE.Group();
            pole.position.set(-9, 0, z);

            const pMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 9, 8), poleMat);
            pMesh.position.y = 4.5;
            pMesh.castShadow = true;
            pole.add(pMesh);

            const arm = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.2, 0.3), poleMat);
            arm.position.set(1.2, 8.8, 0);
            pole.add(arm);

            const lamp = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 0.3, 0.6),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );
            lamp.position.set(2.2, 8.6, 0);
            pole.add(lamp);

            const light = new THREE.PointLight(0xffeedd, 1.4, 20);
            light.position.set(2.2, 8.4, 0);
            pole.add(light);

            shinjukuGroup.add(pole);
        }

        this.scene.add(shinjukuGroup);
    }

    // ----------------------------------------------------
    // ZONE 3: SHIBUYA BLASTED CURSED CRATER & RUINS
    // ----------------------------------------------------
    initCursedCraterZone() {
        const craterGroup = new THREE.Group();
        craterGroup.position.set(35, 0, -45);

        // Blasted Circular Crater Floor with Cursed Glowing Fissures
        const craterGeo = new THREE.RingGeometry(0, 18, 32);
        craterGeo.rotateX(-Math.PI / 2);

        const craterCanvas = document.createElement('canvas');
        craterCanvas.width = 256;
        craterCanvas.height = 256;
        const cCtx = craterCanvas.getContext('2d');

        cCtx.fillStyle = '#150a1a';
        cCtx.fillRect(0, 0, 256, 256);

        // Glowing Purple Cursed Fissures
        cCtx.strokeStyle = '#9d4edd';
        cCtx.lineWidth = 4;
        cCtx.beginPath();
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            cCtx.moveTo(128, 128);
            cCtx.lineTo(128 + Math.cos(a) * 110, 128 + Math.sin(a) * 110);
        }
        cCtx.stroke();

        cCtx.strokeStyle = '#ff0055';
        cCtx.lineWidth = 2;
        cCtx.stroke();

        const craterTex = new THREE.CanvasTexture(craterCanvas);
        const craterMat = new THREE.MeshStandardMaterial({
            map: craterTex,
            roughness: 0.9,
            emissive: 0x330033
        });

        const crater = new THREE.Mesh(craterGeo, craterMat);
        crater.position.y = 0.06;
        crater.receiveShadow = true;
        craterGroup.add(crater);

        // Cursed Core Light
        const cursedLight = new THREE.PointLight(0xaa00ff, 2.0, 28);
        cursedLight.position.set(0, 1.5, 0);
        craterGroup.add(cursedLight);

        // Shattered Concrete Slabs & Rubble
        const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x4a4a55, roughness: 0.9 });
        for (let i = 0; i < 14; i++) {
            const a = Math.random() * Math.PI * 2;
            const dist = 7 + Math.random() * 10;
            const rGeo = new THREE.BoxGeometry(
                1.5 + Math.random() * 2.5,
                0.8 + Math.random() * 1.6,
                1.5 + Math.random() * 2.5
            );
            const rubble = new THREE.Mesh(rGeo, rubbleMat);
            rubble.position.set(Math.cos(a) * dist, 0.6, Math.sin(a) * dist);
            rubble.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
            rubble.castShadow = true;
            rubble.receiveShadow = true;
            craterGroup.add(rubble);
        }

        this.scene.add(craterGroup);
    }

    // ----------------------------------------------------
    // ENVIRONMENTAL PARTICLES (Sakura Petals & Cursed Wisps)
    // ----------------------------------------------------
    initEnvironmentalParticles() {
        const count = 350;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        this.envParticleData = [];

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 160;
            const y = Math.random() * 25 + 0.5;
            const z = (Math.random() - 0.5) * 160;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Half are sakura petals (pink), half are cursed motes (cyan/purple)
            if (i % 2 === 0) {
                colors[i * 3] = 1.0;
                colors[i * 3 + 1] = 0.6;
                colors[i * 3 + 2] = 0.8;
            } else {
                colors[i * 3] = 0.2;
                colors[i * 3 + 1] = 0.8;
                colors[i * 3 + 2] = 1.0;
            }

            this.envParticleData.push({
                vx: (Math.random() - 0.5) * 0.05 + 0.03,
                vy: -0.02 - Math.random() * 0.03,
                vz: (Math.random() - 0.5) * 0.04,
                wobble: Math.random() * Math.PI * 2
            });
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.9,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.envParticles = new THREE.Points(geo, mat);
        this.scene.add(this.envParticles);
    }

    // ----------------------------------------------------
    // LIVE 3D DOMAIN EXPANSION ENVIRONMENTS
    // ----------------------------------------------------
    activateDomain(type, casterPosition) {
        this.clearDomain();
        this.activeDomain = type;

        const pos = casterPosition || { x: 0, y: 0, z: 0 };
        this.domainGroup.position.set(pos.x, 0, pos.z);

        if (type === 'unlimited_void') {
            // Satoru Gojo: Infinite Cosmic Singularity Dome
            this.scene.fog.color.setHex(0x020210);
            this.dirLight.color.setHex(0x00b0ff);

            const domeGeo = new THREE.SphereGeometry(65, 32, 24);
            const domeMat = new THREE.MeshBasicMaterial({
                color: 0x050720,
                side: THREE.BackSide,
                wireframe: false
            });
            const dome = new THREE.Mesh(domeGeo, domeMat);
            dome.position.y = 15;
            this.domainGroup.add(dome);

            // Cosmic Singularity Rings
            for (let r = 12; r <= 36; r += 8) {
                const ringGeo = new THREE.TorusGeometry(r, 0.4, 8, 48);
                ringGeo.rotateX(Math.PI / 2 + Math.random() * 0.3);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: (r % 16 === 0 ? 0x00e5ff : 0x9d4edd),
                    wireframe: true
                });
                const ringMesh = new THREE.Mesh(ringGeo, ringMat);
                ringMesh.position.y = 10;
                this.domainGroup.add(ringMesh);
            }

            // Singularity Point Light
            const voidLight = new THREE.PointLight(0x00b0ff, 3.5, 90);
            voidLight.position.set(0, 18, 0);
            this.domainGroup.add(voidLight);

        } else if (type === 'malevolent_shrine') {
            // Ryomen Sukuna: Blood-Red Sky, Skull Altar & Slicing Abyss
            this.scene.fog.color.setHex(0x3a0005);
            this.dirLight.color.setHex(0xff1122);

            // Blood Pool Floor
            const poolGeo = new THREE.CircleGeometry(55, 32);
            poolGeo.rotateX(-Math.PI / 2);
            const poolMat = new THREE.MeshBasicMaterial({ color: 0x4a000a, transparent: true, opacity: 0.92 });
            const pool = new THREE.Mesh(poolGeo, poolMat);
            pool.position.y = 0.12;
            this.domainGroup.add(pool);

            // Demonic Skull Pagoda Shrine Centerpiece
            const shrineGroup = new THREE.Group();
            shrineGroup.position.set(0, 0, -18);

            const shrineBase = new THREE.Mesh(
                new THREE.BoxGeometry(14, 4, 14),
                new THREE.MeshStandardMaterial({ color: 0x1f1f24, roughness: 0.7 })
            );
            shrineBase.position.y = 2;
            shrineGroup.add(shrineBase);

            const hornedRoof = new THREE.Mesh(
                new THREE.ConeGeometry(12, 6, 4),
                new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.5 })
            );
            hornedRoof.position.y = 7.5;
            hornedRoof.rotation.y = Math.PI / 4;
            shrineGroup.add(hornedRoof);

            // Horns
            for (let side of [-1, 1]) {
                const horn = new THREE.Mesh(
                    new THREE.ConeGeometry(0.8, 5, 8),
                    new THREE.MeshStandardMaterial({ color: 0xddddcc })
                );
                horn.position.set(side * 6, 8.5, 0);
                horn.rotation.z = side * -0.6;
                shrineGroup.add(horn);
            }

            this.domainGroup.add(shrineGroup);

            // Malevolent Crimson Light
            const shrineLight = new THREE.PointLight(0xff0022, 4.0, 80);
            shrineLight.position.set(0, 8, -12);
            this.domainGroup.add(shrineLight);

        } else if (type === 'chimera_shadow') {
            // Megumi Fushiguro: Chimera Shadow Garden liquid abyss
            this.scene.fog.color.setHex(0x050a14);
            const shadowGeo = new THREE.CircleGeometry(48, 32);
            shadowGeo.rotateX(-Math.PI / 2);
            const shadowMat = new THREE.MeshBasicMaterial({ color: 0x050810, transparent: true, opacity: 0.95 });
            const sPool = new THREE.Mesh(shadowGeo, shadowMat);
            sPool.position.y = 0.12;
            this.domainGroup.add(sPool);

            const toadLight = new THREE.PointLight(0x00e5ff, 2.5, 60);
            toadLight.position.set(0, 5, 0);
            this.domainGroup.add(toadLight);

        } else if (type === 'iron_mountain') {
            // Jogo: Coffin of the Iron Mountain Volcano
            this.scene.fog.color.setHex(0x2a0d02);
            this.dirLight.color.setHex(0xff5500);

            // Molten Lava Ring
            const lavaGeo = new THREE.RingGeometry(0, 50, 32);
            lavaGeo.rotateX(-Math.PI / 2);
            const lavaMat = new THREE.MeshBasicMaterial({ color: 0xff4400, wireframe: true });
            const lava = new THREE.Mesh(lavaGeo, lavaMat);
            lava.position.y = 0.12;
            this.domainGroup.add(lava);

            // Volcanic Spikes
            for (let i = 0; i < 12; i++) {
                const a = (i / 12) * Math.PI * 2;
                const spike = new THREE.Mesh(
                    new THREE.ConeGeometry(2.5, 12, 6),
                    new THREE.MeshStandardMaterial({ color: 0x22110c, roughness: 0.9 })
                );
                spike.position.set(Math.cos(a) * 32, 6, Math.sin(a) * 32);
                this.domainGroup.add(spike);
            }

            const lavaLight = new THREE.PointLight(0xff5500, 3.5, 75);
            lavaLight.position.set(0, 7, 0);
            this.domainGroup.add(lavaLight);
        }
    }

    clearDomain() {
        this.activeDomain = null;
        while (this.domainGroup.children.length > 0) {
            const obj = this.domainGroup.children[0];
            this.domainGroup.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        }
        // Restore standard sky & lighting
        this.scene.fog.color.setHex(0x121422);
        this.dirLight.color.setHex(0xfff5e6);
    }

    // ----------------------------------------------------
    // TICK & UPDATE
    // ----------------------------------------------------
    update(delta = 0.016) {
        // Rotate sky dome slowly
        if (this.skyDome) this.skyDome.rotation.y += 0.0003;
        if (this.stars) this.stars.rotation.y += 0.00015;

        // Animate environmental particles (falling sakura and floating cursed motes)
        if (this.envParticles) {
            const posAttr = this.envParticles.geometry.attributes.position;
            const count = posAttr.count;
            for (let i = 0; i < count; i++) {
                const p = this.envParticleData[i];
                p.wobble += 0.04;

                let px = posAttr.getX(i) + p.vx + Math.sin(p.wobble) * 0.03;
                let py = posAttr.getY(i) + p.vy;
                let pz = posAttr.getZ(i) + p.vz;

                // Ground respawn
                if (py < 0.2) {
                    py = 22 + Math.random() * 4;
                    px = (Math.random() - 0.5) * 160;
                    pz = (Math.random() - 0.5) * 160;
                }

                posAttr.setXYZ(i, px, py, pz);
            }
            posAttr.needsUpdate = true;
        }

        // Rotate Domain Expansion rings if active
        if (this.activeDomain === 'unlimited_void' && this.domainGroup) {
            this.domainGroup.rotation.y += 0.005;
        }
    }
}
