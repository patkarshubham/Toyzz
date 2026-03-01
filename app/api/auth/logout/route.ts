import { NextResponse } from "next/server";
import { clearUserSessionCookie } from "@/app/lib/user-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearUserSessionCookie(response);
  return response;
}

