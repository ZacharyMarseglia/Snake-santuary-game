// GRASP Information Expert: inventory mutations live with the inventory data.
export class InventoryManager {
  constructor(items = {}) {
    this.items = { ...items };
  }

  count(name) {
    return this.items[name] || 0;
  }

  canAfford(cost) {
    return Object.entries(cost).every(([name, amount]) => this.count(name) >= amount);
  }

  add(name, amount = 1) {
    return new InventoryManager({ ...this.items, [name]: this.count(name) + amount });
  }

  addMany(resources) {
    return Object.entries(resources).reduce(
      (inventory, [name, amount]) => inventory.add(name, amount),
      this
    );
  }

  spend(cost) {
    if (!this.canAfford(cost)) return null;
    const next = { ...this.items };
    Object.entries(cost).forEach(([name, amount]) => {
      next[name] -= amount;
    });
    return new InventoryManager(next);
  }

  total() {
    return Object.values(this.items).reduce((sum, amount) => sum + amount, 0);
  }

  toJSON() {
    return { ...this.items };
  }
}
