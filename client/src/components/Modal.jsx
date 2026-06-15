import { CharacterGuide } from "./CharacterGuide.jsx";
import { SettingsPanel } from "./SettingsPanel.jsx";
import { Storybook } from "./Storybook.jsx";
import { CraftingPanel } from "./CraftingPanel.jsx";
import { NarrationControls } from "./NarrationControls.jsx";
import { QuizPanel } from "./QuizPanel.jsx";
import { HabitatPanel } from "./HabitatPanel.jsx";
import { EvolutionStoryScene } from "./EvolutionStoryScene.jsx";
import { snakes } from "../data/snakes.js";
import { areaName, content, formatItems, t } from "../i18n/localization.js";

export function Modal({
  modal,
  save,
  onClose,
  setSave,
  onLanguageChange,
  resetGame,
  hasPlayer,
  onCraft,
  onReturnToCrafting,
  onStoryContinue,
  onQuizCorrect,
  onQuizContinue,
  onStartChallenge
}) {
  const language = save.settings?.language || "en";

  if (modal.type === "story") {
    const title = content("stories", modal.biome.name, "title", modal.biome.title, language);
    const story = content("stories", modal.biome.name, "story", modal.biome.story, language);
    const lesson = content("stories", modal.biome.name, "lesson", modal.biome.lesson, language);
    return (
      <div className="modal-backdrop"><article className="modal story-modal illustrated-modal">
        <div className="story-hero"><img src={modal.biome.art} alt={`${modal.biome.name} story art`} /></div>
        <div className="story-modal-copy">
          <p className="eyebrow">{t("discovery", language, { area: areaName(modal.biome.name, language) })}</p>
          <h2>{title}</h2>
          <p>{story}</p>
          <aside><strong>{t("natureNote", language)}</strong><span>{lesson}</span></aside>
          <div className="modal-action-dock">
            <NarrationControls
              title={title}
              story={story}
              lesson={lesson}
              settings={save.settings}
            />
            <button className="primary-button" onClick={() => onStoryContinue(modal.biome)}>{t("continueExploring", language)}</button>
          </div>
        </div>
      </article></div>
    );
  }

  if (modal.type === "quiz") {
    return (
      <div className="modal-backdrop"><article className="modal quiz-modal">
        <QuizPanel quiz={modal.quiz} language={language} onCorrect={onQuizCorrect} onContinue={() => onQuizContinue(modal.quiz)} />
      </article></div>
    );
  }

  if (modal.type === "challengeStart") {
    const guardian = snakes[modal.challenge.guardian];
    const title = content("challenges", modal.challenge.id, "title", modal.challenge.title, language);
    const story = content("challenges", modal.challenge.id, "startStory", modal.challenge.startStory, language);
    const objective = content("challenges", modal.challenge.id, "objective", modal.challenge.objective, language);
    const lesson = content("challenges", modal.challenge.id, "lesson", modal.challenge.lesson, language);
    return (
      <div className="modal-backdrop"><article
        className="modal challenge-modal"
        style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
      >
        <div className="challenge-modal-guardian"><img src={guardian.sprite} alt={modal.challenge.guardian} /></div>
        <p className="eyebrow">{t("elementChallenge", language)}</p>
        <h2>{title}</h2>
        <p>{story}</p>
        <div className="challenge-objective"><strong>{t("objective", language)}</strong><span>{objective}</span></div>
        <aside><strong>{t("guardianLesson", language)}</strong><span>{lesson}</span></aside>
        <div className="modal-action-dock">
          <NarrationControls
            title={title}
            story={`${story}\n${t("objective", language)}: ${objective}`}
            lesson={lesson}
            settings={save.settings}
          />
          <button className="primary-button" onClick={() => onStartChallenge(modal.challenge)}>{t("beginRestoration", language)}</button>
        </div>
      </article></div>
    );
  }

  if (modal.type === "challengeSuccess") {
    const guardian = snakes[modal.challenge.guardian];
    const title = content("challenges", modal.challenge.id, "title", modal.challenge.title, language);
    const story = content("challenges", modal.challenge.id, "successStory", modal.challenge.successStory, language);
    const lesson = content("challenges", modal.challenge.id, "lesson", modal.challenge.lesson, language);
    return (
      <div className="modal-backdrop"><article
        className="modal challenge-modal success"
        style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
      >
        <div className="challenge-modal-guardian"><img src={guardian.sprite} alt={modal.challenge.guardian} /></div>
        <p className="eyebrow">{t("biomeRestored", language)}</p>
        <h2>{title}</h2>
        <p>{story}</p>
        <aside><strong>{t("whatWeLearned", language)}</strong><span>{lesson}</span></aside>
        <div className="reward-box">
          {t("reward", language)}: {formatItems(modal.challenge.reward, language)}
        </div>
        <div className="modal-action-dock">
          <NarrationControls
            title={title}
            story={`${story}\n${t("reward", language)}: ${formatItems(modal.challenge.reward, language)}`}
            lesson={lesson}
            settings={save.settings}
          />
          <button className="primary-button" onClick={onClose}>{t("celebrateRestoration", language)}</button>
        </div>
      </article></div>
    );
  }

  if (modal.type === "quest") {
    const guardian = snakes[modal.quest.guardian];
    const title = content("quests", modal.quest.id, "title", modal.quest.title, language);
    return (
      <div className="modal-backdrop"><article
        className="modal quest-modal"
        style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
      >
        <div className="quest-complete-art">
          <img src={guardian.sprite} alt={`${modal.quest.guardian}, quest guide`} />
        </div>
        <p className="eyebrow">{t("questComplete", language)}</p>
        <h2>{title}</h2>
        <p>{t("questHelped", language, { guardian: modal.quest.guardian })}</p>
        <div className="reward-box">{t("reward", language)}: {formatItems(modal.quest.reward, language)}</div>
        <div className="modal-action-dock">
          <button className="primary-button" onClick={onClose}>{t("collectReward", language)}</button>
        </div>
      </article></div>
    );
  }

  if (modal.type === "evolution") {
    return (
      <EvolutionStoryScene scene={modal.scene} settings={save.settings} onClose={onClose} />
    );
  }

  if (modal.type === "crafting") {
    return (
      <div className="modal-backdrop"><article className="modal crafting-modal">
        <button className="close-button" onClick={onClose} aria-label={t("close", language)}>x</button>
        <p className="eyebrow">{t("guardianWorkbench", language)}</p>
        <h2>{t("craftRelics", language)}</h2>
        <CraftingPanel save={save} language={language} onCraft={onCraft} />
      </article></div>
    );
  }

  if (modal.type === "craftingStory") {
    const guardian = snakes[modal.recipe.guardian];
    const recipeName = content("recipes", modal.recipe.id, "name", modal.recipe.name, language);
    const story = content("recipes", modal.recipe.id, "story", modal.recipe.story, language);
    const lesson = content("recipes", modal.recipe.id, "lesson", modal.recipe.lesson, language);
    return (
      <div className="modal-backdrop"><article
        className="modal crafting-story-modal"
        style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
      >
        <div className="crafting-story-art"><img src={guardian.sprite} alt={modal.recipe.guardian} /></div>
        <p className="eyebrow">{t("crafted", language, { name: recipeName })}</p>
        <h2>{recipeName}</h2>
        <p>{story}</p>
        <aside><strong>{t("workbenchLesson", language)}</strong><span>{lesson}</span></aside>
        <div className="modal-action-dock">
          <NarrationControls
            title={recipeName}
            story={story}
            lesson={lesson}
            settings={save.settings}
          />
          <button className="primary-button" onClick={onReturnToCrafting}>{t("returnWorkbench", language)}</button>
        </div>
      </article></div>
    );
  }

  if (modal.type === "habitat") {
    return (
      <div className="modal-backdrop">
        <HabitatPanel profile={modal.habitat} settings={save.settings} onClose={onClose} />
      </div>
    );
  }

  if (modal.type === "guide") {
    return (
      <div className="modal-backdrop"><article className="modal wide-modal guide-modal">
        <button className="close-button" onClick={onClose} aria-label={t("close", language)}>x</button>
        <p className="eyebrow">{t("characterGuide", language)}</p><h2>{t("meetGuardians", language)}</h2>
        <CharacterGuide save={save} />
      </article></div>
    );
  }

  if (modal.type === "storybook") {
    return (
      <div className="modal-backdrop"><article className="modal storybook-modal">
        <button className="close-button" onClick={onClose} aria-label={t("close", language)}>x</button>
        <p className="eyebrow">{t("storybookLibrary", language)}</p><h2>{t("lessonsSevenBiomes", language)}</h2>
        <Storybook save={save} />
      </article></div>
    );
  }

  return (
    <div className="modal-backdrop"><article className="modal settings-modal">
      <button className="close-button" onClick={onClose} aria-label={t("close", language)}>x</button>
      <p className="eyebrow">{t("settings", language)}</p><h2>{t("settingsTitle", language)}</h2>
      <SettingsPanel
        save={save}
        setSave={setSave}
        onLanguageChange={onLanguageChange}
        resetGame={resetGame}
        hasPlayer={hasPlayer}
      />
    </article></div>
  );
}
