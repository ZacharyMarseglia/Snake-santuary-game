import { useMemo, useState } from "react";
import { snakes } from "../data/snakes.js";
import { storyScenes } from "../story/storyScenes.js";
import { ElementJournal } from "./ElementJournal.jsx";
import { NarrationControls } from "./NarrationControls.jsx";
import { areaName, content, t } from "../i18n/localization.js";

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
  const language = save.settings?.language || "en";
  const title = content("stories", selected.name, "title", selected.title, language);
  const story = content("stories", selected.name, "story", selected.story, language);
  const lesson = content("stories", selected.name, "lesson", selected.lesson, language);

  return (
    <div className="storybook-layout">
      <div className="storybook-view-tabs">
        <button type="button" className={view === "stories" ? "active" : ""} onClick={() => setView("stories")}>
          {t("storyChapters", language)}
        </button>
        <button type="button" className={view === "journal" ? "active" : ""} onClick={() => setView("journal")}>
          {t("elementJournal", language)}
        </button>
      </div>
      {view === "journal" ? <ElementJournal language={language} settings={save.settings} /> : (
        <>
      <section className={`storybook-page ${isUnlocked ? "" : "locked"}`}>
        <div className="storybook-image">
          <img src={selected.art} alt={isUnlocked ? title : t("locked", language)} />
          {isUnlocked && (
            <div className="chapter-guardian" style={{ "--guardian": guardian.theme.primary }}>
              <img src={guardian.sprite} alt="" />
              <span>{selected.guardian}</span>
            </div>
          )}
          {!isUnlocked && <div className="chapter-lock">?</div>}
        </div>
        <div className="storybook-copy">
          <p className="eyebrow">{t("chapter", language, { number: storyScenes.indexOf(selected) + 1 })}</p>
          <h3>{isUnlocked ? title : t("undiscovered", language)}</h3>
          <p>{isUnlocked ? story : t("revealPage", language, { place: areaName(selected.name, language) })}</p>
          {isUnlocked && <aside><strong>{t("natureNote", language)}</strong><span>{lesson}</span></aside>}
          {isUnlocked && (
            <NarrationControls
              key={selected.name}
              title={title}
              story={story}
              lesson={lesson}
              settings={save.settings}
            />
          )}
        </div>
      </section>
      <nav className="chapter-strip" aria-label={t("storyChaptersAria", language)}>
        {storyScenes.map((scene, index) => {
          const seen = save.storyScenesSeen.includes(scene.name);
          return (
            <button
              key={scene.name}
              className={`${selected.name === scene.name ? "active" : ""} ${seen ? "" : "locked"}`}
              onClick={() => setSelectedName(scene.name)}
            >
              <img src={scene.art} alt="" />
              <span><b>{index + 1}</b>{seen ? areaName(scene.name, language) : t("locked", language)}</span>
            </button>
          );
        })}
      </nav>
        </>
      )}
      <p className="art-credit">{t("artCredit", language)}</p>
    </div>
  );
}
