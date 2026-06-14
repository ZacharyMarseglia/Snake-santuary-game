import { snakes } from "../data/snakes.js";
import { NarrationControls } from "./NarrationControls.jsx";

// GRASP High Cohesion: this component only presents a habitat profile.
export function HabitatPanel({ profile, settings, onClose }) {
  const snake = snakes[profile.guardian];
  const portrait = profile.evolved ? snake.evolvedSprite : snake.sprite;
  const displayName = profile.evolved ? snake.evolution : profile.guardian;

  return (
    <article
      className={`modal habitat-modal ${profile.unlocked ? "unlocked" : "locked"}`}
      style={{
        "--guardian": snake.theme.primary,
        "--guardian-soft": snake.theme.soft,
        "--guardian-ink": snake.theme.ink
      }}
    >
      <button className="close-button" onClick={onClose} aria-label="Close">x</button>
      <div className={`habitat-portrait habitat-${profile.kind}`}>
        <span className="habitat-aura" />
        <img src={portrait} alt={`${displayName} in the ${profile.name}`} />
      </div>

      <p className="eyebrow">{profile.unlocked ? "Guardian habitat awakened" : "Sleeping guardian habitat"}</p>
      <h2>{profile.name}</h2>
      <p className="habitat-guardian-name">{displayName} &middot; {snake.element} Guardian</p>

      {!profile.unlocked && (
        <div className="habitat-unlock-note">
          <strong>This room is still dreaming.</strong>
          <span>{profile.unlockHint}</span>
        </div>
      )}

      <p className="habitat-lore">{profile.lore}</p>

      <section className="habitat-bond-card">
        <div>
          <strong>Guardian bond</strong>
          <span>{profile.bond}%</span>
        </div>
        <div className="habitat-bond-track" aria-label={`Guardian bond ${profile.bond}%`}>
          <span style={{ width: `${profile.bond}%` }} />
        </div>
        <small>
          Biome restoration {profile.challengeProgress.current}/{profile.challengeProgress.total}
          {" "}&middot; Sanctuary care {profile.upgradeProgress.current}/{profile.upgradeProgress.total}
        </small>
      </section>

      <section className="habitat-status-grid">
        <div>
          <small>Ability</small>
          <strong>{snake.ability}</strong>
        </div>
        <div>
          <small>Evolution</small>
          <strong>{profile.evolved ? `${snake.evolution} awakened` : `${snake.evolution} waiting`}</strong>
        </div>
      </section>

      <section className="habitat-facts">
        <h3>{profile.guardian}'s nature notes</h3>
        <ul>
          {profile.facts.map((fact) => <li key={fact}>{fact}</li>)}
        </ul>
      </section>

      <div className="modal-action-dock">
        <NarrationControls
          title={`${profile.guardian}'s ${profile.name}`}
          story={profile.lore}
          lesson={profile.facts.join(" ")}
          settings={settings}
        />
        <button className="primary-button" onClick={onClose}>
          {profile.unlocked ? "Return to the Sanctuary" : "Keep restoring"}
        </button>
      </div>
    </article>
  );
}
