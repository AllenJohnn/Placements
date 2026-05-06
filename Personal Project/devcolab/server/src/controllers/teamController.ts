import { Request, Response } from "express";
import { Team } from "@/models/Team.js";
import { User } from "@/models/User.js";
import { generateInviteCode } from "@/utils/inviteCode.js";

export async function createTeam(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name required" });
    }

    const inviteCode = generateInviteCode();
    const team = new Team({
      name,
      inviteCode,
      inviteCodeExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      members: [{ userId: req.userId, role: "admin", joinedAt: new Date() }],
      createdBy: req.userId,
    });

    await team.save();
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Create team failed" });
  }
}

export async function getTeam(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const team = await Team.findById(id)
      .populate("members.userId", "name email avatar")
      .populate("createdBy", "name email");

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Get team failed" });
  }
}

export async function getTeamMembers(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const team = await Team.findById(id).populate("members.userId", "name email avatar");

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    res.json({ success: true, data: team.members });
  } catch (error) {
    res.status(500).json({ success: false, message: "Get members failed" });
  }
}

export async function joinTeam(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { inviteCode } = req.body;
    if (!inviteCode) {
      return res.status(400).json({ success: false, message: "Invite code required" });
    }

    const team = await Team.findOne({ inviteCode });
    if (!team) {
      return res.status(404).json({ success: false, message: "Invalid invite code" });
    }

    if (
      team.inviteCodeExpiresAt &&
      team.inviteCodeExpiresAt < new Date()
    ) {
      return res.status(400).json({ success: false, message: "Invite code expired" });
    }

    const alreadyMember = team.members.some(
      (m) => m.userId.toString() === req.userId
    );
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: "Already a member" });
    }

    team.members.push({
      userId: req.userId as any,
      role: "member",
      joinedAt: new Date(),
    });

    await team.save();
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Join team failed" });
  }
}

export async function removeMember(req: Request, res: Response) {
  try {
    const { id: teamId, uid: userId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    team.members = team.members.filter((m) => m.userId.toString() !== userId);
    await team.save();

    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Remove member failed" });
  }
}

export async function regenerateInvite(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    team.inviteCode = generateInviteCode();
    team.inviteCodeExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await team.save();

    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Regenerate invite failed" });
  }
}

export async function deleteTeam(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    res.json({ success: true, message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete team failed" });
  }
}
