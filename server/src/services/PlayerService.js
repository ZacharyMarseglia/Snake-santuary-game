import { createDefaultSave } from "../defaultSave.js";

// GRASP Creator: player setup creates the closely related initial save.
export class PlayerService {
  constructor(playerRepository, saveRepository) {
    this.players = playerRepository;
    this.saves = saveRepository;
  }

  create(rawName) {
    const name = String(rawName || "").trim().slice(0, 30);
    if (!name) throw Object.assign(new Error("Player name is required."), { status: 400 });
    const player = this.players.create(name);
    const save = createDefaultSave(name);
    this.saves.put(player.id, save);
    return { playerId: player.id, save };
  }
}
