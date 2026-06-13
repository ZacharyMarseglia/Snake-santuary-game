export class PlayerRepository {
  constructor(statements) {
    this.statements = statements;
  }

  create(name) {
    const result = this.statements.createPlayer.run(name);
    return this.findById(Number(result.lastInsertRowid));
  }

  findById(id) {
    return this.statements.getPlayer.get(Number(id)) || null;
  }
}
