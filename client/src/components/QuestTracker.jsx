import { snakes } from "../data/snakes.js";
import { content, formatItems, t } from "../i18n/localization.js";

export function QuestTracker({ quest, progress, language = "en" }) {
  const guardian = snakes[quest.guardian];
  const title = content("quests", quest.id, "title", quest.title, language);
  const text = content("quests", quest.id, "text", quest.text, language);
  const learning = content("quests", quest.id, "learning", quest.learning, language);
  return (
    <section
      className="quest-tracker"
      style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
    >
      <div className="quest-guardian">
        <img src={guardian.sprite} alt="" />
        <div>
          <p className="panel-kicker">{t("activeQuest", language)}</p>
          <h2>{title}</h2>
        </div>
      </div>
      <p>{text}</p>
      {learning && <p className="quest-learning"><strong>{t("guardianLesson", language)}:</strong> {learning}</p>}
      <div className="progress-track"><span style={{ width: `${(progress / quest.target.count) * 100}%` }} /></div>
      <small>{progress} / {quest.target.count} &middot; {t("reward", language)}: {formatItems(quest.reward, language)}</small>
    </section>
  );
}
