import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PhaserGame from "./PhaserGame.jsx";
import { habitats, newSave, quests, recipes, snakes, upgrades } from "./gameData.js";
import { areas, normalizeAreaId, normalizeAreaPosition, resolveAreaId } from "./data/areas.js";
import { challengeByAreaId, challengeByStoryName, challenges } from "./data/challenges.js";
import { biomeQuizByStoryName } from "./data/education.js";
import { evolutionScenes } from "./data/evolutionScenes.js";
import { abilityName, areaName, content, formatItems, itemName, t } from "./i18n/localization.js";
import { GameState } from "./domain/GameState.js";
import { ChallengeManager } from "./domain/ChallengeManager.js";
import { CraftingManager } from "./domain/CraftingManager.js";
import { EvolutionManager } from "./domain/EvolutionManager.js";
import { QuestManager } from "./domain/QuestManager.js";
import { SanctuaryManager } from "./domain/SanctuaryManager.js";
import { SanctuaryHabitatManager } from "./domain/SanctuaryHabitatManager.js";
import { StoryManager } from "./domain/StoryManager.js";
import { ApiClient } from "./services/ApiClient.js";
import { SaveService } from "./services/SaveService.js";
import { narrationManager } from "./services/NarrationManager.js";
import { EvolutionPanel } from "./components/EvolutionPanel.jsx";
import { GuardianPanel } from "./components/GuardianPanel.jsx";
import { InventoryPanel } from "./components/InventoryPanel.jsx";
import { Modal } from "./components/Modal.jsx";
import { PauseMenu } from "./components/PauseMenu.jsx";
import { QuestTracker } from "./components/QuestTracker.jsx";
import { SanctuaryPanel } from "./components/SanctuaryPanel.jsx";
import { audioManager } from "./services/AudioManager.js";
import { WorldMap } from "./components/WorldMap.jsx";
import { ChallengeTracker } from "./components/ChallengeTracker.jsx";

function mergeSave(value) {
  const base = newSave(value?.playerName);
  const localNarrationSettings = saveService.localNarrationSettings();
  const localLanguage = saveService.localLanguage();
  const currentArea = normalizeAreaId(value?.currentArea);
  const positionsByArea = { ...base.positionsByArea };
  Object.entries(value?.positionsByArea || {}).forEach(([areaId, position]) => {
    const resolvedAreaId = resolveAreaId(areaId);
    if (!resolvedAreaId) return;
    positionsByArea[resolvedAreaId] = normalizeAreaPosition(position, resolvedAreaId);
  });
  const oldSanctuaryDefault = positionsByArea.sanctuary?.x === 550 && positionsByArea.sanctuary?.y === 430;
  if (oldSanctuaryDefault) positionsByArea.sanctuary = base.positionsByArea.sanctuary;
  const currentPosition = normalizeAreaPosition(
    value?.position || positionsByArea[currentArea],
    currentArea
  );
  positionsByArea[currentArea] = currentPosition;
  const merged = {
    ...base,
    ...value,
    currentArea,
    position: currentArea === "sanctuary" && value?.position?.x === 550 && value?.position?.y === 430
      ? base.position
      : currentPosition,
    inventory: { ...base.inventory, ...value?.inventory },
    positionsByArea,
    unlockedRecipes: value?.unlockedRecipes || base.unlockedRecipes,
    craftingStoriesSeen: value?.craftingStoriesSeen || base.craftingStoriesSeen,
    completedElementQuizzes: value?.completedElementQuizzes || base.completedElementQuizzes,
    challengeProgress: { ...base.challengeProgress, ...value?.challengeProgress },
    habitatStates: { ...base.habitatStates, ...value?.habitatStates },
    snakeEvolutionStatus: { ...base.snakeEvolutionStatus, ...value?.snakeEvolutionStatus },
    settings: {
      ...base.settings,
      ...value?.settings,
      ...localNarrationSettings,
      language: localLanguage,
      narrationVoices: {
        ...base.settings.narrationVoices,
        ...value?.settings?.narrationVoices,
        ...localNarrationSettings.narrationVoices
      }
    }
  };
  return habitatManager.synchronize(merged);
}

