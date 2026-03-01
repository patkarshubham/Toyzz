import { Model, Schema, model, models } from "mongoose";

type UserCartItem = {
  productId: number;
  qty: number;
};

type UserAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export type UserDocument = {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  wishlist: number[];
  cart: UserCartItem[];
  addresses: UserAddress[];
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const userCartItemSchema = new Schema<UserCartItem>(
  {
    productId: { type: Number, required: true, min: 1 },
    qty: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
);

const userAddressSchema = new Schema<UserAddress>(
  {
    id: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true, maxlength: 40 },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    line1: { type: String, required: true, trim: true, maxlength: 180 },
    line2: { type: String, trim: true, maxlength: 180 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    pincode: { type: String, required: true, trim: true, maxlength: 12 },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true, maxlength: 20 },
    passwordHash: { type: String, required: true, trim: true },
    wishlist: [{ type: Number, min: 1 }],
    cart: { type: [userCartItemSchema], default: [] },
    addresses: { type: [userAddressSchema], default: [] },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export const UserModel =
  (models.User as Model<UserDocument>) || model<UserDocument>("User", userSchema);

