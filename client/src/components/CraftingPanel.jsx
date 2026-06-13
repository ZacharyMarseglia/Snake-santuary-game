import { recipes } from "../data/recipes.js";
import { snakes } from "../data/snakes.js";
import { InventoryManager } from "../domain/InventoryManager.js";

export function CraftingPanel({ save, onCraft }) {
  const inventory = new InventoryManager(save.inventory);
  return (
    <div className="crafting-layout">
      <header className="crafting-intro">
        <span className="workbench-rune" aria-hidden="true">+</span>
        <div>
          <strong>Turn biome materials into guardian relics.</strong>
          <p>Raw resources cannot repair the Sanctuary. Craft the required item first.</p>
        </div>
      </header>
      <div className="recipe-grid">
        {recipes.map((recipe) => {
          const guardian = snakes[recipe.guardian];
          const unlocked = save.unlockedRecipes.includes(recipe.id);
          const affordable = unlocked && inventory.canAfford(recipe.ingredients);
          return (
            <article
              className={`recipe-card ${affordable ? "ready" : ""} ${unlocked ? "" : "locked"}`}
              key={recipe.id}
              style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
            >
              <div className="recipe-heading">
                <img src={guardian.sprite} alt="" />
                <span><small>{recipe.guardianLabel || `${recipe.guardian}'s recipe`}</small><strong>{recipe.name}</strong></span>
                <b>{inventory.count(recipe.name)}</b>
              </div>
              <div className="recipe-materials">
                {Object.entries(recipe.ingredients).map(([name, amount]) => {
                  const owned = inventory.count(name);
                  return (
                    <span className={owned >= amount ? "enough" : "missing"} key={name}>
                      <b>{owned}/{amount}</b> {name}
                    </span>
                  );
                })}
              </div>
              <button disabled={!affordable} onClick={() => onCraft(recipe)}>
                {unlocked ? (affordable ? `Craft ${recipe.name}` : "Missing materials") : "Recipe locked"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
