import type { ToyProduct } from "@/app/data/toys";
import { stableIdFromSlug } from "@/app/lib/stable-id";

type ProductApiRecord = Partial<ToyProduct> & {
  _id?: unknown;
  legacyId?: number;
  isActive?: boolean;
};

export function toToyProduct(input: ProductApiRecord): ToyProduct {
  const slug = String(input.slug || "").trim().toLowerCase();
  const baseId =
    typeof input.legacyId === "number" && input.legacyId > 0
      ? input.legacyId
      : typeof input.id === "number" && input.id > 0
        ? input.id
        : stableIdFromSlug(slug || String(input.name || "toy"));

  const normalizeList = (value: unknown, fallback: string[]) =>
    Array.isArray(value)
      ? value.map((item) => String(item).trim()).filter(Boolean)
      : fallback;

  return {
    id: baseId,
    slug,
    name: String(input.name || "Pine Wooden Toy"),
    image: String(input.image || "/images/toys/pine-cube-starter-box.svg"),
    category: String(input.category || "Pine Toys"),
    ageGroup: String(input.ageGroup || "3+ years"),
    mrp: Number(input.mrp || 999),
    offerPrice: Number(input.offerPrice || 799),
    rating: Number(input.rating || 4.5),
    reviewCount: Number(input.reviewCount || 0),
    shortDescription: String(input.shortDescription || "Handcrafted pine toy."),
    description: String(input.description || input.shortDescription || "Handcrafted pine toy."),
    material: String(input.material || "Solid pine wood"),
    finish: String(input.finish || "Water-based child-safe finish"),
    dimensions: String(input.dimensions || "TBD"),
    weight: String(input.weight || "TBD"),
    inTheBox: normalizeList(input.inTheBox, ["1 Product Unit"]),
    features: normalizeList(input.features, ["Handcrafted pine design"]),
    safety: normalizeList(input.safety, ["Rounded edges", "Non-toxic coating"]),
  };
}

export function toToyProducts(input: ProductApiRecord[]) {
  return input.map(toToyProduct);
}

export function toCategoryNames(
  input: Array<{ name?: string } | string>,
): string[] {
  return Array.from(
    new Set(
      input
        .map((item) =>
          typeof item === "string" ? item.trim() : String(item?.name || "").trim(),
        )
        .filter(Boolean),
    ),
  ).sort();
}
