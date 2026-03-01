import { Model, Schema, model, models } from "mongoose";

export type CategoryDocument = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, trim: true, maxlength: 500 },
    image: { type: String, trim: true, maxlength: 300 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const CategoryModel =
  (models.Category as Model<CategoryDocument>) ||
  model<CategoryDocument>("Category", categorySchema);

