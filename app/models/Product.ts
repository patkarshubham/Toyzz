import { Model, Schema, model, models } from "mongoose";

export type ProductDocument = {
  legacyId?: number;
  name: string;
  slug: string;
  image: string;
  category: string;
  ageGroup: string;
  mrp: number;
  offerPrice: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  material: string;
  finish: string;
  dimensions: string;
  weight: string;
  inTheBox: string[];
  features: string[];
  safety: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const productSchema = new Schema<ProductDocument>(
  {
    legacyId: { type: Number, min: 1 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    image: { type: String, required: true, trim: true, maxlength: 400 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    ageGroup: { type: String, required: true, trim: true, maxlength: 40 },
    mrp: { type: Number, required: true, min: 1 },
    offerPrice: { type: Number, required: true, min: 1 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    shortDescription: { type: String, required: true, trim: true, maxlength: 220 },
    description: { type: String, required: true, trim: true, maxlength: 1200 },
    material: { type: String, required: true, trim: true, maxlength: 100 },
    finish: { type: String, required: true, trim: true, maxlength: 120 },
    dimensions: { type: String, required: true, trim: true, maxlength: 80 },
    weight: { type: String, required: true, trim: true, maxlength: 40 },
    inTheBox: [{ type: String, trim: true, maxlength: 100 }],
    features: [{ type: String, trim: true, maxlength: 100 }],
    safety: [{ type: String, trim: true, maxlength: 100 }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ category: 1 });
productSchema.index({ offerPrice: 1 });
productSchema.index({ legacyId: 1 });

export const ProductModel =
  (models.Product as Model<ProductDocument>) ||
  model<ProductDocument>("Product", productSchema);
