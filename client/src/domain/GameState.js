import { InventoryManager } from "./InventoryManager.js";

// GRASP Indirection: UI and Phaser dispatch actions through one serializable state model.
export class GameState {
  constructor(save, sanctuaryManager, storyManager, craftingManager = null) {
    this.save = save;
    this.sanctuaryManager = sanctuaryManager;
    this.storyManager = storyManager;
    this.craftingManager = craftingManager;
  }

  collect(item) {
    return {
      ...this.save,
      inventory: new InventoryManager(this.save.inventory).add(item.name).toJSON(),
      collectedResourceIds: this.save.collectedResourceIds.includes(item.id)
        ? this.save.collectedResourceIds
        : [...this.save.collectedResourceIds, item.id]
    };
  }

  discover(biome) {
    return this.storyManager.discover(this.save, biome);
  }

  purchaseUpgrade(upgradeId) {
    return this.sanctuaryManager.purchase(this.save, upgradeId);
  }

  craft(recipeId) {
    const result = this.craftingManager?.craft(this.save, recipeId);
    if (!result) return null;
    const story = this.storyManager.discoverCrafting(result.save, result.recipe);
    return { save: story.save, recipe: result.recipe, firstCraft: story.discovered };
  }

  evolve(name) {
    if (!this.sanctuaryManager.canEvolve(this.save) || this.save.snakeEvolutionStatus[name]) return null;
    return {
      ...this.save,
      snakeEvolutionStatus: { ...this.save.snakeEvolutionStatus, [name]: true }
    };
  }

  completeQuest(quest) {
    return {
      ...this.save,
      inventory: new InventoryManager(this.save.inventory).addMany(quest.reward).toJSON(),
      completedQuests: [...this.save.completedQuests, quest.id]
    };
  }

  completeElementQuiz(quiz) {
    const completedElementQuizzes = this.save.completedElementQuizzes || [];
    if (completedElementQuizzes.includes(quiz.id)) return this.save;
    return {
      ...this.save,
      inventory: new InventoryManager(this.save.inventory).addMany(quiz.reward).toJSON(),
      completedElementQuizzes: [...completedElementQuizzes, quiz.id]
    };
  }
}
