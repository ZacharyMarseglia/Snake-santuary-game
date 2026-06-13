import { snakes } from "../data/snakes.js";

export function EvolutionPanel({ save, onEvolve }) {
  const evolvedCount = Object.values(save.snakeEvolutionStatus).filter(Boolean).length;
  const evolved = save.snakeEvolutionStatus[save.selectedSnake];
  const snake = snakes[save.selectedSnake];
  return (
    <section style={{ "--guardian": snake.theme.primary, "--guardian-soft": snake.theme.soft }}>
      <div className="section-heading"><h2>Evolution</h2><span>{evolvedCount}/6</span></div>
      <div className="evolution-preview">
        <img src={snake.sprite} alt={save.selectedSnake} />
        <span aria-hidden="true">to</span>
        <img className={evolved ? "" : "silhouette"} src={snake.evolvedSprite} alt={evolved ? snake.evolution : "Locked evolved form"} />
      </div>
      <p className="tiny-copy">{evolvedCount === 6 ? "Every guardian has reached its evolved form." : "Complete 3 upgrades and restore the elemental shrine, then evolve each guardian for a larger form, wider pickup reach, and faster ability cooldown."}</p>
      <button className="evolve-button" onClick={() => onEvolve(save.selectedSnake)} disabled={evolved}>
        {evolved ? `${snake.evolution} unlocked` : `Evolve ${save.selectedSnake}`}
      </button>
    </section>
  );
}
