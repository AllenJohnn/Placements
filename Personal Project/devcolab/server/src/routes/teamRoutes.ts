import { Router } from "express";
import {
  createTeam,
  getTeam,
  getTeamMembers,
  joinTeam,
  removeMember,
  regenerateInvite,
  deleteTeam,
} from "@/controllers/teamController.js";
import { authMiddleware } from "@/middleware/authMiddleware.js";
import { roleMiddleware } from "@/middleware/roleMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createTeam);
router.get("/:id", authMiddleware, getTeam);
router.post("/join", authMiddleware, joinTeam);
router.get("/:id/members", authMiddleware, getTeamMembers);
router.delete("/:id/members/:uid", authMiddleware, roleMiddleware("admin"), removeMember);
router.post("/:id/regenerate-invite", authMiddleware, roleMiddleware("admin"), regenerateInvite);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteTeam);

export default router;
