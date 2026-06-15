import { snakes } from "../data/snakes.js";
import { upgrades } from "../data/upgrades.js";
import { InventoryManager } from "../domain/InventoryManager.js";
import { content, itemName, symbolName, t } from "../i18n/localization.js";

export function SanctuaryPanel({ completed, onUpgrade, available, inventory, language = "en" }) {
  const items = new InventoryManager(inventory);
  return (
    <section>
      <div className="section-heading"><h2>{t("sanctuary", language)}</h2><span>{completed.length}/5</span></div>
      <p className="tiny-copy">{t("sanctuaryRepairHelp", language)}</p>
      <div className="upgrade-list">
        {upgrades.map((upgrade) => {
          const done = completed.includes(upgrade.id);
          const guardian = snakes[upgrade.guardian];
          const name = content("upgrades", upgrade.id, "name", upgrade.name, language);
          return (
            <button
              key={upgrade.id}
              disabled={done || !available}
              className={done ? "done" : ""}
              style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
              onClick={() => onUpgrade(upgrade)}
            >
              <img src={guardian.sprite} alt="" />
              <span>
                <strong>{done ? t("restoredPrefix", language) : ""}{name}</strong>
                <small>{done
                  ? t("guardianMarkGlowing", language, {
                    guardian: upgrade.guardian,
                    symbol: symbolName(upgrade.symbol, language)
                  })
                  : Object.entries(upgrade.cost).map(([item, amount]) => `${items.count(item)}/${amount} ${itemName(item, language)}`).join(" / ")}
                </small>
              </span>
            </button>
          );
        })}
      </div>
      {!available && <p className="sanctuary-return-note">{t("returnHomeRepairs", language)}</p>}
    </section>
  );
}
