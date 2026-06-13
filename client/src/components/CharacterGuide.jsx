import { useState } from "react";
import { snakes } from "../data/snakes.js";

export function CharacterGuide({ save }) {
  const [selected, setSelected] = useState(save.selectedSnake || "Ripplefin");
  const snake = snakes[selected];
  const evolved = save.snakeEvolutionStatus[selected];

  return (
    <div className="guide-layout">
      <nav className="guide-tabs" aria-label="Guardians">
        {Object.entries(snakes).map(([name, definition]) => (
          <button key={name} className={selected === name ? "active" : ""} onClick={() => setSelected(name)}>
            <img src={definition.sprite} alt="" />
            <span>{name}<small>{definition.element}</small></span>
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
            alt={`${evolved ? snake.evolution : selected}, the ${snake.element} guardian`}
          />
          <span>{snake.element} guardian</span>
        </div>
        <div className="guide-copy">
          <p className="eyebrow">{evolved ? "Evolution discovered" : "Guardian profile"}</p>
          <h3>{evolved ? snake.evolution : selected}</h3>
          <p>{snake.personality}</p>
          <dl>
            <div><dt>Ability</dt><dd>{snake.ability}</dd></div>
            <div><dt>Evolution</dt><dd>{snake.evolution}</dd></div>
            <div><dt>Science note</dt><dd>{snake.lesson}</dd></div>
          </dl>
          <div className="guide-status">
            {evolved ? "Evolved form unlocked" : "Complete 3 sanctuary upgrades to evolve"}
          </div>
        </div>
      </section>
    </div>
  );
}
