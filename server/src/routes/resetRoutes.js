import { Router } from "express";

export function createResetRoutes(saveService) {
  const router = Router();
  router.post("/:playerId", (req, res, next) => {
    try {
      res.json(saveService.reset(Number(req.params.playerId)));
    } catch (error) {
      next(error);
    }
  });
  return router;
}
