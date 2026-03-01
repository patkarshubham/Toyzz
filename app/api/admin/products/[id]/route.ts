import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { isAdminRequest } from "@/app/lib/admin-api-auth";
import { connectToDatabase } from "@/app/lib/mongodb";
import { toSlug } from "@/app/lib/slugify";
import { ProductModel } from "@/app/models/Product";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid product id" }, { status: 400 });
  }

  await connectToDatabase();
  const product = await ProductModel.findById(id).lean();

  if (!product) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: product });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid product id" }, { status: 400 });
  }

  await connectToDatabase();
  const payload = await request.json();

  const update: Record<string, unknown> = {};
  const textFields = [
    "name",
    "image",
    "category",
    "ageGroup",
    "shortDescription",
    "description",
    "material",
    "finish",
    "dimensions",
    "weight",
  ];

  textFields.forEach((field) => {
    if (typeof payload?.[field] === "string") {
      update[field] = payload[field].trim();
    }
  });

  if (typeof payload?.slug === "string") {
    update.slug = toSlug(payload.slug);
  }

  const numberFields = ["mrp", "offerPrice", "rating", "reviewCount"];
  numberFields.forEach((field) => {
    const value = Number(payload?.[field]);
    if (Number.isFinite(value)) {
      update[field] = value;
    }
  });

  if (Number(payload?.legacyId) > 0) {
    update.legacyId = Number(payload.legacyId);
  }

  if (Array.isArray(payload?.inTheBox)) update.inTheBox = payload.inTheBox;
  if (Array.isArray(payload?.features)) update.features = payload.features;
  if (Array.isArray(payload?.safety)) update.safety = payload.safety;
  if (typeof payload?.isActive === "boolean") update.isActive = payload.isActive;

  const updated = await ProductModel.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid product id" }, { status: 400 });
  }

  await connectToDatabase();
  const deleted = await ProductModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: deleted });
}
