# Roll Initiative 5e

Adds a GM button on the **Token** controls to (a) create/activate a combat on the current scene, (b) add configured PCs (by UUID) that have tokens on the scene, (c) add any selected NPC tokens, and (d) roll initiative for NPCs that don’t have it yet. Optionally shows a big “initiative flair” image and/or plays a sound when a new combat begins.

## Install

**Manifest URL:**  
`https://github.com/danshapiro/fvtt-module-roll-initiative/releases/latest/download/module.json`

Foundry: **Setup → Add-on Modules → Install Module →** paste the Manifest URL → **Install**.

## Requirements

- Foundry VTT core **v11+** (verified on v11).  
- System: **D&D 5e (dnd5e)**.

## Usage

1. (GM) Configure PC UUIDs: comma-separated list (e.g., `Actor.ABC...,Actor.XYZ...`) via **Configure Settings → Module Settings → Roll Initiative 5e**.
2. Make sure those PCs have tokens on the **current** scene.
3. Optionally select one or more NPC tokens on the scene.
4. Click the "Roll Initiative 5e" d20 icon button.
5. It will show a flair image and/or play a sound (if not disabled).

## Settings

- **PC Actor UUIDs (world):** e.g., `Actor.XXXXXXXX...,Actor.YYYYY...` — right-click the book icon on a sheet → **Copy UUID**.
- **Flair Asset Folder Path (world):** e.g., `modules/roll-initiative-5e/assets/` (must end with `/`). The module looks for `.png/.webp` images and `.mp3/.wav` sounds here. The module comes with a full set of AI-generated assets that you can use directly.
- **Enable Initiative Flair Animation (world):** show an image animation on new combat.
- **Enable Initiative Flair Sound Effect (world):** play a sound with the flair.
- **Flair Animation Stay Duration (ms) (world):** how long the image stays before animating out.
- **Animation Test Mode (client):** runs through all animations instead of normal behavior (useful to preview your flair assets).

## 🎨 Artwork Gallery

This module comes with **75+ AI-generated art assets** and shows a random one each time.

### Animated Gallery Preview

<p align="center">
  <img src="temp_gif_creator/output/roll_initiative_compact.gif" width="400" alt="Roll for Initiative Artwork Gallery - 75+ AI-Generated Assets">
</p>

## License

MIT — see [LICENSE](./LICENSE).


