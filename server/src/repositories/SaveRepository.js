export class SaveRepository {
  constructor(statements) {
    this.statements = statements;
  }

  findByPlayerId(playerId) {
    const row = this.statements.getSave.get(playerId);
    return row ? { save: JSON.parse(row.saveJson), updatedAt: row.updatedAt } : null;
  }

  put(playerId, save) {
    this.statements.putSave.run(playerId, JSON.stringify(save));
    return save;
  }

  delete(playerId) {
    this.statements.deleteSave.run(playerId);
  }
}
