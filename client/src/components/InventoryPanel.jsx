import { InventoryManager } from "../domain/InventoryManager.js";
import { craftedItemNames } from "../data/recipes.js";

export function InventoryPanel({ inventory }) {
  const expert = new InventoryManager(inventory);
  const crafted = new Set(craftedItemNames);
  const rawItems = Object.entries(inventory).filter(([name]) => !crafted.has(name));
  const craftedItems = Object.entries(inventory).filter(([name]) => crafted.has(name));
  const renderItems = (items) => items.map(([name, count]) => (
    <div className={count ? "" : "empty"} key={name}><strong>{count}</strong><span>{name}</span></div>
  ));
  return (
    <section>
      <div className="section-heading"><h2>Satchel</h2><span>{expert.total()} items</span></div>
      <div className="inventory-grid">
        {renderItems(rawItems)}
      </div>
      <h3 className="crafted-heading">Crafted Relics</h3>
      <div className="inventory-grid crafted-grid">{renderItems(craftedItems)}</div>
    </section>
  );
}
