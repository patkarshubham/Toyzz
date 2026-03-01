import { NextRequest, NextResponse } from "next/server";
import { toyProducts } from "@/app/data/toys";
import { isAdminRequest } from "@/app/lib/admin-api-auth";
import { connectToDatabase } from "@/app/lib/mongodb";
import { toSlug } from "@/app/lib/slugify";
import { CategoryModel } from "@/app/models/Category";
import { ProductModel } from "@/app/models/Product";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const categories = Array.from(new Set(toyProducts.map((item) => item.category)));

    await Promise.all(
      categories.map((name, index) =>
        CategoryModel.updateOne(
          { slug: toSlug(name) },
          { $set: { name, slug: toSlug(name), sortOrder: index + 1, isActive: true } },
          { upsert: true },
        ),
      ),
    );

    await Promise.all(
      toyProducts.map((toy) =>
        ProductModel.updateOne(
          { slug: toy.slug },
          {
            $set: {
              name: toy.name,
              legacyId: toy.id,
              slug: toy.slug,
              image: toy.image,
              category: toy.category,
              ageGroup: toy.ageGroup,
              mrp: toy.mrp,
              offerPrice: toy.offerPrice,
              rating: toy.rating,
              reviewCount: toy.reviewCount,
              shortDescription: toy.shortDescription,
              description: toy.description,
              material: toy.material,
              finish: toy.finish,
              dimensions: toy.dimensions,
              weight: toy.weight,
              inTheBox: toy.inTheBox,
              features: toy.features,
              safety: toy.safety,
              isActive: true,
            },
          },
          { upsert: true },
        ),
      ),
    );

    return NextResponse.json({
      success: true,
      message: "Catalog seeded successfully.",
      seededProducts: toyProducts.length,
      seededCategories: categories.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to seed catalog",
      },
      { status: 500 },
    );
  }
}
