import { snakes } from "../data/snakes.js";

export function QuestTracker({ quest, progress }) {
  const guardian = snakes[quest.guardian];
  return (
    <section
      className="quest-tracker"
      style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
    >
      <div className="quest-guardian">
        <img src={guardian.sprite} alt="" />
        <div>
          <p className="panel-kicker">Active quest</p>
          <h2>{quest.title}</h2>
        </div>
      </div>
      <p>{quest.text}</p>
      {quest.learning && <p className="quest-learning"><strong>Guardian lesson:</strong> {quest.learning}</p>}
      <div className="progress-track"><span style={{ width: `${(progress / quest.target.count) * 100}%` }} /></div>
      <small>{progress} / {quest.target.count} &middot; Reward: {Object.entries(quest.reward).map(([name, amount]) => `${amount} ${name}`).join(", ")}</small>
    </section>
  );
}
