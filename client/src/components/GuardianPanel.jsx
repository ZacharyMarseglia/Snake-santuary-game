import { snakes } from "../data/snakes.js";
import { abilityName, elementName, t } from "../i18n/localization.js";

export function GuardianPanel({ save, currentAreaId, onSelect, onAbility, onGuide }) {
  const atHome = currentAreaId === "sanctuary";
  const language = save.settings?.language || "en";
  return (
    <aside className="left-panel panel">
      <p className="panel-kicker">{t("guardianParty", language)}</p>
      <h2>{t("chooseSnake", language)}</h2>
      <div className="snake-list">
        {Object.entries(snakes).map(([name, snake]) => {
          const selected = save.selectedSnake === name;
          const evolved = save.snakeEvolutionStatus[name];
          return (
            <button
              key={name}
              className={`snake-card ${selected ? "selected" : ""}`}
              style={{ "--guardian": snake.theme.primary, "--guardian-soft": snake.theme.soft }}
              disabled={!atHome && !selected}
              onClick={() => onSelect(name)}
            >
              <img className="guardian-thumb" src={evolved ? snake.evolvedSprite : snake.sprite} alt="" />
              <span>
                <strong>{evolved ? snake.evolution : name}</strong>
                <small>{elementName(snake.element, language)} &middot; {abilityName(snake.ability, language)}</small>
              </span>
              {evolved && <em>{t("evolved", language)}</em>}
            </button>
          );
        })}
      </div>
      {!atHome && <p className="party-lock-note">{t("returnToChange", language)}</p>}
      <button
        className="ability-button"
        style={{
          "--guardian": snakes[save.selectedSnake].theme.primary,
          "--guardian-ink": snakes[save.selectedSnake].theme.ink
        }}
        onClick={onAbility}
      >
        {t("useAbility", language, { ability: abilityName(snakes[save.selectedSnake].ability, language) })}
        <small>{t("abilityHint", language)}</small>
      </button>
      <button className="guide-link" onClick={onGuide}>{t("openGuide", language)}</button>
    </aside>
  );
}
