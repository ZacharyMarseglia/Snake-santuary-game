import { useState } from "react";
import { elementLessons } from "../data/education.js";
import { snakes } from "../data/snakes.js";

export function ElementJournal() {
  const [selectedId, setSelectedId] = useState(elementLessons[0].id);
  const lesson = elementLessons.find((entry) => entry.id === selectedId) || elementLessons[0];
  const guardian = snakes[lesson.guardian];

  return (
    <div className="element-journal">
      <nav className="element-tabs" aria-label="Element journal pages">
        {elementLessons.map((entry) => (
          <button
            type="button"
            key={entry.id}
            className={entry.id === lesson.id ? "active" : ""}
            onClick={() => setSelectedId(entry.id)}
          >
            <img src={snakes[entry.guardian].sprite} alt="" />
            <span>{entry.element}</span>
          </button>
        ))}
      </nav>
      <article
        className="element-journal-page"
        style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
      >
        <div className="element-journal-guardian">
          <img src={guardian.sprite} alt={`${lesson.guardian}, ${lesson.element} guardian`} />
          <p className="eyebrow">{lesson.element} guardian</p>
          <h3>{lesson.guardian}</h3>
          <blockquote>{lesson.quote}</blockquote>
        </div>
        <div className="element-journal-copy">
          <section>
            <h4>What {lesson.element} does in nature</h4>
            <p>{lesson.role}</p>
          </section>
          <section>
            <h4>Three guardian facts</h4>
            <ol>{lesson.facts.map((fact) => <li key={fact}>{fact}</li>)}</ol>
          </section>
          <div className="journal-note-grid">
            <aside><strong>Real-world example</strong><span>{lesson.example}</span></aside>
            <aside><strong>Did You Know?</strong><span>{lesson.didYouKnow}</span></aside>
          </div>
          <section className="journal-quiz-preview">
            <strong>Think about it</strong>
            <span>{lesson.question}</span>
            <small>Answer: {lesson.answer}</small>
          </section>
          <section>
            <h4>Resources in the game</h4>
            <div className="journal-resource-list">
              {lesson.resources.map((resource) => <span key={resource}>{resource}</span>)}
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
