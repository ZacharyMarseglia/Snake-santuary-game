import { CharacterGuide } from "./CharacterGuide.jsx";
import { SettingsPanel } from "./SettingsPanel.jsx";
import { Storybook } from "./Storybook.jsx";
import { CraftingPanel } from "./CraftingPanel.jsx";
import { snakes } from "../data/snakes.js";

export function Modal({ modal, save, onClose, setSave, resetGame, hasPlayer, onCraft, onReturnToCrafting }) {
  if (modal.type === "story") {
    return (
      <div className="modal-backdrop"><article className="modal story-modal illustrated-modal">
        <div className="story-hero"><img src={modal.biome.art} alt={`${modal.biome.name} story art`} /></div>
        <div className="story-modal-copy">
          <p className="eyebrow">{modal.biome.name} discovery</p>
          <h2>{modal.biome.title}</h2>
          <p>{modal.biome.story}</p>
          <aside><strong>Nature note</strong><span>{modal.biome.lesson}</span></aside>
          <button className="primary-button" onClick={onClose}>Continue exploring</button>
        </div>
      </article></div>
    );
  }

  if (modal.type === "quest") {
    const guardian = snakes[modal.quest.guardian];
    return (
      <div className="modal-backdrop"><article
        className="modal quest-modal"
        style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
      >
        <div className="quest-complete-art">
          <img src={guardian.sprite} alt={`${modal.quest.guardian}, quest guide`} />
        </div>
        <p className="eyebrow">Quest complete</p>
        <h2>{modal.quest.title}</h2>
        <p>{modal.quest.guardian} helped the sanctuary grow stronger.</p>
        <div className="reward-box">Reward: {Object.entries(modal.quest.reward).map(([name, amount]) => `${amount} ${name}`).join(", ")}</div>
        <button className="primary-button" onClick={onClose}>Collect reward</button>
      </article></div>
    );
  }

  if (modal.type === "evolution") {
    const snake = snakes[modal.snakeName];
    return (
      <div className="modal-backdrop"><article
        className="modal evolution-modal"
        style={{ "--guardian": snake.theme.primary, "--guardian-soft": snake.theme.soft }}
      >
        <p className="eyebrow">Guardian evolution</p>
        <div className="evolution-hero">
          <img src={snake.evolvedSprite} alt={`${snake.evolution}, evolved form of ${modal.snakeName}`} />
        </div>
        <h2>{modal.snakeName} became {snake.evolution}!</h2>
        <p>A stronger elemental form has awakened with a wider pickup reach and a faster ability cooldown.</p>
        <button className="primary-button" onClick={onClose}>Meet {snake.evolution}</button>
      </article></div>
    );
  }

  if (modal.type === "crafting") {
    return (
      <div className="modal-backdrop"><article className="modal crafting-modal">
        <button className="close-button" onClick={onClose} aria-label="Close">x</button>
        <p className="eyebrow">Guardian Workbench</p>
        <h2>Craft Sanctuary Relics</h2>
        <CraftingPanel save={save} onCraft={onCraft} />
      </article></div>
    );
  }

  if (modal.type === "craftingStory") {
    const guardian = snakes[modal.recipe.guardian];
    return (
      <div className="modal-backdrop"><article
        className="modal crafting-story-modal"
        style={{ "--guardian": guardian.theme.primary, "--guardian-soft": guardian.theme.soft }}
      >
        <div className="crafting-story-art"><img src={guardian.sprite} alt={modal.recipe.guardian} /></div>
        <p className="eyebrow">First craft discovered</p>
        <h2>{modal.recipe.name}</h2>
        <p>{modal.recipe.story}</p>
        <aside><strong>Workbench lesson</strong><span>{modal.recipe.lesson}</span></aside>
        <button className="primary-button" onClick={onReturnToCrafting}>Return to the Workbench</button>
      </article></div>
    );
  }

  if (modal.type === "guide") {
    return (
      <div className="modal-backdrop"><article className="modal wide-modal guide-modal">
        <button className="close-button" onClick={onClose} aria-label="Close">x</button>
        <p className="eyebrow">Character guide</p><h2>Meet the Scale Guardians</h2>
        <CharacterGuide save={save} />
      </article></div>
    );
  }

  if (modal.type === "storybook") {
    return (
      <div className="modal-backdrop"><article className="modal storybook-modal">
        <button className="close-button" onClick={onClose} aria-label="Close">x</button>
        <p className="eyebrow">Storybook library</p><h2>Lessons from the seven biomes</h2>
        <Storybook save={save} />
      </article></div>
    );
  }

  return (
    <div className="modal-backdrop"><article className="modal settings-modal">
      <button className="close-button" onClick={onClose} aria-label="Close">x</button>
      <p className="eyebrow">Settings</p><h2>Make the adventure yours</h2>
      <SettingsPanel save={save} setSave={setSave} resetGame={resetGame} hasPlayer={hasPlayer} />
    </article></div>
  );
}