const questManager = new QuestManager(quests);
const sanctuaryManager = new SanctuaryManager(upgrades);
const storyManager = new StoryManager();
const craftingManager = new CraftingManager(recipes);
const challengeManager = new ChallengeManager(challenges);
const habitatManager = new SanctuaryHabitatManager(habitats);
const evolutionManager = new EvolutionManager(evolutionScenes);
const saveService = new SaveService(new ApiClient());

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [playerId, setPlayerId] = useState(() => saveService.playerId());
  const [save, setSave] = useState(() => mergeSave());
  const [playerName, setPlayerName] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [currentAreaId, setCurrentAreaId] = useState(() => normalizeAreaId(save.currentArea));
  const [worldPrompt, setWorldPrompt] = useState("");
  const [sanctuaryCelebration, setSanctuaryCelebration] = useState(null);
  const [saveStatus, setSaveStatus] = useState("notSaved");
  const [menuError, setMenuError] = useState("");
  const [paused, setPaused] = useState(false);
  const gameRef = useRef(null);
  const saveTimer = useRef(null);
  const celebrationTimer = useRef(null);
  const loadedRef = useRef(false);
  const language = save.settings?.language || "en";

  const activeQuest = useMemo(
    () => questManager.active(save.completedQuests),
    [save.completedQuests]
  );
  const progress = Math.min(questManager.progress(activeQuest, save), activeQuest.target.count);
  const activeChallenge = challengeByAreaId[currentAreaId] || null;
  const activeChallengeProgress = activeChallenge
    ? challengeManager.progress(save, activeChallenge.id)
    : null;
  const selectedEvolutionProfile = useMemo(
    () => evolutionManager.profile(save, save.selectedSnake),
    [save.selectedSnake, save.challengeProgress, save.inventory, save.snakeEvolutionStatus]
  );

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(""), 2600);
  }, []);

  useEffect(() => () => window.clearTimeout(celebrationTimer.current), []);
  useEffect(() => {
    narrationManager.stop();
  }, [screen]);
  useEffect(() => {
    saveService.saveNarrationSettings(save.settings);
  }, [save.settings]);
  useEffect(() => {
    document.documentElement.lang = save.settings.language === "zh" ? "zh-CN" : "en";
    narrationManager.stop();
  }, [save.settings.language]);

  const openModal = useCallback((type) => {
    audioManager.play("click");
    setModal({ type });
  }, []);

  const closeModal = useCallback(() => {
    audioManager.play("click");
    narrationManager.stop();
    setModal(null);
  }, []);

  const changeLanguage = useCallback((nextLanguage) => {
    const language = saveService.saveLanguage(nextLanguage);
    setSave((current) => ({
      ...current,
      settings: { ...current.settings, language }
    }));
  }, []);

  const startGame = async () => {
    const name = playerName.trim();
    if (!name) {
      setMenuError("nameRequired");
      return;
    }
    audioManager.play("click");
    audioManager.startMusic();
    setMenuError("");
    try {
      const data = await saveService.create(name);
      setPlayerId(String(data.playerId));
      setSave(mergeSave(data.save));
      loadedRef.current = true;
      audioManager.play("start");
      audioManager.startMusic();
      setPaused(false);
      setScreen("game");
    } catch {
      setMenuError("saveUnavailable");
    }
  };

  const continueGame = async () => {
    if (!playerId) return;
    audioManager.play("click");
    audioManager.startMusic();
    setMenuError("");
    try {
      const data = await saveService.load(playerId);
      setSave(mergeSave(data.save));
      loadedRef.current = true;
      audioManager.play("start");
      audioManager.startMusic();
      setPaused(false);
      setScreen("game");
    } catch {
      setMenuError("saveNotFound");
    }
  };

  const resetGame = async () => {
    if (!playerId) return;
    let data;
    try {
      data = await saveService.reset(playerId);
    } catch {
      return showToast(t("resetFailed", language));
    }
    setSave(mergeSave(data.save));
    setModal(null);
    audioManager.play("upgrade");
    showToast(t("freshAdventure", language));
  };

  useEffect(() => {
    audioManager.updateSettings(save.settings);
  }, [save.settings]);

  useEffect(() => {
    if (screen === "game") gameRef.current?.setPaused(paused || Boolean(modal));
  }, [paused, modal, screen]);

  useEffect(() => {
    if (!playerId || !loadedRef.current || screen !== "game") return;
    window.clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = window.setTimeout(async () => {
      try {
        await saveService.save(playerId, save);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("saveFailed");
      }
    }, 700);
    return () => window.clearTimeout(saveTimer.current);
  }, [save, playerId, screen]);

  useEffect(() => {
    const completed = questManager.findCompleted(save);
    if (!completed || screen !== "game" || sanctuaryCelebration || modal) return;

    setSave((current) => {
      if (current.completedQuests.includes(completed.id)) return current;
      return new GameState(current, sanctuaryManager, storyManager).completeQuest(completed);
    });
    setModal({ type: "quest", quest: completed });
    audioManager.play("upgrade");
  }, [save.inventory, save.sanctuaryUpgrades, save.storyScenesSeen, save.completedQuests, screen, sanctuaryCelebration, modal]);

  const handleGameEvent = useCallback((event) => {
    if (event.type === "pickup") {
      setSave((current) => {
        return new GameState(current, sanctuaryManager, storyManager).collect(event.item);
      });
      audioManager.play("pickup");
      showToast(`+1 ${itemName(event.item.name, language)}`);
    }
    if (event.type === "position") {
      setSave((current) => ({
        ...current,
        position: event.position,
        positionsByArea: { ...current.positionsByArea, [event.areaId]: event.position }
      }));
    }
    if (event.type === "ability") {
      audioManager.play("ability");
      if (!event.harvested) showToast(`${abilityName(event.name, language)}!`);
    }
    if (event.type === "warning") {
      audioManager.play("pause");
      showToast(event.message);
    }
    if (event.type === "prompt") {
      setWorldPrompt(event.message);
    }
    if (event.type === "workbench") {
      audioManager.play("click");
      setModal({ type: "crafting" });
    }
    if (event.type === "habitat") {
      audioManager.play("click");
      const synchronized = habitatManager.synchronize(save);
      if (synchronized !== save) setSave(synchronized);
      setModal({ type: "habitat", habitat: habitatManager.profile(synchronized, event.guardian) });
    }
    if (event.type === "challenge-action") {
      const result = challengeManager.advance(save, event.challengeId, event.targetId);
      if (!result.accepted) {
        audioManager.play("pause");
        showToast(result.message);
      } else {
        setSave(habitatManager.synchronize(result.save));
        audioManager.play(result.completed ? "upgrade" : "ability");
        if (result.completed) {
          setModal({ type: "challengeSuccess", challenge: challengeManager.definition(event.challengeId) });
        } else {
          showToast(result.message);
        }
      }
    }
    if (event.type === "area" && event.area) {
      narrationManager.stop();
      setCurrentAreaId(event.area.id);
      setSave((current) => ({ ...current, currentArea: event.area.id }));
      setSave((current) => {
        const result = new GameState(current, sanctuaryManager, storyManager).discover(event.storyScene);
        const quiz = biomeQuizByStoryName[event.storyScene?.name];
        const challenge = challengeByAreaId[event.area.id];
        const challengeProgress = challenge
          ? challengeManager.progress(result.save, challenge.id)
          : null;
        if (result.discovered) {
          audioManager.play("story");
          setModal({ type: "story", biome: event.storyScene });
        } else if (quiz && !result.save.completedElementQuizzes.includes(quiz.id)) {
          audioManager.play("story");
          setModal({ type: "quiz", quiz });
        } else if (challenge && !challengeProgress.started && !challengeProgress.completed) {
          audioManager.play("story");
          setModal({ type: "challengeStart", challenge });
        }
        return result.save;
      });
    }
    if (event.type === "pause") {
      audioManager.play("pause");
      narrationManager.stop();
      if (modal) setModal(null);
      else setPaused((current) => !current);
    }
  }, [showToast, modal, save]);

  const buyUpgrade = (upgrade) => {
    if (currentAreaId !== "sanctuary") return showToast(t("returnRepairWarning", language));
    const next = new GameState(save, sanctuaryManager, storyManager).purchaseUpgrade(upgrade.id);
    if (!next) return showToast(t("craftRepairWarning", language));
    setSave(habitatManager.synchronize(next));
    audioManager.play("upgrade");
    setSanctuaryCelebration(upgrade);
    window.clearTimeout(celebrationTimer.current);
    celebrationTimer.current = window.setTimeout(() => setSanctuaryCelebration(null), 3400);
  };

  const craftRecipe = (recipe) => {
    const result = new GameState(save, sanctuaryManager, storyManager, craftingManager).craft(recipe.id);
    if (!result) {
      const missing = craftingManager.missingMaterials(save, recipe.id);
      const details = missing.map((item) => `${item.missing} ${itemName(item.name, language)}`).join(language === "zh" ? "、" : ", ");
      return showToast(details
        ? t("missingPrefix", language, { items: details })
        : t("recipeNotUnlocked", language));
    }
    setSave(result.save);
    audioManager.play("craft");
    if (result.firstCraft) {
      audioManager.play("story");
      setModal({ type: "craftingStory", recipe: result.recipe });
    } else {
      const recipeName = content("recipes", recipe.id, "name", recipe.name, language);
      showToast(t("crafted", language, { name: recipeName }));
    }
  };

  const evolveSnake = (name) => {
    const result = new GameState(
      save,
      sanctuaryManager,
      storyManager,
      null,
      evolutionManager
    ).evolve(name);
    if (!result.ok) return showToast(result.message);
    setSave(result.save);
    audioManager.play("evolve");
    setModal({ type: "evolution", scene: result.scene });
  };

  const continueStory = (biome) => {
    narrationManager.stop();
    const quiz = biomeQuizByStoryName[biome.name];
    if (quiz && !save.completedElementQuizzes.includes(quiz.id)) {
      setModal({ type: "quiz", quiz });
      return;
    }
    const challenge = challengeByStoryName[biome.name];
    const progress = challenge ? challengeManager.progress(save, challenge.id) : null;
    if (challenge && !progress.started && !progress.completed) {
      setModal({ type: "challengeStart", challenge });
      return;
    }
    closeModal();
  };

  const completeQuiz = (quiz) => {
    setSave((current) => (
      new GameState(current, sanctuaryManager, storyManager).completeElementQuiz(quiz)
    ));
    audioManager.play("upgrade");
    const reward = formatItems(quiz.reward, language, "+");
    showToast(t("correctReward", language, { reward }));
  };

  const continueQuiz = (quiz) => {
    const challenge = challengeByStoryName[quiz.storyName];
    const progress = challenge ? challengeManager.progress(save, challenge.id) : null;
    if (challenge && !progress.started && !progress.completed) {
      setModal({ type: "challengeStart", challenge });
      return;
    }
    closeModal();
  };

  const startChallenge = (challenge) => {
    setSave((current) => challengeManager.start(current, challenge.id));
    audioManager.play("start");
    setModal(null);
    const title = content("challenges", challenge.id, "title", challenge.title, language);
    showToast(t("challengeStarted", language, { title }));
  };

  const returnToMenu = () => {
    audioManager.play("click");
    narrationManager.stop();
    setModal(null);
    setPaused(false);
    setScreen("menu");
  };

  const currentArea = areas[currentAreaId] || areas.sanctuary;

  if (screen === "menu") {
    return (
      <main className="menu-page">
        <section className="title-card">
          <div className="crest">SG</div>
          <p className="eyebrow">{t("cozyScienceAdventure", language)}</p>
          <h1>The Rise of the<br /><span>Scale Guardians</span></h1>
          <p className="menu-copy">{t("menuDescription", language)}</p>
          <div className="menu-guardian-ribbon" aria-label="The six Scale Guardians">
            {Object.entries(snakes).map(([name, snake]) => (
              <img key={name} src={snake.sprite} alt={name} title={name} />
            ))}
          </div>
          <label className="name-field">
            {t("guardianName", language)}
            <input value={playerName} onChange={(event) => setPlayerName(event.target.value)} maxLength={30} placeholder={t("enterName", language)} />
          </label>
          {menuError && <p className="error-text">{t(menuError, language)}</p>}
          <div className="menu-buttons">
            <button className="primary-button" onClick={startGame}>{t("startGame", language)}</button>
            <button onClick={continueGame} disabled={!playerId}>{t("continueGame", language)}</button>
            <button onClick={() => openModal("guide")}>{t("characterGuide", language)}</button>
            <button onClick={() => openModal("storybook")}>{t("storybook", language)}</button>
            <button onClick={() => openModal("settings")}>{t("settings", language)}</button>
          </div>
        </section>
        <div className="menu-guardian-stage" aria-hidden="true">
          {Object.entries(snakes).map(([name, snake], index) => (
            <figure key={name} style={{ "--guardian": snake.theme.primary, "--i": index }}>
              <img src={snake.sprite} alt="" />
              <figcaption>{name}</figcaption>
            </figure>
          ))}
        </div>
        {modal && <Modal modal={modal} save={save} onClose={closeModal} setSave={setSave} onLanguageChange={changeLanguage} resetGame={resetGame} hasPlayer={Boolean(saveService.playerId())} onCraft={craftRecipe} onReturnToCrafting={() => setModal({ type: "crafting" })} onStoryContinue={continueStory} onQuizCorrect={completeQuiz} onQuizContinue={continueQuiz} onStartChallenge={startChallenge} />}
      </main>
    );
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <button className="brand-button" onClick={returnToMenu}>Scale Guardians</button>
        <div className="location">
          <span>{currentArea.guardian
            ? t("requiredGuardian", language, { guardian: currentArea.guardian })
            : t("anyGuardianWelcome", language)}
          </span>
          <strong>{areaName(currentArea.name, language)}</strong>
        </div>
        <div className="header-actions">
          <span className={`save-state ${saveStatus === "saveFailed" ? "bad" : ""}`}>{t(saveStatus, language)}</span>
          <button onClick={() => openModal("storybook")}>{t("storybook", language)}</button>
          <button onClick={() => openModal("settings")}>{t("settings", language)}</button>
          <button className="pause-button" onClick={() => setPaused(true)}>{t("pause", language)}</button>
        </div>
      </header>

      <section className="game-layout">
        <GuardianPanel
          save={save}
          currentAreaId={currentAreaId}
          onSelect={(name) => {
            if (currentAreaId !== "sanctuary") return showToast(t("changeGuardianWarning", language));
            audioManager.play("click");
            setSave((current) => ({ ...current, selectedSnake: name }));
          }}
          onAbility={() => gameRef.current?.useAbility()}
          onGuide={() => openModal("guide")}
        />

        <section className="world-panel">
          <PhaserGame ref={gameRef} save={save} onEvent={handleGameEvent} />
          {worldPrompt && <div className="harvest-prompt">{worldPrompt}</div>}
          {currentAreaId !== "sanctuary" && (
            <button className="return-sanctuary-button" onClick={() => gameRef.current?.returnToSanctuary()}>
              {t("returnToSanctuary", language)}
            </button>
          )}
          <div className="controls-note">{t("controlsNote", language)}</div>
          {sanctuaryCelebration && (
            <div className="sanctuary-upgrade-banner" style={{ "--upgrade": sanctuaryCelebration.color, "--upgrade-soft": sanctuaryCelebration.softColor }}>
              <img src={snakes[sanctuaryCelebration.guardian].sprite} alt="" />
              <span>
                <small>{t("sanctuaryUpgraded", language)}</small>
                <strong>{content("upgrades", sanctuaryCelebration.id, "name", sanctuaryCelebration.name, language)}</strong>
                <em>{content("upgrades", sanctuaryCelebration.id, "story", sanctuaryCelebration.story, language)}</em>
              </span>
            </div>
          )}
          {toast && <div className="toast">{toast}</div>}
        </section>

        <aside className="right-panel panel">
          <WorldMap currentAreaId={currentAreaId} selectedSnake={save.selectedSnake} language={language} />
          <ChallengeTracker challenge={activeChallenge} progress={activeChallengeProgress} language={language} />
          <QuestTracker quest={activeQuest} progress={progress} language={language} />
          <InventoryPanel inventory={save.inventory} language={language} />
          <SanctuaryPanel completed={save.sanctuaryUpgrades} onUpgrade={buyUpgrade} available={currentAreaId === "sanctuary"} inventory={save.inventory} language={language} />
          <EvolutionPanel save={save} profile={selectedEvolutionProfile} onEvolve={evolveSnake} />
        </aside>
      </section>

      {paused && !modal && (
        <PauseMenu
          onResume={() => {
            audioManager.play("click");
            setPaused(false);
          }}
          onSettings={() => openModal("settings")}
          onStorybook={() => openModal("storybook")}
          onGuide={() => openModal("guide")}
          onMainMenu={returnToMenu}
          language={language}
        />
      )}
      {modal && <Modal modal={modal} save={save} onClose={closeModal} setSave={setSave} onLanguageChange={changeLanguage} resetGame={resetGame} hasPlayer={Boolean(saveService.playerId())} onCraft={craftRecipe} onReturnToCrafting={() => setModal({ type: "crafting" })} onStoryContinue={continueStory} onQuizCorrect={completeQuiz} onQuizContinue={continueQuiz} onStartChallenge={startChallenge} />}
    </main>
  );
}
