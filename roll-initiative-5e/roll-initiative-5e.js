const MODULE_ID = "roll-initiative-5e"; // Matches the 'id' in module.json
const LOG_PREFIX = `▲ ${MODULE_ID}:`;

// --- Animation Definitions (remains the same) ---
const ANIMATIONS = [
  { name: "Subtle Emergence", inClass: "flair-emerge-in", outClass: "flair-emerge-out", inDuration: 600, outDuration: 500, initialTransform: "scale(0.3) rotate(-15deg)", finalTransform: "scale(1) rotate(0deg)", exitTransform: "scale(1.8) rotate(15deg)" },
  { name: "Simple Fade", inClass: "flair-fade-in", outClass: "flair-fade-out", inDuration: 700, outDuration: 400, initialTransform: "scale(0.8) translateY(20px)", finalTransform: "scale(1) translateY(0px)", exitTransform: "scale(0.7) translateY(20px)" },
  { name: "Slide In From Left", inClass: "flair-slide-left-in", outClass: "flair-slide-right-out", inDuration: 700, outDuration: 600, initialTransform: "translateX(-80vw) scale(0.7) rotate(-10deg)", finalTransform: "translateX(0) scale(1) rotate(0deg)", exitTransform: "translateX(80vw) scale(0.7) rotate(10deg)" },
  { name: "Slide In From Top", inClass: "flair-slide-top-in", outClass: "flair-slide-bottom-out", inDuration: 700, outDuration: 600, initialTransform: "translateY(-80vh) scale(0.7) rotate(10deg)", finalTransform: "translateY(0) scale(1) rotate(0deg)", exitTransform: "translateY(80vh) scale(0.7) rotate(-10deg)" },
  { name: "Zoom & Bounce", inClass: "flair-zoom-bounce-in", outClass: "flair-zoom-bounce-out", inDuration: 800, outDuration: 500, initialTransform: "scale(0.1)", finalTransform: "scale(1)", exitTransform: "scale(2.5)" },
  { name: "Spin & Grow", inClass: "flair-spin-grow-in", outClass: "flair-spin-shrink-out", inDuration: 1000, outDuration: 700, initialTransform: "scale(0.2) rotate(-270deg)", finalTransform: "scale(1) rotate(0deg)", exitTransform: "scale(0.2) rotate(270deg)" },
  { name: "Drop From Top (Heavy)", inClass: "flair-drop-heavy-in", outClass: "flair-lift-heavy-out", inDuration: 600, outDuration: 500, initialTransform: "translateY(-70vh) scale(1.2) rotate(5deg)", finalTransform: "translateY(0) scale(1) rotate(0deg)", exitTransform: "translateY(-70vh) scale(1.2) rotate(-5deg)" },
  { name: "Flip In (Y-Axis)", inClass: "flair-flip-y-in", outClass: "flair-flip-y-out", inDuration: 800, outDuration: 700, initialTransform: "perspective(1000px) rotateY(90deg) scale(0.8)", finalTransform: "perspective(1000px) rotateY(0deg) scale(1)", exitTransform: "perspective(1000px) rotateY(-90deg) scale(0.8)" }
];

// --- Helper Functions (adapted) ---
function applyFlairState(element, opacity, transform, transitionDuration, transitionTiming = 'ease-out') {
    element.style.opacity = opacity;
    element.style.transform = transform;
    element.style.transition = `opacity ${transitionDuration}ms ${transitionTiming}, transform ${transitionDuration}ms ${transitionTiming}`;
}

