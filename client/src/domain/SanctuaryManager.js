import { InventoryManager } from "./InventoryManager.js";

// GRASP Information Expert: upgrade eligibility and costs belong to the sanctuary.
export class SanctuaryManager {
  constructor(upgradeDefinitions) {
    this.upgrades = upgradeDefinitions;
  }

  purchase(save, upgradeId) {
    const upgrade = this.upgrades.find((candidate) => candidate.id === upgradeId);
    if (!upgrade || save.sanctuaryUpgrades.includes(upgradeId)) return null;
    const inventory = new InventoryManager(save.inventory).spend(upgrade.cost);
    if (!inventory) return null;
    return {
      ...save,
      inventory: inventory.toJSON(),
      sanctuaryUpgrades: [...save.sanctuaryUpgrades, upgradeId]
    };
  }

  canEvolve(save) {
    return save.sanctuaryUpgrades.length >= 3 && save.sanctuaryUpgrades.includes("shrine");
  }
}
