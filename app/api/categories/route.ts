import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { CategoryModel } from "@/app/models/Category";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await CategoryModel.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load categories",
      },
      { status: 500 },
    );
  }
}

