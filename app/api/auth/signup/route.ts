import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/app/lib/mongodb";
import { setUserSessionCookie } from "@/app/lib/user-auth";
import { UserModel } from "@/app/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const password = String(body?.password || "");

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const exists = await UserModel.findOne({ email }).lean();
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Email is already registered." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await UserModel.create({
      name,
      email,
      phone: phone || undefined,
      passwordHash,
      wishlist: [],
      cart: [],
      addresses: [],
      isActive: true,
      lastLoginAt: new Date(),
    });

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: String(created._id),
          name: created.name,
          email: created.email,
          phone: created.phone || "",
        },
      },
    });

    setUserSessionCookie(response, {
      userId: String(created._id),
      name: created.name,
      email: created.email,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Signup failed",
      },
      { status: 500 },
    );
  }
}

