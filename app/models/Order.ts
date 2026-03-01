import { Model, Schema, model, models } from "mongoose";

type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  qty: number;
  price: number;
};

export type OrderDocument = {
  userId?: string;
  orderNo: string;
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: "cod" | "upi" | "card";
  paymentStatus: "pending" | "paid" | "failed";
  fulfillmentType: "delivery" | "pickup";
  orderStatus:
    | "processing"
    | "packed"
    | "in_transit"
    | "ready_for_pickup"
    | "delivered"
    | "picked_up"
    | "cancelled";
  createdAt: Date;
  updatedAt: Date;
};

const orderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: String, trim: true },
    orderNo: { type: String, required: true, unique: true, trim: true },
    customerName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    addressLine1: { type: String, required: true, trim: true, maxlength: 200 },
    addressLine2: { type: String, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    pincode: { type: String, required: true, trim: true, maxlength: 12 },
    items: { type: [orderItemSchema], required: true, default: [] },
    itemCount: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 1 },
    shippingFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
    paymentMethod: { type: String, enum: ["cod", "upi", "card"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: true,
    },
    fulfillmentType: { type: String, enum: ["delivery", "pickup"], required: true },
    orderStatus: {
      type: String,
      enum: [
        "processing",
        "packed",
        "in_transit",
        "ready_for_pickup",
        "delivered",
        "picked_up",
        "cancelled",
      ],
      default: "processing",
      required: true,
    },
  },
  { timestamps: true },
);

orderSchema.index({ orderNo: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

export const OrderModel =
  (models.Order as Model<OrderDocument>) || model<OrderDocument>("Order", orderSchema);
