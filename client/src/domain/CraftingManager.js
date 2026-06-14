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
    return save.unlockedRecipes?.includes(recipeId) ?? false;
  }

  canCraft(save, recipeId) {
    const recipe = this.recipe(recipeId);
    return Boolean(recipe) &&
      this.isUnlocked(save, recipeId) &&
      new InventoryManager(save.inventory).canAfford(recipe.ingredients);
  }

  missingMaterials(save, recipeId) {
    const recipe = this.recipe(recipeId);
    if (!recipe) return [];
    const inventory = new InventoryManager(save.inventory);
    return Object.entries(recipe.ingredients)
      .map(([name, amount]) => ({ name, needed: amount, owned: inventory.count(name) }))
      .filter((item) => item.owned < item.needed)
      .map((item) => ({ ...item, missing: item.needed - item.owned }));
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
