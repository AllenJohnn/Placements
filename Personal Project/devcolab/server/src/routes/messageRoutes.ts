import { Router } from "express";
import { getMessages } from "@/controllers/messageController.js";
import { authMiddleware } from "@/middleware/authMiddleware.js";

const router = Router();

router.get("/:teamId", authMiddleware, getMessages);

export default router;
