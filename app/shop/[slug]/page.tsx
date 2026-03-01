import "server-only";
import { notFound } from "next/navigation";
import { findToyBySlug } from "@/app/data/toys";
import { toToyProduct } from "@/app/lib/catalog-normalizer";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ProductModel } from "@/app/models/Product";
import ToyDetailClient from "./ToyDetailClient";

export const dynamic = "force-dynamic";

export default async function ToyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let toy = null;

  try {
    await connectToDatabase();
    const product = await ProductModel.findOne({ slug, isActive: true }).lean();
    if (product) {
      toy = toToyProduct(product);
    }
  } catch {
    // Use static fallback if DB is unavailable.
  }

  if (!toy) {
    toy = findToyBySlug(slug) ?? null;
  }

  if (!toy) {
    notFound();
  }

  return <ToyDetailClient toy={toy} />;
}
