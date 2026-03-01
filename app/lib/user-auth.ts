import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type UserJwtPayload = {
  userId: string;
  email: string;
  name: string;
};

export const USER_SESSION_COOKIE = "pinetoyzz_user_session";

const USER_AUTH_SECRET =
  process.env.USER_AUTH_SECRET ||
  process.env.ADMIN_API_KEY ||
  "dev-user-auth-secret-change-me";

export function signUserToken(payload: UserJwtPayload) {
  return jwt.sign(payload, USER_AUTH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyUserToken(token: string) {
  try {
    return jwt.verify(token, USER_AUTH_SECRET) as UserJwtPayload;
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export function setUserSessionCookie(
  response: NextResponse,
  payload: UserJwtPayload,
) {
  const token = signUserToken(payload);
  response.cookies.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearUserSessionCookie(response: NextResponse) {
  response.cookies.set(USER_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

