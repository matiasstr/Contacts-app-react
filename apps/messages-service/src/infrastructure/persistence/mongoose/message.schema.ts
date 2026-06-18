import { Schema } from 'mongoose';

export const MessageSchema = new Schema(
  {
    from: { type: String, required: true, index: true },
    to: { type: String, required: true, index: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);
