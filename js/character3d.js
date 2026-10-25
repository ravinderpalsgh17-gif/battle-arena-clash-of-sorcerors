// Procedural 3D Character Rigging & Animation Engine for Battle Arena: Clash of Sorcerors
// Features: 16 Unique Jujutsu Kaisen Sorcerer Models, Weapons, Companions, Cursed Effects,
// and Hierarchical Procedural Skeletal Animation (Idle, Run, Jump, Attack combos, Block, Hurt, Domains)

class Character3DFactory {
    static create(charKey, isPlayer2 = false) {
        const charData = CHARACTERS_DATA[charKey] || CHARACTERS_DATA.yuji;
        const group = new THREE.Group();
        group.name = `char_${charKey}_${isPlayer2 ? 'p2' : 'p1'}`;

        const parts = {};
        const materials = [];

        // Helper to register materials for effects (e.g. flashing on hurt)
        function regMat(mat) {
            materials.push(mat);
            return mat;
        }

        // Shared Standard Materials
        const skinMat = regMat(new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.6 }));
        const darkSkinMat = regMat(new THREE.MeshStandardMaterial({ color: 0xe0b59b, roughness: 0.6 }));
        const uniformDarkMat = regMat(new THREE.MeshStandardMaterial({ color: 0x141829, roughness: 0.5 }));
        const uniformGoldMat = regMat(new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.8, roughness: 0.2 }));
        const metalMat = regMat(new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 }));

        // 1. Torso Base
        const torsoGroup = new THREE.Group();
        torsoGroup.position.y = 1.9;
        group.add(torsoGroup);
        parts.torso = torsoGroup;

        let torsoWidth = 0.9;
        let torsoHeight = 1.2;
        let torsoDepth = 0.55;

        // Bulky characters adjustments
        if (charKey === 'panda') {
            torsoWidth = 1.6;
            torsoHeight = 1.4;
            torsoDepth = 1.4;
        } else if (charKey === 'todo' || charKey === 'sukuna' || charKey === 'toji') {
            torsoWidth = 1.15;
            torsoHeight = 1.3;
            torsoDepth = 0.7;
        }

        let torsoMat = uniformDarkMat;
        if (charKey === 'panda') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf0f0f5, roughness: 0.9 }));
        } else if (charKey === 'todo') {
            torsoMat = darkSkinMat; // Shirtless martial artist
        } else if (charKey === 'nanami') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xddccaa, roughness: 0.6 })); // Tan suit
        } else if (charKey === 'geto') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.7 })); // Monk robes
        } else if (charKey === 'yuta') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf5f5fa, roughness: 0.6 })); // White loose jacket
        } else if (charKey === 'sukuna') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xede8dc, roughness: 0.7 })); // Open kimono
        } else if (charKey === 'toji') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.4 })); // Tight black shirt
        } else if (charKey === 'jogo') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0x4a6344, roughness: 0.8 })); // Green speckled robe
        } else if (charKey === 'choso') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xded8ce, roughness: 0.7 })); // Beige haori
        }

        const torsoMesh = new THREE.Mesh(
            charKey === 'panda' 
                ? new THREE.SphereGeometry(0.85, 12, 12)
                : new THREE.BoxGeometry(torsoWidth, torsoHeight, torsoDepth),
            torsoMat
        );
        torsoMesh.castShadow = true;
        torsoMesh.receiveShadow = true;
        torsoGroup.add(torsoMesh);

        // Character-specific Torso Details
        if (charKey === 'yuji') {
            // Bright Red Hood folded on shoulders
            const hoodGeo = new THREE.TorusGeometry(0.55, 0.16, 8, 16);
            hoodGeo.rotateX(Math.PI / 2);
            const hoodMat = regMat(new THREE.MeshStandardMaterial({ color: 0xff2a5f, roughness: 0.6 }));
            const hood = new THREE.Mesh(hoodGeo, hoodMat);
            hood.position.set(0, 0.6, 0);
            torsoGroup.add(hood);
        } else if (charKey === 'nanami') {
            // Spotted Tie & Collared Shirt
            const tieGeo = new THREE.BoxGeometry(0.18, 0.7, 0.08);
            const tieMat = regMat(new THREE.MeshStandardMaterial({ color: 0x3366cc, roughness: 0.4 }));
            const tie = new THREE.Mesh(tieGeo, tieMat);
            tie.position.set(0, 0.1, 0.3);
            torsoGroup.add(tie);
        } else if (charKey === 'sukuna') {
            // Cursed Black Chest Markings / Tattoos
            const chestTattoo = new THREE.Mesh(
                new THREE.BoxGeometry(0.7, 0.8, 0.05),
                regMat(new THREE.MeshBasicMaterial({ color: 0x110810 }))
            );
            chestTattoo.position.set(0, 0.1, 0.36);
            torsoGroup.add(chestTattoo);

            // Black Obi Sash
            const sash = new THREE.Mesh(
                new THREE.BoxGeometry(torsoWidth + 0.1, 0.3, torsoDepth + 0.1),
                regMat(new THREE.MeshStandardMaterial({ color: 0x1a1a20 }))
            );
            sash.position.set(0, -0.4, 0);
            torsoGroup.add(sash);
        } else if (charKey === 'toji') {
            // Coiled Cursed Spirit Worm draped diagonally over chest!
            const wormGeo = new THREE.TorusGeometry(0.7, 0.16, 8, 24);
            wormGeo.rotateZ(Math.PI / 4);
            const wormMat = regMat(new THREE.MeshStandardMaterial({ color: 0x5a4d66, roughness: 0.8 }));
            const worm = new THREE.Mesh(wormGeo, wormMat);
            worm.position.set(0, 0.1, 0.1);
            torsoGroup.add(worm);
        }

        // 2. Head Group
        const headGroup = new THREE.Group();
        headGroup.position.y = (charKey === 'panda' ? 0.75 : 0.85);
        torsoGroup.add(headGroup);
        parts.head = headGroup;

        // Head mesh
        let headSize = 0.55;
        if (charKey === 'panda') headSize = 0.7;
        const headMat = (charKey === 'panda' ? torsoMat : (charKey === 'todo' ? darkSkinMat : (charKey === 'jogo' ? regMat(new THREE.MeshStandardMaterial({ color: 0xa4b89b })) : skinMat)));
        const headMesh = new THREE.Mesh(
            new THREE.SphereGeometry(headSize * 0.75, 12, 12),
            headMat
        );
        headMesh.castShadow = true;
        headGroup.add(headMesh);

        // Hairstyle & Iconic Head Features
        if (charKey === 'gojo') {
            // Spiky White Hair
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf5f8ff, roughness: 0.3 }));
            for (let i = 0; i < 9; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.45, 5), hairMat);
                const angle = (i / 9) * Math.PI * 2;
                spike.position.set(Math.cos(angle) * 0.28, 0.35 + Math.sin(i) * 0.08, Math.sin(angle) * 0.28);
                spike.rotation.set(Math.sin(angle) * 0.5, 0, -Math.cos(angle) * 0.5);
                headGroup.add(spike);
            }
            // Iconic Black Blindfold
            const blindfold = new THREE.Mesh(
                new THREE.BoxGeometry(0.66, 0.24, 0.66),
                regMat(new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.4 }))
            );
            blindfold.position.set(0, 0.04, 0);
            headGroup.add(blindfold);
        } else if (charKey === 'yuji') {
            // Spiky Pink-Black Hair
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0xff3b77, roughness: 0.6 }));
            for (let i = 0; i < 8; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.38, 5), hairMat);
                const a = (i / 8) * Math.PI * 2;
                spike.position.set(Math.cos(a) * 0.26, 0.32, Math.sin(a) * 0.26);
                spike.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4);
                headGroup.add(spike);
            }
            // Facial Slits under eyes
            const slitMat = regMat(new THREE.MeshBasicMaterial({ color: 0x5a1122 }));
            for (let s of [-0.15, 0.15]) {
                const slit = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), slitMat);
                slit.position.set(s, -0.06, 0.4);
                headGroup.add(slit);
            }
        } else if (charKey === 'nobara') {
            // Orange-Brown Bob Hair
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0xd9682b, roughness: 0.6 }));
            const bob = new THREE.Mesh(new THREE.SphereGeometry(0.46, 12, 10), hairMat);
            bob.position.set(0, 0.08, -0.05);
            headGroup.add(bob);
        } else if (charKey === 'megumi') {
            // Spiky Black Hair (Sea Urchin style)
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0x0f1118, roughness: 0.6 }));
            for (let i = 0; i < 11; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 4), hairMat);
                const a = (i / 11) * Math.PI * 2;
                spike.position.set(Math.cos(a) * 0.28, 0.35, Math.sin(a) * 0.28);
                spike.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6);
                headGroup.add(spike);
            }
        } else if (charKey === 'panda') {
            // Panda Ears & Black Eye Patches
            const earMat = regMat(new THREE.MeshStandardMaterial({ color: 0x111116 }));
            for (let side of [-1, 1]) {
                const ear = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), earMat);
                ear.position.set(side * 0.4, 0.45, 0);
                headGroup.add(ear);

                const patch = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.05), earMat);
                patch.position.set(side * 0.2, 0.05, 0.48);
                headGroup.add(patch);
            }
            // Black snout
            const snout = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), earMat);
            snout.position.set(0, -0.08, 0.52);
            headGroup.add(snout);
        } else if (charKey === 'nanami') {
            // Blonde Hair & Wireframe Sunglasses
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0xe6c86e, roughness: 0.4 }));
            const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 10, 8), hairMat);
            hair.position.set(0, 0.12, -0.05);
            headGroup.add(hair);

            const glasses = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.14, 0.1),
                regMat(new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 }))
            );
            glasses.position.set(0, 0.05, 0.38);
            headGroup.add(glasses);
        } else if (charKey === 'sukuna') {
            // Spiky Hair & Forehead Cursed Markings + 4 Eyes
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0x2e111a, roughness: 0.6 }));
            const hair = new THREE.Mesh(new THREE.SphereGeometry(0.46, 10, 8), hairMat);
            hair.position.set(0, 0.12, -0.05);
            headGroup.add(hair);

            const eyeMat = regMat(new THREE.MeshBasicMaterial({ color: 0xff0022 }));
            for (let side of [-0.14, 0.14]) {
                // Top eyes
                const e1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.03), eyeMat);
                e1.position.set(side, 0.08, 0.4);
                headGroup.add(e1);
                // Lower small eyes
                const e2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.03), eyeMat);
                e2.position.set(side, -0.02, 0.39);
                headGroup.add(e2);
            }
        } else if (charKey === 'jogo') {
            // Volcano Chimney Head with glowing molten lava core!
            const volcMat = regMat(new THREE.MeshStandardMaterial({ color: 0x33221a, roughness: 0.9 }));
            const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.35, 0.5, 8), volcMat);
            chimney.position.set(0, 0.45, 0);
            headGroup.add(chimney);

            const lavaCore = new THREE.Mesh(
                new THREE.SphereGeometry(0.15, 8, 8),
                regMat(new THREE.MeshBasicMaterial({ color: 0xff4400 }))
            );
            lavaCore.position.set(0, 0.65, 0);
            headGroup.add(lavaCore);

            // Single Cyclops Eye
            const eye = new THREE.Mesh(
                new THREE.SphereGeometry(0.16, 8, 8),
                regMat(new THREE.MeshBasicMaterial({ color: 0xffcc00 }))
            );
            eye.position.set(0, 0.04, 0.42);
            headGroup.add(eye);
        } else {
            // Default styled sorcerer hair
            const defHairMat = regMat(new THREE.MeshStandardMaterial({
                color: (charKey === 'todo' || charKey === 'maki' || charKey === 'toji' || charKey === 'geto' || charKey === 'yuta') ? 0x11141c : (charKey === 'mahito' ? 0x8899aa : 0x4a2a1a),
                roughness: 0.6
            }));
            const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.44, 10, 8), defHairMat);
            hairCap.position.set(0, 0.1, -0.04);
            headGroup.add(hairCap);

            if (charKey === 'todo' || charKey === 'geto') {
                // High Samurai Topknot
                const knot = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.35, 6), defHairMat);
                knot.position.set(0, 0.55, -0.1);
                headGroup.add(knot);
            }
        }

        // 3. Arms Rigging (Hierarchical Shoulders -> Elbows -> Hands)
        parts.arms = [];
        const armThickness = (charKey === 'panda' ? 0.32 : (charKey === 'todo' || charKey === 'sukuna' ? 0.22 : 0.16));
        const sleeveMat = (charKey === 'todo' ? darkSkinMat : (charKey === 'sukuna' ? skinMat : torsoMat));

        for (let side of [-1, 1]) { // -1 = Left, 1 = Right
            const shoulderGroup = new THREE.Group();
            shoulderGroup.position.set(side * (torsoWidth / 2 + 0.15), 0.45, 0);
            torsoGroup.add(shoulderGroup);

            // Upper Arm
            const upperArm = new THREE.Mesh(
                new THREE.CylinderGeometry(armThickness, armThickness * 0.9, 0.65, 8),
                sleeveMat
            );
            upperArm.position.y = -0.32;
            upperArm.castShadow = true;
            shoulderGroup.add(upperArm);

            // Forearm Group (Elbow joint)
            const forearmGroup = new THREE.Group();
            forearmGroup.position.set(0, -0.65, 0);
            shoulderGroup.add(forearmGroup);

            const forearm = new THREE.Mesh(
                new THREE.CylinderGeometry(armThickness * 0.9, armThickness * 0.8, 0.65, 8),
                (charKey === 'panda' ? regMat(new THREE.MeshStandardMaterial({ color: 0x111116 })) : skinMat)
            );
            forearm.position.y = -0.32;
            forearm.castShadow = true;
            forearmGroup.add(forearm);

            // Hand
            const hand = new THREE.Mesh(
                new THREE.SphereGeometry(armThickness * 0.8, 6, 6),
                skinMat
            );
            hand.position.set(0, -0.65, 0);
            forearmGroup.add(hand);

            if (side === -1) {
                parts.leftShoulder = shoulderGroup;
                parts.leftForearm = forearmGroup;
                parts.leftHand = hand;
            } else {
                parts.rightShoulder = shoulderGroup;
                parts.rightForearm = forearmGroup;
                parts.rightHand = hand;
            }
        }

        // 4. Legs Rigging (Hips -> Knees -> Boots)
        const legThickness = (charKey === 'panda' ? 0.34 : (charKey === 'todo' ? 0.24 : 0.18));
        const pantsMat = (charKey === 'todo' ? regMat(new THREE.MeshStandardMaterial({ color: 0x3d4a36 })) : (charKey === 'toji' ? regMat(new THREE.MeshStandardMaterial({ color: 0xded8cc })) : uniformDarkMat));

        for (let side of [-1, 1]) {
            const hipGroup = new THREE.Group();
            hipGroup.position.set(side * (torsoWidth / 4), -0.6, 0);
            torsoGroup.add(hipGroup);

            const thigh = new THREE.Mesh(
                new THREE.CylinderGeometry(legThickness, legThickness * 0.85, 0.7, 8),
                pantsMat
            );
            thigh.position.y = -0.35;
            thigh.castShadow = true;
            hipGroup.add(thigh);

            const calfGroup = new THREE.Group();
            calfGroup.position.set(0, -0.7, 0);
            hipGroup.add(calfGroup);

            const calf = new THREE.Mesh(
                new THREE.CylinderGeometry(legThickness * 0.85, legThickness * 0.75, 0.7, 8),
                pantsMat
            );
            calf.position.y = -0.35;
            calf.castShadow = true;
            calfGroup.add(calf);

            const boot = new THREE.Mesh(
                new THREE.BoxGeometry(legThickness * 1.8, 0.22, legThickness * 2.4),
                regMat(new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.6 }))
            );
            boot.position.set(0, -0.72, 0.08);
            boot.castShadow = true;
            calfGroup.add(boot);

            if (side === -1) {
                parts.leftHip = hipGroup;
                parts.leftCalf = calfGroup;
            } else {
                parts.rightHip = hipGroup;
                parts.rightCalf = calfGroup;
            }
        }

        // 5. Signature 3D Weapons & Companions
        parts.weapon = null;
        if (charKey === 'nobara') {
            // Carpenter's Claw Hammer
            const hammerGroup = new THREE.Group();
            const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6), regMat(new THREE.MeshStandardMaterial({ color: 0x6e4a2c })));
            handle.position.y = 0.2;
            hammerGroup.add(handle);

            const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.15), metalMat);
            hammerHead.position.set(0, 0.6, 0);
            hammerGroup.add(hammerHead);

            parts.rightHand.add(hammerGroup);
            parts.weapon = hammerGroup;
        } else if (charKey === 'nanami') {
            // 7:3 Ratio Spotted Cleaver
            const cleaverGroup = new THREE.Group();
            const blade = new THREE.Mesh(
                new THREE.BoxGeometry(0.18, 0.9, 0.04),
                regMat(new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.8 }))
            );
            blade.position.y = 0.45;
            cleaverGroup.add(blade);
            parts.rightHand.add(cleaverGroup);
            parts.weapon = cleaverGroup;
        } else if (charKey === 'maki') {
            // Naginata Spear / Playful Cloud
            const spearGroup = new THREE.Group();
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), regMat(new THREE.MeshStandardMaterial({ color: 0x881122 })));
            shaft.position.y = 0.3;
            spearGroup.add(shaft);

            const spearBlade = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.6, 4), metalMat);
            spearBlade.position.set(0, 1.4, 0);
            spearGroup.add(spearBlade);
            parts.rightHand.add(spearGroup);
            parts.weapon = spearGroup;
        } else if (charKey === 'toji') {
            // Inverted Spear of Heaven (Twin-tined Dagger)
            const daggerGroup = new THREE.Group();
            const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 6), regMat(new THREE.MeshStandardMaterial({ color: 0x111116 })));
            daggerGroup.add(hilt);

            const dBlade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.65, 0.03), metalMat);
            dBlade.position.y = 0.45;
            daggerGroup.add(dBlade);
            parts.rightHand.add(daggerGroup);
            parts.weapon = daggerGroup;
        } else if (charKey === 'yuta') {
            // Katana
            const katanaGroup = new THREE.Group();
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.3, 0.02), metalMat);
            blade.position.y = 0.65;
            katanaGroup.add(blade);
            parts.rightHand.add(katanaGroup);
            parts.weapon = katanaGroup;
        }

        // 6. Gojo Satoru 3D Infinity Barrier & Orbiting Lapse Blue / Reversal Red Orbs
        if (charKey === 'gojo') {
            const barrierGeo = new THREE.SphereGeometry(1.6, 24, 16);
            const barrierMat = regMat(new THREE.MeshBasicMaterial({
                color: 0x00b0ff,
                transparent: true,
                opacity: 0.28,
                wireframe: true
            }));
            const barrier = new THREE.Mesh(barrierGeo, barrierMat);
            barrier.position.y = 0;
            torsoGroup.add(barrier);
            parts.infinityBarrier = barrier;

            // Blue & Red Orbs
            const blueOrb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), regMat(new THREE.MeshBasicMaterial({ color: 0x00e5ff })));
            const redOrb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), regMat(new THREE.MeshBasicMaterial({ color: 0xff0044 })));
            torsoGroup.add(blueOrb);
            torsoGroup.add(redOrb);
            parts.blueOrb = blueOrb;
            parts.redOrb = redOrb;
        }

        // 7. Cursed Aura Particle Burst / Halo
        const auraGeo = new THREE.RingGeometry(0.8, 1.4, 16);
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

        // Return rich model controller
        return new CharacterModel3D(charKey, group, parts, materials, charData);
    }
}

