import { useState } from "react";
import { InventoryManager } from "../domain/InventoryManager.js";
import { craftedItemNames } from "../data/recipes.js";
import { resourceFacts } from "../data/education.js";

export function InventoryPanel({ inventory }) {
  const [selectedResource, setSelectedResource] = useState("");
  const expert = new InventoryManager(inventory);
  const crafted = new Set(craftedItemNames);
  const rawItems = Object.entries(inventory).filter(([name]) => !crafted.has(name));
  const craftedItems = Object.entries(inventory).filter(([name]) => crafted.has(name));
  const renderItems = (items) => items.map(([name, count]) => (
    <button
      type="button"
      className={`inventory-item ${count ? "" : "empty"} ${selectedResource === name ? "active" : ""}`}
      key={name}
      title={resourceFacts[name] || name}
      onClick={() => resourceFacts[name] && setSelectedResource((current) => current === name ? "" : name)}
    >
      <strong>{count}</strong><span>{name}</span>
    </button>
  ));
  return (
    <section>
      <div className="section-heading"><h2>Satchel</h2><span>{expert.total()} items</span></div>
      <div className="inventory-grid">
        {renderItems(rawItems)}
      </div>
      {selectedResource && resourceFacts[selectedResource] && (
        <div className="resource-fact-card" role="status">
          <strong>{selectedResource}</strong>
          <span>{resourceFacts[selectedResource]}</span>
        </div>
      )}
      <h3 className="crafted-heading">Crafted Relics</h3>
      <div className="inventory-grid crafted-grid">{renderItems(craftedItems)}</div>
    </section>
  );
}