async function getRandomFlairAsset(folderPath, extensions, assetTypeLogName, usedAssetPaths = []) {
  const log = (...args) => console.log(`${LOG_PREFIX} Flair [${assetTypeLogName}]:`, ...args);
  const testAnimationsMode = game.settings.get(MODULE_ID, "testAnimationsMode");
  try {
    const browseResult = await FilePicker.browse("data", folderPath, { extensions, wildcard: false });
    if (!browseResult || !browseResult.files || browseResult.files.length === 0) {
      if (!usedAssetPaths.length) ui.notifications.warn(`${MODULE_ID}: No ${assetTypeLogName}s found in '${folderPath}' for flair.`);
      return null;
    }
    let availableAssets = browseResult.files.filter(f => !usedAssetPaths.includes(f));
    if (availableAssets.length === 0 && browseResult.files.length > 0) { availableAssets = browseResult.files; usedAssetPaths.length = 0; }
    else if (availableAssets.length === 0) return null;
    const selectedAsset = availableAssets[Math.floor(Math.random() * availableAssets.length)];
    if (testAnimationsMode) usedAssetPaths.push(selectedAsset);
    return selectedAsset;
  } catch (error) {
    console.error(`${LOG_PREFIX} Flair [${assetTypeLogName}]: Error browsing assets in '${folderPath}':`, error);
    ui.notifications.error(`${MODULE_ID}: Error finding ${assetTypeLogName}s. See console (F12).`);
    return null;
  }
}

async function displayInitiativeFlairAnimation(imageSrc, soundSrc, animation, testModeName = null) {
  const playSoundEffect = game.settings.get(MODULE_ID, "playSoundEffect");
  const flairStayDurationMs = game.settings.get(MODULE_ID, "flairStayDuration");
  const flairLog = (...args) => console.log(`${LOG_PREFIX} CFA [${testModeName || animation.name}]:`, ...args);

  return new Promise(async (resolve) => {
    if (!imageSrc && !soundSrc) { resolve(); return; }
    // CSS is now loaded via module.json, so ensureInitiativeFlairStyles is not needed for injecting styles.
    if (soundSrc && playSoundEffect) AudioHelper.play({ src: soundSrc, volume: 0.8, autoplay: true, loop: false }, true).catch(err => flairLog("Error playing sound:", soundSrc, err));
    if (!imageSrc) { setTimeout(resolve, playSoundEffect && soundSrc ? 1000 : 50); return; }

    document.getElementById("combat-flair-container")?.remove(); // Clean up any previous one
    const container = document.createElement("div"); container.id = "combat-flair-container";
    const img = document.createElement("img"); img.id = "combat-flair-image";

    img.onerror = () => { ui.notifications.error(`${MODULE_ID}: Could not load image ${imageSrc}`); container.remove(); resolve(); };
    img.onload = () => {
        img.style.opacity = '0'; img.style.transform = animation.initialTransform; img.style.transition = 'none';
        container.appendChild(img);
        if (testModeName) {
          const nameDisplay = document.createElement("div");
          nameDisplay.id = "combat-flair-test-name";
          nameDisplay.textContent = testModeName + (soundSrc ? " (🔊)" : "");
          container.appendChild(nameDisplay);
        }
        document.body.appendChild(container);
        requestAnimationFrame(() => { // Ensure element is in DOM and styles applied before transition
            requestAnimationFrame(() => { // Double requestAnimationFrame for good measure with transforms
                 applyFlairState(img, '1', animation.finalTransform, animation.inDuration, 'cubic-bezier(0.34, 1.56, 0.64, 1)');
            });
        });

        setTimeout(() => {
          applyFlairState(img, '0', animation.exitTransform, animation.outDuration, 'ease-in');
          setTimeout(() => { container.remove(); resolve(); }, animation.outDuration + 50);
        }, animation.inDuration + flairStayDurationMs);
    };
    img.src = imageSrc;
  });
}

