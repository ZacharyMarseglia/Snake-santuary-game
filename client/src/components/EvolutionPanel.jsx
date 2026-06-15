import { snakes } from "../data/snakes.js";
import { content, itemName, t } from "../i18n/localization.js";

export function EvolutionPanel({ save, profile, onEvolve }) {
  const evolvedCount = Object.values(save.snakeEvolutionStatus).filter(Boolean).length;
  const evolved = save.snakeEvolutionStatus[save.selectedSnake];
  const snake = snakes[save.selectedSnake];
  const language = save.settings?.language || "en";
  const challengeName = content("evolutions", save.selectedSnake, "challengeName", profile.challengeName, language);
  return (
    <section style={{ "--guardian": snake.theme.primary, "--guardian-soft": snake.theme.soft }}>
      <div className="section-heading"><h2>{t("evolution", language)}</h2><span>{evolvedCount}/6</span></div>
      <div className="evolution-preview">
        <img src={snake.sprite} alt={save.selectedSnake} />
        <span aria-hidden="true">→</span>
        <img className={evolved ? "" : "silhouette"} src={snake.evolvedSprite} alt={evolved ? snake.evolution : t("lockedEvolvedForm", language)} />
      </div>
      {evolvedCount === 6 ? (
        <p className="tiny-copy">{t("everyGuardianEvolved", language)}</p>
      ) : (
        <div className="evolution-requirements">
          <span className={profile.challengeComplete ? "ready" : ""}>
            <b>{profile.challengeComplete ? t("done", language) : t("needed", language)}</b>
            {challengeName}
          </span>
          <span className={profile.craftedCount >= profile.craftedAmount ? "ready" : ""}>
            <b>{profile.craftedCount}/{profile.craftedAmount}</b>
            {itemName(profile.craftedItem, language)}
          </span>
        </div>
      )}
      <button className="evolve-button" onClick={() => onEvolve(save.selectedSnake)} disabled={evolved}>
        {evolved
          ? t("evolutionUnlocked", language, { name: snake.evolution })
          : t("evolveGuardian", language, { guardian: save.selectedSnake })}
      </button>
    </section>
  );
}
