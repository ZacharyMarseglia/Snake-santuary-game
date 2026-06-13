// GRASP Pure Fabrication: persistence details stay outside React and Phaser.
export class SaveService {
  constructor(apiClient, storage = localStorage) {
    this.api = apiClient;
    this.storage = storage;
    this.playerKey = "scaleGuardiansPlayerId";
  }

  playerId() {
    return this.storage.getItem(this.playerKey);
  }

  async create(name) {
    const result = await this.api.createPlayer(name);
    this.storage.setItem(this.playerKey, result.playerId);
    return result;
  }

  load(playerId) {
    return this.api.load(playerId);
  }

  save(playerId, gameSave) {
    return this.api.save(playerId, gameSave);
  }

  reset(playerId) {
    return this.api.reset(playerId);
  }
}
