import { guardianAccessMessage } from "../data/areas.js";
import { areaName, t } from "../i18n/localization.js";

// GRASP Information Expert: area access and portal interaction live with area data.
export class AreaManager {
  constructor(areas, initialAreaId = "sanctuary") {
    this.areas = areas;
    this.currentAreaId = areas[initialAreaId] ? initialAreaId : "sanctuary";
  }

  current() {
    return this.areas[this.currentAreaId];
  }

  canEnter(areaId, guardianName) {
    const area = this.areas[areaId];
    return Boolean(area) && (!area.guardian || area.guardian === guardianName);
  }

  enter(areaId, guardianName, language = "en") {
    const area = this.areas[areaId];
    if (!area) return { ok: false, message: t("pathHidden", language) };
    if (!this.canEnter(areaId, guardianName)) {
      return { ok: false, message: guardianAccessMessage(area, language) };
    }
    this.currentAreaId = areaId;
    return { ok: true, area };
  }

  interactionNear(x, y) {
    const area = this.current();
    if (area.id === "sanctuary") {
      const workbench = area.workbench;
      if (distanceBetween(x, y, workbench.x, workbench.y) <= workbench.radius) {
        return { type: "workbench", ...workbench };
      }
      const gate = area.gates.find((candidate) =>
        distanceBetween(x, y, candidate.x, candidate.y) <= 72
      );
      if (!gate) return null;
      return { type: "gate", targetArea: this.areas[gate.areaId], ...gate };
    }

    const portal = area.returnPortal;
    if (distanceBetween(x, y, portal.x, portal.y) <= portal.radius) {
      return { type: "return", targetArea: this.areas.sanctuary, ...portal };
    }
    return null;
  }

  promptFor(interaction, guardianName, language = "en") {
    if (!interaction) return "";
    if (interaction.type === "workbench") return t("workbenchPrompt", language);
    if (interaction.type === "return") return t("returnPrompt", language);
    if (!this.canEnter(interaction.targetArea.id, guardianName)) {
      return guardianAccessMessage(interaction.targetArea, language);
    }
    return t("enterAreaPrompt", language, {
      area: areaName(interaction.targetArea.name, language),
      guardian: guardianName
    });
  }
}

function distanceBetween(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}
