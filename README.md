# The Rise of the Scale Guardians

A cozy, educational full-stack adventure game about six hand-drawn elemental snakes restoring a magical sanctuary. Explore seven biomes, gather resources, learn short science lessons, complete quests, repair the sanctuary, and evolve every guardian.

## Technology

- React 19 and Vite
- Phaser 3 with Arcade Physics
- Node.js and Express
- SQLite through `better-sqlite3`
- Local browser player ID with server-side save data

## Install and run

Requirements: Node.js 20.19+ or Node.js 22.12+.

```bash
npm install
npm run dev
```

Open [http://localhost:5175](http://localhost:5175). The API runs at [http://localhost:3001](http://localhost:3001).

Production frontend build:

```bash
npm run build
```

Run only the API:

```bash
npm start
```

## Controls

- Move: `WASD` or arrow keys
- Click the world: travel toward that point
- Enter a biome gate or return portal: `E`
- Use the Guardian Workbench in the Sanctuary: `E` while nearby
- Harvest a nearby resource with the active guardian's ability: `Space` or the ability button
- Choose a guardian: use the party panel while in the Sanctuary
- Progress is saved automatically after starting a player profile

## Guardians

| Guardian | Element | Ability | Evolution |
| --- | --- | --- | --- |
| Ripplefin | Water | Water Surge | Fallspring |
| Nimbus Coil | Air/cloud | Gust Dash | Whirlscale |
| PebbleBack | Earth/stone | Stone Shield | Bouldercoil |
| Emberling | Fire | Burn Clear | Blazetail |
| ZapScale | Lightning | Thunder Blink | Voltcoil |
| HeartBloom | Nature/love | Healing Bloom | Rosetail |

Evolution unlocks after three sanctuary upgrades including the restored elemental shrine. Evolved guardians are larger, collect from farther away, and recharge abilities faster.

## Features

- Main menu with Start, Continue, Character Guide, Storybook, and Settings
- Seven separate Phaser area screens with the Sanctuary as a navigable home hub
- Twelve illustrated guardian sprites: six recognizable base forms and six matching evolutions
- The generated six-character lineup is the canonical design source for gameplay, menus, quests, biome markers, and portraits
- Painterly story scenes adapted from the supplied Scale Guardians reference PDF
- Smooth guardian idle/movement animation, biome decoration, particles, and upgrade celebrations
- Twenty-four guardian-specific resource types and a persistent satchel
- Guardian-locked biome gates and 24 elemental resources harvested only by using abilities
- Minecraft-style Guardian Workbench crafting with seven recipes, material checks, crafted relic inventory, and first-craft science stories
- Sanctuary repairs consume crafted relics rather than raw biome resources
- Five sanctuary landmarks with dramatically different ruined/restored art, persistent pond/garden/shrine/library animation, and focused upgrade celebrations
- Five sequential quests, progress display, rewards, and completion popups
- Guardian-led quest cards and sanctuary repairs with character-specific portraits, colors, and elemental marks
- First-visit science lessons covering ecosystems, pollination, rivers, clouds, rocks, fire regrowth, and electricity
- Six selectable guardians with distinct speed and abilities
- Evolution states persisted independently for every guardian
- Automatic server saves plus reset support
- Responsive menu, game HUD, guide, settings, and unlockable storybook
- Pause menu, synthesized ambient music, sound effects, volume controls, fullscreen, and reduced-motion support

## Project structure

```text
.
|-- client/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- GameScene.js
|   |   |-- PhaserGame.jsx
|   |   |-- components/
|   |   |-- data/
|   |   |-- domain/
|   |   |-- game/
|   |   |-- services/
|   |   |-- story/
|   |   `-- styles.css
|   |-- index.html
|   `-- vite.config.js
|-- server/
|   `-- src/
|       |-- db.js
|       |-- defaultSave.js
|       |-- repositories/
|       |-- routes/
|       |-- services/
|       `-- index.js
|-- package.json
`-- README.md
```

## API

### `POST /api/player`

Creates a player and initial save.

```json
{ "name": "Avery" }
```

### `GET /api/save/:playerId`

Returns the player save.

### `POST /api/save/:playerId`

Replaces the stored save.

```json
{ "save": { "playerName": "Avery" } }
```

### `POST /api/reset/:playerId`

Resets the player to a new default save.

### `GET /api/health`

Small development health check.

## Database

The database is created automatically at `server/data/scale-guardians.sqlite`. It contains:

- `players`: local player identity and creation time
- `saves`: one JSON save document per player with inventory, quests, upgrades, story scenes, position, settings, collected pickups, selected snake, and evolution status

The `server/data` directory is ignored by Git so local profiles are not committed.

## Architecture

The project applies GRASP with short comments at the main boundaries:

- Information Expert: `InventoryManager`, `QuestManager`, `SanctuaryManager`, and `story/storyScenes` own the rules or content for their data.
- Creator and Controller: `GameScene` creates and coordinates `AreaManager`, `AreaRenderer`, and `ResourceManager`; backend setup composes repositories and services.
- Low Coupling and Indirection: React and Phaser use `GameState`; `SaveService` uses `ApiClient`; Express routes use backend services; services use repositories.
- High Cohesion: inventory, quest display, sanctuary display, resources, biomes, saves, routes, and SQL access live in focused modules.
- Polymorphism: snake ability strategies share `use(context)` while dash and collection abilities provide different effects.
- Protected Variations: snakes, quests, biomes, resources, and upgrades live in separate data modules.

## Credits

- Game design and original concept: project owner
- Guardian visual direction: AI-enhanced interpretations of the supplied original character drawings
- Phaser: Photon Storm
- React and Vite: their respective open-source contributors
- Typeface styling uses Fredoka and DM Sans when Google Fonts is available, with local fallbacks
