import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PhaserGame from "./PhaserGame.jsx";
import { newSave, quests, recipes, snakes, upgrades } from "./gameData.js";
import { areas } from "./data/areas.js";
import { GameState } from "./domain/GameState.js";
import { CraftingManager } from "./domain/CraftingManager.js";
import { QuestManager } from "./domain/QuestManager.js";
import { SanctuaryManager } from "./domain/SanctuaryManager.js";
import { StoryManager } from "./domain/StoryManager.js";
import { ApiClient } from "./services/ApiClient.js";
import { SaveService } from "./services/SaveService.js";
import { EvolutionPanel } from "./components/EvolutionPanel.jsx";
import { GuardianPanel } from "./components/GuardianPanel.jsx";
import { InventoryPanel } from "./components/InventoryPanel.jsx";
import { Modal } from "./components/Modal.jsx";
import { PauseMenu } from "./components/PauseMenu.jsx";
import { QuestTracker } from "./components/QuestTracker.jsx";
import { SanctuaryPanel } from "./components/SanctuaryPanel.jsx";
import { audioManager } from "./services/AudioManager.js";
import { WorldMap } from "./components/WorldMap.jsx";

function mergeSave(value) {
  const base = newSave(value?.playerName);
  const positionsByArea = { ...base.positionsByArea, ...value?.positionsByArea };
  const oldSanctuaryDefault = positionsByArea.sanctuary?.x === 550 && positionsByArea.sanctuary?.y === 430;
  if (oldSanctuaryDefault) positionsByArea.sanctuary = base.positionsByArea.sanctuary;
  return {
    ...base,
    ...value,
    position: (value?.currentArea || base.currentArea) === "sanctuary" && value?.position?.x === 550 && value?.position?.y === 430
      ? base.position
      : (value?.position || base.position),
    inventory: { ...base.inventory, ...value?.inventory },
    positionsByArea,
    unlockedRecipes: value?.unlockedRecipes || base.unlockedRecipes,
    craftingStoriesSeen: value?.craftingStoriesSeen || base.craftingStoriesSeen,
    snakeEvolutionStatus: { ...base.snakeEvolutionStatus, ...value?.snakeEvolutionStatus },
    settings: { ...base.settings, ...value?.settings }
  };
}

