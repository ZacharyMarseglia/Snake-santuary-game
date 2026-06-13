import { InventoryManager } from "./InventoryManager.js";

// GRASP Controller/Information Expert: recipe eligibility and inventory conversion live here.
export class CraftingManager {
  constructor(recipeDefinitions) {
    this.recipes = recipeDefinitions;
  }

  recipe(recipeId) {
    return this.recipes.find((candidate) => candidate.id === recipeId);
  }

  isUnlocked(save, recipeId) {
    return save.unlockedRecipes.includes(recipeId);
  }

  canCraft(save, recipeId) {
    const recipe = this.recipe(recipeId);
    return Boolean(recipe) &&
      this.isUnlocked(save, recipeId) &&
      new InventoryManager(save.inventory).canAfford(recipe.ingredients);
  }

  craft(save, recipeId) {
    const recipe = this.recipe(recipeId);
    if (!recipe || !this.isUnlocked(save, recipeId)) return null;
    const spent = new InventoryManager(save.inventory).spend(recipe.ingredients);
    if (!spent) return null;
    return {
      save: {
        ...save,
        inventory: spent.addMany(recipe.output).toJSON()
      },
      recipe
    };
  }
}
