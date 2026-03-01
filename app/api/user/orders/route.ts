import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { getUserFromRequest } from "@/app/lib/user-auth";
import { OrderModel } from "@/app/models/Order";
import { UserModel } from "@/app/models/User";

type OrderRequestItem = {
  productId: number;
  slug: string;
  name: string;
  qty: number;
  price: number;
};

function makeOrderNo() {
  const seed = Date.now().toString().slice(-8);
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `PTZ${seed}${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const payload = await request.json();
    const items = Array.isArray(payload?.items) ? (payload.items as OrderRequestItem[]) : [];

    if (!items.length) {
      return NextResponse.json(
        { success: false, message: "No cart items found for order." },
        { status: 400 },
      );
    }

    const user = await UserModel.findById(authUser.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const address = payload?.address || {};
    const fullName = String(address?.fullName || user.name || "").trim();
    const phone = String(address?.phone || user.phone || "").trim();
    const line1 = String(address?.line1 || "").trim();
    const city = String(address?.city || "").trim();
    const state = String(address?.state || "").trim();
    const pincode = String(address?.pincode || "").trim();

    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, message: "Complete address is required to place order." },
        { status: 400 },
      );
    }

    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);
    const shippingFee = subtotal > 3000 ? 0 : 99;
    const total = subtotal + shippingFee;
    const itemCount = items.reduce((sum, item) => sum + Number(item.qty), 0);

    const order = await OrderModel.create({
      userId: String(user._id),
      orderNo: makeOrderNo(),
      customerName: fullName,
      email: user.email,
      phone,
      addressLine1: line1,
      addressLine2: String(address?.line2 || "").trim() || undefined,
      city,
      state,
      pincode,
      items: items.map((item) => ({
        productId: String(item.productId),
        slug: String(item.slug || ""),
        name: String(item.name || ""),
        qty: Number(item.qty || 1),
        price: Number(item.price || 0),
      })),
      itemCount,
      subtotal,
      shippingFee,
      total,
      paymentMethod: "cod",
      paymentStatus: "pending",
      fulfillmentType: "delivery",
      orderStatus: "processing",
    });

    user.cart = [];
    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        orderNo: order.orderNo,
        orderId: String(order._id),
      },
      message: "Order placed successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Order placement failed.",
      },
      { status: 500 },
    );
  }
}

