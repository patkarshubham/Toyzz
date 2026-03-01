import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-api-auth";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function isFileLike(
  value: FormDataEntryValue | null,
): value is File {
  return (
    !!value &&
    typeof value === "object" &&
    "name" in value &&
    "size" in value &&
    "type" in value &&
    "arrayBuffer" in value &&
    typeof (value as { arrayBuffer: unknown }).arrayBuffer === "function"
  );
}

function extensionFromFile(file: File) {
  const byType: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };

  if (byType[file.type]) return byType[file.type];

  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "png";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "jpg";
  if (name.endsWith(".webp")) return "webp";
  if (name.endsWith(".svg")) return "svg";
  return "bin";
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const type = formData.get("type");
    const file = formData.get("file");

    if (type !== "category" && type !== "product") {
      return NextResponse.json(
        { success: false, message: "Invalid upload type." },
        { status: 400 },
      );
    }

    if (!isFileLike(file)) {
      return NextResponse.json(
        { success: false, message: "File is required." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only PNG, JPG, WEBP, and SVG images are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 5MB." },
        { status: 400 },
      );
    }

    const ext = extensionFromFile(file);
    const folder = type === "category" ? "categories" : "products";
    const fileName = `${Date.now()}-${randomUUID()}.${ext}`;

    const absoluteDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(absoluteDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const filePath = path.join(absoluteDir, fileName);
    await writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json({
      success: true,
      data: {
        url: `/uploads/${folder}/${fileName}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    );
  }
}
