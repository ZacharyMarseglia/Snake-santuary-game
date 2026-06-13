import cors from "cors";
import express from "express";
import { statements } from "./db.js";
import { PlayerRepository } from "./repositories/PlayerRepository.js";
import { SaveRepository } from "./repositories/SaveRepository.js";
import { createPlayerRoutes } from "./routes/playerRoutes.js";
import { createResetRoutes } from "./routes/resetRoutes.js";
import { createSaveRoutes } from "./routes/saveRoutes.js";
import { PlayerService } from "./services/PlayerService.js";
import { SaveService } from "./services/SaveService.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors({
  origin: ["http://localhost:5175", "http://127.0.0.1:5175", "http://localhost:5173"]
}));
app.use(express.json({ limit: "1mb" }));

const playerRepository = new PlayerRepository(statements);
const saveRepository = new SaveRepository(statements);
const playerService = new PlayerService(playerRepository, saveRepository);
const saveService = new SaveService(playerRepository, saveRepository);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, game: "The Rise of the Scale Guardians" });
});

app.use("/api/player", createPlayerRoutes(playerService));
app.use("/api/save", createSaveRoutes(saveService));
app.use("/api/reset", createResetRoutes(saveService));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.status ? err.message : "The sanctuary records could not be updated." });
});

app.listen(port, () => {
  console.log(`Scale Guardians server listening on http://localhost:${port}`);
});
