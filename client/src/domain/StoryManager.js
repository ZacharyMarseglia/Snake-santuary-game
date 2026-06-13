// GRASP Pure Fabrication: story discovery is isolated from rendering and persistence.
export class StoryManager {
  discover(save, biome) {
    if (!biome || save.storyScenesSeen.includes(biome.name)) return { save, discovered: false };
    return {
      save: { ...save, storyScenesSeen: [...save.storyScenesSeen, biome.name] },
      discovered: true
    };
  }

  discoverCrafting(save, recipe) {
    if (!recipe || save.craftingStoriesSeen.includes(recipe.id)) return { save, discovered: false };
    return {
      save: { ...save, craftingStoriesSeen: [...save.craftingStoriesSeen, recipe.id] },
      discovered: true
    };
  }
}
