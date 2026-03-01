import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-api-auth";
import { connectToDatabase } from "@/app/lib/mongodb";
import { toSlug } from "@/app/lib/slugify";
import { stableIdFromSlug } from "@/app/lib/stable-id";
import { ProductModel } from "@/app/models/Product";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to fetch products",
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
    const image = String(payload?.image || "").trim();
    const category = String(payload?.category || "").trim();
    const ageGroup = String(payload?.ageGroup || "3+ years").trim();
    const mrp = Number(payload?.mrp || 0);
    const offerPrice = Number(payload?.offerPrice || 0);
    const shortDescription = String(payload?.shortDescription || "").trim();
    const description = String(payload?.description || "").trim();
    const material = String(payload?.material || "Solid pine wood").trim();
    const finish = String(payload?.finish || "Water-based non-toxic finish").trim();
    const dimensions = String(payload?.dimensions || "").trim();
    const weight = String(payload?.weight || "").trim();

    if (!name || !image || !category || !shortDescription || !description) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(mrp) || !Number.isFinite(offerPrice) || mrp <= 0 || offerPrice <= 0) {
      return NextResponse.json(
        { success: false, message: "MRP and offer price must be valid numbers." },
        { status: 400 },
      );
    }

    const normalizeArray = (value: unknown) =>
      Array.isArray(value)
        ? value.map((item) => String(item).trim()).filter(Boolean)
        : [];

    const created = await ProductModel.create({
      legacyId: Number(payload?.legacyId) > 0 ? Number(payload.legacyId) : stableIdFromSlug(slug),
      name,
      slug,
      image,
      category,
      ageGroup,
      mrp,
      offerPrice,
      shortDescription,
      description,
      material,
      finish,
      dimensions: dimensions || "TBD",
      weight: weight || "TBD",
      rating: Number(payload?.rating || 4.5),
      reviewCount: Number(payload?.reviewCount || 0),
      inTheBox: normalizeArray(payload?.inTheBox),
      features: normalizeArray(payload?.features),
      safety: normalizeArray(payload?.safety),
      isActive: payload?.isActive ?? true,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("duplicate key")
        ? "Product slug already exists."
        : error instanceof Error
          ? error.message
          : "Unable to create product";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
