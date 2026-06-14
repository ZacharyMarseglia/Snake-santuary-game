export const RESOURCE_NAMES = [
  "Clean Water", "River Reed", "Smooth Stone", "Blue Petal",
  "Cloud Fluff", "Wind Wisp", "Sky Droplet", "Feather Leaf",
  "Pebbles", "Fossil Chip", "Crystal Shard", "Clay",
  "Ash Dust", "Charcoal Bark", "Ember Stone", "Heat Flower",
  "Spark Stone", "Charged Crystal", "Metal Scrap", "Static Wisp",
  "Heart Petals", "Seeds", "Nectar Drop", "Pollen Dust"
];

export const CRAFTED_ITEM_NAMES = [
  "Water Seal",
  "Bloom Bundle",
  "Stone Core",
  "Ember Lantern",
  "Storm Battery",
  "Sky Charm",
  "Storybook Ink"
];

export const RECIPE_IDS = [
  "water-seal",
  "bloom-bundle",
  "stone-core",
  "ember-lantern",
  "storm-battery",
  "sky-charm",
  "storybook-ink"
];

export const SNAKE_NAMES = [
  "Ripplefin",
  "Nimbus Coil",
  "PebbleBack",
  "Emberling",
  "ZapScale",
  "HeartBloom"
];

export function createDefaultSave(playerName = "Guardian") {
  return {
    playerName,
    selectedSnake: "Ripplefin",
    currentArea: "sanctuary",
    position: { x: 245, y: 430 },
    positionsByArea: { sanctuary: { x: 245, y: 430 } },
    inventory: Object.fromEntries([...RESOURCE_NAMES, ...CRAFTED_ITEM_NAMES].map((name) => [name, 0])),
    unlockedRecipes: [...RECIPE_IDS],
    craftingStoriesSeen: [],
    completedElementQuizzes: [],
    completedQuests: [],
    questProgress: {},
    sanctuaryUpgrades: [],
    storyScenesSeen: [],
    snakeEvolutionStatus: Object.fromEntries(SNAKE_NAMES.map((name) => [name, false])),
    collectedResourceIds: [],
    settings: {
      music: true,
      sound: true,
      narration: false,
      narrationVoice: "",
      narrationRate: 0.82,
      narrationPitch: 1.12,
      narrationVolume: 1,
      musicVolume: 0.35,
      soundVolume: 0.7,
      reducedMotion: false
    },
    updatedAt: new Date().toISOString()
  };
}
