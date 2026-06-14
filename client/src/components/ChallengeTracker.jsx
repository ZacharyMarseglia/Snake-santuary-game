import { snakes } from "../data/snakes.js";

export function ChallengeTracker({ challenge, progress }) {
  if (!challenge || !progress?.started) return null;
  const guardian = snakes[challenge.guardian];
  const count = progress.completedTargetIds?.length || 0;
  const total = challenge.targets.length;

  return (
    <section
      className={`challenge-tracker ${progress.completed ? "complete" : ""}`}
      style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
    >
      <div className="challenge-tracker-heading">
        <img src={guardian.sprite} alt="" />
        <div>
          <p className="panel-kicker">{progress.completed ? "Biome restored" : "Restoration challenge"}</p>
          <h2>{challenge.title}</h2>
        </div>
      </div>
      <p>{progress.completed ? challenge.successStory : challenge.objective}</p>
      <div className="progress-track"><span style={{ width: `${(count / total) * 100}%` }} /></div>
      <small>{count} / {total} restored &middot; {challenge.lesson}</small>
    </section>
  );
}
