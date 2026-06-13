import { snakes } from "../data/snakes.js";
import { upgrades } from "../data/upgrades.js";

export function SanctuaryPanel({ completed, onUpgrade, available }) {
  return (
    <section>
      <div className="section-heading"><h2>Sanctuary</h2><span>{completed.length}/5</span></div>
      <p className="tiny-copy">Repairs consume crafted relics from the Guardian Workbench.</p>
      <div className="upgrade-list">
        {upgrades.map((upgrade) => {
          const done = completed.includes(upgrade.id);
          const guardian = snakes[upgrade.guardian];
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
                <strong>{done ? "Restored: " : ""}{upgrade.name}</strong>
                <small>{done ? `${upgrade.guardian}'s ${upgrade.symbol} mark is glowing` : Object.entries(upgrade.cost).map(([name, amount]) => `${amount} ${name}`).join(" / ")}</small>
              </span>
            </button>
          );
        })}
      </div>
      {!available && <p className="sanctuary-return-note">Return home to complete sanctuary repairs.</p>}
    </section>
  );
}