// --- Animation Test Suite (Assumed unchanged as per prompt, ensure it uses settings if needed) ---
async function runAnimationTestSuite() {
    console.log(`${LOG_PREFIX} Starting Animation Test Suite...`);
    const flairAssetPath = game.settings.get(MODULE_ID, "flairAssetPath");
    const animateFlair = game.settings.get(MODULE_ID, "animateFlair");
    const playSound = game.settings.get(MODULE_ID, "playSoundEffect"); // Renamed to avoid conflict

    if (!animateFlair && !playSound) {
        ui.notifications.info("Roll Initiative 5e: Animations and Sounds are disabled in settings. Test suite aborted.");
        return;
    }

    let imageAssets = [];
    let soundAssets = [];
    const usedImagePaths = []; // For cycling through images
    const usedSoundPaths = []; // For cycling through sounds

    if (animateFlair) {
        const browseImages = await FilePicker.browse("data", flairAssetPath, { extensions: [".png", ".webp", ".PNG", ".WEBP"], wildcard: false });
        if (browseImages.files.length > 0) imageAssets = browseImages.files;
        else ui.notifications.warn("Roll Initiative 5e Test: No images found for testing in " + flairAssetPath);
    }
    if (playSound) {
        const browseSounds = await FilePicker.browse("data", flairAssetPath, { extensions: [".mp3", ".wav", ".MP3", ".WAV"], wildcard: false });
        if (browseSounds.files.length > 0) soundAssets = browseSounds.files;
        else ui.notifications.warn("Roll Initiative 5e Test: No sounds found for testing in " + flairAssetPath);
    }

    if (imageAssets.length === 0 && soundAssets.length === 0) {
        ui.notifications.error("Roll Initiative 5e Test: No image or sound assets found in " + flairAssetPath + ". Test suite cannot run.");
        return;
    }
    ui.notifications.info(`Roll Initiative 5e Test: Starting suite with ${ANIMATIONS.length} animations.`);

    for (let i = 0; i < ANIMATIONS.length; i++) {
        const anim = ANIMATIONS[i];
        let currentImage = null;
        let currentSound = null;

        if (imageAssets.length > 0) {
            let availableImages = imageAssets.filter(f => !usedImagePaths.includes(f));
            if (availableImages.length === 0) { usedImagePaths.length = 0; availableImages = imageAssets; } // Cycle
            currentImage = availableImages[Math.floor(Math.random() * availableImages.length)];
            usedImagePaths.push(currentImage);
        }
        if (soundAssets.length > 0) {
            let availableSounds = soundAssets.filter(f => !usedSoundPaths.includes(f));
            if (availableSounds.length === 0) { usedSoundPaths.length = 0; availableSounds = soundAssets; } // Cycle
            currentSound = availableSounds[Math.floor(Math.random() * availableSounds.length)];
            usedSoundPaths.push(currentSound);
        }
        const testDisplayName = `${i + 1}/${ANIMATIONS.length}: ${anim.name}`;
        console.log(`${LOG_PREFIX} Test: Displaying animation - ${testDisplayName}`);
        await displayInitiativeFlairAnimation(currentImage, currentSound, anim, testDisplayName);
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause between animations
    }
    console.log(`${LOG_PREFIX} Animation Test Suite Finished.`);
    ui.notifications.info("Roll Initiative 5e: Animation Test Suite Finished.");
}


