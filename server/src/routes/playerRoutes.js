import { Router } from "express";

// GRASP Controller: HTTP concerns are translated into service calls here.
export function createPlayerRoutes(playerService) {
  const router = Router();
  router.post("/", (req, res, next) => {
    try {
      res.status(201).json(playerService.create(req.body?.name));
    } catch (error) {
      next(error);
    }
  });
  return router;
}
