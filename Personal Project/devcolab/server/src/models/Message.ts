import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IMessage extends Document {
  sender: ObjectId;
  teamId: ObjectId;
  content: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model<IMessage>("Message", messageSchema);
