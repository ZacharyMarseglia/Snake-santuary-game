import { snakes } from "../data/snakes.js";
import { NarrationControls } from "./NarrationControls.jsx";
import { abilityName, content, elementName, t } from "../i18n/localization.js";

// GRASP High Cohesion: this component only presents a habitat profile.
export function HabitatPanel({ profile, settings, onClose }) {
  const snake = snakes[profile.guardian];
  const portrait = profile.evolved ? snake.evolvedSprite : snake.sprite;
  const displayName = profile.evolved ? snake.evolution : profile.guardian;
  const language = settings?.language || "en";
  const habitatName = content("habitats", profile.id, "name", profile.name, language);
  const unlockHint = content("habitats", profile.id, "unlockHint", profile.unlockHint, language);
  const lore = content("habitats", profile.id, "lore", profile.lore, language);
  const facts = content("habitats", profile.id, "facts", profile.facts, language);

  return (
    <article
      className={`modal habitat-modal ${profile.unlocked ? "unlocked" : "locked"}`}
      style={{
        "--guardian": snake.theme.primary,
        "--guardian-soft": snake.theme.soft,
        "--guardian-ink": snake.theme.ink
      }}
    >
      <button className="close-button" onClick={onClose} aria-label={t("close", language)}>x</button>
      <div className={`habitat-portrait habitat-${profile.kind}`}>
        <span className="habitat-aura" />
        <img src={portrait} alt={`${displayName} - ${habitatName}`} />
      </div>

      <p className="eyebrow">{profile.unlocked ? t("guardianHabitatAwakened", language) : t("sleepingHabitat", language)}</p>
      <h2>{habitatName}</h2>
      <p className="habitat-guardian-name">
        {displayName} &middot; {t("elementGuardian", language, { element: elementName(snake.element, language) })}
      </p>

      {!profile.unlocked && (
        <div className="habitat-unlock-note">
          <strong>{t("roomDreaming", language)}</strong>
          <span>{unlockHint}</span>
        </div>
      )}

      <p className="habitat-lore">{lore}</p>

      <section className="habitat-bond-card">
        <div>
          <strong>{t("guardianBond", language)}</strong>
          <span>{profile.bond}%</span>
        </div>
        <div className="habitat-bond-track" aria-label={`${t("guardianBond", language)} ${profile.bond}%`}>
          <span style={{ width: `${profile.bond}%` }} />
        </div>
        <small>
          {t("biomeRestoration", language)} {profile.challengeProgress.current}/{profile.challengeProgress.total}
          {" "}&middot; {t("sanctuaryCare", language)} {profile.upgradeProgress.current}/{profile.upgradeProgress.total}
        </small>
      </section>

      <section className="habitat-status-grid">
        <div>
          <small>{t("ability", language)}</small>
          <strong>{abilityName(snake.ability, language)}</strong>
        </div>
        <div>
          <small>{t("evolution", language)}</small>
          <strong>{snake.evolution} {profile.evolved ? t("awakened", language) : t("waiting", language)}</strong>
        </div>
      </section>

      <section className="habitat-facts">
        <h3>{t("natureNotes", language, { guardian: profile.guardian })}</h3>
        <ul>
          {facts.map((fact) => <li key={fact}>{fact}</li>)}
        </ul>
      </section>

      <div className="modal-action-dock">
        <NarrationControls
          title={`${profile.guardian} - ${habitatName}`}
          story={lore}
          lesson={facts.join(" ")}
          settings={settings}
        />
        <button className="primary-button" onClick={onClose}>
          {profile.unlocked ? t("returnSanctuary", language) : t("keepRestoring", language)}
        </button>
      </div>
    </article>
  );
}
