import { useMemo, useState } from "react";
import { snakes } from "../data/snakes.js";
import { storyScenes } from "../story/storyScenes.js";
import { ElementJournal } from "./ElementJournal.jsx";
import { NarrationControls } from "./NarrationControls.jsx";

export function Storybook({ save }) {
  const [view, setView] = useState("stories");
  const unlocked = useMemo(
    () => storyScenes.filter((scene) => save.storyScenesSeen.includes(scene.name)),
    [save.storyScenesSeen]
  );
  const [selectedName, setSelectedName] = useState(unlocked[0]?.name || storyScenes[0].name);
  const selected = storyScenes.find((scene) => scene.name === selectedName) || storyScenes[0];
  const isUnlocked = save.storyScenesSeen.includes(selected.name);
  const guardian = snakes[selected.guardian];

  return (
    <div className="storybook-layout">
      <div className="storybook-view-tabs">
        <button type="button" className={view === "stories" ? "active" : ""} onClick={() => setView("stories")}>
          Story Chapters
        </button>
        <button type="button" className={view === "journal" ? "active" : ""} onClick={() => setView("journal")}>
          Element Journal
        </button>
      </div>
      {view === "journal" ? <ElementJournal /> : (
        <>
      <section className={`storybook-page ${isUnlocked ? "" : "locked"}`}>
        <div className="storybook-image">
          <img src={selected.art} alt={isUnlocked ? selected.title : "Locked story chapter"} />
          {isUnlocked && (
            <div className="chapter-guardian" style={{ "--guardian": guardian.theme.primary }}>
              <img src={guardian.sprite} alt="" />
              <span>{selected.guardian}</span>
            </div>
          )}
          {!isUnlocked && <div className="chapter-lock">?</div>}
        </div>
        <div className="storybook-copy">
          <p className="eyebrow">Chapter {storyScenes.indexOf(selected) + 1}</p>
          <h3>{isUnlocked ? selected.title : "An undiscovered tale"}</h3>
          <p>{isUnlocked ? selected.story : `Travel to ${selected.name} to reveal this page.`}</p>
          {isUnlocked && <aside><strong>Nature note</strong><span>{selected.lesson}</span></aside>}
          {isUnlocked && (
            <NarrationControls
              key={selected.name}
              title={selected.title}
              story={selected.story}
              lesson={selected.lesson}
              settings={save.settings}
            />
          )}
        </div>
      </section>
      <nav className="chapter-strip" aria-label="Story chapters">
        {storyScenes.map((scene, index) => {
          const seen = save.storyScenesSeen.includes(scene.name);
          return (
            <button
              key={scene.name}
              className={`${selected.name === scene.name ? "active" : ""} ${seen ? "" : "locked"}`}
              onClick={() => setSelectedName(scene.name)}
            >
              <img src={scene.art} alt="" />
              <span><b>{index + 1}</b>{seen ? scene.name : "Locked"}</span>
            </button>
          );
        })}
      </nav>
        </>
      )}
      <p className="art-credit">Story scenes and guardian portraits follow the supplied Scale Guardians reference artwork.</p>
    </div>
  );
}
