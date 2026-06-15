import { recipes } from "../data/recipes.js";
import { snakes } from "../data/snakes.js";
import { InventoryManager } from "../domain/InventoryManager.js";
import { content, itemName, t } from "../i18n/localization.js";

export function CraftingPanel({ save, language = "en", onCraft }) {
  const inventory = new InventoryManager(save.inventory);
  return (
    <div className="crafting-layout">
      <header className="crafting-intro">
        <span className="workbench-rune" aria-hidden="true">+</span>
        <div>
          <strong>{t("craftingIntro", language)}</strong>
          <p>{t("craftingHelp", language)}</p>
        </div>
      </header>
      <div className="recipe-grid">
        {recipes.map((recipe) => {
          const guardian = snakes[recipe.guardian];
          const unlocked = save.unlockedRecipes.includes(recipe.id);
          const affordable = unlocked && inventory.canAfford(recipe.ingredients);
          const displayName = content("recipes", recipe.id, "name", recipe.name, language);
          return (
            <article
              className={`recipe-card ${affordable ? "ready" : ""} ${unlocked ? "" : "locked"}`}
              key={recipe.id}
              style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
            >
              <div className="recipe-heading">
                <img src={guardian.sprite} alt="" />
                <span>
                  <small>{recipe.guardianLabel
                    ? t("allGuardians", language)
                    : t("guardianRecipe", language, { guardian: recipe.guardian })}
                  </small>
                  <strong>{displayName}</strong>
                </span>
                <b>{inventory.count(recipe.name)}</b>
              </div>
              <div className="recipe-materials">
                {Object.entries(recipe.ingredients).map(([name, amount]) => {
                  const owned = inventory.count(name);
                  return (
                    <span className={owned >= amount ? "enough" : "missing"} key={name}>
                      <b>{owned}/{amount}</b> {itemName(name, language)}
                    </span>
                  );
                })}
              </div>
              <button disabled={!affordable} onClick={() => onCraft(recipe)}>
                {unlocked
                  ? (affordable ? t("craftItem", language, { name: displayName }) : t("missingMaterials", language))
                  : t("recipeLocked", language)}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
