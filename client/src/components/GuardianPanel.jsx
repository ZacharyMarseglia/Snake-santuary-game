import { snakes } from "../data/snakes.js";

export function GuardianPanel({ save, currentAreaId, onSelect, onAbility, onGuide }) {
  const atHome = currentAreaId === "sanctuary";
  return (
    <aside className="left-panel panel">
      <p className="panel-kicker">Guardian party</p>
      <h2>Choose a snake</h2>
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
              <span><strong>{evolved ? snake.evolution : name}</strong><small>{snake.element} &middot; {snake.ability}</small></span>
              {evolved && <em>EVOLVED</em>}
            </button>
          );
        })}
      </div>
      {!atHome && <p className="party-lock-note">Return to the Sanctuary to change guardians.</p>}
      <button
        className="ability-button"
        style={{
          "--guardian": snakes[save.selectedSnake].theme.primary,
          "--guardian-ink": snakes[save.selectedSnake].theme.ink
        }}
        onClick={onAbility}
      >
        Use {snakes[save.selectedSnake].ability}
        <small>Space key &middot; improved after evolution</small>
      </button>
      <button className="guide-link" onClick={onGuide}>Open character guide</button>
    </aside>
  );
}
