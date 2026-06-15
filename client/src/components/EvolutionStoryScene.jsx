import { snakes } from "../data/snakes.js";
import { EVOLUTION_GROWTH_MESSAGE } from "../data/evolutionScenes.js";
import { NarrationControls } from "./NarrationControls.jsx";
import { content, elementName, t } from "../i18n/localization.js";

export function EvolutionStoryScene({ scene, settings, onClose }) {
  const snake = snakes[scene.guardian];
  const language = settings?.language || "en";
  const story = content("evolutions", scene.guardian, "story", scene.story, language);
  const lesson = content("evolutions", scene.guardian, "lesson", scene.lesson, language);
  const growthMessage = t("growthMessage", language);
  const particles = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    x: 7 + ((index * 31) % 88),
    y: 5 + ((index * 47) % 88),
    delay: (index % 7) * -0.34,
    size: 5 + (index % 4) * 3
  }));

  return (
    <div
      className={`evolution-scene-backdrop evolution-${scene.kind}`}
      style={{ "--guardian": snake.theme.primary, "--guardian-soft": snake.theme.soft }}
    >
      <article
        className="evolution-story-scene"
        style={{
          "--guardian": snake.theme.primary,
          "--guardian-soft": snake.theme.soft,
          "--guardian-ink": snake.theme.ink
        }}
      >
        <div className="evolution-scene-art">
          <div className="evolution-effect-field" aria-hidden="true">
            {particles.map((particle) => (
              <i
                key={particle.id}
                style={{
                  "--x": `${particle.x}%`,
                  "--y": `${particle.y}%`,
                  "--delay": `${particle.delay}s`,
                  "--size": `${particle.size}px`
                }}
              />
            ))}
          </div>
          <div className="evolution-ring" aria-hidden="true"><span /><span /><span /></div>
          <img className="evolution-base-echo" src={snake.sprite} alt="" />
          <img
            className="evolution-revealed-guardian"
            src={snake.evolvedSprite}
            alt={`${scene.evolution}, evolved form of ${scene.guardian}`}
          />
          <p className="evolution-form-label">
            {t("elementGuardian", language, { element: elementName(snake.element, language) })}
          </p>
        </div>

        <div className="evolution-scene-copy">
          <p className="eyebrow">{t("newChapter", language)}</p>
          <h2>
            <span>{t("evolvedInto", language, { guardian: scene.guardian })}</span>
            {scene.evolution}
          </h2>
          <p className="evolution-story-text">{story}</p>
          <aside className="evolution-lesson">
            <strong>{t("guardianLesson", language)}</strong>
            <span>{lesson}</span>
          </aside>
          <blockquote>{language === "en" ? EVOLUTION_GROWTH_MESSAGE : growthMessage}</blockquote>
          <div className="evolution-power-list">
            <span>{t("fasterAbility", language)}</span>
            <span>{t("largerReach", language)}</span>
            <span>{t("strongerAura", language)}</span>
          </div>
          <div className="modal-action-dock">
            <NarrationControls
              title={`${t("evolvedInto", language, { guardian: scene.guardian })} ${scene.evolution}`}
              story={`${story} ${growthMessage}`}
              lesson={lesson}
              settings={settings}
            />
            <button className="primary-button" onClick={onClose}>{t("continueAs", language, { name: scene.evolution })}</button>
          </div>
        </div>
      </article>
    </div>
  );
}
