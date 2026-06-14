import { useState } from "react";
import { snakes } from "../data/snakes.js";

export function QuizPanel({ quiz, onCorrect, onContinue }) {
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");
  const [complete, setComplete] = useState(false);
  const guardian = snakes[quiz.guardian];

  const answer = (choice) => {
    setSelected(choice);
    if (choice === quiz.correctChoice) {
      setComplete(true);
      setFeedback(quiz.explanation);
      onCorrect(quiz);
    } else {
      setFeedback(quiz.retry);
    }
  };

  return (
    <article
      className="quiz-card"
      style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
    >
      <div className="quiz-guardian">
        <img src={guardian.sprite} alt={quiz.guardian} />
        <div><p className="eyebrow">Guardian question</p><h2>{quiz.guardian} asks...</h2></div>
      </div>
      <h3>{quiz.question}</h3>
      <div className="quiz-choices">
        {quiz.choices.map((choice) => (
          <button
            type="button"
            key={choice}
            className={[
              selected === choice ? "selected" : "",
              complete && choice === quiz.correctChoice ? "correct" : ""
            ].join(" ")}
            onClick={() => answer(choice)}
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
            Journal reward: {Object.entries(quiz.reward).map(([name, amount]) => `+${amount} ${name}`).join(", ")}
          </div>
          <button type="button" className="primary-button" onClick={onContinue}>Continue adventure</button>
        </div>
      )}
    </article>
  );
}