// --- Main Initiative Logic (now a callable function) ---
async function rollInitiativeMain() {
  const log = (...args) => console.log(LOG_PREFIX, ...args);

  const testAnimationsMode = game.settings.get(MODULE_ID, "testAnimationsMode");
  if (testAnimationsMode) {
    runAnimationTestSuite().catch(err => { console.error(`${LOG_PREFIX} TestSuite Error:`, err); });
    return;
  }

  const pcUuidsString = game.settings.get(MODULE_ID, "pcUuids");
  const PC_UUIDS = pcUuidsString ? pcUuidsString.split(',').map(s => s.trim()).filter(s => s) : [];
  const flairAssetPath = game.settings.get(MODULE_ID, "flairAssetPath");
  const animateFlair = game.settings.get(MODULE_ID, "animateFlair");
  const playSoundEffect = game.settings.get(MODULE_ID, "playSoundEffect");

  const currentSceneId = canvas.scene?.id;
  if (!currentSceneId) {
    ui.notifications.error("Roll Initiative 5e: No viewed scene. Cannot manage combat.");
    return;
  }

  const allPcUuidActors = (await Promise.all(PC_UUIDS.map(uuid => fromUuid(uuid)))).filter(actor => actor instanceof Actor);
  const eligiblePcDataList = [];
  const pcsWithoutTokensNames = [];

  for (const actor of allPcUuidActors) {
    const tokenOnScene = canvas.tokens.placeables.find(t => t.document && t.document.actorId === actor.id);
    if (tokenOnScene) {
      eligiblePcDataList.push({
        actorId: actor.id,
        tokenId: tokenOnScene.id,
        sceneId: currentSceneId,
        hidden: false,
        name: actor.name
      });
    } else {
      pcsWithoutTokensNames.push(actor.name);
    }
  }

  if (pcsWithoutTokensNames.length > 0) {
    const msg = `PCs not added (no token on current scene '${canvas.scene.name}'): ${pcsWithoutTokensNames.join(', ')}`;
    log(msg);
    if (allPcUuidActors.length > 0) {
        ui.notifications.warn(`${MODULE_ID}: ${msg}. Ensure their tokens are on this scene.`);
    }
  }

  const selectedTokens = canvas.tokens.controlled || [];
  const selectedNpcTokens = selectedTokens.filter(t => {
    if (!t.actor) return false;
    const isListedPc = PC_UUIDS.some(uuid => uuid.endsWith(t.document.actorId));
    return !isListedPc;
  });

  if (eligiblePcDataList.length === 0 && selectedNpcTokens.length === 0) {
    if (PC_UUIDS.length > 0 || selectedTokens.length > 0) {
        log("No eligible PCs with tokens on this scene and no valid NPCs selected. Combat not started/modified.");
        ui.notifications.info("Roll Initiative 5e: No eligible combatants found (PCs with tokens on *this* scene, or selected NPCs).");
    } else {
        log("No PCs configured and no tokens selected. Macro did nothing.");
    }
    return;
  }

  let combat = game.combats.active;
  let combatWasNewlyCreated = false;

  if (combat && combat.scene?.id !== currentSceneId) combat = null;
  if (!combat) {
    const sceneCombats = game.combats.filter(c => c.scene?.id === currentSceneId);
    if (sceneCombats.length === 1) {
      combat = sceneCombats[0];
      if (!combat.active) { log("Activating existing combat on current scene."); await combat.activate(); }
    } else if (sceneCombats.length > 1) {
      combat = null; ui.notifications.warn("Roll Initiative 5e: Multiple combats on scene. Activate one, or macro will create a new one.");
    }
  }

  if (!combat) {
    log(`Creating new combat with ${eligiblePcDataList.length} eligible PC(s).`);
    const combatantCreationData = eligiblePcDataList.map(pc => ({
        actorId: pc.actorId, tokenId: pc.tokenId, sceneId: pc.sceneId, hidden: pc.hidden, name: pc.name
    }));

    combat = await Combat.create({ scene: currentSceneId, combatants: combatantCreationData, active: true });
    if (!combat) {
        ui.notifications.error("Roll Initiative 5e: Failed to create combat.");
        return;
    }
    combatWasNewlyCreated = true;
    if (game.combats.active !== combat) await combat.activate();

    if ((animateFlair || playSoundEffect)) {
      const randomAnimIndex = Math.floor(Math.random() * ANIMATIONS.length);
      const randomAnimation = ANIMATIONS[randomAnimIndex];
      let imagePath = animateFlair ? await getRandomFlairAsset(flairAssetPath, [".png", ".webp", ".PNG", ".WEBP"], "Image") : null;
      let soundPath = playSoundEffect ? await getRandomFlairAsset(flairAssetPath, [".mp3", ".wav", ".MP3", ".WAV"], "Sound") : null;
      if (imagePath || soundPath) {
        // Broadcast to all clients so everyone sees and hears the flair
        console.log(`${LOG_PREFIX} Broadcasting flair to all clients:`, { type: "flair", image: imagePath, sound: soundPath, animIndex: randomAnimIndex });
        game.socket.emit(`module.${MODULE_ID}`, { type: "flair", image: imagePath, sound: soundPath, animIndex: randomAnimIndex });
        // Play locally as the emitting client does not receive its own socket emission
        console.log(`${LOG_PREFIX} Playing flair locally for GM`);
        displayInitiativeFlairAnimation(imagePath, soundPath, randomAnimation).catch(err => console.error(`${LOG_PREFIX} Flair display error:`, err));
      } else {
        log("Flair enabled, but no image or sound assets found.");
      }
    }
    await combat.startCombat();
    log(`Started new combat '${combat.id}'.`);
    ui.notifications.info(`Roll Initiative 5e: New combat '${combat.id}' started with ${combatantCreationData.length} PC(s).`);
  } else {
    log(`Using existing combat: '${combat.id}'.`);
  }

  let addedPCs = 0, skippedPCs = 0, updatedPcLinks = 0;
  for (const pcData of eligiblePcDataList) {
    let existingCombatant = combat.combatants.find(c => c.actorId === pcData.actorId && c.sceneId === pcData.sceneId && c.tokenId === pcData.tokenId);
     if (!existingCombatant) existingCombatant = combat.combatants.find(c => c.actorId === pcData.actorId && c.sceneId === pcData.sceneId); // More general find by actor & scene

    if (existingCombatant) {
      skippedPCs++;
      let updatePayload = {};
      if (existingCombatant.tokenId !== pcData.tokenId) updatePayload.tokenId = pcData.tokenId;
      if (existingCombatant.hidden !== pcData.hidden) updatePayload.hidden = pcData.hidden;

      if (Object.keys(updatePayload).length > 0) {
        await existingCombatant.update(updatePayload);
        updatedPcLinks++;
        log(`Updated token link/visibility for PC: ${pcData.name}.`);
      }
    } else {
      await combat.createEmbeddedDocuments("Combatant", [pcData]);
      addedPCs++;
      log(`Added PC ${pcData.name} (with token ${pcData.tokenId}) to combat.`);
    }
  }

  if (!combatWasNewlyCreated) {
      if (addedPCs > 0) ui.notifications.info(`Roll Initiative 5e: ${addedPCs} PC(s) added to combat '${combat.id}'.`);
      if (updatedPcLinks > 0) ui.notifications.info(`Roll Initiative 5e: ${updatedPcLinks} PC token link(s)/visibility updated in '${combat.id}'.`);
      if (addedPCs === 0 && updatedPcLinks === 0 && eligiblePcDataList.length > 0) {
        log(`All ${eligiblePcDataList.length} eligible PCs already correctly in combat '${combat.id}'.`);
      }
  }

  let rolledNPCs = 0, skippedNPCInit = 0, addedNewNPCs = 0;
  if (selectedNpcTokens.length > 0) {
    const npcCombatantDataToCreate = [];
    const npcCombatantsToUpdate = [];
    const npcCombatantsToRoll = [];

    for (const token of selectedNpcTokens) {
        const actor = token.actor;
        if (!actor) continue;

        let cmb = combat.getCombatantByToken(token.id);
        if (!cmb) { // If no combatant for this specific token, check by actor ID on current scene
            cmb = combat.combatants.find(c => c.actorId === actor.id && c.sceneId === currentSceneId);
        }

        const combatantData = { tokenId: token.id, actorId: actor.id, sceneId: currentSceneId, hidden: token.document.hidden };

        if (!cmb) {
            npcCombatantDataToCreate.push(combatantData);
        } else {
            let updateData = {};
            if (cmb.tokenId !== token.id) updateData.tokenId = token.id; // Link to specific token
            if (cmb.hidden !== token.document.hidden) updateData.hidden = token.document.hidden; // Sync hidden state
            if (Object.keys(updateData).length > 0) {
                 npcCombatantsToUpdate.push({_id: cmb.id, ...updateData});
            }
            // Check initiative for existing combatant
            if (cmb.initiative === null || cmb.initiative === undefined) {
                 npcCombatantsToRoll.push(cmb.id);
            } else {
                skippedNPCInit++;
            }
        }
    }

    if (npcCombatantDataToCreate.length > 0) {
        const newCombatants = await combat.createEmbeddedDocuments("Combatant", npcCombatantDataToCreate);
        addedNewNPCs += newCombatants.length;
        newCombatants.forEach(nc => {
            // Only roll for newly created NPCs if they don't have initiative (should be null by default)
            if (nc.initiative === null || nc.initiative === undefined) {
                npcCombatantsToRoll.push(nc.id);
            }
        });
    }
    if (npcCombatantsToUpdate.length > 0) {
        await combat.updateEmbeddedDocuments("Combatant", npcCombatantsToUpdate);
    }

    if (npcCombatantsToRoll.length > 0) {
        try {
            await combat.rollInitiative(npcCombatantsToRoll);
            rolledNPCs += npcCombatantsToRoll.length;
        } catch (e) { log(`Failed to roll initiative for some NPCs: ${e}`); }
    }

    if (addedNewNPCs > 0 || rolledNPCs > 0 || skippedNPCInit > 0) {
      ui.notifications.info(`Roll Initiative 5e NPCs for combat '${combat.id}': ${addedNewNPCs} added, ${rolledNPCs} rolled init, ${skippedNPCInit} already had init.`);
    } else if (selectedNpcTokens.length > 0) {
       ui.notifications.info(`Roll Initiative 5e: Selected NPC(s) already in combat '${combat.id}' with initiative or no changes needed.`);
    }
  }

  if (ui.combat) ui.combat.render(true);
}

