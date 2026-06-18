import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    firebaseUid: { type: String, index: true, sparse: true },
    email: { type: String, unique: true, required: true },
    displayName: { type: String },
    photoUrl: { type: String },
    authProvider: { type: String, default: 'local' },
  },
  { timestamps: true },
);
