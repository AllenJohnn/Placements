import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ITeam extends Document {
  name: string;
  inviteCode: string;
  inviteCodeExpiresAt?: Date;
  members: Array<{
    userId: ObjectId;
    role: "admin" | "member";
    joinedAt: Date;
  }>;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
    inviteCodeExpiresAt: { type: Date },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["admin", "member"], default: "member" },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Team = mongoose.model<ITeam>("Team", teamSchema);
