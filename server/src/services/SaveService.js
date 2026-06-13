import { createDefaultSave } from "../defaultSave.js";

// GRASP Pure Fabrication/Indirection: routes never know SQL or save serialization details.
export class SaveService {
  constructor(playerRepository, saveRepository) {
    this.players = playerRepository;
    this.saves = saveRepository;
  }

  requirePlayer(playerId) {
    const player = this.players.findById(playerId);
    if (!player) throw Object.assign(new Error("Player not found."), { status: 404 });
    return player;
  }

  load(playerId) {
    const player = this.requirePlayer(playerId);
    const record = this.saves.findByPlayerId(player.id);
    return {
      playerId: player.id,
      save: record?.save || createDefaultSave(player.name),
      updatedAt: record?.updatedAt || null
    };
  }

  save(playerId, candidate) {
    const player = this.requirePlayer(playerId);
    if (!candidate || typeof candidate !== "object") {
      throw Object.assign(new Error("A save object is required."), { status: 400 });
    }
    const save = { ...candidate, playerName: player.name, updatedAt: new Date().toISOString() };
    this.saves.put(player.id, save);
    return { ok: true, playerId: player.id, save };
  }

  reset(playerId) {
    const player = this.requirePlayer(playerId);
    this.saves.delete(player.id);
    const save = createDefaultSave(player.name);
    this.saves.put(player.id, save);
    return { ok: true, playerId: player.id, save };
  }
}
