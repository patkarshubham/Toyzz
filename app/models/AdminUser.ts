import { Model, Schema, model, models } from "mongoose";

export type AdminUserDocument = {
  name: string;
  email: string;
  passwordHash: string;
  role: "super_admin" | "manager";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const adminUserSchema = new Schema<AdminUserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, trim: true },
    role: { type: String, enum: ["super_admin", "manager"], default: "manager" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const AdminUserModel =
  (models.AdminUser as Model<AdminUserDocument>) ||
  model<AdminUserDocument>("AdminUser", adminUserSchema);

