import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { isAdminRequest } from "@/app/lib/admin-api-auth";
import { connectToDatabase } from "@/app/lib/mongodb";
import { toSlug } from "@/app/lib/slugify";
import { CategoryModel } from "@/app/models/Category";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid category id" }, { status: 400 });
  }

  await connectToDatabase();
  const category = await CategoryModel.findById(id).lean();

  if (!category) {
    return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: category });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid category id" }, { status: 400 });
  }

  await connectToDatabase();
  const payload = await request.json();

  const update: Record<string, unknown> = {};
  if (typeof payload?.name === "string") update.name = payload.name.trim();
  if (typeof payload?.slug === "string") update.slug = toSlug(payload.slug);
  if (typeof payload?.description === "string") update.description = payload.description.trim();
  if (typeof payload?.image === "string") update.image = payload.image.trim();
  if (typeof payload?.sortOrder === "number") update.sortOrder = payload.sortOrder;
  if (typeof payload?.isActive === "boolean") update.isActive = payload.isActive;

  const updated = await CategoryModel.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid category id" }, { status: 400 });
  }

  await connectToDatabase();
  const deleted = await CategoryModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: deleted });
}
