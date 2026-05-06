import { Request, Response, NextFunction } from "express";
import { Team } from "@/models/Team.js";

export async function roleMiddleware(requiredRole: "admin" | "member") {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { teamId } = req.params;
      if (!req.userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const team = await Team.findById(teamId);
      if (!team) {
        return res
          .status(404)
          .json({ success: false, message: "Team not found" });
      }

      const member = team.members.find((m) => m.userId.toString() === req.userId);
      if (!member) {
        return res.status(403).json({ success: false, message: "Not a member" });
      }

      if (requiredRole === "admin" && member.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Admin access required" });
      }

      next();
    } catch (error) {
      res.status(500).json({ success: false, message: "Role check failed" });
    }
  };
}
