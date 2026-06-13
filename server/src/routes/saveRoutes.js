import { Router } from "express";

export function createSaveRoutes(saveService) {
  const router = Router();
  router.get("/:playerId", (req, res, next) => {
    try {
      res.json(saveService.load(Number(req.params.playerId)));
    } catch (error) {
      next(error);
    }
  });
  router.post("/:playerId", (req, res, next) => {
    try {
      res.json(saveService.save(Number(req.params.playerId), req.body?.save));
    } catch (error) {
      next(error);
    }
  });
  return router;
}
