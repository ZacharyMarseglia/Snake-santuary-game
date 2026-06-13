import { guardianAccessMessage } from "../data/areas.js";

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

  enter(areaId, guardianName) {
    const area = this.areas[areaId];
    if (!area) return { ok: false, message: "That path is still hidden." };
    if (!this.canEnter(areaId, guardianName)) {
      return { ok: false, message: guardianAccessMessage(area) };
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

  promptFor(interaction, guardianName) {
    if (!interaction) return "";
    if (interaction.type === "workbench") return "Press E to use the Guardian Workbench.";
    if (interaction.type === "return") return "Press E to return to the Sanctuary.";
    if (!this.canEnter(interaction.targetArea.id, guardianName)) {
      return guardianAccessMessage(interaction.targetArea);
    }
    return `Press E to enter ${interaction.targetArea.name} with ${guardianName}.`;
  }
}

function distanceBetween(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}
