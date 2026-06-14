import { resourceNames } from "./data/resources.js";
import { craftedItemNames, recipeIds } from "./data/recipes.js";
import { snakes } from "./data/snakes.js";

export { areas, areaList, WORLD_SIZE } from "./data/areas.js";
export { quests } from "./data/quests.js";
export { craftedItemNames, recipeIds, recipes } from "./data/recipes.js";
export { resourceNames as resources, resourceSpawns, resourceSpawnsByArea } from "./data/resources.js";
export { snakes } from "./data/snakes.js";
export { upgrades } from "./data/upgrades.js";

export function newSave(playerName = "Guardian") {
  return {
    playerName,
    selectedSnake: "Ripplefin",
    currentArea: "sanctuary",
    position: { x: 245, y: 430 },
    positionsByArea: { sanctuary: { x: 245, y: 430 } },
    inventory: Object.fromEntries([...resourceNames, ...craftedItemNames].map((name) => [name, 0])),
    unlockedRecipes: [...recipeIds],
    craftingStoriesSeen: [],
    completedElementQuizzes: [],
    completedQuests: [],
    sanctuaryUpgrades: [],
    storyScenesSeen: [],
    snakeEvolutionStatus: Object.fromEntries(Object.keys(snakes).map((name) => [name, false])),
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
    }
  };
}
