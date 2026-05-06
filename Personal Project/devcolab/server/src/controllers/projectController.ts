import { Request, Response } from "express";
import { Project } from "@/models/Project.js";

export async function createProject(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { title, description, teamId } = req.body;
    if (!title || !teamId) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const project = new Project({
      title,
      description,
      teamId,
      createdBy: req.userId,
    });

    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Create project failed" });
  }
}

export async function getProjectsByTeam(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const projects = await Project.find({ teamId }).populate(
      "createdBy",
      "name email"
    );

    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Get projects failed" });
  }
}

export async function getProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("createdBy", "name email")
      .populate("teamId", "name");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Get project failed" });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete project failed" });
  }
}
