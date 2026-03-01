import { NextRequest } from "next/server";

function getAdminToken(request: NextRequest) {
  const headerToken = request.headers.get("x-admin-token");
  if (headerToken) return headerToken;

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return "";

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return "";
  return token || "";
}

export function isAdminRequest(request: NextRequest) {
  const expectedToken = process.env.ADMIN_API_KEY;
  if (!expectedToken) return false;
  return getAdminToken(request) === expectedToken;
}

