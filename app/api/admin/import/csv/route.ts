import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-api-auth";
import { connectToDatabase } from "@/app/lib/mongodb";
import { toSlug } from "@/app/lib/slugify";
import { stableIdFromSlug } from "@/app/lib/stable-id";
import { csvToObjects } from "@/app/lib/csv";
import { CategoryModel } from "@/app/models/Category";
import { ProductModel } from "@/app/models/Product";

type ImportType = "categories" | "products";
const MAX_CSV_SIZE = 2 * 1024 * 1024;

const CATEGORY_REQUIRED_HEADER_GROUPS = [
  ["name", "category", "categoryName", "cetegory", "title"],
];
const PRODUCT_REQUIRED_HEADER_GROUPS = [
  ["name", "productName", "product", "title"],
  ["category", "categoryName", "cetegory", "type"],
  ["mrp", "price", "listPrice"],
  ["offerPrice", "offer", "salePrice", "finalPrice"],
];

function normalizeHeaderKey(key: string) {
  return key.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function valueFromAliases(
  row: Record<string, string>,
  aliases: string[],
): string {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeHeaderKey(key), value]),
  ) as Record<string, string>;

  for (const alias of aliases) {
    const value = normalized[normalizeHeaderKey(alias)];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function firstNonEmptyCell(row: Record<string, string>) {
  const value = Object.values(row).find((cell) => String(cell || "").trim());
  return value ? String(value).trim() : "";
}

function parseBoolean(input: string, fallback: boolean) {
  const value = input.trim().toLowerCase();
  if (!value) return fallback;
  if (["true", "1", "yes", "y"].includes(value)) return true;
  if (["false", "0", "no", "n"].includes(value)) return false;
  return fallback;
}

function parseList(input: string) {
  return input
    .split(/[|,]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isFileLike(
  value: FormDataEntryValue | null,
): value is File {
  return (
    !!value &&
    typeof value === "object" &&
    "name" in value &&
    "size" in value &&
    "text" in value &&
    typeof (value as { text: unknown }).text === "function"
  );
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const typeValue = String(formData.get("type") || "").toLowerCase();
    const mode = String(formData.get("mode") || "import").toLowerCase();
    const type = (typeValue === "categories" || typeValue === "products"
      ? typeValue
      : null) as ImportType | null;
    const file = formData.get("file");

    if (!type) {
      return NextResponse.json(
        { success: false, message: "Invalid type. Use categories or products." },
        { status: 400 },
      );
    }

    if (!isFileLike(file)) {
      return NextResponse.json({ success: false, message: "CSV file is required." }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json(
        { success: false, message: "Invalid file format. Please upload a .csv file." },
        { status: 400 },
      );
    }

    if (file.size > MAX_CSV_SIZE) {
      return NextResponse.json(
        { success: false, message: "CSV file too large. Maximum size is 2MB." },
        { status: 400 },
      );
    }

    const text = await file.text();
    const rows = csvToObjects(text);
    if (!rows.length) {
      return NextResponse.json({ success: false, message: "CSV has no data rows." }, { status: 400 });
    }

    const headers = Object.keys(rows[0] || {});
    const normalizedHeaders = headers.map((item) => normalizeHeaderKey(item));
    const requiredGroups =
      type === "categories"
        ? CATEGORY_REQUIRED_HEADER_GROUPS
        : PRODUCT_REQUIRED_HEADER_GROUPS;
    const missingHeaders = requiredGroups
      .filter(
        (group) =>
          !group.some((alias) =>
            normalizedHeaders.includes(normalizeHeaderKey(alias)),
          ),
      )
      .map((group) => `Header not found (accepted): ${group.join(" | ")}`);

    if (type === "categories") {
      let skipped = 0;
      const issues: string[] = [...missingHeaders];
      const previewCategories: Array<{ name: string; slug: string }> = [];
      const operations = rows
        .map((row, index) => {
          const aliasName = valueFromAliases(row, [
            "name",
            "category",
            "categoryName",
            "cetegory",
            "title",
          ]);
          const name = aliasName || firstNonEmptyCell(row);
          if (!name) {
            skipped += 1;
            issues.push(`Row ${index + 2}: category name not found.`);
            return null;
          }

          const slug = toSlug(valueFromAliases(row, ["slug"]) || name);
          previewCategories.push({ name, slug });
          const description = valueFromAliases(row, ["description", "desc"]);
          const image = valueFromAliases(row, ["image", "imageUrl", "imageURL", "img"]);
          const sortOrderRaw = valueFromAliases(row, ["sortOrder", "sort", "position", "rank"]);
          const isActiveRaw = valueFromAliases(row, ["isActive", "active", "enabled", "status"]);

          return {
            updateOne: {
              filter: { slug },
              update: {
                $set: {
                  name,
                  slug,
                  description: description || undefined,
                  image: image || undefined,
                  sortOrder: Number(sortOrderRaw || 0) || 0,
                  isActive: parseBoolean(isActiveRaw, true),
                },
              },
              upsert: true,
            },
          };
        })
        .filter(Boolean);

      if (!operations.length) {
        return NextResponse.json(
          {
            success: false,
            message: "No valid category rows found in CSV.",
            issues: issues.slice(0, 30),
          },
          { status: 400 },
        );
      }

      if (mode === "preview") {
        return NextResponse.json({
          success: true,
          message: "Category CSV preview generated.",
          data: {
            processed: operations.length,
            skipped,
            inserted: 0,
            updated: 0,
            previewCategories: previewCategories.slice(0, 100),
          },
          issues: issues.slice(0, 20),
        });
      }

      await connectToDatabase();
      const result = await CategoryModel.bulkWrite(operations);
      return NextResponse.json({
        success: true,
        message: "Category CSV imported.",
        data: {
          processed: operations.length,
          skipped,
          inserted: result.upsertedCount,
          updated: result.modifiedCount,
          previewCategories: [],
        },
        issues: issues.slice(0, 20),
      });
    }

    let skipped = 0;
    const issues: string[] = [...missingHeaders];
    const previewProducts: Array<{ name: string; slug: string; category: string }> = [];
    const productOperations = rows
      .map((row, index) => {
        const name = valueFromAliases(row, ["name", "productName", "product", "title"]);
        const category = valueFromAliases(row, [
          "category",
          "categoryName",
          "cetegory",
          "type",
        ]);
        const image =
          valueFromAliases(row, ["image", "imageUrl", "imageURL", "img"]) ||
          "/images/toys/pine-cube-starter-box.svg";
        const mrp = Number(valueFromAliases(row, ["mrp", "price", "listPrice"]) || 0);
        const offerPrice = Number(
          valueFromAliases(row, ["offerPrice", "offer", "salePrice", "finalPrice"]) || 0,
        );
        const shortDescription =
          valueFromAliases(row, ["shortDescription", "shortDesc", "summary"]) ||
          valueFromAliases(row, ["description", "desc", "longDescription"]);

        if (
          !name ||
          !category ||
          !image ||
          !shortDescription ||
          !Number.isFinite(mrp) ||
          !Number.isFinite(offerPrice) ||
          mrp <= 0 ||
          offerPrice <= 0
        ) {
          skipped += 1;
          const rowIssues: string[] = [];
          if (!name) rowIssues.push("name is required");
          if (!category) rowIssues.push("category is required");
          if (!shortDescription) rowIssues.push("shortDescription or description is required");
          if (!Number.isFinite(mrp) || mrp <= 0) rowIssues.push("mrp must be > 0");
          if (!Number.isFinite(offerPrice) || offerPrice <= 0) {
            rowIssues.push("offerPrice must be > 0");
          }
          if (Number.isFinite(mrp) && Number.isFinite(offerPrice) && offerPrice > mrp) {
            rowIssues.push("offerPrice cannot be greater than mrp");
          }
          issues.push(`Row ${index + 2}: ${rowIssues.join(", ")}.`);
          return null;
        }

        const slug = toSlug(valueFromAliases(row, ["slug"]) || name);
        const description =
          valueFromAliases(row, ["description", "desc", "longDescription"]) ||
          shortDescription;
        const legacyRaw = Number(valueFromAliases(row, ["legacyId", "id", "productId"]) || 0);
        const legacyId = legacyRaw > 0 ? legacyRaw : stableIdFromSlug(slug);
        const ageGroup = valueFromAliases(row, ["ageGroup", "age", "ageRange"]) || "3+ years";
        const rating = Number(valueFromAliases(row, ["rating", "stars"]) || 4.5);
        const reviewCount = Number(
          valueFromAliases(row, ["reviewCount", "reviews", "totalReviews"]) || 0,
        );
        const material = valueFromAliases(row, ["material"]) || "Solid pine wood";
        const finish = valueFromAliases(row, ["finish"]) || "Non-toxic child-safe finish";
        const dimensions = valueFromAliases(row, ["dimensions", "size"]) || "TBD";
        const weight = valueFromAliases(row, ["weight"]) || "TBD";
        const inTheBox = parseList(
          valueFromAliases(row, ["inTheBox", "boxItems", "itemsIncluded"]) || "1 Product Unit",
        );
        const features = parseList(
          valueFromAliases(row, ["features", "featureList"]) || "Handcrafted pine design",
        );
        const safety = parseList(
          valueFromAliases(row, ["safety", "safetyPoints"]) || "Non-toxic coating",
        );
        const isActive = parseBoolean(
          valueFromAliases(row, ["isActive", "active", "enabled", "status"]),
          true,
        );
        previewProducts.push({ name, slug, category });

        return {
          updateOne: {
            filter: { slug },
            update: {
              $set: {
                legacyId,
                name,
                slug,
                image,
                category,
                ageGroup,
                mrp,
                offerPrice,
                rating,
                reviewCount,
                shortDescription,
                description,
                material,
                finish,
                dimensions,
                weight,
                inTheBox,
                features,
                safety,
                isActive,
              },
            },
            upsert: true,
          },
        };
      })
      .filter(Boolean);

    if (!productOperations.length) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid product rows found in CSV.",
          issues: issues.slice(0, 30),
        },
        { status: 400 },
      );
    }

    if (mode === "preview") {
      return NextResponse.json({
        success: true,
        message: "Product CSV preview generated.",
        data: {
          processed: productOperations.length,
          skipped,
          inserted: 0,
          updated: 0,
          previewProducts: previewProducts.slice(0, 100),
        },
        issues: issues.slice(0, 20),
      });
    }

    await connectToDatabase();
    const uniqueCategories = Array.from(
      new Set(
        previewProducts
          .map((row) => String(row.category || "").trim())
          .filter(Boolean),
      ),
    );

    await Promise.all(
      uniqueCategories.map((name, index) =>
        CategoryModel.updateOne(
          { slug: toSlug(name) },
          {
            $set: {
              name,
              slug: toSlug(name),
              sortOrder: index,
              isActive: true,
            },
          },
          { upsert: true },
        ),
      ),
    );

    const result = await ProductModel.bulkWrite(productOperations);
    return NextResponse.json({
      success: true,
      message: "Product CSV imported.",
      data: {
        processed: productOperations.length,
        skipped,
        inserted: result.upsertedCount,
        updated: result.modifiedCount,
        previewProducts: [],
      },
      issues: issues.slice(0, 20),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CSV import failed";
    const status =
      /invalid|missing|required|csv|header|too large|unauthorized|not found/i.test(message)
        ? 400
        : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}
