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

        // Advanced Domain Expansion System State
        this.domainState = {
            active: false,
            type: null,
            caster: null,
            casterKey: null,
            timer: 0,
            maxDuration: 840, // 14 seconds at 60 FPS
            casterDamageTaken: 0,
            isClosedBarrier: false,
            barrierShell: null,
            sureHitInterval: 45, // Tick every 45 frames (~0.75s)
            sureHitTimer: 0,
            // Clash State
            isClashing: false,
            clashTimer: 0,
            clashDomainA: null,
            clashDomainB: null,
            clashCasterA: null,
            clashCasterB: null,
            clashGroup: new THREE.Group(),
            clashDamageA: 0,
            clashDamageB: 0
        };
        this.scene.add(this.domainState.clashGroup);

        this.bounds = {
            minX: -100,
            maxX: 100,
            minZ: -100,
            maxZ: 100
        };

        // Battlefield Environment Groups
        this.groundGroup = new THREE.Group();
        this.battlefieldGroup = new THREE.Group();
        this.scene.add(this.groundGroup);
        this.scene.add(this.battlefieldGroup);

        this.currentBattlefieldKey = 'jjk_high';
        this.orbitRings = [];
        this.waterMesh = null;
        this.waterTime = 0;
        this.droneCrystals = [];

        // Environmental Particle System
        this.envParticles = null;
        this.envParticleData = [];

        this.initLighting();
        this.initSky();

        // Load Initial Active Battlefield
        const initialField = (typeof StorageManager !== 'undefined' && StorageManager.getSelectedBattlefield)
            ? StorageManager.getSelectedBattlefield()
            : 'jjk_high';
        this.loadBattlefield(initialField);
    }

    // ----------------------------------------------------
    // LIGHTING & ATMOSPHERE (4K ULTRA FIDELITY)
    // ----------------------------------------------------
    initLighting() {
        // Ambient Light
        this.ambientLight = new THREE.AmbientLight(0xddeeff, 0.5);
        this.scene.add(this.ambientLight);

        // Hemisphere Light (Sky and Ground Bounce)
        this.hemiLight = new THREE.HemisphereLight(0xaaccff, 0x2e3b26, 0.5);
        this.hemiLight.position.set(0, 50, 0);
        this.scene.add(this.hemiLight);

        // Main Sun / Moon Directional Light with Safe Mobile & 4K Soft Shadows
        this.dirLight = new THREE.DirectionalLight(0xfff5e6, 1.25);
        this.dirLight.position.set(45, 85, 40);
        this.dirLight.castShadow = true;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
                         (window.innerWidth <= 900);
        const shadowRes = isMobile ? 1024 : 4096; // 1024 safe on mobile GPUs, 4096 on desktop
        this.dirLight.shadow.mapSize.width = shadowRes;
        this.dirLight.shadow.mapSize.height = shadowRes;
        this.dirLight.shadow.camera.near = 1;
        this.dirLight.shadow.camera.far = 280;

        const d = 80;
        this.dirLight.shadow.camera.left = -d;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = -d;
        this.dirLight.shadow.bias = -0.0003;
        this.dirLight.shadow.normalBias = 0.035;
        this.scene.add(this.dirLight);

        // Cinematic 4K Rim / Silhouette Light
        this.rimLight = new THREE.DirectionalLight(0x70d6ff, 0.75);
        this.rimLight.position.set(-35, 45, -35);
        this.scene.add(this.rimLight);

        // Atmospheric Volumetric Fog
        this.scene.fog = new THREE.FogExp2(0x101322, 0.007);
        this.lanternLights = [];
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
    // 10 3D BATTLEFIELD ARENAS ENGINE
    // ----------------------------------------------------
    loadBattlefield(fieldKey) {
        const field = (typeof BATTLEFIELDS_DATA !== 'undefined' && BATTLEFIELDS_DATA[fieldKey])
            ? BATTLEFIELDS_DATA[fieldKey]
            : (typeof BATTLEFIELDS_DATA !== 'undefined' ? BATTLEFIELDS_DATA.jjk_high : null);

        if (!field) return;
        this.currentBattlefieldKey = fieldKey;

        // 1. Clean Previous Groups
        this.cleanGroup(this.groundGroup);
        this.cleanGroup(this.battlefieldGroup);
        this.orbitRings = [];
        this.waterMesh = null;
        this.droneCrystals = [];

        // 2. Atmosphere, Sky & Dynamic Lighting
        if (this.skyDome && this.skyDome.material) {
            this.skyDome.material.color.setHex(field.skyColor);
        }
        if (this.scene.fog) {
            this.scene.fog.color.setHex(field.fogColor);
            this.scene.fog.density = field.fogDensity || 0.007;
        }

        if (this.dirLight) {
            this.dirLight.color.setHex(field.sunColor);
            this.dirLight.intensity = field.sunIntensity || 1.25;
            if (field.sunPos) {
                this.dirLight.position.set(field.sunPos.x, field.sunPos.y, field.sunPos.z);
            }
        }
        if (this.ambientLight) {
            this.ambientLight.color.setHex(field.ambientColor);
            this.ambientLight.intensity = field.ambientIntensity || 0.5;
        }
        if (this.hemiLight) {
            this.hemiLight.color.setHex(field.hemiSky || 0xaaccff);
            this.hemiLight.groundColor.setHex(field.hemiGround || 0x2e3b26);
        }
        if (this.rimLight) {
            this.rimLight.color.setHex(field.rimColor || 0x70d6ff);
        }

        // 3. Ground & Central Arena Ring
        this.buildGroundAndArenaRing(field);

        // 4. Unique 3D Battlefield Landmark Structures & Props
        switch (fieldKey) {
            case 'jjk_high':
                this.buildJujutsuHighProps();
                break;
            case 'shibuya_crater':
                this.buildShibuyaCraterProps();
                break;
            case 'shinjuku_zenith':
                this.buildShinjukuZenithProps();
                break;
            case 'sendai_colosseum':
                this.buildSendaiColosseumProps();
                break;
            case 'dagon_beach':
                this.buildDagonBeachProps();
                break;
            case 'star_tomb':
                this.buildStarTombProps();
                break;
            case 'tokyo_subway':
                this.buildTokyoSubwayProps();
                break;
            case 'culling_barrier':
                this.buildCullingBarrierProps();
                break;
            case 'heian_necropolis':
                this.buildHeianNecropolisProps();
                break;
            case 'celestial_void':
                this.buildCelestialVoidProps();
                break;
            default:
                this.buildJujutsuHighProps();
                break;
        }

        // 5. Environmental Particles
        this.initEnvironmentalParticles(field.particleType);
    }

    cleanGroup(group) {
        if (!group) return;
        while (group.children.length > 0) {
            const obj = group.children[0];
            group.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        }
    }

    buildGroundAndArenaRing(field) {
        // Base Ground Plane
        const groundGeo = new THREE.PlaneGeometry(280, 280, 32, 32);
        groundGeo.rotateX(-Math.PI / 2);

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = field.groundColors.fill || '#10131d';
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = field.groundColors.stroke || '#1b2234';
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

        const groundTex = new THREE.CanvasTexture(canvas);
        groundTex.wrapS = THREE.RepeatWrapping;
        groundTex.wrapT = THREE.RepeatWrapping;
        groundTex.repeat.set(24, 24);

        const groundMat = new THREE.MeshStandardMaterial({
            map: groundTex,
            roughness: 0.85,
            metalness: 0.12
        });

        const groundMesh = new THREE.Mesh(groundGeo, groundMat);
        groundMesh.receiveShadow = true;
        this.groundGroup.add(groundMesh);

        // Central Battle Arena Circle Ring (Radius 24)
        const arenaGeo = new THREE.RingGeometry(0, 24, 96);
        arenaGeo.rotateX(-Math.PI / 2);

        const ringTex = (typeof ProceduralTextureFactory !== 'undefined' && ProceduralTextureFactory.createArenaGround4KTexture)
            ? ProceduralTextureFactory.createArenaGround4KTexture()
            : null;

        const ringMat = new THREE.MeshStandardMaterial({
            map: ringTex,
            color: field.ringDecalColor || 0xffffff,
            roughness: 0.75,
            metalness: 0.15,
            transparent: true,
            opacity: 0.95
        });

        const arenaRing = new THREE.Mesh(arenaGeo, ringMat);
        arenaRing.position.y = 0.05;
        arenaRing.receiveShadow = true;
        this.groundGroup.add(arenaRing);

        // 8 Perimeter Ward Boundary Pillars
        const pillarMat = new THREE.MeshStandardMaterial({ color: field.ringDecalColor || 0x222633, roughness: 0.8 });
        const sealMat = new THREE.MeshBasicMaterial({ color: field.wardSealColor || 0xff0044 });

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const px = Math.cos(angle) * 24.5;
            const pz = Math.sin(angle) * 24.5;

            const pillar = new THREE.Group();
            pillar.position.set(px, 0, pz);

            const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.6, 0.8), pillarMat);
            baseMesh.position.y = 1.3;
            baseMesh.castShadow = true;
            pillar.add(baseMesh);

            const topPyramid = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.5, 4), pillarMat);
            topPyramid.position.y = 2.85;
            topPyramid.rotation.y = Math.PI / 4;
            pillar.add(topPyramid);

            const seal = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.9, 0.04), sealMat);
            seal.position.set(0, 1.4, 0.42);
            pillar.add(seal);

            pillar.lookAt(0, 0, 0);
            this.groundGroup.add(pillar);
        }
    }

    // --- 1. JUJUTSU HIGH COURTYARD ---
    buildJujutsuHighProps() {
        const jjkGroup = new THREE.Group();
        jjkGroup.position.set(-45, 0, -35);

        // Torii Gate
        const toriiGroup = new THREE.Group();
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.5 });
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.3 });

        const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.1, 14, 16), pillarMat);
        p1.position.set(-6, 7, 0);
        p1.castShadow = true;
        toriiGroup.add(p1);

        const p2 = p1.clone();
        p2.position.set(6, 7, 0);
        toriiGroup.add(p2);

        const topBar = new THREE.Mesh(new THREE.BoxGeometry(17, 1.2, 1.8), blackMat);
        topBar.position.set(0, 14.2, 0);
        topBar.castShadow = true;
        toriiGroup.add(topBar);

        const subBar = new THREE.Mesh(new THREE.BoxGeometry(15, 0.9, 1.2), pillarMat);
        subBar.position.set(0, 12.4, 0);
        toriiGroup.add(subBar);

        jjkGroup.add(toriiGroup);

        // Stone Lanterns
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x777f88, roughness: 0.9 });
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
        for (let i of [-1, 1]) {
            const lantern = new THREE.Group();
            lantern.position.set(i * 8.5, 0, 4);
            const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.6), stoneMat);
            base.position.y = 0.3;
            lantern.add(base);
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 3.2, 8), stoneMat);
            stem.position.y = 2.0;
            lantern.add(stem);
            const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), glowMat);
            box.position.y = 4.0;
            lantern.add(box);
            const light = new THREE.PointLight(0xff9922, 1.4, 16);
            light.position.set(0, 4.0, 0);
            lantern.add(light);
            jjkGroup.add(lantern);
        }

        // Sakura Trees
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2f1b, roughness: 0.9 });
        const sakuraMat = new THREE.MeshStandardMaterial({ color: 0xffaacc, roughness: 0.7, emissive: 0x331122 });
        [ { x: -14, z: -8 }, { x: 14, z: -6 }, { x: -12, z: 12 }, { x: 15, z: 10 } ].forEach(pos => {
            const tree = new THREE.Group();
            tree.position.set(pos.x, 0, pos.z);
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.1, 8, 8), trunkMat);
            trunk.position.y = 4;
            tree.add(trunk);
            const f1 = new THREE.Mesh(new THREE.SphereGeometry(3.6, 8, 8), sakuraMat);
            f1.position.set(0, 8.5, 0);
            tree.add(f1);
            jjkGroup.add(tree);
        });

        // Pagoda Pavilion
        const dojo = new THREE.Group();
        dojo.position.set(0, 0, -22);
        const walls = new THREE.Mesh(new THREE.BoxGeometry(18, 6, 12), new THREE.MeshStandardMaterial({ color: 0xddccaa, roughness: 0.8 }));
        walls.position.y = 3;
        dojo.add(walls);
        const dojoRoof = new THREE.Mesh(new THREE.ConeGeometry(15, 4.5, 4), new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.6 }));
        dojoRoof.position.y = 8.2;
        dojoRoof.rotation.y = Math.PI / 4;
        dojo.add(dojoRoof);
        jjkGroup.add(dojo);

        this.battlefieldGroup.add(jjkGroup);
    }

    // --- 2. SHIBUYA CURSED CRATER ---
    buildShibuyaCraterProps() {
        const craterGroup = new THREE.Group();
        craterGroup.position.set(35, 0, -45);

        // Circular Crater Fissures
        const craterGeo = new THREE.RingGeometry(0, 22, 32);
        craterGeo.rotateX(-Math.PI / 2);
        const craterCanvas = document.createElement('canvas');
        craterCanvas.width = 256;
        craterCanvas.height = 256;
        const cCtx = craterCanvas.getContext('2d');
        cCtx.fillStyle = '#150a1a';
        cCtx.fillRect(0, 0, 256, 256);
        cCtx.strokeStyle = '#9d4edd';
        cCtx.lineWidth = 4;
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            cCtx.beginPath();
            cCtx.moveTo(128, 128);
            cCtx.lineTo(128 + Math.cos(a) * 115, 128 + Math.sin(a) * 115);
            cCtx.stroke();
        }
        const craterTex = new THREE.CanvasTexture(craterCanvas);
        const crater = new THREE.Mesh(craterGeo, new THREE.MeshStandardMaterial({ map: craterTex, roughness: 0.9, emissive: 0x330033 }));
        crater.position.y = 0.08;
        craterGroup.add(crater);

        // Core Cursed Light
        const cursedLight = new THREE.PointLight(0xaa00ff, 2.8, 35);
        cursedLight.position.set(0, 2.5, 0);
        craterGroup.add(cursedLight);

        // Shattered Concrete Rubble & Highway Pillars
        const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x3e3c48, roughness: 0.9 });
        for (let i = 0; i < 18; i++) {
            const a = Math.random() * Math.PI * 2;
            const dist = 6 + Math.random() * 16;
            const rGeo = new THREE.BoxGeometry(1.5 + Math.random() * 2.5, 0.8 + Math.random() * 2.0, 1.5 + Math.random() * 2.5);
            const rubble = new THREE.Mesh(rGeo, rubbleMat);
            rubble.position.set(Math.cos(a) * dist, 0.8, Math.sin(a) * dist);
            rubble.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
            rubble.castShadow = true;
            craterGroup.add(rubble);
        }

        // Severed Highway Overpass Pillars
        for (let side of [-18, 18]) {
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 16, 8), rubbleMat);
            pillar.position.set(side, 8, -12);
            craterGroup.add(pillar);
        }

        this.battlefieldGroup.add(craterGroup);
    }

    // --- 3. SHINJUKU SKYSCRAPER ZENITH ---
    buildShinjukuZenithProps() {
        const shinjukuGroup = new THREE.Group();
        shinjukuGroup.position.set(45, 0, 35);

        // Asphalt Road Plane
        const road = new THREE.Mesh(
            new THREE.PlaneGeometry(36, 90).rotateX(-Math.PI / 2),
            new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.9 })
        );
        road.position.set(0, 0.08, 0);
        shinjukuGroup.add(road);

        // White Lane Lines
        const lineGeo = new THREE.PlaneGeometry(1.0, 5).rotateX(-Math.PI / 2);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let z = -35; z <= 35; z += 10) {
            const laneLine = new THREE.Mesh(lineGeo, lineMat);
            laneLine.position.set(0, 0.1, z);
            shinjukuGroup.add(laneLine);
        }

        // 4 Illuminated Skyscrapers
        const bldgData = [
            { x: -18, z: -25, w: 16, d: 18, h: 52, col: 0x242d3d, winCol: 0xffeeaa },
            { x: -18, z: 15, w: 15, d: 18, h: 65, col: 0x1d2230, winCol: 0x66ccff },
            { x: 18, z: -20, w: 16, d: 16, h: 56, col: 0x283042, winCol: 0xffcc88 },
            { x: 18, z: 22, w: 15, d: 16, h: 48, col: 0x1e2533, winCol: 0xaaddff }
        ];

        bldgData.forEach(b => {
            const bldg = new THREE.Group();
            bldg.position.set(b.x, 0, b.z);
            const bMesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), new THREE.MeshStandardMaterial({ color: b.col, roughness: 0.6 }));
            bMesh.position.y = b.h / 2;
            bldg.add(bMesh);

            // Windows Facade
            const winCanvas = document.createElement('canvas');
            winCanvas.width = 128;
            winCanvas.height = 256;
            const wCtx = winCanvas.getContext('2d');
            wCtx.fillStyle = '#111622';
            wCtx.fillRect(0, 0, 128, 256);
            wCtx.fillStyle = '#' + b.winCol.toString(16).padStart(6, '0');
            for (let wy = 8; wy < 250; wy += 20) {
                for (let wx = 8; wx < 120; wx += 16) {
                    if (Math.random() > 0.3) wCtx.fillRect(wx, wy, 9, 12);
                }
            }
            const winTex = new THREE.CanvasTexture(winCanvas);
            winTex.wrapS = THREE.RepeatWrapping;
            winTex.wrapT = THREE.RepeatWrapping;
            winTex.repeat.set(2, 4);

            const facade = new THREE.Mesh(new THREE.PlaneGeometry(b.w - 0.2, b.h - 4), new THREE.MeshBasicMaterial({ map: winTex }));
            facade.position.set(0, b.h / 2, (b.x > 0 ? -b.d / 2 - 0.1 : b.d / 2 + 0.1));
            if (b.x > 0) facade.rotation.y = Math.PI;
            bldg.add(facade);
            shinjukuGroup.add(bldg);
        });

        // Streetlamps with Lights
        for (let z of [-25, 0, 25]) {
            const pole = new THREE.Group();
            pole.position.set(-9, 0, z);
            const pMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 9, 8), new THREE.MeshStandardMaterial({ color: 0x556070 }));
            pMesh.position.y = 4.5;
            pole.add(pMesh);
            const light = new THREE.PointLight(0xffeedd, 1.4, 20);
            light.position.set(2.2, 8.4, 0);
            pole.add(light);
            shinjukuGroup.add(pole);
        }

        this.battlefieldGroup.add(shinjukuGroup);
    }

    // --- 4. SENDAI CURSED COLONY ---
    buildSendaiColosseumProps() {
        const sendaiGroup = new THREE.Group();
        sendaiGroup.position.set(-35, 0, 40);

        const steelMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, metalness: 0.8, roughness: 0.5 });
        const concreteMat = new THREE.MeshStandardMaterial({ color: 0x4a4a52, roughness: 0.9 });

        // Stadium Floodlight Towers
        [ { x: -22, z: -25 }, { x: 22, z: -25 }, { x: -22, z: 25 }, { x: 22, z: 25 } ].forEach(pos => {
            const tower = new THREE.Group();
            tower.position.set(pos.x, 0, pos.z);

            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 22, 8), steelMat);
            pole.position.y = 11;
            tower.add(pole);

            const bank = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.0, 1.2), new THREE.MeshStandardMaterial({ color: 0x222228 }));
            bank.position.y = 22;
            tower.add(bank);

            const floodLight = new THREE.PointLight(0xffaa55, 2.5, 45);
            floodLight.position.set(0, 21.5, 1.0);
            tower.add(floodLight);

            sendaiGroup.add(tower);
        });

        // Collapsed Highway Ramp Section
        const ramp = new THREE.Mesh(new THREE.BoxGeometry(28, 1.2, 10), concreteMat);
        ramp.position.set(0, 4.5, -20);
        ramp.rotation.z = 0.22;
        sendaiGroup.add(ramp);

        // Criss-Cross Steel I-Beams
        for (let i = 0; i < 8; i++) {
            const beam = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 12), steelMat);
            beam.position.set((Math.random() - 0.5) * 35, 0.6, (Math.random() - 0.5) * 35);
            beam.rotation.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4);
            sendaiGroup.add(beam);
        }

        this.battlefieldGroup.add(sendaiGroup);
    }

    // --- 5. DAGON'S HORIZON BEACH ---
    buildDagonBeachProps() {
        const beachGroup = new THREE.Group();

        // Turquoise Ocean Water Ring around Arena
        const waterGeo = new THREE.RingGeometry(24.5, 95, 64);
        waterGeo.rotateX(-Math.PI / 2);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x0088aa,
            roughness: 0.15,
            metalness: 0.35,
            transparent: true,
            opacity: 0.88
        });
        this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
        this.waterMesh.position.y = 0.02;
        beachGroup.add(this.waterMesh);

        // Coconut Palm Trees
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x5a4228, roughness: 0.8 });
        const frondMat = new THREE.MeshStandardMaterial({ color: 0x118833, roughness: 0.6, side: THREE.DoubleSide });

        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const r = 26 + (i % 2) * 5;
            const tree = new THREE.Group();
            tree.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);

            // Curved segmented trunk
            for (let s = 0; s < 5; s++) {
                const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.5 - s * 0.05, 0.6 - s * 0.05, 2.2, 8), woodMat);
                seg.position.set(Math.sin(s * 0.2) * 0.6, 1.1 + s * 2.0, 0);
                seg.rotation.z = -0.08 * s;
                tree.add(seg);
            }

            // Crown fronds
            for (let f = 0; f < 8; f++) {
                const fa = (f / 8) * Math.PI * 2;
                const frond = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 4.5), frondMat);
                frond.position.set(Math.sin(fa) * 1.6, 10.5, Math.cos(fa) * 1.6);
                frond.rotation.set(0.6, fa, 0);
                tree.add(frond);
            }

            beachGroup.add(tree);
        }

        // Bamboo Tiki Fire Torches
        const torchMat = new THREE.MeshStandardMaterial({ color: 0x3d2817 });
        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
            const torch = new THREE.Group();
            torch.position.set(Math.cos(a) * 23.8, 0, Math.sin(a) * 23.8);

            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.5, 8), torchMat);
            post.position.y = 2.25;
            torch.add(post);

            const flame = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 6), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
            flame.position.y = 4.8;
            torch.add(flame);

            const tLight = new THREE.PointLight(0xff7700, 1.6, 14);
            tLight.position.y = 4.8;
            torch.add(tLight);

            beachGroup.add(torch);
        }

        this.battlefieldGroup.add(beachGroup);
    }

    // --- 6. TOMB OF THE STAR (TENGEN SANCTUM) ---
    buildStarTombProps() {
        const tombGroup = new THREE.Group();

        const rootMat = new THREE.MeshStandardMaterial({ color: 0x2d1f14, roughness: 0.95 });
        const lanternMat = new THREE.MeshBasicMaterial({ color: 0x00ff66 });

        // Giant Arching Tree Roots Over Canopy
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            const arch = new THREE.Mesh(
                new THREE.TorusGeometry(32, 2.2, 8, 24, Math.PI),
                rootMat
            );
            arch.position.set(0, 0, 0);
            arch.rotation.set(Math.PI / 2, a, 0.2);
            tombGroup.add(arch);
        }

        // Sacred Stone Shinto Obelisks with Talismans
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x1f2b22, roughness: 0.85 });
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const p = new THREE.Group();
            p.position.set(Math.cos(a) * 25, 0, Math.sin(a) * 25);

            const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 7.5, 1.6), stoneMat);
            body.position.y = 3.75;
            p.add(body);

            // Shimenawa rope ring
            const rope = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.2, 6, 16), new THREE.MeshStandardMaterial({ color: 0xd4cbb8 }));
            rope.position.y = 6.2;
            rope.rotation.x = Math.PI / 2;
            p.add(rope);

            // Emerald Spirit Lamp
            const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), lanternMat);
            lamp.position.y = 8.2;
            p.add(lamp);

            const pLight = new THREE.PointLight(0x00ff66, 1.8, 18);
            pLight.position.y = 8.2;
            p.add(pLight);

            tombGroup.add(p);
        }

        this.battlefieldGroup.add(tombGroup);
    }

    // --- 7. TOKYO METRO B5F PLATFORM ---
    buildTokyoSubwayProps() {
        const metroGroup = new THREE.Group();

        const steelMat = new THREE.MeshStandardMaterial({ color: 0x667788, metalness: 0.85, roughness: 0.3 });
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.9 });
        const tileMat = new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.6 });

        // Dual Subway Rails running across the battlefield
        for (let side of [-8, 8]) {
            // Steel Tracks
            for (let rx of [-1.2, 1.2]) {
                const rail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 90), steelMat);
                rail.position.set(side + rx, 0.15, 0);
                metroGroup.add(rail);
            }
            // Wooden Railway Ties
            for (let z = -44; z <= 44; z += 3.5) {
                const tie = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 0.6), woodMat);
                tie.position.set(side, 0.08, z);
                metroGroup.add(tie);
            }
        }

        // Concrete Platform Walls with Yellow Caution Edge
        const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 80), tileMat);
        wallLeft.position.set(-28, 2.5, 0);
        metroGroup.add(wallLeft);

        const wallRight = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 80), tileMat);
        wallRight.position.set(28, 2.5, 0);
        metroGroup.add(wallRight);

        // Yellow Hazard Warning Strips
        const cautionMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
        for (let side of [-25.9, 25.9]) {
            const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 80).rotateX(-Math.PI / 2), cautionMat);
            strip.position.set(side, 0.09, 0);
            metroGroup.add(strip);
        }

        // Hanging Industrial Fluorescent Fixtures
        for (let z of [-20, 0, 20]) {
            const fixture = new THREE.Group();
            fixture.position.set(0, 10, z);

            const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3, 6), steelMat);
            rod.position.y = 1.5;
            fixture.add(rod);

            const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffeedd }));
            tube.rotation.z = Math.PI / 2;
            fixture.add(tube);

            const tubeLight = new THREE.PointLight(0xffe688, 1.6, 22);
            fixture.add(tubeLight);

            metroGroup.add(fixture);
        }

        this.battlefieldGroup.add(metroGroup);
    }

    // --- 8. CULLING GAME BARRIER COLONY ---
    buildCullingBarrierProps() {
        const cullingGroup = new THREE.Group();

        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            metalness: 0.9,
            roughness: 0.2,
            emissive: 0x332200
        });

        // 8 Giant Golden Hexagonal Barrier Pillars
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const pillar = new THREE.Group();
            pillar.position.set(Math.cos(a) * 26, 0, Math.sin(a) * 26);

            const obelisk = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 30, 6), goldMat);
            obelisk.position.y = 15;
            pillar.add(obelisk);

            const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffdd44 }));
            beacon.position.y = 30.5;
            pillar.add(beacon);

            const bLight = new THREE.PointLight(0xffcc00, 2.2, 30);
            bLight.position.y = 30.5;
            pillar.add(bLight);

            cullingGroup.add(pillar);
        }

        // Floating Kogane Surveillance Drones
        for (let i = 0; i < 4; i++) {
            const drone = new THREE.Group();
            const a = (i / 4) * Math.PI * 2 + 0.4;
            drone.position.set(Math.cos(a) * 18, 7 + Math.random() * 3, Math.sin(a) * 18);

            const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.65), new THREE.MeshBasicMaterial({ color: 0xffd700 }));
            drone.add(core);

            const dLight = new THREE.PointLight(0xffea00, 1.5, 12);
            drone.add(dLight);

            this.droneCrystals.push(drone);
            cullingGroup.add(drone);
        }

        // Golden Barrier Energy Lattice Ring
        const latticeGeo = new THREE.CylinderGeometry(25.5, 25.5, 8, 32, 1, true);
        const latticeMat = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            wireframe: true,
            transparent: true,
            opacity: 0.28,
            side: THREE.DoubleSide
        });
        const lattice = new THREE.Mesh(latticeGeo, latticeMat);
        lattice.position.y = 4;
        cullingGroup.add(lattice);

        this.battlefieldGroup.add(cullingGroup);
    }

    // --- 9. ANCIENT HEIAN NECROPOLIS ---
    buildHeianNecropolisProps() {
        const heianGroup = new THREE.Group();

        const boneMat = new THREE.MeshStandardMaterial({ color: 0xd8d4c8, roughness: 0.8 });
        const basaltMat = new THREE.MeshStandardMaterial({ color: 0x1f1416, roughness: 0.95 });

        // Giant Blood Moon in Sky
        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(22, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xdd1122 })
        );
        moon.position.set(0, 95, -120);
        heianGroup.add(moon);

        // 3 Demonic Skull Pagoda Shrines
        for (let i of [-1, 0, 1]) {
            const pagoda = new THREE.Group();
            pagoda.position.set(i * 24, 0, -25);

            const base = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 8), basaltMat);
            base.position.y = 1.5;
            pagoda.add(base);

            const roof = new THREE.Mesh(new THREE.ConeGeometry(6, 4, 4), basaltMat);
            roof.position.y = 5.0;
            roof.rotation.y = Math.PI / 4;
            pagoda.add(roof);

            // Giant Horned Skull
            const skull = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), boneMat);
            skull.position.set(0, 7.5, 0);
            pagoda.add(skull);

            for (let side of [-1, 1]) {
                const horn = new THREE.Mesh(new THREE.ConeGeometry(0.4, 3.2, 6), boneMat);
                horn.position.set(side * 1.5, 9.2, 0);
                horn.rotation.z = side * -0.55;
                pagoda.add(horn);
            }

            const pLight = new THREE.PointLight(0xff0022, 2.5, 30);
            pLight.position.set(0, 7.5, 1.5);
            pagoda.add(pLight);

            heianGroup.add(pagoda);
        }

        // Dark Crimson Blood Pool
        const bloodPool = new THREE.Mesh(
            new THREE.CircleGeometry(16, 24).rotateX(-Math.PI / 2),
            new THREE.MeshStandardMaterial({ color: 0x4a0008, roughness: 0.2, metalness: 0.8, transparent: true, opacity: 0.92 })
        );
        bloodPool.position.set(0, 0.08, 16);
        heianGroup.add(bloodPool);

        this.battlefieldGroup.add(heianGroup);
    }

    // --- 10. CELESTIAL SINGULARITY VOID ---
    buildCelestialVoidProps() {
        const voidGroup = new THREE.Group();

        // 6 Floating Meteorite Island Platforms in 3D mid-air
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x1f1730, roughness: 0.7, metalness: 0.3 });
        const islandPositions = [
            { x: -30, y: 12, z: -20, s: 6 },
            { x: 32, y: 16, z: -18, s: 7 },
            { x: -28, y: 18, z: 22, s: 5 },
            { x: 30, y: 14, z: 24, s: 6.5 },
            { x: 0, y: 24, z: -35, s: 8 },
            { x: 0, y: 22, z: 35, s: 7.5 }
        ];

        islandPositions.forEach(p => {
            const island = new THREE.Mesh(new THREE.DodecahedronGeometry(p.s), rockMat);
            island.position.set(p.x, p.y, p.z);
            island.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            voidGroup.add(island);
        });

        // 3 Rotating Concentric Starlight Orbital Rings
        [ { r: 28, col: 0xa855f7, spd: 0.006 }, { r: 38, col: 0x00e5ff, spd: -0.004 }, { r: 48, col: 0xff00aa, spd: 0.003 } ].forEach(ring => {
            const ringGeo = new THREE.TorusGeometry(ring.r, 0.45, 8, 64);
            ringGeo.rotateX(Math.PI / 2 + (Math.random() - 0.5) * 0.3);
            const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: ring.col, wireframe: true }));
            ringMesh.position.y = 8;
            ringMesh.userData = { speed: ring.spd };
            this.orbitRings.push(ringMesh);
            voidGroup.add(ringMesh);
        });

        // Radiant Singularity Pulsar Core Light
        const pulsarLight = new THREE.PointLight(0xa855f7, 3.8, 90);
        pulsarLight.position.set(0, 16, 0);
        voidGroup.add(pulsarLight);

        this.battlefieldGroup.add(voidGroup);
    }

    // ----------------------------------------------------
    // DYNAMIC ENVIRONMENTAL PARTICLES FOR ALL 10 THEMES
    // ----------------------------------------------------
    initEnvironmentalParticles(particleType = 'sakura') {
        if (this.envParticles) {
            this.scene.remove(this.envParticles);
            this.envParticles.geometry.dispose();
            this.envParticles.material.dispose();
            this.envParticles = null;
        }

        const count = 350;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        this.envParticleData = [];

        // Determine Particle Color Palette according to active battlefield
        let col1 = { r: 1.0, g: 0.6, b: 0.8 }; // Sakura Pink default
        let col2 = { r: 0.2, g: 0.8, b: 1.0 }; // Gentle Blue

        if (particleType === 'cursed_embers') {
            col1 = { r: 0.62, g: 0.31, b: 0.87 }; // Violet
            col2 = { r: 1.0, g: 0.0, b: 0.33 };   // Crimson
        } else if (particleType === 'electric_sparks') {
            col1 = { r: 0.0, g: 0.9, b: 1.0 };   // Electric Cyan
            col2 = { r: 1.0, g: 1.0, b: 1.0 };   // White Spark
        } else if (particleType === 'golden_cinders') {
            col1 = { r: 1.0, g: 0.53, b: 0.0 };  // Sunset Orange
            col2 = { r: 1.0, g: 0.84, b: 0.0 };  // Gold
        } else if (particleType === 'sea_spray') {
            col1 = { r: 0.0, g: 0.8, b: 1.0 };   // Aqua
            col2 = { r: 0.9, g: 0.98, b: 1.0 };  // White Spray
        } else if (particleType === 'sacred_spores') {
            col1 = { r: 0.22, g: 0.69, b: 0.0 }; // Emerald Spore
            col2 = { r: 1.0, g: 0.88, b: 0.4 };  // Golden Pollen
        } else if (particleType === 'subway_dust') {
            col1 = { r: 1.0, g: 0.84, b: 0.0 };  // Amber
            col2 = { r: 0.67, g: 0.67, b: 0.67 };// Dust Gray
        } else if (particleType === 'barrier_glyphs') {
            col1 = { r: 1.0, g: 0.84, b: 0.0 };  // Gold Glyphs
            col2 = { r: 1.0, g: 0.93, b: 0.33 }; // Yellow Code
        } else if (particleType === 'blood_ash') {
            col1 = { r: 1.0, g: 0.0, b: 0.2 };   // Blood Red
            col2 = { r: 0.2, g: 0.07, b: 0.07 }; // Dark Charcoal Ash
        } else if (particleType === 'cosmic_stardust') {
            col1 = { r: 0.78, g: 0.49, b: 1.0 }; // Starlight Purple
            col2 = { r: 1.0, g: 0.0, b: 0.67 };  // Neon Magenta
        }

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 160;
            const y = Math.random() * 25 + 0.5;
            const z = (Math.random() - 0.5) * 160;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            const c = (i % 2 === 0) ? col1 : col2;
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;

            this.envParticleData.push({
                vx: (Math.random() - 0.5) * 0.05 + 0.03,
                vy: (particleType === 'blood_ash' || particleType === 'sakura') ? (-0.02 - Math.random() * 0.03) : (Math.random() - 0.5) * 0.03,
                vz: (Math.random() - 0.5) * 0.04,
                wobble: Math.random() * Math.PI * 2
            });
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: (particleType === 'cosmic_stardust' || particleType === 'electric_sparks') ? 1.2 : 0.9,
            vertexColors: true,
            transparent: true,
            opacity: 0.85
        });

        this.envParticles = new THREE.Points(geo, mat);
        this.scene.add(this.envParticles);
    }

    // ----------------------------------------------------
    // LIVE 3D DOMAIN EXPANSION ENVIRONMENTS
    // ----------------------------------------------------
    activateDomain(type, caster) {
        const casterObj = (caster && caster.x !== undefined) ? caster : null;
        const pos = casterObj ? { x: casterObj.x, y: 0, z: casterObj.z } : (caster || { x: 0, y: 0, z: 0 });

        // DOMAIN CLASH DETECTION: If another domain is already active and the new caster is different!
        if (this.domainState.active && this.domainState.caster && casterObj && this.domainState.caster !== casterObj && !this.domainState.isClashing) {
            this.triggerDomainClash(this.domainState.type, type, this.domainState.caster, casterObj);
            return;
        }

        this.clearDomain();
        this.activeDomain = type;
        this.domainState.active = true;
        this.domainState.type = type;
        this.domainState.caster = casterObj;
        this.domainState.casterKey = casterObj ? casterObj.charKey : null;
        this.domainState.timer = 0;
        this.domainState.casterDamageTaken = 0;
        this.domainState.sureHitTimer = 0;
        this.domainState.isClashing = false;

        this.domainGroup.position.set(pos.x, 0, pos.z);

        // Canon Barrier Shell check: Sukuna (Malevolent Shrine) and Megumi (Chimera Shadow Garden) are Open/Incomplete domains!
        const isOpenDomain = (type === 'malevolent_shrine' || type === 'chimera_shadow');
        this.domainState.isClosedBarrier = !isOpenDomain;

        // ----------------------------------------------------
        // DOMAIN BARRIER SHELL (For all closed barrier domains)
        // ----------------------------------------------------
        if (this.domainState.isClosedBarrier) {
            const shellGeo = new THREE.SphereGeometry(52, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.58);
            let shellColor = 0x070812;
            let wireColor = 0x334466;

            if (type === 'unlimited_void') { shellColor = 0x030518; wireColor = 0x00b0ff; }
            else if (type === 'self_embodiment') { shellColor = 0x0a0214; wireColor = 0xaa22ff; }
            else if (type === 'iron_mountain') { shellColor = 0x180602; wireColor = 0xff5500; }
            else if (type === 'authentic_mutual_love') { shellColor = 0x0e0918; wireColor = 0xdfd5ff; }
            else if (type === 'idle_death_gamble') { shellColor = 0x080814; wireColor = 0xffd700; }
            else if (type === 'womb_profusion') { shellColor = 0x1a0408; wireColor = 0xdd1133; }
            else if (type === 'memory_of_soul') { shellColor = 0x0a1018; wireColor = 0x88ccff; }

            const shellMat = new THREE.MeshStandardMaterial({
                color: shellColor,
                roughness: 0.35,
                metalness: 0.75,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.94
            });
            const shell = new THREE.Mesh(shellGeo, shellMat);
            shell.position.y = 0;
            // Starts small and blooms outward in update()!
            shell.scale.set(0.08, 0.08, 0.08);

            // Wireframe barrier resonance grid
            const wireGeo = new THREE.SphereGeometry(52.2, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
            const wireMat = new THREE.MeshBasicMaterial({
                color: wireColor,
                wireframe: true,
                transparent: true,
                opacity: 0.28
            });
            const wireMesh = new THREE.Mesh(wireGeo, wireMat);
            shell.add(wireMesh);

            this.domainGroup.add(shell);
            this.domainState.barrierShell = shell;
        }

        // ----------------------------------------------------
        // 3D DOMAIN ENVIRONMENTS PER CHARACTER
        // ----------------------------------------------------
        if (type === 'unlimited_void') {
            // Satoru Gojo: Infinite Cosmic Singularity Dome
            this.scene.fog.color.setHex(0x020210);
            this.dirLight.color.setHex(0x00b0ff);

            const domeGeo = new THREE.SphereGeometry(65, 32, 24);
            const domeMat = new THREE.MeshBasicMaterial({ color: 0x050720, side: THREE.BackSide });
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

            const voidLight = new THREE.PointLight(0x00b0ff, 3.5, 90);
            voidLight.position.set(0, 18, 0);
            this.domainGroup.add(voidLight);

        } else if (type === 'malevolent_shrine') {
            // Ryomen Sukuna: Blood-Red Sky, Skull Altar & Slicing Abyss (Open Domain)
            this.scene.fog.color.setHex(0x3a0005);
            this.dirLight.color.setHex(0xff1122);

            const poolGeo = new THREE.CircleGeometry(55, 32);
            poolGeo.rotateX(-Math.PI / 2);
            const poolMat = new THREE.MeshBasicMaterial({ color: 0x4a000a, transparent: true, opacity: 0.92 });
            const pool = new THREE.Mesh(poolGeo, poolMat);
            pool.position.y = 0.12;
            this.domainGroup.add(pool);

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

            for (let side of [-1, 1]) {
                const horn = new THREE.Mesh(
                    new THREE.ConeGeometry(0.9, 6.5, 8),
                    new THREE.MeshStandardMaterial({ color: 0xddddcc, roughness: 0.5 })
                );
                horn.position.set(side * 6.5, 9.5, 0);
                horn.rotation.z = side * -0.65;
                shrineGroup.add(horn);
            }

            const skullMat = new THREE.MeshStandardMaterial({ color: 0xd8d4c8, roughness: 0.75 });
            for (let s = -5.5; s <= 5.5; s += 2.2) {
                const skull = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 8), skullMat);
                skull.position.set(s, 5.2, 7.2);
                shrineGroup.add(skull);
            }
            this.domainGroup.add(shrineGroup);

            // Flying Slicing Cleave Cut Planes
            const cutMat = new THREE.MeshBasicMaterial({ color: 0xff2255, transparent: true, opacity: 0.75, side: THREE.DoubleSide });
            for (let c = 0; c < 22; c++) {
                const cutMesh = new THREE.Mesh(new THREE.PlaneGeometry(18, 0.09), cutMat);
                cutMesh.position.set((Math.random() - 0.5) * 45, 0.8 + Math.random() * 5.5, (Math.random() - 0.5) * 45);
                cutMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                this.domainGroup.add(cutMesh);
            }

            const shrineLight = new THREE.PointLight(0xff0022, 4.0, 80);
            shrineLight.position.set(0, 8, -12);
            this.domainGroup.add(shrineLight);

        } else if (type === 'chimera_shadow') {
            // Megumi Fushiguro: Chimera Shadow Garden liquid abyss (Incomplete open floor)
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

            const lavaGeo = new THREE.RingGeometry(0, 50, 32);
            lavaGeo.rotateX(-Math.PI / 2);
            const lavaMat = new THREE.MeshBasicMaterial({ color: 0xff4400, wireframe: true });
            const lava = new THREE.Mesh(lavaGeo, lavaMat);
            lava.position.y = 0.12;
            this.domainGroup.add(lava);

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

        } else if (type === 'authentic_mutual_love') {
            // Yuta Okkotsu: Authentic Mutual Love (Graveyard of Infinite Katanas)
            this.scene.fog.color.setHex(0x160e29);
            this.dirLight.color.setHex(0xdfd5ff);

            const stoneFloor = new THREE.Mesh(
                new THREE.CircleGeometry(50, 32).rotateX(-Math.PI / 2),
                new THREE.MeshStandardMaterial({ color: 0x1f1b2b, roughness: 0.85 })
            );
            stoneFloor.position.y = 0.12;
            this.domainGroup.add(stoneFloor);

            // Overhead Shimenawa barrier ropes
            const ropeGeo = new THREE.TorusGeometry(30, 0.35, 6, 24, Math.PI);
            ropeGeo.rotateX(Math.PI / 2);
            const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd4cbb8, roughness: 0.8 });
            const ropeMesh = new THREE.Mesh(ropeGeo, ropeMat);
            ropeMesh.position.y = 14;
            this.domainGroup.add(ropeMesh);

            // 28 Plunged Katanas with Copied Cursed Technique glows
            const bladeMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.95, roughness: 0.15 });
            const tsubaMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.3 });
            const gripMat = new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 0.7 });
            const techniqueColors = [0xff2255, 0x00e5ff, 0xa855f7, 0xffd700, 0x00ffaa];

            for (let i = 0; i < 28; i++) {
                const swordGroup = new THREE.Group();
                const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.2, 0.16), bladeMat);
                blade.position.y = 1.1;
                swordGroup.add(blade);

                const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.05, 8), tsubaMat);
                guard.position.y = 2.22;
                swordGroup.add(guard);

                const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.75, 8), gripMat);
                grip.position.y = 2.62;
                swordGroup.add(grip);

                const radius = 6 + Math.random() * 26;
                const angle = Math.random() * Math.PI * 2;
                swordGroup.position.set(Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius);
                swordGroup.rotation.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4);

                // Copied Cursed Technique Aura Light
                if (i % 4 === 0) {
                    const col = techniqueColors[Math.floor(Math.random() * techniqueColors.length)];
                    const tLight = new THREE.PointLight(col, 1.6, 12);
                    tLight.position.y = 2.2;
                    swordGroup.add(tLight);
                }

                this.domainGroup.add(swordGroup);
            }

            const yutaLight = new THREE.PointLight(0xdfd5ff, 3.2, 80);
            yutaLight.position.set(0, 10, 0);
            this.domainGroup.add(yutaLight);

        } else if (type === 'self_embodiment') {
            // Mahito: Self-Embodiment of Perfection (Grotesque Hand-Woven Void)
            this.scene.fog.color.setHex(0x0a0212);
            this.dirLight.color.setHex(0xb536ff);

            const voidFloor = new THREE.Mesh(
                new THREE.CircleGeometry(50, 32).rotateX(-Math.PI / 2),
                new THREE.MeshBasicMaterial({ color: 0x020106 })
            );
            voidFloor.position.y = 0.12;
            this.domainGroup.add(voidFloor);

            const skinMat = new THREE.MeshStandardMaterial({ color: 0x9888a5, roughness: 0.55 });
            // 14 Towering Sculpted Hands Emerging from Abyss Floor
            for (let i = 0; i < 14; i++) {
                const handGroup = new THREE.Group();
                const armHeight = 4 + Math.random() * 4.5;
                const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.1, armHeight, 8), skinMat);
                arm.position.y = armHeight / 2;
                handGroup.add(arm);

                const palm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 1.3), skinMat);
                palm.position.y = armHeight + 0.25;
                handGroup.add(palm);

                // Curled Grasping Fingers
                for (let f = -0.45; f <= 0.45; f += 0.3) {
                    const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.4, 6), skinMat);
                    finger.position.set(f, armHeight + 0.9, 0.2);
                    finger.rotation.x = -0.6;
                    handGroup.add(finger);
                }

                const r = 10 + Math.random() * 22;
                const a = (i / 14) * Math.PI * 2;
                handGroup.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
                handGroup.rotation.y = a + Math.PI;
                this.domainGroup.add(handGroup);
            }

            // Overhead Interlocking Hand Clasp Canopy
            const canopy = new THREE.Mesh(
                new THREE.TorusGeometry(18, 1.2, 8, 24),
                new THREE.MeshStandardMaterial({ color: 0x7a6688, roughness: 0.6 })
            );
            canopy.position.y = 16;
            canopy.rotation.x = Math.PI / 2;
            this.domainGroup.add(canopy);

            const mahitoLight = new THREE.PointLight(0xb536ff, 3.8, 80);
            mahitoLight.position.set(0, 9, 0);
            this.domainGroup.add(mahitoLight);

        } else if (type === 'idle_death_gamble') {
            // Kinji Hakari: Idle Death Gamble (Pachinko Station & Golden Rush)
            this.scene.fog.color.setHex(0x0c0c16);
            this.dirLight.color.setHex(0xffd700);

            // Shinjuku Platform Ground
            const stationFloor = new THREE.Mesh(
                new THREE.BoxGeometry(54, 0.2, 54),
                new THREE.MeshStandardMaterial({ color: 0x181822, roughness: 0.7 })
            );
            stationFloor.position.y = 0.1;
            this.domainGroup.add(stationFloor);

            // Subway Steel Rails
            for (let rx of [-8, -6, 6, 8]) {
                const rail = new THREE.Mesh(
                    new THREE.BoxGeometry(0.22, 0.25, 52),
                    new THREE.MeshStandardMaterial({ color: 0x777788, metalness: 0.9, roughness: 0.2 })
                );
                rail.position.set(rx, 0.22, 0);
                this.domainGroup.add(rail);
            }

            // Automated Subway Sliding Train Doors (Left & Right)
            for (let side of [-1, 1]) {
                const doorFrame = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 7, 10),
                    new THREE.MeshStandardMaterial({ color: 0x282835, metalness: 0.6, roughness: 0.4 })
                );
                doorFrame.position.set(side * 18, 3.5, 0);
                this.domainGroup.add(doorFrame);

                // Golden Warning Neon Door Edge
                const edgeLight = new THREE.Mesh(
                    new THREE.BoxGeometry(0.55, 6.8, 0.4),
                    new THREE.MeshBasicMaterial({ color: 0xffd700 })
                );
                edgeLight.position.set(side * 17.8, 3.5, 0);
                this.domainGroup.add(edgeLight);
            }

            // Floating 3D Pachinko Roulette Display Cubes [ 7 7 7 ]
            const pGroup = new THREE.Group();
            pGroup.position.set(0, 11, -8);
            for (let c = -1; c <= 1; c++) {
                const cube = new THREE.Mesh(
                    new THREE.BoxGeometry(2.4, 2.8, 1.2),
                    new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.3, metalness: 0.8 })
                );
                cube.position.x = c * 3.4;
                pGroup.add(cube);

                // Neon 7 Digits
                const sevenMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
                const sevenH = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 0.1), sevenMat);
                sevenH.position.set(c * 3.4, 0.8, 0.65);
                pGroup.add(sevenH);
                const sevenD = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.6, 0.1), sevenMat);
                sevenD.position.set(c * 3.4 + 0.3, 0.1, 0.65);
                sevenD.rotation.z = -0.3;
                pGroup.add(sevenD);
            }
            this.domainGroup.add(pGroup);

            const hakariLight = new THREE.PointLight(0xffd700, 3.6, 85);
            hakariLight.position.set(0, 9, 0);
            this.domainGroup.add(hakariLight);

        } else if (type === 'womb_profusion') {
            // Kenjaku / Suguru Geto: Womb Profusion (Nightmarish Face Pillar)
            this.scene.fog.color.setHex(0x1f060a);
            this.dirLight.color.setHex(0xcc2233);

            const fleshFloor = new THREE.Mesh(
                new THREE.CircleGeometry(52, 32).rotateX(-Math.PI / 2),
                new THREE.MeshStandardMaterial({ color: 0x220508, roughness: 0.9 })
            );
            fleshFloor.position.y = 0.12;
            this.domainGroup.add(fleshFloor);

            // Colossal Central Spirit Pillar
            const pillarMat = new THREE.MeshStandardMaterial({ color: 0x2e080e, roughness: 0.7 });
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 5.8, 22, 16), pillarMat);
            pillar.position.set(0, 11, -12);
            this.domainGroup.add(pillar);

            // Contorted Demonic Face Spheres stacked vertically
            const faceMat = new THREE.MeshStandardMaterial({ color: 0x907078, roughness: 0.6 });
            for (let y = 3; y <= 18; y += 3.2) {
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
                    const face = new THREE.Mesh(new THREE.SphereGeometry(0.95, 8, 8), faceMat);
                    face.position.set(Math.cos(a) * 4.6, y, -12 + Math.sin(a) * 4.6);
                    this.domainGroup.add(face);
                }
            }

            const wombLight = new THREE.PointLight(0xcc1122, 4.2, 85);
            wombLight.position.set(0, 10, -6);
            this.domainGroup.add(wombLight);

        } else if (type === 'memory_of_soul') {
            // Yuji Itadori: Memory of the Soul (Snowbound Sendai Station)
            this.scene.fog.color.setHex(0x1b232c);
            this.dirLight.color.setHex(0xcae8ff);

            const snowFloor = new THREE.Mesh(
                new THREE.BoxGeometry(54, 0.2, 54),
                new THREE.MeshStandardMaterial({ color: 0xd8e4ee, roughness: 0.95 })
            );
            snowFloor.position.y = 0.1;
            this.domainGroup.add(snowFloor);

            // Train Station Awning & Roof Posts
            const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d3025, roughness: 0.85 });
            for (let side of [-1, 1]) {
                for (let z of [-12, 0, 12]) {
                    const post = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6.5, 0.6), woodMat);
                    post.position.set(side * 14, 3.25, z);
                    this.domainGroup.add(post);
                }
            }
            const roof = new THREE.Mesh(
                new THREE.BoxGeometry(32, 0.4, 32),
                new THREE.MeshStandardMaterial({ color: 0x2b221a, roughness: 0.8 })
            );
            roof.position.set(0, 6.7, 0);
            this.domainGroup.add(roof);

            // Cold Winter Station Point Light
            const stationLight = new THREE.PointLight(0xc8e6ff, 3.0, 75);
            stationLight.position.set(0, 6.2, 0);
            this.domainGroup.add(stationLight);

        } else {
            // Thematic Stylized Domains for Remaining Sorcerers
            let fogCol = 0x121422;
            let dirCol = 0xffffff;

            if (type === 'straw_doll_domain') { fogCol = 0x180b18; dirCol = 0x00e5ff; }
            else if (type === 'ratio_domain') { fogCol = 0x14141c; dirCol = 0xffd700; }
            else if (type === 'boogie_domain') { fogCol = 0x1a0a20; dirCol = 0xff22aa; }
            else if (type === 'tri_core_domain') { fogCol = 0x101a14; dirCol = 0x44dd66; }
            else if (type === 'flowing_red_domain') { fogCol = 0x220508; dirCol = 0xee1133; }

            this.scene.fog.color.setHex(fogCol);
            this.dirLight.color.setHex(dirCol);

            const floor = new THREE.Mesh(
                new THREE.CircleGeometry(48, 32).rotateX(-Math.PI / 2),
                new THREE.MeshStandardMaterial({ color: 0x181a24, roughness: 0.8 })
            );
            floor.position.y = 0.12;
            this.domainGroup.add(floor);

            const domainLight = new THREE.PointLight(dirCol, 3.0, 75);
            domainLight.position.set(0, 8, 0);
            this.domainGroup.add(domainLight);
        }
    }

    // ----------------------------------------------------
    // DOMAIN CLASH SYSTEM
    // ----------------------------------------------------
    triggerDomainClash(domainA, domainB, casterA, casterB) {
        this.domainState.isClashing = true;
        this.domainState.clashDomainA = domainA;
        this.domainState.clashDomainB = domainB;
        this.domainState.clashCasterA = casterA;
        this.domainState.clashCasterB = casterB;
        this.domainState.clashTimer = 600; // 10 seconds of clashing barrier tug-of-war
        this.domainState.clashDamageA = 0;
        this.domainState.clashDamageB = 0;

        // Play crackling clash audio
        if (window.GameInstance && window.GameInstance.sound) {
            window.GameInstance.sound.playDomainClash();
        }

        // Announce Clash via floating banner & screen shake
        if (window.GameInstance && window.GameInstance.particles) {
            window.GameInstance.particles.shake(20, 32);
            window.GameInstance.particles.flash('#ffffff', 0.6);
            const midX = (casterA.x + casterB.x) / 2;
            const midZ = (casterA.z + casterB.z) / 2;
            window.GameInstance.particles.addFloatingText('⚡ DOMAIN CLASH! ⚡', midX, 6.5, '#ffd700', 32, true);
            window.GameInstance.particles.addFloatingText('SURE-HITS MUTUALLY NEUTRALIZED!', midX, 4.2, '#00e5ff', 20);
        }

        this.setupClashVisuals(casterA, casterB);
    }

    setupClashVisuals(casterA, casterB) {
        this.clearClashVisuals();

        const midX = (casterA.x + casterB.x) / 2;
        const midZ = (casterA.z + casterB.z) / 2;
        const dx = casterB.x - casterA.x;
        const dz = casterB.z - casterA.z;
        const seamAngle = Math.atan2(dx, dz) + Math.PI / 2;

        // Dynamic 3D Energy Rift dividing the two domains
        const riftGeo = new THREE.PlaneGeometry(65, 26);
        const riftMat = new THREE.MeshBasicMaterial({
            color: 0xff0055,
            wireframe: true,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.72
        });
        const riftMesh = new THREE.Mesh(riftGeo, riftMat);
        riftMesh.position.set(midX, 10, midZ);
        riftMesh.rotation.y = seamAngle;
        this.domainState.clashGroup.add(riftMesh);

        // Core Clash Point Light
        const clashLight = new THREE.PointLight(0xff00aa, 4.5, 60);
        clashLight.position.set(midX, 6, midZ);
        this.domainState.clashGroup.add(clashLight);
    }

    updateDomainClash() {
        this.domainState.clashTimer--;

        // Spawn crackling barrier sparks along the clash midline
        if (this.domainState.clashCasterA && this.domainState.clashCasterB && window.GameInstance && window.GameInstance.particles) {
            const midX = (this.domainState.clashCasterA.x + this.domainState.clashCasterB.x) / 2;
            const midZ = (this.domainState.clashCasterA.z + this.domainState.clashCasterB.z) / 2;
            window.GameInstance.particles.createDomainClashSparks(midX, 4, midZ, 6);
        }

        // Barrier Pressure Check: First caster to sustain 50+ damage loses the clash!
        if (this.domainState.clashDamageA >= 50) {
            this.resolveClash(this.domainState.clashCasterB, this.domainState.clashDomainB, this.domainState.clashCasterA);
            return;
        }
        if (this.domainState.clashDamageB >= 50) {
            this.resolveClash(this.domainState.clashCasterA, this.domainState.clashDomainA, this.domainState.clashCasterB);
            return;
        }

        // Timer Expiration: Double Domain Burnout!
        if (this.domainState.clashTimer <= 0) {
            this.clearClashVisuals();
            this.collapseDomain('burnout');
        }
    }

    resolveClash(winnerCaster, winnerDomain, loserCaster) {
        this.clearClashVisuals();
        this.domainState.isClashing = false;

        if (window.GameInstance && window.GameInstance.particles) {
            window.GameInstance.particles.shake(22, 30);
            window.GameInstance.particles.addFloatingText(
                `${winnerCaster.charKey.toUpperCase()} OVERPOWERS THE BARRIER!`,
                winnerCaster.x,
                5.5,
                '#ffd700',
                28,
                true
            );
        }

        if (window.GameInstance && window.GameInstance.sound) {
            window.GameInstance.sound.playDomainShatter();
        }

        // Crown winner domain: Sure-Hit re-engages for remaining duration!
        this.domainState.type = winnerDomain;
        this.domainState.caster = winnerCaster;
        this.domainState.casterKey = winnerCaster.charKey;
        this.domainState.timer = 0;
        this.domainState.casterDamageTaken = 0;
    }

    clearClashVisuals() {
        while (this.domainState.clashGroup.children.length > 0) {
            const obj = this.domainState.clashGroup.children[0];
            this.domainState.clashGroup.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        }
    }

    // ----------------------------------------------------
    // CONTINUOUS SURE-HIT DAMAGE & PRESSURE
    // ----------------------------------------------------
    applyDomainSureHit() {
        if (!this.domainState.active || this.domainState.isClashing) return;
        const caster = this.domainState.caster;
        if (!caster || caster.state === 'dead' || !window.GameInstance) return;

        const target = (caster === window.GameInstance.p1) ? window.GameInstance.p2 : window.GameInstance.p1;
        if (!target || target.state === 'dead') return;

        // HEAVENLY RESTRICTION IMMUNITY: Maki and Toji possess 0 Cursed Energy!
        // Closed domain barriers cannot detect or lock onto them with sure-hit effects!
        if ((target.charKey === 'toji' || target.charKey === 'maki') && this.domainState.isClosedBarrier) {
            if (this.domainState.timer % 180 === 0 && window.GameInstance.particles) {
                window.GameInstance.particles.addFloatingText('HEAVENLY RESTRICTION: 0 CE (IMMUNE!)', target.x, target.y + 3.2, '#78909c', 18);
            }
            return;
        }

        // Distance check from domain center
        const centerPos = this.domainGroup.position;
        const dist = Math.hypot(target.x - centerPos.x, target.z - centerPos.z);
        if (dist > 58) return;

        const type = this.domainState.type;
        let damage = 11;
        let hitText = 'SURE-HIT!';
        let hitColor = '#ff2a5f';
        let statusType = null;
        let statusDur = 0;

        switch (type) {
            case 'malevolent_shrine':
                damage = 12;
                hitText = 'CLEAVE!';
                hitColor = '#ff2255';
                if (window.GameInstance.sound) window.GameInstance.sound.playSlash();
                if (window.GameInstance.particles) {
                    window.GameInstance.particles.createHitSparks(target.x, target.y + 1.5, target.z, 14, '#ff1133');
                }
                break;

            case 'unlimited_void':
                damage = 8;
                hitText = 'INFO OVERLOAD!';
                hitColor = '#00e5ff';
                statusType = 'stun';
                statusDur = 16;
                if (window.GameInstance.particles) {
                    window.GameInstance.particles.createCursedBurst(target.x, target.y + 1.5, target.z, '#00b0ff', 12);
                }
                break;

            case 'iron_mountain':
                damage = 10;
                hitText = 'MAGMA HEAT!';
                hitColor = '#ff5500';
                if (window.GameInstance.sound) window.GameInstance.sound.playFireExplosion();
                if (window.GameInstance.particles) {
                    window.GameInstance.particles.createHitSparks(target.x, target.y + 1.5, target.z, 12, '#ff4400');
                }
                break;

            case 'chimera_shadow':
                damage = 9;
                hitText = 'SHADOW SINK!';
                hitColor = '#00e5ff';
                if (window.GameInstance.particles) {
                    window.GameInstance.particles.createCursedBurst(target.x, target.y + 0.5, target.z, '#003366', 10);
                }
                break;

            case 'authentic_mutual_love':
                const copiedMoves = [
                    { name: 'COPIED CLEAVE!', dmg: 12, col: '#ff2255' },
                    { name: 'THIN ICE BREAKER!', dmg: 11, col: '#00e5ff' },
                    { name: 'CURSED SPEECH!', dmg: 10, col: '#dfd5ff' },
                    { name: 'SKY MANIPULATION!', dmg: 11, col: '#a855f7' }
                ];
                const tech = copiedMoves[Math.floor(Math.random() * copiedMoves.length)];
                damage = tech.dmg;
                hitText = tech.name;
                hitColor = tech.col;
                if (window.GameInstance.particles) {
                    window.GameInstance.particles.createHitSparks(target.x, target.y + 1.5, target.z, 14, tech.col);
                }
                break;

            case 'self_embodiment':
                damage = 13;
                hitText = 'SOUL TRANSHAPE!';
                hitColor = '#b022ff';
                if (window.GameInstance.particles) {
                    window.GameInstance.particles.createCursedBurst(target.x, target.y + 1.5, target.z, '#b022ff', 16);
                }
                break;

            case 'idle_death_gamble':
                if (caster.charKey === 'hakari') {
                    caster.heal(8);
                    caster.gainEnergy(15);
                    if (window.GameInstance.particles) {
                        window.GameInstance.particles.addFloatingText('JACKPOT FEVER!', caster.x, caster.y + 3.2, '#ffd700', 20);
                    }
                }
                damage = 9;
                hitText = 'PACHINKO STRIKE!';
                hitColor = '#ffd700';
                break;

            case 'womb_profusion':
                damage = 12;
                hitText = 'GRAVITY SURGE!';
                hitColor = '#cc0022';
                if (window.GameInstance.particles) {
                    window.GameInstance.particles.createCursedBurst(target.x, target.y + 1.5, target.z, '#660011', 14);
                }
                break;

            case 'memory_of_soul':
                damage = 11;
                hitText = 'SOUL DISMANTLE!';
                hitColor = '#c8e4ff';
                if (window.GameInstance.particles) {
                    window.GameInstance.particles.createHitSparks(target.x, target.y + 1.5, target.z, 14, '#ffffff');
                }
                break;

            case 'straw_doll_domain':
                damage = 10;
                hitText = 'RESONANCE!';
                hitColor = '#00e5ff';
                break;

            case 'ratio_domain':
                damage = 12;
                hitText = '7:3 RATIO CRIT!';
                hitColor = '#ffd700';
                break;

            default:
                damage = 10;
                hitText = 'SURE-HIT!';
                hitColor = '#ff2a5f';
                break;
        }

        if (statusType) {
            target.applyStatus(statusType, statusDur);
        }

        // Apply Damage (respects opponent blocking & reduction)
        target.takeDamage(damage, caster, `${type}_surehit`, 0.08);

        if (window.GameInstance.particles) {
            window.GameInstance.particles.addFloatingText(hitText, target.x, target.y + 2.8, hitColor, 18);
        }
    }

    // ----------------------------------------------------
    // DOMAIN LIFECYCLE & COLLAPSE
    // ----------------------------------------------------
    collapseDomain(reason = 'expired') {
        if (!this.domainState.active && !this.domainState.isClashing) return;

        const pos = this.domainGroup.position;
        const color = (this.domainState.type === 'malevolent_shrine' ? '#ff2255' :
                       (this.domainState.type === 'unlimited_void' ? '#00e5ff' :
                       (this.domainState.type === 'iron_mountain' ? '#ff5500' :
                       (this.domainState.type === 'self_embodiment' ? '#b022ff' :
                       (this.domainState.type === 'idle_death_gamble' ? '#ffd700' : '#a855f7')))));

        // Audio
        if (window.GameInstance && window.GameInstance.sound) {
            window.GameInstance.sound.playDomainShatter();
        }

        // Particle Shatter Burst & Announcements
        if (window.GameInstance && window.GameInstance.particles) {
            window.GameInstance.particles.createDomainShatter(pos.x, 3.5, pos.z, color, 65);
            window.GameInstance.particles.shake(16, 24);

            let banner = 'DOMAIN COLLAPSED!';
            if (reason === 'caster_dead') banner = 'DOMAIN SHATTERED: CASTER DEFEATED!';
            else if (reason === 'damage') banner = 'DOMAIN SHATTERED: CONCENTRATION BROKEN!';
            else if (reason === 'burnout') banner = 'DOUBLE DOMAIN BURNOUT!';
            else if (reason === 'clash_loss') banner = 'BARRIER OVERPOWERED & SHATTERED!';

            window.GameInstance.particles.addFloatingText(banner, pos.x, 5.0, color, 28, true);
        }

        this.clearDomain();
    }

    clearDomain() {
        this.activeDomain = null;
        this.domainState.active = false;
        this.domainState.type = null;
        this.domainState.caster = null;
        this.domainState.casterKey = null;
        this.domainState.timer = 0;
        this.domainState.casterDamageTaken = 0;
        this.domainState.isClosedBarrier = false;
        this.domainState.barrierShell = null;
        this.domainState.isClashing = false;
        this.domainState.clashTimer = 0;

        this.clearClashVisuals();

        while (this.domainGroup.children.length > 0) {
            const obj = this.domainGroup.children[0];
            this.domainGroup.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        }

        // Restore active battlefield sky & lighting
        const field = (typeof BATTLEFIELDS_DATA !== 'undefined' && BATTLEFIELDS_DATA[this.currentBattlefieldKey])
            ? BATTLEFIELDS_DATA[this.currentBattlefieldKey]
            : null;
        if (field) {
            this.scene.fog.color.setHex(field.fogColor);
            this.scene.fog.density = field.fogDensity || 0.007;
            this.dirLight.color.setHex(field.sunColor);
            this.dirLight.intensity = field.sunIntensity || 1.25;
            if (this.ambientLight) this.ambientLight.color.setHex(field.ambientColor);
            if (this.skyDome && this.skyDome.material) this.skyDome.material.color.setHex(field.skyColor);
        } else {
            this.scene.fog.color.setHex(0x121422);
            this.dirLight.color.setHex(0xfff5e6);
        }
    }

    // ----------------------------------------------------
    // TICK & UPDATE
    // ----------------------------------------------------
    update(delta = 0.016) {
        // Rotate sky dome slowly
        if (this.skyDome) this.skyDome.rotation.y += 0.0003;
        if (this.stars) this.stars.rotation.y += 0.00015;

        // Rotate Celestial Void starlight orbital rings
        if (this.orbitRings && this.orbitRings.length > 0) {
            this.orbitRings.forEach(r => {
                if (r.userData && r.userData.speed) r.rotation.y += r.userData.speed;
            });
        }

        // Float & spin Culling Game Kogane crystals
        if (this.droneCrystals && this.droneCrystals.length > 0) {
            const time = Date.now() * 0.002;
            this.droneCrystals.forEach((d, idx) => {
                d.rotation.y += 0.03;
                d.position.y += Math.sin(time + idx) * 0.015;
            });
        }

        // Ripple Dagon Beach water
        if (this.waterMesh) {
            this.waterTime = (this.waterTime || 0) + 0.02;
            this.waterMesh.rotation.z = Math.sin(this.waterTime * 0.5) * 0.015;
        }

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

        // ----------------------------------------------------
        // DOMAIN EXPANSION LIFECYCLE & SURE-HIT TICKER
        // ----------------------------------------------------
        if (this.domainState.active) {
            this.domainState.timer++;

            // Dynamic barrier shell expansion animation (ballooning barrier bloom)
            if (this.domainState.barrierShell && this.domainState.barrierShell.scale.x < 1.0) {
                const cur = this.domainState.barrierShell.scale.x;
                const next = cur + (1.0 - cur) * 0.16;
                this.domainState.barrierShell.scale.set(next, next, next);
            }

            // Caster Death Check: Domain shatters immediately if caster is eliminated
            if (this.domainState.caster && this.domainState.caster.state === 'dead') {
                this.collapseDomain('caster_dead');
                return;
            }

            // Expiration Check: Canonical domain collapse after duration
            if (this.domainState.timer >= this.domainState.maxDuration) {
                this.collapseDomain('expired');
                return;
            }

            // If Domain Clash is active, execute clash tug-of-war (Sure-Hits neutralized!)
            if (this.domainState.isClashing) {
                this.updateDomainClash();
                return;
            }

            // Continuous Sure-Hit Pressure Loop
            this.domainState.sureHitTimer++;
            if (this.domainState.sureHitTimer >= this.domainState.sureHitInterval) {
                this.domainState.sureHitTimer = 0;
                this.applyDomainSureHit();
            }
        }
    }
}
