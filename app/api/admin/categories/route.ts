import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-api-auth";
import { connectToDatabase } from "@/app/lib/mongodb";
import { toSlug } from "@/app/lib/slugify";
import { CategoryModel } from "@/app/models/Category";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const categories = await CategoryModel.find().sort({ sortOrder: 1, name: 1 }).lean();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to fetch categories",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const payload = await request.json();

    const name = String(payload?.name || "").trim();
    const slug = toSlug(String(payload?.slug || name));
    const description = String(payload?.description || "").trim();
    const image = String(payload?.image || "").trim();
    const sortOrder = Number(payload?.sortOrder || 0);

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 },
      );
    }

    const created = await CategoryModel.create({
      name,
      slug,
      description: description || undefined,
      image: image || undefined,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      isActive: payload?.isActive ?? true,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("duplicate key")
        ? "Category slug already exists."
        : error instanceof Error
          ? error.message
          : "Unable to create category";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

