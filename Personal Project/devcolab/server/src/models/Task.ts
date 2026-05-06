import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  assignedTo?: ObjectId;
  deadline?: Date;
  projectId: ObjectId;
  createdBy: ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    deadline: { type: Date },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
