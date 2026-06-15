import { useState } from "react";
import { snakes } from "../data/snakes.js";
import { evolutionSceneByGuardian } from "../data/evolutionScenes.js";
import { abilityName, content, elementName, itemName, t } from "../i18n/localization.js";

export function CharacterGuide({ save }) {
  const [selected, setSelected] = useState(save.selectedSnake || "Ripplefin");
  const snake = snakes[selected];
  const evolved = save.snakeEvolutionStatus[selected];
  const evolutionScene = evolutionSceneByGuardian[selected];
  const challengeComplete = Boolean(save.challengeProgress?.[evolutionScene.challengeId]?.completed);
  const craftedCount = save.inventory?.[evolutionScene.craftedItem] || 0;
  const language = save.settings?.language || "en";
  const personality = content("snakes", selected, "personality", snake.personality, language);
  const lesson = content("snakes", selected, "lesson", snake.lesson, language);

  return (
    <div className="guide-layout">
      <nav className="guide-tabs" aria-label={t("guardiansAria", language)}>
        {Object.entries(snakes).map(([name, definition]) => (
          <button key={name} className={selected === name ? "active" : ""} onClick={() => setSelected(name)}>
            <img src={definition.sprite} alt="" />
            <span>{name}<small>{elementName(definition.element, language)}</small></span>
          </button>
        ))}
      </nav>
      <section
        className="guide-feature"
        style={{
          "--guardian": snake.theme.primary,
          "--guardian-soft": snake.theme.soft,
          "--guardian-ink": snake.theme.ink
        }}
      >
        <div className="guide-portrait">
          <div className="portrait-sparkles" aria-hidden="true"><i /><i /><i /></div>
          <img
            className="guardian-portrait-art"
            src={evolved ? snake.evolvedSprite : snake.sprite}
            alt={`${evolved ? snake.evolution : selected}, ${t("elementGuardian", language, { element: elementName(snake.element, language) })}`}
          />
          <span>{t("elementGuardian", language, { element: elementName(snake.element, language) })}</span>
        </div>
        <div className="guide-copy">
          <p className="eyebrow">{evolved ? t("evolutionDiscovered", language) : t("guardianProfile", language)}</p>
          <h3>{evolved ? snake.evolution : selected}</h3>
          <p>{personality}</p>
          <dl>
            <div><dt>{t("ability", language)}</dt><dd>{abilityName(snake.ability, language)}</dd></div>
            <div><dt>{t("evolution", language)}</dt><dd>{snake.evolution}</dd></div>
            <div><dt>{t("scienceNote", language)}</dt><dd>{lesson}</dd></div>
          </dl>
          <div className="guide-status">
            {evolved
              ? t("evolvedFormUnlocked", language)
              : `${challengeComplete
                ? t("challengeComplete", language)
                : t("completeChallenge", language, {
                  challenge: content("evolutions", selected, "challengeName", evolutionScene.challengeName, language)
                })} · ${craftedCount}/${evolutionScene.craftedAmount} ${itemName(evolutionScene.craftedItem, language)}`}
          </div>
        </div>
      </section>
    </div>
  );
}
