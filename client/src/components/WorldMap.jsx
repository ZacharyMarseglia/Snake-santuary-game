import { areaList } from "../data/areas.js";
import { snakes } from "../data/snakes.js";
import { areaName, t } from "../i18n/localization.js";

export function WorldMap({ currentAreaId, selectedSnake, language = "en" }) {
  return (
    <section className="world-map-section">
      <div className="section-heading"><h2>{t("worldMap", language)}</h2><span>{t("areaCount", language, { count: 7 })}</span></div>
      <div className="world-map-grid">
        {areaList.map((area) => {
          const guardian = area.guardian ? snakes[area.guardian] : null;
          const active = area.id === currentAreaId;
          const accessible = !area.guardian || area.guardian === selectedSnake;
          return (
            <div
              key={area.id}
              className={`map-location ${active ? "active" : ""} ${accessible ? "" : "locked"}`}
              style={{
                "--area": guardian?.theme.primary || "#d5b95f",
                "--area-soft": guardian?.theme.soft || "#f7ebbd"
              }}
            >
              {guardian ? <img src={guardian.sprite} alt="" /> : <span className="home-rune">SG</span>}
              <small>{areaName(area.name.replace(" / Home Base", ""), language)}</small>
            </div>
          );
        })}
      </div>
      <p className="map-help">{t("mapHelp", language)}</p>
    </section>
  );
}
