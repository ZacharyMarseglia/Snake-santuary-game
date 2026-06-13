import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(directory, "../data");
fs.mkdirSync(dataDirectory, { recursive: true });

export const db = new Database(path.join(dataDirectory, "scale-guardians.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS saves (
    player_id INTEGER PRIMARY KEY,
    save_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
  );
`);

export const statements = {
  createPlayer: db.prepare("INSERT INTO players (name) VALUES (?)"),
  getPlayer: db.prepare("SELECT id, name, created_at AS createdAt FROM players WHERE id = ?"),
  getSave: db.prepare("SELECT save_json AS saveJson, updated_at AS updatedAt FROM saves WHERE player_id = ?"),
  putSave: db.prepare(`
    INSERT INTO saves (player_id, save_json, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(player_id) DO UPDATE SET
      save_json = excluded.save_json,
      updated_at = CURRENT_TIMESTAMP
  `),
  deleteSave: db.prepare("DELETE FROM saves WHERE player_id = ?")
};
