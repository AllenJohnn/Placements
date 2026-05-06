import { Request, Response } from "express";
import { Task } from "@/models/Task.js";

export async function createTask(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { title, description, assignedTo, deadline, projectId } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const maxOrder = await Task.findOne({ projectId })
      .sort({ order: -1 })
      .select("order");

    const task = new Task({
      title,
      description,
      assignedTo,
      deadline,
      projectId,
      createdBy: req.userId,
      order: (maxOrder?.order || 0) + 1,
      status: "todo",
    });

    await task.save();
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Create task failed" });
  }
}

export async function getTasksByProject(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email")
      .sort({ status: 1, order: 1 });

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Get tasks failed" });
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo, deadline } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status, assignedTo, deadline, updatedAt: new Date() },
      { new: true }
    )
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update task failed" });
  }
}

export async function reorderTask(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { newStatus, newOrder } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { status: newStatus, order: newOrder, updatedAt: new Date() },
      { new: true }
    )
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Reorder task failed" });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete task failed" });
  }
}
