import { Router } from "express";
import {
  createProject,
  getProjectsByTeam,
  getProject,
  deleteProject,
} from "@/controllers/projectController.js";
import { authMiddleware } from "@/middleware/authMiddleware.js";
import { roleMiddleware } from "@/middleware/roleMiddleware.js";

const router = Router();

router.post("/", authMiddleware, roleMiddleware("admin"), createProject);
router.get("/team/:teamId", authMiddleware, getProjectsByTeam);
router.get("/:id", authMiddleware, getProject);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteProject);

export default router;
