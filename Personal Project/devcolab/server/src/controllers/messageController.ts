import { Request, Response } from "express";
import { Message } from "@/models/Message.js";

export async function getMessages(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const messages = await Message.find({ teamId })
      .populate("sender", "name email avatar")
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: "Get messages failed" });
  }
}