// ----------------------------------------------------
// PROCEDURAL ANIMATOR CONTROLLER
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

        // Reset hurt flash
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

        // Aura pulse & spin
        if (this.parts.aura) {
            this.parts.aura.rotation.z += 0.03;
            const s = 1.0 + Math.sin(t * 3) * 0.12;
            this.parts.aura.scale.set(s, s, s);
        }

        // Gojo Infinity Barrier & Orbs animation
        if (this.parts.infinityBarrier) {
            this.parts.infinityBarrier.rotation.y += 0.02;
            if (this.parts.blueOrb && this.parts.redOrb) {
                const orbDist = 1.35;
                this.parts.blueOrb.position.set(Math.cos(t * 2) * orbDist, 0.2 + Math.sin(t * 2) * 0.2, Math.sin(t * 2) * orbDist);
                this.parts.redOrb.position.set(Math.cos(t * 2 + Math.PI) * orbDist, 0.2 + Math.sin(t * 2 + Math.PI) * 0.2, Math.sin(t * 2 + Math.PI) * orbDist);
            }
        }

        const isMoving = (Math.abs(vx) > 0.05 || Math.abs(vz) > 0.05);

        // --- Procedural Skeletal Animation ---

        if (state === 'dead') {
            // Fallen Flat On Back
            this.parts.torso.position.y = 0.4;
            this.parts.torso.rotation.x = -Math.PI / 2;
            this.parts.torso.rotation.y = 0;
            this.parts.torso.rotation.z = 0;
            return;
        }

        if (isBlocking) {
            // Guard Stance (Forearms crossed in front)
            this.parts.torso.position.y = 1.8;
            this.parts.torso.rotation.set(0.15, 0, 0);
            this.parts.leftShoulder.rotation.set(0.9, 0.6, -0.4);
            this.parts.rightShoulder.rotation.set(0.9, -0.6, 0.4);
            this.parts.leftForearm.rotation.set(0.8, 0, 0);
            this.parts.rightForearm.rotation.set(0.8, 0, 0);
            return;
        }

        if (!isGrounded) {
            // Jump / In-air Pose
            this.parts.torso.position.y = 1.9;
            this.parts.torso.rotation.set(-0.2, 0, 0);

            // Arms raised
            this.parts.leftShoulder.rotation.set(-0.8, 0, -0.5);
            this.parts.rightShoulder.rotation.set(-0.8, 0, 0.5);

            // Legs tucked
            this.parts.leftHip.rotation.set(-0.6, 0, 0);
            this.parts.rightHip.rotation.set(-0.3, 0, 0);
            this.parts.leftCalf.rotation.set(0.8, 0, 0);
            this.parts.rightCalf.rotation.set(0.5, 0, 0);
            return;
        }

        if (state === 'attack1') {
            // Punch / Primary Strike (Right Arm Thrust)
            const progress = (22 - stateTimer) / 22; // 0 to 1
            const strike = Math.sin(progress * Math.PI);

            this.parts.torso.rotation.y = strike * 0.45;
            this.parts.rightShoulder.rotation.set(-1.2 * strike, 0, 0);
            this.parts.rightForearm.rotation.set(-0.3 * strike, 0, 0);

            this.parts.leftShoulder.rotation.set(0.4 * strike, 0, -0.2);
            return;
        }

        if (state === 'attack2') {
            // Roundhouse Kick / Special Slash
            const progress = (34 - stateTimer) / 34;
            const spin = Math.sin(progress * Math.PI);

            this.parts.torso.rotation.y = spin * 1.2;
            this.parts.rightHip.rotation.set(-1.4 * spin, 0, 0.3 * spin);
            this.parts.rightCalf.rotation.set(0.8 * spin, 0, 0);

            this.parts.leftShoulder.rotation.set(0.6 * spin, 0, -0.6 * spin);
            this.parts.rightShoulder.rotation.set(-0.8 * spin, 0, 0.4 * spin);
            return;
        }

        if (state === 'attack3') {
            // Heavy Somersault / Overhead Strike
            const progress = (36 - stateTimer) / 36;
            const slam = Math.sin(progress * Math.PI);

            this.parts.torso.position.y = 1.9 + slam * 0.4;
            this.parts.torso.rotation.x = slam * 0.4;

            this.parts.rightShoulder.rotation.set(-1.8 * slam, 0, 0);
            this.parts.leftShoulder.rotation.set(-1.8 * slam, 0, 0);
            return;
        }

        if (state === 'ultimate') {
            // Domain Expansion Signature Hand Sign & Levitation!
            this.parts.torso.position.y = 2.4 + Math.sin(t * 4) * 0.15;
            this.parts.torso.rotation.set(0, 0, 0);

            // Both hands joined in center (JJK Domain Hand Signs)
            this.parts.leftShoulder.rotation.set(-0.9, 0.7, -0.3);
            this.parts.rightShoulder.rotation.set(-0.9, -0.7, 0.3);
            this.parts.leftForearm.rotation.set(0.7, 0, 0);
            this.parts.rightForearm.rotation.set(0.7, 0, 0);

            // Legs slightly parted and floating
            this.parts.leftHip.rotation.set(0.2, 0, -0.2);
            this.parts.rightHip.rotation.set(0.2, 0, 0.2);
            return;
        }

        if (state === 'hurt') {
            // Stagger & Recoil Backwards
            this.parts.torso.position.y = 1.8;
            this.parts.torso.rotation.set(-0.4, 0, (Math.random() - 0.5) * 0.2);
            this.parts.leftShoulder.rotation.set(0.6, 0, -0.5);
            this.parts.rightShoulder.rotation.set(0.6, 0, 0.5);
            return;
        }

        if (isMoving) {
            // 3D Run / Stride Cycle
            const runSpeed = 8.5;
            const swing = Math.sin(t * runSpeed);

            this.parts.torso.position.y = 1.9 + Math.abs(Math.sin(t * runSpeed)) * 0.12;
            this.parts.torso.rotation.set(0.18, 0, -swing * 0.05);

            // Legs reciprocal swing
            this.parts.leftHip.rotation.set(swing * 0.8, 0, 0);
            this.parts.rightHip.rotation.set(-swing * 0.8, 0, 0);

            this.parts.leftCalf.rotation.set(Math.max(0, -swing * 0.9), 0, 0);
            this.parts.rightCalf.rotation.set(Math.max(0, swing * 0.9), 0, 0);

            // Arms reciprocal counter-swing
            this.parts.leftShoulder.rotation.set(-swing * 0.7, 0, 0);
            this.parts.rightShoulder.rotation.set(swing * 0.7, 0, 0);
            this.parts.leftForearm.rotation.set(0.3, 0, 0);
            this.parts.rightForearm.rotation.set(0.3, 0, 0);
        } else {
            // Idle Breathing & Natural Posture
            const breath = Math.sin(t * 2);
            this.parts.torso.position.y = 1.9 + breath * 0.04;
            this.parts.torso.rotation.set(0, 0, 0);

            this.parts.leftShoulder.rotation.set(0.1 + breath * 0.03, 0, -0.15);
            this.parts.rightShoulder.rotation.set(0.1 + breath * 0.03, 0, 0.15);
            this.parts.leftForearm.rotation.set(0.2, 0, 0);
            this.parts.rightForearm.rotation.set(0.2, 0, 0);

            this.parts.leftHip.rotation.set(0, 0, -0.08);
            this.parts.rightHip.rotation.set(0, 0, 0.08);
            this.parts.leftCalf.rotation.set(0, 0, 0);
            this.parts.rightCalf.rotation.set(0, 0, 0);
        }
    }
}
