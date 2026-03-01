import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/app/lib/mongodb";
import { setUserSessionCookie } from "@/app/lib/user-auth";
import { UserModel } from "@/app/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({ email });
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 },
      );
    }

    user.lastLoginAt = new Date();
    await user.save();

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          phone: user.phone || "",
        },
      },
    });

    setUserSessionCookie(response, {
      userId: String(user._id),
      name: user.name,
      email: user.email,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      },
      { status: 500 },
    );
  }
}

