import { useState } from "react";
import { snakes } from "../data/snakes.js";
import { content, formatItems, t } from "../i18n/localization.js";

export function QuizPanel({ quiz, language = "en", onCorrect, onContinue }) {
  const [selected, setSelected] = useState(-1);
  const [feedback, setFeedback] = useState("");
  const [complete, setComplete] = useState(false);
  const guardian = snakes[quiz.guardian];
  const question = content("quizzes", quiz.id, "question", quiz.question, language);
  const choices = content("quizzes", quiz.id, "choices", quiz.choices, language);
  const correctIndex = quiz.choices.indexOf(quiz.correctChoice);

  const answer = (choiceIndex) => {
    setSelected(choiceIndex);
    if (choiceIndex === correctIndex) {
      setComplete(true);
      setFeedback(content("quizzes", quiz.id, "explanation", quiz.explanation, language));
      onCorrect(quiz);
    } else {
      setFeedback(content("quizzes", quiz.id, "retry", quiz.retry, language));
    }
  };

  return (
    <article
      className="quiz-card"
      style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
    >
      <div className="quiz-guardian">
        <img src={guardian.sprite} alt={quiz.guardian} />
        <div><p className="eyebrow">{t("guardianQuestion", language)}</p><h2>{t("guardianAsks", language, { guardian: quiz.guardian })}</h2></div>
      </div>
      <h3>{question}</h3>
      <div className="quiz-choices">
        {choices.map((choice, index) => (
          <button
            type="button"
            key={`${quiz.id}-${index}`}
            className={[
              selected === index ? "selected" : "",
              complete && index === correctIndex ? "correct" : ""
            ].join(" ")}
            onClick={() => answer(index)}
            disabled={complete}
          >
            {choice}
          </button>
        ))}
      </div>
      {feedback && <p className={`quiz-feedback ${complete ? "correct" : "retry"}`}>{feedback}</p>}
      {complete && (
        <div className="modal-action-dock quiz-action-dock">
          <div className="reward-box">
            {t("journalReward", language)}: {formatItems(quiz.reward, language, "+")}
          </div>
          <button type="button" className="primary-button" onClick={onContinue}>{t("continueAdventure", language)}</button>
        </div>
      )}
    </article>
  );
}
