import { areaList } from "../data/areas.js";
import { snakes } from "../data/snakes.js";

export function WorldMap({ currentAreaId, selectedSnake }) {
  return (
    <section className="world-map-section">
      <div className="section-heading"><h2>World Map</h2><span>7 areas</span></div>
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
              <small>{area.name.replace(" / Home Base", "")}</small>
            </div>
          );
        })}
      </div>
      <p className="map-help">Choose a guardian at home, then find their matching gate.</p>
    </section>
  );
}
