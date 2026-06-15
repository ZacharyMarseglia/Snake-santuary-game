import { snakes } from "../data/snakes.js";
import { content, t } from "../i18n/localization.js";

export function ChallengeTracker({ challenge, progress, language = "en" }) {
  if (!challenge || !progress?.started) return null;
  const guardian = snakes[challenge.guardian];
  const count = progress.completedTargetIds?.length || 0;
  const total = challenge.targets.length;
  const title = content("challenges", challenge.id, "title", challenge.title, language);
  const objective = content("challenges", challenge.id, "objective", challenge.objective, language);
  const successStory = content("challenges", challenge.id, "successStory", challenge.successStory, language);
  const lesson = content("challenges", challenge.id, "lesson", challenge.lesson, language);

  return (
    <section
      className={`challenge-tracker ${progress.completed ? "complete" : ""}`}
      style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
    >
      <div className="challenge-tracker-heading">
        <img src={guardian.sprite} alt="" />
        <div>
          <p className="panel-kicker">{progress.completed ? t("biomeRestored", language) : t("restorationChallenge", language)}</p>
          <h2>{title}</h2>
        </div>
      </div>
      <p>{progress.completed ? successStory : objective}</p>
      <div className="progress-track"><span style={{ width: `${(count / total) * 100}%` }} /></div>
      <small>{count} / {total} {t("restored", language)} &middot; {lesson}</small>
    </section>
  );
}
