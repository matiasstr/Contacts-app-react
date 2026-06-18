import { Schema } from 'mongoose';

export const ContactSchema = new Schema(
  {
    ownerId: { type: String, index: true, required: true },
    firstName: { type: String, index: true, required: true },
    lastName: { type: String, index: true, required: true },
    email: { type: String, index: true },
    phone: { type: String },
    company: { type: String },
    jobTitle: { type: String },
    notes: { type: String },
    isFavorite: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);
