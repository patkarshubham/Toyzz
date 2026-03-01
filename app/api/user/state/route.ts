import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { getUserFromRequest } from "@/app/lib/user-auth";
import { OrderModel } from "@/app/models/Order";
import { UserModel } from "@/app/models/User";

function normalizeNumberList(input: unknown) {
  if (!Array.isArray(input)) return [];
  return Array.from(
    new Set(
      input
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item) && item > 0),
    ),
  );
}

function normalizeCart(input: unknown) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => ({
      productId: Number((item as { productId?: number }).productId || 0),
      qty: Number((item as { qty?: number }).qty || 0),
    }))
    .filter((item) => item.productId > 0 && item.qty > 0);
}

type AddressInput = {
  id?: string;
  label?: string;
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isDefault?: boolean;
};

function normalizeAddresses(input: unknown) {
  if (!Array.isArray(input)) return [];
  const addresses = input
    .map((item) => {
      const entry = item as AddressInput;
      return {
        id: entry.id || randomUUID(),
        label: String(entry.label || "Home").trim() || "Home",
        fullName: String(entry.fullName || "").trim(),
        phone: String(entry.phone || "").trim(),
        line1: String(entry.line1 || "").trim(),
        line2: String(entry.line2 || "").trim(),
        city: String(entry.city || "").trim(),
        state: String(entry.state || "").trim(),
        pincode: String(entry.pincode || "").trim(),
        isDefault: Boolean(entry.isDefault),
      };
    })
    .filter(
      (item) =>
        item.fullName &&
        item.phone &&
        item.line1 &&
        item.city &&
        item.state &&
        item.pincode,
    );

  if (addresses.length && !addresses.some((item) => item.isDefault)) {
    addresses[0].isDefault = true;
  }

  return addresses;
}

export async function GET(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findById(authUser.userId).lean();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const orders = await OrderModel.find({
      $or: [{ userId: String(user._id) }, { email: user.email }],
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          phone: user.phone || "",
        },
        wishlist: user.wishlist || [],
        cart: user.cart || [],
        addresses: user.addresses || [],
        orders: orders.map((order) => ({
          id: String(order._id),
          orderNo: order.orderNo,
          total: order.total,
          itemCount: order.itemCount,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
          paymentStatus: order.paymentStatus,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load account.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const payload = await request.json();

    const update: Record<string, unknown> = {};
    if (typeof payload?.name === "string") update.name = payload.name.trim();
    if (typeof payload?.phone === "string") update.phone = payload.phone.trim();
    if (payload?.wishlist) update.wishlist = normalizeNumberList(payload.wishlist);
    if (payload?.cart) update.cart = normalizeCart(payload.cart);
    if (payload?.addresses) update.addresses = normalizeAddresses(payload.addresses);

    const user = await UserModel.findByIdAndUpdate(authUser.userId, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          phone: user.phone || "",
        },
        wishlist: user.wishlist || [],
        cart: user.cart || [],
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to update account.",
      },
      { status: 500 },
    );
  }
}

