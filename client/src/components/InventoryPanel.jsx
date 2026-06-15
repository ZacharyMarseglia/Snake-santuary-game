import { useState } from "react";
import { InventoryManager } from "../domain/InventoryManager.js";
import { craftedItemNames } from "../data/recipes.js";
import { resourceFacts } from "../data/education.js";
import { itemName, resourceFact, t } from "../i18n/localization.js";

export function InventoryPanel({ inventory, language = "en" }) {
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
      title={resourceFact(name, resourceFacts[name], language) || name}
      onClick={() => resourceFacts[name] && setSelectedResource((current) => current === name ? "" : name)}
    >
      <strong>{count}</strong><span>{itemName(name, language)}</span>
    </button>
  ));
  return (
    <section>
      <div className="section-heading"><h2>{t("satchel", language)}</h2><span>{t("items", language, { count: expert.total() })}</span></div>
      <div className="inventory-grid">
        {renderItems(rawItems)}
      </div>
      {selectedResource && resourceFacts[selectedResource] && (
        <div className="resource-fact-card" role="status">
          <strong>{itemName(selectedResource, language)}</strong>
          <span>{resourceFact(selectedResource, resourceFacts[selectedResource], language)}</span>
        </div>
      )}
      <h3 className="crafted-heading">{t("craftedRelics", language)}</h3>
      <div className="inventory-grid crafted-grid">{renderItems(craftedItems)}</div>
    </section>
  );
}
