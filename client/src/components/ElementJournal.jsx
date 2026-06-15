import { useState } from "react";
import { elementLessons } from "../data/education.js";
import { snakes } from "../data/snakes.js";
import { content, itemName, t } from "../i18n/localization.js";
import { NarrationControls } from "./NarrationControls.jsx";

export function ElementJournal({ language = "en", settings = {} }) {
  const [selectedId, setSelectedId] = useState(elementLessons[0].id);
  const lesson = elementLessons.find((entry) => entry.id === selectedId) || elementLessons[0];
  const guardian = snakes[lesson.guardian];
  const element = content("elements", lesson.id, "element", lesson.element, language);
  const quote = content("elements", lesson.id, "quote", lesson.quote, language);
  const role = content("elements", lesson.id, "role", lesson.role, language);
  const facts = content("elements", lesson.id, "facts", lesson.facts, language);
  const example = content("elements", lesson.id, "example", lesson.example, language);
  const question = content("elements", lesson.id, "question", lesson.question, language);
  const answer = content("elements", lesson.id, "answer", lesson.answer, language);
  const didYouKnow = content("elements", lesson.id, "didYouKnow", lesson.didYouKnow, language);

  return (
    <div className="element-journal">
      <nav className="element-tabs" aria-label={t("elementPagesAria", language)}>
        {elementLessons.map((entry) => (
          <button
            type="button"
            key={entry.id}
            className={entry.id === lesson.id ? "active" : ""}
            onClick={() => setSelectedId(entry.id)}
          >
            <img src={snakes[entry.guardian].sprite} alt="" />
            <span>{content("elements", entry.id, "element", entry.element, language)}</span>
          </button>
        ))}
      </nav>
      <article
        className="element-journal-page"
        style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
      >
        <div className="element-journal-guardian">
          <img src={guardian.sprite} alt={`${lesson.guardian}, ${element}`} />
          <p className="eyebrow">{element}</p>
          <h3>{lesson.guardian}</h3>
          <blockquote>{quote}</blockquote>
        </div>
        <div className="element-journal-copy">
          <section>
            <h4>{t("journalRole", language, { element })}</h4>
            <p>{role}</p>
          </section>
          <section>
            <h4>{t("threeFacts", language)}</h4>
            <ol>{facts.map((fact) => <li key={fact}>{fact}</li>)}</ol>
          </section>
          <div className="journal-note-grid">
            <aside><strong>{t("realExample", language)}</strong><span>{example}</span></aside>
            <aside><strong>{t("didYouKnow", language)}</strong><span>{didYouKnow}</span></aside>
          </div>
          <section className="journal-quiz-preview">
            <strong>{t("thinkAbout", language)}</strong>
            <span>{question}</span>
            <small>{t("answer", language, { answer })}</small>
          </section>
          <section>
            <h4>{t("gameResources", language)}</h4>
            <div className="journal-resource-list">
              {lesson.resources.map((resource) => <span key={resource}>{itemName(resource, language)}</span>)}
            </div>
          </section>
          <NarrationControls
            key={lesson.id}
            title={`${lesson.guardian} - ${element}`}
            story={[
              quote,
              role,
              ...facts,
              example,
              didYouKnow,
              `${t("gameResources", language)}: ${lesson.resources.map((resource) => itemName(resource, language)).join(language === "zh" ? "、" : ", ")}`
            ].join("\n")}
            lesson={`${question} ${t("answer", language, { answer })}`}
            settings={settings}
          />
        </div>
      </article>
    </div>
  );
}
