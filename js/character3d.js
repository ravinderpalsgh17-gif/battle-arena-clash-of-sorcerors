// Realistic 3D Character Rigging & Animation Engine for Battle Arena: Clash of Sorcerors
// Features: True Heian 4-Armed Ryomen Sukuna, Six Eyes Gojo, Divine Dog Wolf Companion,
// Coiled Cursed Worm Toji, 3D Panda, Volcano Jogo, Transfigured Mahito, and 16 High-Fidelity JJK Rigs

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

        // --- Realistic Shaded Materials ---
        const skinMat = regMat(new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.55, metalness: 0.05 }));
        const darkSkinMat = regMat(new THREE.MeshStandardMaterial({ color: 0xd4a383, roughness: 0.55 }));
        const uniformDarkMat = regMat(new THREE.MeshStandardMaterial({ color: 0x121524, roughness: 0.6 }));
        const metalMat = regMat(new THREE.MeshStandardMaterial({ color: 0xd8d8e0, metalness: 0.85, roughness: 0.25 }));
        const goldMat = regMat(new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.9, roughness: 0.2 }));
        const cursedTattooMat = regMat(new THREE.MeshBasicMaterial({ color: 0x110814 }));
        const clawMat = regMat(new THREE.MeshStandardMaterial({ color: 0x18101a, roughness: 0.3, metalness: 0.5 }));

        // ----------------------------------------------------
        // 1. TORSO RIGGING & ANATOMY
        // ----------------------------------------------------
        const torsoGroup = new THREE.Group();
        torsoGroup.position.y = 1.9;
        group.add(torsoGroup);
        parts.torso = torsoGroup;

        let torsoWidth = 0.92;
        let torsoHeight = 1.25;
        let torsoDepth = 0.58;

        if (charKey === 'panda') {
            torsoWidth = 1.65;
            torsoHeight = 1.45;
            torsoDepth = 1.45;
        } else if (charKey === 'sukuna') {
            torsoWidth = 1.25; // Broad muscular chest to support 4 arms!
            torsoHeight = 1.35;
            torsoDepth = 0.75;
        } else if (charKey === 'todo' || charKey === 'toji') {
            torsoWidth = 1.2;
            torsoHeight = 1.32;
            torsoDepth = 0.72;
        }

        let torsoMat = uniformDarkMat;
        if (charKey === 'panda') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf5f5fa, roughness: 0.9 }));
        } else if (charKey === 'todo') {
            torsoMat = darkSkinMat;
        } else if (charKey === 'sukuna') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf2ece1, roughness: 0.65 })); // Open Heian kimono
        } else if (charKey === 'toji') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.4 })); // Tight compression shirt
        } else if (charKey === 'nanami') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xd8caa8, roughness: 0.6 })); // Tan suit jacket
        } else if (charKey === 'geto') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0x181822, roughness: 0.7 })); // Monk robes
        } else if (charKey === 'yuta') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf5f5fa, roughness: 0.6 })); // White loose jacket
        } else if (charKey === 'jogo') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0x486042, roughness: 0.85 })); // Green speckled robe
        } else if (charKey === 'choso') {
            torsoMat = regMat(new THREE.MeshStandardMaterial({ color: 0xdcd6cb, roughness: 0.7 })); // Beige haori
        }

        // Torso Mesh
        const torsoMesh = new THREE.Mesh(
            charKey === 'panda'
                ? new THREE.SphereGeometry(0.85, 14, 14)
                : new THREE.BoxGeometry(torsoWidth, torsoHeight, torsoDepth),
            torsoMat
        );
        torsoMesh.castShadow = true;
        torsoMesh.receiveShadow = true;
        torsoGroup.add(torsoMesh);

        // --- Character-Specific Realistic Torso Geometry ---
        if (charKey === 'sukuna') {
            // Defined Muscular Chest inside open kimono
            const chestPecs = new THREE.Mesh(
                new THREE.BoxGeometry(torsoWidth - 0.1, 0.55, 0.15),
                skinMat
            );
            chestPecs.position.set(0, 0.25, torsoDepth / 2 - 0.02);
            torsoGroup.add(chestPecs);

            // Black Cursed Tattoos crossing chest, arches and collarbones
            const tattoo1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.06, 0.04), cursedTattooMat);
            tattoo1.position.set(0, 0.4, torsoDepth / 2 + 0.06);
            torsoGroup.add(tattoo1);

            const tattoo2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.04), cursedTattooMat);
            tattoo2.position.set(0, 0.22, torsoDepth / 2 + 0.06);
            torsoGroup.add(tattoo2);

            const tattooCircle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 16), cursedTattooMat);
            tattooCircle.position.set(0, 0.05, torsoDepth / 2 + 0.06);
            torsoGroup.add(tattooCircle);

            // Thick Black Textured Obi Sash with golden trim
            const obi = new THREE.Mesh(
                new THREE.BoxGeometry(torsoWidth + 0.12, 0.32, torsoDepth + 0.12),
                regMat(new THREE.MeshStandardMaterial({ color: 0x141418, roughness: 0.5 }))
            );
            obi.position.set(0, -0.42, 0);
            torsoGroup.add(obi);

        } else if (charKey === 'yuji') {
            // Bright Red Cowl Hood folded around neck
            const hoodGeo = new THREE.TorusGeometry(0.58, 0.18, 8, 20);
            hoodGeo.rotateX(Math.PI / 2);
            const hoodMat = regMat(new THREE.MeshStandardMaterial({ color: 0xff2a5f, roughness: 0.6 }));
            const hood = new THREE.Mesh(hoodGeo, hoodMat);
            hood.position.set(0, 0.62, 0);
            torsoGroup.add(hood);

            // Gold Jujutsu High Emblem Button
            const button = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12), goldMat);
            button.position.set(0.18, 0.35, torsoDepth / 2 + 0.02);
            button.rotation.x = Math.PI / 2;
            torsoGroup.add(button);

        } else if (charKey === 'toji') {
            // Sculpted Abdomen / Pectorals
            const pecs = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth - 0.1, 0.5, 0.1), torsoMat);
            pecs.position.set(0, 0.3, torsoDepth / 2);
            torsoGroup.add(pecs);

            // Realistic Coiled Cursed Spirit Worm draped diagonally across torso!
            const wormGroup = new THREE.Group();
            for (let i = 0; i < 9; i++) {
                const seg = new THREE.Mesh(
                    new THREE.SphereGeometry(0.14, 8, 8),
                    regMat(new THREE.MeshStandardMaterial({ color: 0x5d4c6b, roughness: 0.7 }))
                );
                const t = (i / 8) * Math.PI - 0.2;
                seg.position.set(Math.cos(t) * 0.62, Math.sin(t) * 0.5 - 0.1, Math.sin(t) * 0.35 + 0.1);
                wormGroup.add(seg);
            }
            // Worm Head with eye
            const wHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), regMat(new THREE.MeshStandardMaterial({ color: 0x755e87 })));
            wHead.position.set(0.55, 0.45, 0.25);
            const wEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), regMat(new THREE.MeshBasicMaterial({ color: 0xdd1144 })));
            wEye.position.set(0.64, 0.5, 0.32);
            wormGroup.add(wHead);
            wormGroup.add(wEye);
            torsoGroup.add(wormGroup);

        } else if (charKey === 'nanami') {
            // Suit Lapels & Spotted Necktie
            const tieGeo = new THREE.BoxGeometry(0.16, 0.75, 0.06);
            const tieMat = regMat(new THREE.MeshStandardMaterial({ color: 0x2e5cb8, roughness: 0.4 }));
            const tie = new THREE.Mesh(tieGeo, tieMat);
            tie.position.set(0, 0.12, torsoDepth / 2 + 0.04);
            torsoGroup.add(tie);

        } else if (charKey === 'geto') {
            // Golden Buddhist Stole (Kesa Sash) draped over left shoulder
            const sashGeo = new THREE.BoxGeometry(0.24, 1.35, 0.08);
            const sash = new THREE.Mesh(sashGeo, goldMat);
            sash.position.set(-0.25, 0.05, torsoDepth / 2 + 0.03);
            sash.rotation.z = -0.15;
            torsoGroup.add(sash);
        }

        // ----------------------------------------------------
        // 2. HEAD RIGGING & REALISTIC FACIAL DETAILS
        // ----------------------------------------------------
        const headGroup = new THREE.Group();
        headGroup.position.y = (charKey === 'panda' ? 0.8 : 0.88);
        torsoGroup.add(headGroup);
        parts.head = headGroup;

        let headSize = (charKey === 'panda' ? 0.75 : 0.56);
        const headMat = (charKey === 'panda' ? torsoMat : (charKey === 'todo' ? darkSkinMat : (charKey === 'jogo' ? regMat(new THREE.MeshStandardMaterial({ color: 0xa4b89b })) : skinMat)));
        const headMesh = new THREE.Mesh(
            new THREE.SphereGeometry(headSize * 0.75, 14, 14),
            headMat
        );
        headMesh.castShadow = true;
        headGroup.add(headMesh);

        // --- RYOMEN SUKUNA: TRUE HEIAN DEMONIC FACE & 4 EYES ---
        if (charKey === 'sukuna') {
            // Slicked-back Spiky Dark Wine Hair
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0x2c0f18, roughness: 0.6 }));
            for (let i = 0; i < 10; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.42, 5), hairMat);
                const a = (i / 10) * Math.PI * 2;
                spike.position.set(Math.cos(a) * 0.28, 0.34, Math.sin(a) * 0.28 - 0.05);
                spike.rotation.set(Math.sin(a) * 0.4 - 0.2, 0, -Math.cos(a) * 0.4);
                headGroup.add(spike);
            }

            // Demonic Carapace Mask over right eye side!
            const maskMat = regMat(new THREE.MeshStandardMaterial({ color: 0x330d18, roughness: 0.8 }));
            const maskPlate = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.12), maskMat);
            maskPlate.position.set(0.18, 0.04, 0.38);
            headGroup.add(maskPlate);

            // 4 GLOWING CRIMSON EYES (2 on left, 2 on right demonic plate)
            const eyeGlowMat = regMat(new THREE.MeshBasicMaterial({ color: 0xff002b }));
            // Left Upper & Lower Eyes
            const eLeftUp = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.03), eyeGlowMat);
            eLeftUp.position.set(-0.14, 0.08, 0.41);
            headGroup.add(eLeftUp);

            const eLeftLow = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, 0.03), eyeGlowMat);
            eLeftLow.position.set(-0.14, -0.04, 0.40);
            headGroup.add(eLeftLow);

            // Right Upper & Lower Eyes (embedded in mask)
            const eRightUp = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.03), eyeGlowMat);
            eRightUp.position.set(0.18, 0.09, 0.44);
            headGroup.add(eRightUp);

            const eRightLow = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, 0.03), eyeGlowMat);
            eRightLow.position.set(0.18, -0.03, 0.43);
            headGroup.add(eRightLow);

            // Forehead Cursed Crest Markings
            const crest = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.03), cursedTattooMat);
            crest.position.set(0, 0.22, 0.41);
            headGroup.add(crest);

        } else if (charKey === 'gojo') {
            // Satoru Gojo: Layered Snow-White Spiky Hair
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf6f9ff, roughness: 0.3 }));
            for (let i = 0; i < 14; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.48, 5), hairMat);
                const angle = (i / 14) * Math.PI * 2;
                spike.position.set(Math.cos(angle) * 0.3, 0.35 + Math.sin(i) * 0.08, Math.sin(angle) * 0.3);
                spike.rotation.set(Math.sin(angle) * 0.5, 0, -Math.cos(angle) * 0.5);
                headGroup.add(spike);
            }

            // Black Sorcerer Blindfold
            const blindfold = new THREE.Mesh(
                new THREE.BoxGeometry(0.68, 0.25, 0.68),
                regMat(new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.4 }))
            );
            blindfold.position.set(0, 0.04, 0);
            headGroup.add(blindfold);
            parts.blindfold = blindfold;

            // SIX EYES (Crystalline Cyan Irises that glow during ultimate)
            const sixEyesMat = regMat(new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
            for (let side of [-0.14, 0.14]) {
                const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), sixEyesMat);
                eye.position.set(side, 0.04, 0.42);
                headGroup.add(eye);
            }

        } else if (charKey === 'yuji') {
            // Spiky Pink Hair with Dark Undertone
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0xff3b77, roughness: 0.5 }));
            for (let i = 0; i < 10; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.42, 5), hairMat);
                const a = (i / 10) * Math.PI * 2;
                spike.position.set(Math.cos(a) * 0.27, 0.34, Math.sin(a) * 0.27);
                spike.rotation.set(Math.sin(a) * 0.45, 0, -Math.cos(a) * 0.45);
                headGroup.add(spike);
            }
            // Facial Slits under both eyes
            for (let s of [-0.15, 0.15]) {
                const slit = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), cursedTattooMat);
                slit.position.set(s, -0.06, 0.4);
                headGroup.add(slit);
            }

        } else if (charKey === 'megumi') {
            // Wild Sea-Urchin Spiky Black Hair
            const hairMat = regMat(new THREE.MeshStandardMaterial({ color: 0x0d0f17, roughness: 0.6 }));
            for (let i = 0; i < 13; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.54, 4), hairMat);
                const a = (i / 13) * Math.PI * 2;
                spike.position.set(Math.cos(a) * 0.3, 0.36, Math.sin(a) * 0.3);
                spike.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6);
                headGroup.add(spike);
            }

        } else if (charKey === 'panda') {
            // Full 3D Panda Face & Ears
            const darkPandaMat = regMat(new THREE.MeshStandardMaterial({ color: 0x111116 }));
            for (let side of [-1, 1]) {
                const ear = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), darkPandaMat);
                ear.position.set(side * 0.44, 0.48, 0);
                headGroup.add(ear);

                const patch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.06), darkPandaMat);
                patch.position.set(side * 0.22, 0.06, 0.5);
                headGroup.add(patch);
            }
            const snout = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), darkPandaMat);
            snout.position.set(0, -0.08, 0.54);
            headGroup.add(snout);

        } else if (charKey === 'jogo') {
            // Active Volcanic Mountain Crater Head
            const volcMat = regMat(new THREE.MeshStandardMaterial({ color: 0x2c1d16, roughness: 0.95 }));
            const crater = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.4, 0.55, 10), volcMat);
            crater.position.set(0, 0.48, 0);
            headGroup.add(crater);

            // Glowing Molten Lava Core
            const lavaCore = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), regMat(new THREE.MeshBasicMaterial({ color: 0xff4400 })));
            lavaCore.position.set(0, 0.72, 0);
            headGroup.add(lavaCore);

            // Giant Cyclops Eye with black slit pupil
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), regMat(new THREE.MeshBasicMaterial({ color: 0xffbb00 })));
            eye.position.set(0, 0.04, 0.42);
            headGroup.add(eye);
            const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.03), regMat(new THREE.MeshBasicMaterial({ color: 0x000000 })));
            pupil.position.set(0, 0.04, 0.55);
            headGroup.add(pupil);

        } else {
            // Styled Anime Hair for other characters
            const defHairMat = regMat(new THREE.MeshStandardMaterial({
                color: (charKey === 'nobara' ? 0xd9682b : (charKey === 'nanami' ? 0xe6c86e : (charKey === 'mahito' ? 0x8a9ba8 : 0x11131a))),
                roughness: 0.6
            }));
            const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 10), defHairMat);
            hairCap.position.set(0, 0.12, -0.04);
            headGroup.add(hairCap);

            if (charKey === 'todo' || charKey === 'geto') {
                const topknot = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.38, 6), defHairMat);
                topknot.position.set(0, 0.6, -0.1);
                headGroup.add(topknot);
            }
            if (charKey === 'choso') {
                // Dual Ponytails & Blood nose bar
                for (let side of [-0.3, 0.3]) {
                    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.55, 6), defHairMat);
                    tail.position.set(side, 0.45, -0.15);
                    headGroup.add(tail);
                }
                const bloodBar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.04), regMat(new THREE.MeshBasicMaterial({ color: 0x770a1a })));
                bloodBar.position.set(0, 0.02, 0.42);
                headGroup.add(bloodBar);
            }
        }

        // ----------------------------------------------------
        // 3. ARMS RIGGING (4 ARMS FOR SUKUNA, 2 ARMS FOR OTHERS)
        // ----------------------------------------------------
        const armThickness = (charKey === 'panda' ? 0.32 : (charKey === 'todo' || charKey === 'sukuna' ? 0.22 : 0.16));
        const sleeveMat = (charKey === 'todo' ? darkSkinMat : (charKey === 'sukuna' ? skinMat : torsoMat));

        // Helper to build a complete jointed arm
        function createArm(side, shoulderY, shoulderZ, isLower = false) {
            const shoulderGroup = new THREE.Group();
            shoulderGroup.position.set(side * (torsoWidth / 2 + 0.16), shoulderY, shoulderZ);
            torsoGroup.add(shoulderGroup);

            // Bicep / Upper Arm
            const upperArm = new THREE.Mesh(
                new THREE.CylinderGeometry(armThickness, armThickness * 0.9, 0.65, 8),
                (isLower ? skinMat : sleeveMat)
            );
            upperArm.position.y = -0.32;
            upperArm.castShadow = true;
            shoulderGroup.add(upperArm);

            // Forearm Group (Elbow)
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

            // Hand with Claws for Sukuna
            const handMesh = new THREE.Mesh(
                new THREE.SphereGeometry(armThickness * 0.8, 8, 8),
                skinMat
            );
            handMesh.position.set(0, -0.65, 0);
            forearmGroup.add(handMesh);

            if (charKey === 'sukuna') {
                // Black Cursed Claws on fingers!
                for (let f = -0.06; f <= 0.06; f += 0.04) {
                    const claw = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 4), clawMat);
                    claw.position.set(f, -0.8, 0);
                    claw.rotation.x = Math.PI;
                    forearmGroup.add(claw);
                }
            }

            return { shoulder: shoulderGroup, forearm: forearmGroup, hand: handMesh };
        }

        // Standard Upper Pair of Arms (Sides: -1 = Left, 1 = Right)
        const leftUpper = createArm(-1, 0.46, 0);
        const rightUpper = createArm(1, 0.46, 0);
        parts.leftShoulder = leftUpper.shoulder;
        parts.leftForearm = leftUpper.forearm;
        parts.leftHand = leftUpper.hand;
        parts.rightShoulder = rightUpper.shoulder;
        parts.rightForearm = rightUpper.forearm;
        parts.rightHand = rightUpper.hand;

        // --- RYOMEN SUKUNA: 4 FULLY FUNCTIONAL ARMS ---
        if (charKey === 'sukuna') {
            const leftLower = createArm(-1, -0.08, 0.08, true);
            const rightLower = createArm(1, -0.08, 0.08, true);
            parts.leftLowerShoulder = leftLower.shoulder;
            parts.leftLowerForearm = leftLower.forearm;
            parts.leftLowerHand = leftLower.hand;
            parts.rightLowerShoulder = rightLower.shoulder;
            parts.rightLowerForearm = rightLower.forearm;
            parts.rightLowerHand = rightLower.hand;
        }

        // ----------------------------------------------------
        // 4. LEGS RIGGING (Hips -> Knees -> Boots)
        // ----------------------------------------------------
        const legThickness = (charKey === 'panda' ? 0.34 : (charKey === 'todo' ? 0.24 : 0.18));
        const pantsMat = (charKey === 'todo' ? regMat(new THREE.MeshStandardMaterial({ color: 0x3d4a36 })) : (charKey === 'toji' ? regMat(new THREE.MeshStandardMaterial({ color: 0xded8cc })) : uniformDarkMat));

        for (let side of [-1, 1]) {
            const hipGroup = new THREE.Group();
            hipGroup.position.set(side * (torsoWidth / 4), -0.62, 0);
            torsoGroup.add(hipGroup);

            const thigh = new THREE.Mesh(
                new THREE.CylinderGeometry(legThickness, legThickness * 0.85, 0.72, 8),
                pantsMat
            );
            thigh.position.y = -0.36;
            thigh.castShadow = true;
            hipGroup.add(thigh);

            const calfGroup = new THREE.Group();
            calfGroup.position.set(0, -0.72, 0);
            hipGroup.add(calfGroup);

            const calf = new THREE.Mesh(
                new THREE.CylinderGeometry(legThickness * 0.85, legThickness * 0.75, 0.72, 8),
                pantsMat
            );
            calf.position.y = -0.36;
            calf.castShadow = true;
            calfGroup.add(calf);

            const boot = new THREE.Mesh(
                new THREE.BoxGeometry(legThickness * 1.8, 0.24, legThickness * 2.4),
                regMat(new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.6 }))
            );
            boot.position.set(0, -0.74, 0.08);
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

        // ----------------------------------------------------
        // 5. SIGNATURE WEAPONS & COMPANIONS
        // ----------------------------------------------------
        if (charKey === 'nobara') {
            const hammerGroup = new THREE.Group();
            const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.95, 6), regMat(new THREE.MeshStandardMaterial({ color: 0x6e4a2c })));
            handle.position.y = 0.22;
            hammerGroup.add(handle);
            const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.16), metalMat);
            hammerHead.position.set(0, 0.65, 0);
            hammerGroup.add(hammerHead);
            parts.rightHand.add(hammerGroup);
            parts.weapon = hammerGroup;

        } else if (charKey === 'nanami') {
            const cleaverGroup = new THREE.Group();
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.95, 0.04), regMat(new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.8 })));
            blade.position.y = 0.48;
            cleaverGroup.add(blade);
            parts.rightHand.add(cleaverGroup);
            parts.weapon = cleaverGroup;

        } else if (charKey === 'toji') {
            const daggerGroup = new THREE.Group();
            const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.38, 6), regMat(new THREE.MeshStandardMaterial({ color: 0x111116 })));
            daggerGroup.add(hilt);
            const dBlade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.03), metalMat);
            dBlade.position.y = 0.48;
            daggerGroup.add(dBlade);
            parts.rightHand.add(daggerGroup);
            parts.weapon = daggerGroup;

        } else if (charKey === 'yuta') {
            const katanaGroup = new THREE.Group();
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.35, 0.02), metalMat);
            blade.position.y = 0.68;
            katanaGroup.add(blade);
            parts.rightHand.add(katanaGroup);
            parts.weapon = katanaGroup;

            // Rika Spectral Companion floating behind Yuta
            const rikaGroup = new THREE.Group();
            rikaGroup.position.set(0, 2.2, -1.2);
            const rikaHead = new THREE.Mesh(
                new THREE.SphereGeometry(0.65, 10, 10),
                regMat(new THREE.MeshStandardMaterial({ color: 0xe0e5ea, transparent: true, opacity: 0.65 }))
            );
            rikaGroup.add(rikaHead);
            group.add(rikaGroup);
            parts.rika = rikaGroup;

        } else if (charKey === 'megumi') {
            // 3D Divine Dog (Totality) Companion Wolf!
            const dogGroup = new THREE.Group();
            dogGroup.position.set(1.4, 0, 0.5);
            const wolfMat = regMat(new THREE.MeshStandardMaterial({ color: 0x181a24, roughness: 0.7 }));
            // Body
            const dogBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 1.2), wolfMat);
            dogBody.position.y = 0.6;
            dogGroup.add(dogBody);
            // Wolf Head & Snout
            const dogHead = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.5), wolfMat);
            dogHead.position.set(0, 0.85, 0.75);
            dogGroup.add(dogHead);
            const dogSnout = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.35), wolfMat);
            dogSnout.position.set(0, 0.78, 1.05);
            dogGroup.add(dogSnout);
            // Red wolf eyes
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
            const barrierGeo = new THREE.SphereGeometry(1.65, 24, 16);
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
            const blueOrb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), regMat(new THREE.MeshBasicMaterial({ color: 0x00e5ff })));
            const redOrb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), regMat(new THREE.MeshBasicMaterial({ color: 0xff0044 })));
            torsoGroup.add(blueOrb);
            torsoGroup.add(redOrb);
            parts.blueOrb = blueOrb;
            parts.redOrb = redOrb;
        }

        // Cursed Energy Ground Halo
        const auraGeo = new THREE.RingGeometry(0.85, 1.45, 16);
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
                const orbDist = 1.4;
                this.parts.blueOrb.position.set(Math.cos(t * 2) * orbDist, 0.2 + Math.sin(t * 2) * 0.2, Math.sin(t * 2) * orbDist);
                this.parts.redOrb.position.set(Math.cos(t * 2 + Math.PI) * orbDist, 0.2 + Math.sin(t * 2 + Math.PI) * 0.2, Math.sin(t * 2 + Math.PI) * orbDist);
            }
        }

        // Divine Dog breathing and tracking
        if (this.parts.divineDog) {
            this.parts.divineDog.position.y = Math.abs(Math.sin(t * 4)) * 0.08;
        }

        // Rika floating sway
        if (this.parts.rika) {
            this.parts.rika.position.y = 2.2 + Math.sin(t * 2) * 0.25;
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
            // Skill 2: Heavy Attack / Fuga Flame Arrow
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
