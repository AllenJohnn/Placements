import { Router } from "express";
import {
  createTask,
  getTasksByProject,
  updateTask,
  reorderTask,
  deleteTask,
} from "@/controllers/taskController.js";
import { authMiddleware } from "@/middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createTask);
router.get("/project/:projectId", authMiddleware, getTasksByProject);
router.patch("/:id", authMiddleware, updateTask);
router.patch("/:id/reorder", authMiddleware, reorderTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