// --- Hooks ---
Hooks.once('init', () => {
  console.log(`${LOG_PREFIX} Initializing`);

  // Register Settings
  game.settings.register(MODULE_ID, "pcUuids", {
    name: "PC Actor UUIDs",
    hint: "Enter PC Actor UUIDs, separated by commas. How to find: Open a PC's character sheet, right-click the book icon next to the name → \"Copy UUID\". Paste the string (e.g., 'Actor.xxxxxxxxxxxxxxxx').",
    scope: "world", // "world" so GMs can configure it for all players
    config: true,   // true so it appears in module settings
    type: String,
    default: "", // Example: "Actor.GtAjWrms5P1G1FqE,Actor.yzxPxjQLrsrbkdXL"
  });

  game.settings.register(MODULE_ID, "flairAssetPath", {
    name: "Flair Asset Folder Path",
    hint: "Path to flair images AND sounds, relative to your FoundryVTT User Data folder. Example: 'assets/my_module_flair/'. ENSURE IT ENDS WITH A SLASH. This folder is where the module will look for .png, .webp, .mp3, .wav files.",
    scope: "world",
    config: true,
    type: String,
    default: "modules/roll-initiative-5e/assets/",
  });

  game.settings.register(MODULE_ID, "animateFlair", {
    name: "Enable Initiative Flair Animation",
    hint: "Show a visual animation when new combat starts.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MODULE_ID, "playSoundEffect", {
    name: "Enable Initiative Flair Sound Effect",
    hint: "Play a sound effect with the flair animation.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MODULE_ID, "flairStayDuration", {
    name: "Flair Animation Stay Duration (ms)",
    hint: "How long the flair image stays fully visible before animating out (in milliseconds).",
    scope: "world",
    config: true,
    type: Number,
    default: 2000,
  });

  game.settings.register(MODULE_ID, "testAnimationsMode", {
    name: "Animation Test Mode",
    hint: "If checked, clicking the 'Roll Initiative' button will run an animation test suite instead of normal initiative. Requires images/sounds in the flair asset path.",
    scope: "client", // Client setting for testing
    config: true,
    type: Boolean,
    default: false,
  });

  // Set up socket listener early in init
  game.socket.on(`module.${MODULE_ID}`, data => {
    console.log(`${LOG_PREFIX} Socket received:`, data);
    if (!data || data.type !== "flair") {
      console.log(`${LOG_PREFIX} Socket: Ignoring non-flair message`);
      return;
    }
    const animation = ANIMATIONS[data.animIndex] || ANIMATIONS[0];
    console.log(`${LOG_PREFIX} Socket: Playing flair animation for other clients`);
    displayInitiativeFlairAnimation(data.image, data.sound, animation).catch(err => console.error(`${LOG_PREFIX} Flair socket error:`, err));
  });
  console.log(`${LOG_PREFIX} Socket listener registered`);
});

Hooks.on('getSceneControlButtons', (controls) => {
  // Find the token controls
  const tokenControl = controls.find(c => c.name === "token");
  if (tokenControl && game.user.isGM) {
    tokenControl.tools.push({
      name: "rollInitiative5e",
      title: "Roll Initiative 5e",
      icon: "fas fa-dice-d20", // Font Awesome d20 icon
      onClick: () => {
        rollInitiativeMain(); // Call the main function
      },
      button: true // Renders it as a button
    });
  }
});

console.log(`${LOG_PREFIX} Loaded`); 