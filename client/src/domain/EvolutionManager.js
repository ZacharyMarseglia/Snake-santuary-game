import { InventoryManager } from "./InventoryManager.js";
import { content, itemName, t } from "../i18n/localization.js";

// GRASP Information Expert: this manager owns evolution eligibility and relic consumption.
export class EvolutionManager {
  constructor(evolutionScenes) {
    this.scenes = Object.fromEntries(
      evolutionScenes.map((scene) => [scene.guardian, scene])
    );
  }

  profile(save, guardianName) {
    const scene = this.scenes[guardianName];
    if (!scene) return null;
    const challengeComplete = Boolean(save.challengeProgress?.[scene.challengeId]?.completed);
    const craftedCount = save.inventory?.[scene.craftedItem] || 0;
    const evolved = Boolean(save.snakeEvolutionStatus?.[guardianName]);

    return {
      ...scene,
      challengeComplete,
      craftedCount,
      evolved,
      canEvolve: !evolved && challengeComplete && craftedCount >= scene.craftedAmount
    };
  }

  evolve(save, guardianName) {
    const language = save.settings?.language || "en";
    const profile = this.profile(save, guardianName);
    if (!profile) return { ok: false, save, message: t("evolutionHidden", language) };
    if (profile.evolved) return {
      ok: false,
      save,
      message: t("evolutionAwakened", language, { name: profile.evolution })
    };
    if (!profile.challengeComplete) {
      const challengeName = content("evolutions", guardianName, "challengeName", profile.challengeName, language);
      return {
        ok: false,
        save,
        message: t("completeBeforeEvolving", language, {
          challenge: challengeName,
          guardian: guardianName
        })
      };
    }
    if (profile.craftedCount < profile.craftedAmount) {
      return {
        ok: false,
        save,
        message: t("craftBeforeEvolving", language, {
          amount: profile.craftedAmount,
          item: itemName(profile.craftedItem, language)
        })
      };
    }

    const inventory = new InventoryManager(save.inventory).spend({
      [profile.craftedItem]: profile.craftedAmount
    });
    if (!inventory) return {
      ok: false,
      save,
      message: t("craftItemFirst", language, { item: itemName(profile.craftedItem, language) })
    };

    return {
      ok: true,
      scene: this.scenes[guardianName],
      save: {
        ...save,
        inventory: inventory.toJSON(),
        snakeEvolutionStatus: {
          ...save.snakeEvolutionStatus,
          [guardianName]: true
        }
      }
    };
  }
}