const questManager = new QuestManager(quests);
const sanctuaryManager = new SanctuaryManager(upgrades);
const storyManager = new StoryManager();
const craftingManager = new CraftingManager(recipes);
const saveService = new SaveService(new ApiClient());

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [playerId, setPlayerId] = useState(() => saveService.playerId());
  const [save, setSave] = useState(() => newSave());
  const [playerName, setPlayerName] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [currentAreaId, setCurrentAreaId] = useState("sanctuary");
  const [worldPrompt, setWorldPrompt] = useState("");
  const [sanctuaryCelebration, setSanctuaryCelebration] = useState(null);
  const [saveStatus, setSaveStatus] = useState("Not saved");
  const [menuError, setMenuError] = useState("");
  const [paused, setPaused] = useState(false);
  const gameRef = useRef(null);
  const saveTimer = useRef(null);
  const celebrationTimer = useRef(null);
  const loadedRef = useRef(false);

  const activeQuest = useMemo(
    () => questManager.active(save.completedQuests),
    [save.completedQuests]
  );
  const progress = Math.min(questManager.progress(activeQuest, save), activeQuest.target.count);

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(""), 2600);
  }, []);

  useEffect(() => () => window.clearTimeout(celebrationTimer.current), []);

  const openModal = useCallback((type) => {
    audioManager.play("click");
    setModal({ type });
  }, []);

  const closeModal = useCallback(() => {
    audioManager.play("click");
    setModal(null);
  }, []);

  const startGame = async () => {
    const name = playerName.trim();
    if (!name) {
      setMenuError("Please name your guardian first.");
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
      setMenuError("The save service is not available. Make sure the server is running.");
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
      setMenuError("That local save could not be loaded. Start a new adventure.");
    }
  };

  const resetGame = async () => {
    if (!playerId) return;
    let data;
    try {
      data = await saveService.reset(playerId);
    } catch {
      return showToast("Reset could not be completed.");
    }
    setSave(mergeSave(data.save));
    setModal(null);
    audioManager.play("upgrade");
    showToast("A fresh sanctuary adventure has begun.");
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
    setSaveStatus("Saving...");
    saveTimer.current = window.setTimeout(async () => {
      try {
        await saveService.save(playerId, save);
        setSaveStatus("Saved");
      } catch {
        setSaveStatus("Save failed");
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
      showToast(`Found ${event.item.name}!`);
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
      if (event.harvested) showToast(`${event.name} harvested ${event.harvested}!`);
      else showToast(`${event.name}! Move near a resource to harvest.`);
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
    if (event.type === "area" && event.area) {
      setCurrentAreaId(event.area.id);
      setSave((current) => ({ ...current, currentArea: event.area.id }));
      setSave((current) => {
        const result = new GameState(current, sanctuaryManager, storyManager).discover(event.storyScene);
        if (result.discovered) {
          audioManager.play("story");
          setModal({ type: "story", biome: event.storyScene });
        }
        return result.save;
      });
    }
    if (event.type === "pause") {
      audioManager.play("pause");
      if (modal) setModal(null);
      else setPaused((current) => !current);
    }
  }, [showToast, modal]);

  const buyUpgrade = (upgrade) => {
    if (currentAreaId !== "sanctuary") return showToast("Return to the Sanctuary to complete this repair.");
    const next = new GameState(save, sanctuaryManager, storyManager).purchaseUpgrade(upgrade.id);
    if (!next) return showToast("Craft the required guardian relic at the Workbench first.");
    setSave(next);
    audioManager.play("upgrade");
    setSanctuaryCelebration(upgrade);
    window.clearTimeout(celebrationTimer.current);
    celebrationTimer.current = window.setTimeout(() => setSanctuaryCelebration(null), 3400);
  };

  const craftRecipe = (recipe) => {
    const result = new GameState(save, sanctuaryManager, storyManager, craftingManager).craft(recipe.id);
    if (!result) return showToast("You are still missing some recipe materials.");
    setSave(result.save);
    audioManager.play("craft");
    if (result.firstCraft) {
      audioManager.play("story");
      setModal({ type: "craftingStory", recipe: result.recipe });
    } else {
      showToast(`${recipe.name} crafted!`);
    }
  };

  const evolveSnake = (name) => {
    const next = new GameState(save, sanctuaryManager, storyManager).evolve(name);
    if (!next) return showToast("Complete 3 upgrades and restore the elemental shrine first.");
    setSave(next);
    audioManager.play("evolve");
    setModal({ type: "evolution", snakeName: name });
  };

  const returnToMenu = () => {
    audioManager.play("click");
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
          <p className="eyebrow">A cozy science adventure</p>
          <h1>The Rise of the<br /><span>Scale Guardians</span></h1>
          <p className="menu-copy">Explore a painted world, heal seven habitats, and help six tiny elemental snakes grow into legendary guardians.</p>
          <div className="menu-guardian-ribbon" aria-label="The six Scale Guardians">
            {Object.entries(snakes).map(([name, snake]) => (
              <img key={name} src={snake.sprite} alt={name} title={name} />
            ))}
          </div>
          <label className="name-field">
            Guardian name
            <input value={playerName} onChange={(event) => setPlayerName(event.target.value)} maxLength={30} placeholder="Enter your name" />
          </label>
          {menuError && <p className="error-text">{menuError}</p>}
          <div className="menu-buttons">
            <button className="primary-button" onClick={startGame}>Start Game</button>
            <button onClick={continueGame} disabled={!playerId}>Continue Game</button>
            <button onClick={() => openModal("guide")}>Character Guide</button>
            <button onClick={() => openModal("storybook")}>Storybook</button>
            <button onClick={() => openModal("settings")}>Settings</button>
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
        {modal && <Modal modal={modal} save={save} onClose={closeModal} setSave={setSave} resetGame={resetGame} hasPlayer={Boolean(saveService.playerId())} onCraft={craftRecipe} onReturnToCrafting={() => setModal({ type: "crafting" })} />}
      </main>
    );
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <button className="brand-button" onClick={returnToMenu}>Scale Guardians</button>
        <div className="location">
          <span>{currentArea.guardian ? `Required: ${currentArea.guardian}` : "Any guardian welcome"}</span>
          <strong>{currentArea.name}</strong>
        </div>
        <div className="header-actions">
          <span className={`save-state ${saveStatus === "Save failed" ? "bad" : ""}`}>{saveStatus}</span>
          <button onClick={() => openModal("storybook")}>Storybook</button>
          <button onClick={() => openModal("settings")}>Settings</button>
          <button className="pause-button" onClick={() => setPaused(true)}>Pause</button>
        </div>
      </header>

      <section className="game-layout">
        <GuardianPanel
          save={save}
          currentAreaId={currentAreaId}
          onSelect={(name) => {
            if (currentAreaId !== "sanctuary") return showToast("Return to the Sanctuary to change guardians.");
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
              Return to Sanctuary
            </button>
          )}
          <div className="controls-note">Move: WASD / arrows &middot; Harvest: Space &middot; Interact: E &middot; Pause: Esc or P</div>
          {sanctuaryCelebration && (
            <div className="sanctuary-upgrade-banner" style={{ "--upgrade": sanctuaryCelebration.color, "--upgrade-soft": sanctuaryCelebration.softColor }}>
              <img src={snakes[sanctuaryCelebration.guardian].sprite} alt="" />
              <span>
                <small>Sanctuary Upgraded!</small>
                <strong>{sanctuaryCelebration.name}</strong>
                <em>{sanctuaryCelebration.story}</em>
              </span>
            </div>
          )}
          {toast && <div className="toast">{toast}</div>}
        </section>

        <aside className="right-panel panel">
          <WorldMap currentAreaId={currentAreaId} selectedSnake={save.selectedSnake} />
          <QuestTracker quest={activeQuest} progress={progress} />
          <InventoryPanel inventory={save.inventory} />
          <SanctuaryPanel completed={save.sanctuaryUpgrades} onUpgrade={buyUpgrade} available={currentAreaId === "sanctuary"} />
          <EvolutionPanel save={save} onEvolve={evolveSnake} />
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
        />
      )}
      {modal && <Modal modal={modal} save={save} onClose={closeModal} setSave={setSave} resetGame={resetGame} hasPlayer={Boolean(saveService.playerId())} onCraft={craftRecipe} onReturnToCrafting={() => setModal({ type: "crafting" })} />}
    </main>
  );
}
