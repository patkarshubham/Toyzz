import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ProductModel } from "@/app/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const category = request.nextUrl.searchParams.get("category");
    const q = request.nextUrl.searchParams.get("q");

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: "i" };

    const products = await ProductModel.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load products",
      },
      { status: 500 },
    );
  }
}

