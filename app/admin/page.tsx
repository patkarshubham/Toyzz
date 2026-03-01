"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/Admin/LogoutButton";
import { adminOrders } from "@/app/data/admin-orders";
import type { ToyProduct } from "@/app/data/toys";
import {
  ADMIN_DEMO_EMAIL,
  ADMIN_SESSION_VALUE,
  ADMIN_STORAGE_KEY,
} from "@/app/lib/admin-auth-client";
import {
  getAdminLiveOrders,
  type AdminLiveOrder,
} from "@/app/lib/admin-live-orders";
import { toCategoryNames, toToyProduct } from "@/app/lib/catalog-normalizer";

type AdminCategory = {
  _id: string;
  name: string;
  slug: string;
};

type AdminProduct = ToyProduct & {
  _id: string;
  legacyId?: number;
  isActive?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  issues?: string[];
};

const IMAGE_ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const CSV_MAX_SIZE = 2 * 1024 * 1024;

const adminMenu = [
  { id: "overview", label: "Overview" },
  { id: "catalog", label: "Catalog & Revenue" },
  { id: "fulfillment", label: "Fulfillment" },
  { id: "orders", label: "Recent Orders" },
  { id: "data-crud", label: "Data Management" },
];

type ProductForm = {
  name: string;
  slug: string;
  image: string;
  category: string;
  ageGroup: string;
  mrp: string;
  offerPrice: string;
  shortDescription: string;
  description: string;
  material: string;
  finish: string;
  dimensions: string;
  weight: string;
  inTheBox: string;
  features: string;
  safety: string;
};

const initialProductForm: ProductForm = {
  name: "",
  slug: "",
  image: "",
  category: "",
  ageGroup: "3+ years",
  mrp: "",
  offerPrice: "",
  shortDescription: "",
  description: "",
  material: "Solid pine wood",
  finish: "Non-toxic child-safe finish",
  dimensions: "TBD",
  weight: "TBD",
  inTheBox: "1 Product Unit",
  features: "Handcrafted pine design, Rounded edges",
  safety: "Non-toxic coating, Splinter-safe polish",
};

const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [liveOrders, setLiveOrders] = useState<AdminLiveOrder[]>([]);

  const [managedProducts, setManagedProducts] = useState<AdminProduct[]>([]);
  const [managedCategories, setManagedCategories] = useState<AdminCategory[]>(
    [],
  );

  const [categoryInput, setCategoryInput] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryValue, setEditingCategoryValue] = useState("");

  const [productForm, setProductForm] =
    useState<ProductForm>(initialProductForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [importingCategoriesCsv, setImportingCategoriesCsv] = useState(false);
  const [importingProductsCsv, setImportingProductsCsv] = useState(false);
  const [selectedCategoryImageFile, setSelectedCategoryImageFile] = useState("");
  const [selectedProductImageFile, setSelectedProductImageFile] = useState("");
  const [selectedCategoriesCsvFile, setSelectedCategoriesCsvFile] = useState("");
  const [selectedProductsCsvFile, setSelectedProductsCsvFile] = useState("");
  const [pendingCategoriesCsvFile, setPendingCategoriesCsvFile] =
    useState<File | null>(null);
  const [previewCategories, setPreviewCategories] = useState<
    Array<{ name: string; slug: string }>
  >([]);
  const [pendingCategoriesCount, setPendingCategoriesCount] = useState(0);
  const [pendingProductsCsvFile, setPendingProductsCsvFile] =
    useState<File | null>(null);
  const [previewProducts, setPreviewProducts] = useState<
    Array<{ name: string; slug: string; category: string }>
  >([]);
  const [pendingProductsCount, setPendingProductsCount] = useState(0);
  const [committingCategoriesCsv, setCommittingCategoriesCsv] = useState(false);
  const [committingProductsCsv, setCommittingProductsCsv] = useState(false);
  const [bulkImportIssues, setBulkImportIssues] = useState<string[]>([]);
  const [adminMessage, setAdminMessage] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    if (token === ADMIN_SESSION_VALUE) {
      setAuthorized(true);
      setReady(true);
      return;
    }

    router.replace("/admin/login");
    setReady(true);
  }, [router]);

  const requestAdmin = async <T,>(
    path: string,
    init?: RequestInit,
  ): Promise<ApiResponse<T>> => {
    if (!ADMIN_API_KEY) {
      throw new Error(
        "Missing NEXT_PUBLIC_ADMIN_API_KEY in .env.local. Set it and restart dev server.",
      );
    }

    const response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": ADMIN_API_KEY,
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || "Admin API request failed.");
    }

    return payload;
  };

  const uploadImage = async (file: File, type: "category" | "product") => {
    if (!ADMIN_API_KEY) {
      throw new Error("Missing NEXT_PUBLIC_ADMIN_API_KEY in .env.local.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/admin/upload/", {
      method: "POST",
      headers: {
        "x-admin-token": ADMIN_API_KEY,
      },
      body: formData,
    });

    const payload = (await response.json()) as ApiResponse<{ url: string }>;
    if (!response.ok || !payload.success || !payload.data?.url) {
      throw new Error(payload.message || "Image upload failed.");
    }

    return payload.data.url;
  };

  const handleCategoryImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedCategoryImageFile(file.name);
    setBulkImportIssues([]);

    if (!IMAGE_ALLOWED_TYPES.has(file.type)) {
      setAdminMessage("Invalid image format. Use PNG, JPG, WEBP, or SVG.");
      event.target.value = "";
      return;
    }

    if (file.size > IMAGE_MAX_SIZE) {
      setAdminMessage("Image is too large. Maximum allowed size is 5MB.");
      event.target.value = "";
      return;
    }

    setUploadingCategoryImage(true);
    try {
      const url = await uploadImage(file, "category");
      setCategoryImage(url);
      setAdminMessage("Category image uploaded.");
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "Unable to upload image.",
      );
    } finally {
      setUploadingCategoryImage(false);
      event.target.value = "";
    }
  };

  const handleProductImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedProductImageFile(file.name);
    setBulkImportIssues([]);

    if (!IMAGE_ALLOWED_TYPES.has(file.type)) {
      setAdminMessage("Invalid image format. Use PNG, JPG, WEBP, or SVG.");
      event.target.value = "";
      return;
    }

    if (file.size > IMAGE_MAX_SIZE) {
      setAdminMessage("Image is too large. Maximum allowed size is 5MB.");
      event.target.value = "";
      return;
    }

    setUploadingProductImage(true);
    try {
      const url = await uploadImage(file, "product");
      setProductForm((prev) => ({ ...prev, image: url }));
      setAdminMessage("Product image uploaded.");
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "Unable to upload image.",
      );
    } finally {
      setUploadingProductImage(false);
      event.target.value = "";
    }
  };

  const handleCsvImport = async (
    event: ChangeEvent<HTMLInputElement>,
    type: "categories" | "products",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBulkImportIssues([]);
    if (type === "categories") {
      setSelectedCategoriesCsvFile(file.name);
      setPreviewCategories([]);
      setPendingCategoriesCsvFile(null);
      setPendingCategoriesCount(0);
    } else {
      setSelectedProductsCsvFile(file.name);
      setPreviewProducts([]);
      setPendingProductsCsvFile(null);
      setPendingProductsCount(0);
    }

    if (!ADMIN_API_KEY) {
      setAdminMessage("Missing NEXT_PUBLIC_ADMIN_API_KEY in .env.local.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setAdminMessage("Please upload only CSV files.");
      event.target.value = "";
      return;
    }

    if (file.size > CSV_MAX_SIZE) {
      setAdminMessage("CSV file is too large. Maximum allowed size is 2MB.");
      event.target.value = "";
      return;
    }

    if (type === "categories") {
      setImportingCategoriesCsv(true);
    } else {
      setImportingProductsCsv(true);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      if (type === "categories" || type === "products") {
        formData.append("mode", "preview");
      }

      const response = await fetch("/api/admin/import/csv/", {
        method: "POST",
        headers: {
          "x-admin-token": ADMIN_API_KEY,
        },
        body: formData,
      });

      const payload = (await response.json()) as ApiResponse<{
        processed: number;
        skipped: number;
        inserted: number;
        updated: number;
      }>;

      if (!response.ok || !payload.success) {
        if (Array.isArray(payload.issues) && payload.issues.length) {
          setBulkImportIssues(payload.issues);
        }
        throw new Error(payload.message || "CSV import failed.");
      }

      const stats = payload.data || {
        processed: 0,
        skipped: 0,
        inserted: 0,
        updated: 0,
        previewCategories: [],
        previewProducts: [],
      };
      if (Array.isArray(payload.issues) && payload.issues.length) {
        setBulkImportIssues(payload.issues);
      }

      if (type === "categories") {
        setPendingCategoriesCsvFile(file);
        setPendingCategoriesCount(stats.processed);
        setPreviewCategories(
          Array.isArray((stats as Record<string, unknown>).previewCategories)
            ? ((stats as Record<string, unknown>).previewCategories as Array<{
                name: string;
                slug: string;
              }>)
            : [],
        );
        setAdminMessage(
          `Categories CSV validated. ${stats.processed} valid rows ready. Click "Add These Categories" to save.`,
        );
      } else {
        setPendingProductsCsvFile(file);
        setPendingProductsCount(stats.processed);
        setPreviewProducts(
          Array.isArray((stats as Record<string, unknown>).previewProducts)
            ? ((stats as Record<string, unknown>).previewProducts as Array<{
                name: string;
                slug: string;
                category: string;
              }>)
            : [],
        );
        setAdminMessage(
          `Products CSV validated. ${stats.processed} valid rows ready. Click "Add These Products" to save.`,
        );
      }
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "CSV import failed.",
      );
    } finally {
      if (type === "categories") {
        setImportingCategoriesCsv(false);
      } else {
        setImportingProductsCsv(false);
      }
      event.target.value = "";
    }
  };

  const handleConfirmCategoriesImport = async () => {
    if (!pendingCategoriesCsvFile) {
      setAdminMessage("Upload a categories CSV first.");
      return;
    }

    if (!ADMIN_API_KEY) {
      setAdminMessage("Missing NEXT_PUBLIC_ADMIN_API_KEY in .env.local.");
      return;
    }

    setCommittingCategoriesCsv(true);
    try {
      const formData = new FormData();
      formData.append("file", pendingCategoriesCsvFile);
      formData.append("type", "categories");
      formData.append("mode", "import");

      const response = await fetch("/api/admin/import/csv/", {
        method: "POST",
        headers: {
          "x-admin-token": ADMIN_API_KEY,
        },
        body: formData,
      });

      const payload = (await response.json()) as ApiResponse<{
        processed: number;
        skipped: number;
        inserted: number;
        updated: number;
      }>;

      if (!response.ok || !payload.success) {
        if (Array.isArray(payload.issues) && payload.issues.length) {
          setBulkImportIssues(payload.issues);
        }
        throw new Error(payload.message || "Category import failed.");
      }

      const stats = payload.data || {
        processed: 0,
        skipped: 0,
        inserted: 0,
        updated: 0,
      };
      setAdminMessage(
        `Category CSV imported. Processed ${stats.processed}, inserted ${stats.inserted}, updated ${stats.updated}, skipped ${stats.skipped}.`,
      );
      setPendingCategoriesCsvFile(null);
      setPreviewCategories([]);
      setPendingCategoriesCount(0);
      setSelectedCategoriesCsvFile("");
      await loadCatalog();
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "Category import failed.",
      );
    } finally {
      setCommittingCategoriesCsv(false);
    }
  };

  const handleConfirmProductsImport = async () => {
    if (!pendingProductsCsvFile) {
      setAdminMessage("Upload a products CSV first.");
      return;
    }

    if (!ADMIN_API_KEY) {
      setAdminMessage("Missing NEXT_PUBLIC_ADMIN_API_KEY in .env.local.");
      return;
    }

    setCommittingProductsCsv(true);
    try {
      const formData = new FormData();
      formData.append("file", pendingProductsCsvFile);
      formData.append("type", "products");
      formData.append("mode", "import");

      const response = await fetch("/api/admin/import/csv/", {
        method: "POST",
        headers: {
          "x-admin-token": ADMIN_API_KEY,
        },
        body: formData,
      });

      const payload = (await response.json()) as ApiResponse<{
        processed: number;
        skipped: number;
        inserted: number;
        updated: number;
      }>;

      if (!response.ok || !payload.success) {
        if (Array.isArray(payload.issues) && payload.issues.length) {
          setBulkImportIssues(payload.issues);
        }
        throw new Error(payload.message || "Product import failed.");
      }

      const stats = payload.data || {
        processed: 0,
        skipped: 0,
        inserted: 0,
        updated: 0,
      };
      setAdminMessage(
        `Product CSV imported. Processed ${stats.processed}, inserted ${stats.inserted}, updated ${stats.updated}, skipped ${stats.skipped}.`,
      );
      setPendingProductsCsvFile(null);
      setPreviewProducts([]);
      setPendingProductsCount(0);
      setSelectedProductsCsvFile("");
      await loadCatalog();
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "Product import failed.",
      );
    } finally {
      setCommittingProductsCsv(false);
    }
  };

  const loadCatalog = async () => {
    setLoadingCatalog(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        requestAdmin<Record<string, unknown>[]>("/api/admin/products"),
        requestAdmin<Record<string, unknown>[]>("/api/admin/categories"),
      ]);

      const rawProducts = Array.isArray(productsRes.data)
        ? productsRes.data
        : [];
      const products: AdminProduct[] = rawProducts.map((item) => ({
        ...toToyProduct(item),
        _id: String(item._id || ""),
        legacyId:
          typeof item.legacyId === "number" && item.legacyId > 0
            ? item.legacyId
            : undefined,
        isActive: item.isActive !== false,
      }));

      const categoryRows = Array.isArray(categoriesRes.data)
        ? categoriesRes.data
        : [];
      const categories: AdminCategory[] = categoryRows.map((item) => ({
        _id: String(item._id || ""),
        name: String(item.name || ""),
        slug: String(item.slug || ""),
      }));

      const mergedCategoryNames = toCategoryNames([
        ...categories.map((item) => item.name),
        ...products.map((item) => item.category),
      ]);

      const normalizedCategories = mergedCategoryNames.map((name) => {
        const existing = categories.find((item) => item.name === name);
        return (
          existing || {
            _id: `temp-${name}`,
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
          }
        );
      });

      setManagedProducts(products);
      setManagedCategories(normalizedCategories);
      if (!productForm.category && normalizedCategories.length) {
        setProductForm((prev) => ({
          ...prev,
          category: normalizedCategories[0].name,
        }));
      }
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "Unable to load catalog.",
      );
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      loadCatalog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized]);

  useEffect(() => {
    const sync = () => setLiveOrders(getAdminLiveOrders());
    sync();
    const timer = window.setInterval(sync, 1500);
    return () => window.clearInterval(timer);
  }, []);

  const combinedOrders = useMemo(
    () => [...liveOrders, ...adminOrders],
    [liveOrders],
  );

  const metrics = useMemo(() => {
    const totalItems = managedProducts.length;
    const categoryCount = managedCategories.length;
    const totalPiecesOrdered = combinedOrders.reduce(
      (sum, order) => sum + order.qty,
      0,
    );

    const deliveredPieces = combinedOrders
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + order.qty, 0);

    const pickedUpPieces = combinedOrders
      .filter((order) => order.status === "picked_up")
      .reduce((sum, order) => sum + order.qty, 0);

    const inTransitPieces = combinedOrders
      .filter((order) => order.status === "in_transit")
      .reduce((sum, order) => sum + order.qty, 0);

    const findProductByOrderId = (productId: number) =>
      managedProducts.find((item) => (item.legacyId || item.id) === productId);

    const grossRevenue = combinedOrders.reduce((sum, order) => {
      if (order.status === "cancelled") return sum;
      const product = findProductByOrderId(order.productId);
      if (!product) return sum;
      return sum + product.offerPrice * order.qty;
    }, 0);

    const pendingOrders = combinedOrders.filter((order) =>
      ["processing", "packed", "in_transit", "ready_for_pickup"].includes(
        order.status,
      ),
    ).length;

    const deliveryOrders = combinedOrders.filter(
      (order) => order.channel === "delivery",
    ).length;
    const pickupOrders = combinedOrders.filter(
      (order) => order.channel === "pickup",
    ).length;

    const statusSummary = {
      processing: combinedOrders.filter(
        (order) => order.status === "processing",
      ).length,
      packed: combinedOrders.filter((order) => order.status === "packed")
        .length,
      inTransit: combinedOrders.filter((order) => order.status === "in_transit")
        .length,
      delivered: combinedOrders.filter((order) => order.status === "delivered")
        .length,
      readyForPickup: combinedOrders.filter(
        (order) => order.status === "ready_for_pickup",
      ).length,
      pickedUp: combinedOrders.filter((order) => order.status === "picked_up")
        .length,
      cancelled: combinedOrders.filter((order) => order.status === "cancelled")
        .length,
    };

    const categorySummary = Array.from(
      managedProducts.reduce((map, product) => {
        if (!map.has(product.category)) {
          map.set(product.category, { items: 0, pieces: 0, revenue: 0 });
        }

        const entry = map.get(product.category)!;
        entry.items += 1;

        const relatedOrders = combinedOrders.filter(
          (order) => order.productId === (product.legacyId || product.id),
        );
        entry.pieces += relatedOrders.reduce(
          (sum, order) => sum + order.qty,
          0,
        );
        entry.revenue += relatedOrders.reduce((sum, order) => {
          if (order.status === "cancelled") return sum;
          return sum + order.qty * product.offerPrice;
        }, 0);

        return map;
      }, new Map<string, { items: number; pieces: number; revenue: number }>()),
    );

    const topProducts = managedProducts
      .map((product) => {
        const pieces = combinedOrders
          .filter(
            (order) => order.productId === (product.legacyId || product.id),
          )
          .reduce((sum, order) => sum + order.qty, 0);
        return { product, pieces };
      })
      .filter((item) => item.pieces > 0)
      .sort((a, b) => b.pieces - a.pieces)
      .slice(0, 5);

    return {
      totalItems,
      categoryCount,
      totalPiecesOrdered,
      deliveredPieces,
      pickedUpPieces,
      inTransitPieces,
      grossRevenue,
      pendingOrders,
      deliveryOrders,
      pickupOrders,
      statusSummary,
      categorySummary,
      topProducts,
      findProductByOrderId,
    };
  }, [combinedOrders, managedCategories.length, managedProducts]);

  const categoryNames = managedCategories.map((item) => item.name);

  const resetProductForm = () => {
    setProductForm({
      ...initialProductForm,
      category: categoryNames[0] ?? "",
    });
    setEditingProductId(null);
  };

  const handleAddCategory = async () => {
    const next = categoryInput.trim();
    if (!next) return;

    try {
      await requestAdmin("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ name: next, image: categoryImage || undefined }),
      });
      setCategoryInput("");
      setCategoryImage("");
      setAdminMessage("Category created.");
      await loadCatalog();
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "Unable to create category.",
      );
    }
  };

  const handleSaveCategoryRename = async () => {
    if (!editingCategoryId) return;
    const target = managedCategories.find(
      (item) => item._id === editingCategoryId,
    );
    const nextName = editingCategoryValue.trim();
    if (!target || !nextName) return;

    try {
      await requestAdmin(`/api/admin/categories/${editingCategoryId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: nextName }),
      });

      const productsToUpdate = managedProducts.filter(
        (item) => item.category === target.name,
      );
      await Promise.all(
        productsToUpdate.map((item) =>
          requestAdmin(`/api/admin/products/${item._id}`, {
            method: "PATCH",
            body: JSON.stringify({ category: nextName }),
          }),
        ),
      );

      setEditingCategoryId(null);
      setEditingCategoryValue("");
      setAdminMessage("Category updated.");
      await loadCatalog();
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "Unable to update category.",
      );
    }
  };

  const handleDeleteCategory = async (category: AdminCategory) => {
    const inUse = managedProducts.some(
      (item) => item.category === category.name,
    );
    if (inUse) {
      setAdminMessage("Cannot delete category that is used by products.");
      return;
    }

    if (category._id.startsWith("temp-")) {
      setAdminMessage("Refresh dashboard and try again.");
      return;
    }

    try {
      await requestAdmin(`/api/admin/categories/${category._id}`, {
        method: "DELETE",
      });
      setAdminMessage("Category deleted.");
      await loadCatalog();
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "Unable to delete category.",
      );
    }
  };

  const handleSaveProduct = async (event: FormEvent) => {
    event.preventDefault();

    const name = productForm.name.trim();
    const slug = productForm.slug.trim().toLowerCase();
    const category = productForm.category.trim();
    const image = productForm.image.trim();
    const ageGroup = productForm.ageGroup.trim();
    const shortDescription = productForm.shortDescription.trim();
    const description = productForm.description.trim() || shortDescription;
    const material = productForm.material.trim() || "Solid pine wood";
    const finish = productForm.finish.trim() || "Non-toxic child-safe finish";
    const dimensions = productForm.dimensions.trim() || "TBD";
    const weight = productForm.weight.trim() || "TBD";
    const mrp = Number(productForm.mrp);
    const offerPrice = Number(productForm.offerPrice);

    if (
      !name ||
      !slug ||
      !category ||
      !image ||
      !ageGroup ||
      !shortDescription
    ) {
      setAdminMessage("Please complete all product fields.");
      return;
    }

    if (!categoryNames.includes(category)) {
      setAdminMessage("Select a valid category from list.");
      return;
    }

    if (
      !Number.isFinite(mrp) ||
      !Number.isFinite(offerPrice) ||
      mrp <= 0 ||
      offerPrice <= 0
    ) {
      setAdminMessage("MRP and Offer price must be valid positive numbers.");
      return;
    }

    if (offerPrice > mrp) {
      setAdminMessage("Offer price cannot be greater than MRP.");
      return;
    }

    const duplicateSlug = managedProducts.some(
      (item) => item.slug === slug && item._id !== editingProductId,
    );
    if (duplicateSlug) {
      setAdminMessage("Slug already exists. Use a unique slug.");
      return;
    }

    const toArray = (value: string) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const payload = {
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
      dimensions,
      weight,
      inTheBox: toArray(productForm.inTheBox),
      features: toArray(productForm.features),
      safety: toArray(productForm.safety),
    };

    try {
      if (editingProductId) {
        await requestAdmin(`/api/admin/products/${editingProductId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setAdminMessage("Product updated.");
      } else {
        await requestAdmin("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setAdminMessage("Product created.");
      }

      resetProductForm();
      await loadCatalog();
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "Unable to save product.",
      );
    }
  };

  const handleEditProduct = (product: AdminProduct) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      slug: product.slug,
      image: product.image,
      category: product.category,
      ageGroup: product.ageGroup,
      mrp: String(product.mrp),
      offerPrice: String(product.offerPrice),
      shortDescription: product.shortDescription,
      description: product.description,
      material: product.material,
      finish: product.finish,
      dimensions: product.dimensions,
      weight: product.weight,
      inTheBox: product.inTheBox.join(", "),
      features: product.features.join(", "),
      safety: product.safety.join(", "),
    });
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await requestAdmin(`/api/admin/products/${id}`, { method: "DELETE" });
      if (editingProductId === id) {
        resetProductForm();
      }
      setAdminMessage("Product deleted.");
      await loadCatalog();
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "Unable to delete product.",
      );
    }
  };

  const adminMessageIsError =
    /error|unable|invalid|missing|failed|cannot/i.test(adminMessage);

  if (!ready || !authorized) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
        <div className="text-slate-700 rounded-2xl border border-[#e7d2b8] bg-white p-6 text-sm font-semibold">
          Checking admin access...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 md:px-6 md:py-10">
      <section className="mb-6 rounded-3xl border border-[#e5ceb2] bg-[linear-gradient(120deg,#fff8f0,#f6e1ca)] p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
              PineToyzz Back Office
            </p>
            <h1 className="text-slate-900 mt-1 text-3xl font-black md:text-4xl">
              Admin Dashboard
            </h1>
            <p className="text-slate-700 mt-1 text-sm">
              Logged in as PineToyzz Admin ({ADMIN_DEMO_EMAIL})
            </p>
            <p className="mt-1 text-xs font-semibold text-[#8a4f2b]">
              Live cart activity synced: {liveOrders.length} entries
            </p>
            {!ADMIN_API_KEY && (
              <p className="text-red-700 mt-1 text-xs font-semibold">
                Missing NEXT_PUBLIC_ADMIN_API_KEY in .env.local
              </p>
            )}
          </div>
          <LogoutButton />
        </div>
      </section>

      {adminMessage && (
        <div
          className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
            adminMessageIsError
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {adminMessage}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[240px_1fr]">
        <aside className="xl:sticky xl:top-24 xl:h-fit">
          <nav className="rounded-3xl border border-[#e6d5bf] bg-white p-4 shadow-sm">
            <p className="text-slate-500 mb-3 text-xs font-bold uppercase tracking-wide">
              Menu
            </p>
            <div className="space-y-2">
              {adminMenu.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-slate-700 block rounded-xl border border-[#efe0ce] px-3 py-2 text-sm font-semibold transition hover:bg-[#fff8f1] hover:text-[#8a4f2b]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <div className="space-y-6">
          <section id="overview" className="scroll-mt-24">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-[#e6d5bf] bg-white p-4 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                  Catalog Items
                </p>
                <p className="text-slate-900 mt-1 text-3xl font-black">
                  {metrics.totalItems}
                </p>
                <p className="text-slate-600 mt-1 text-xs">
                  Across {metrics.categoryCount} categories
                </p>
              </article>
              <article className="rounded-2xl border border-[#e6d5bf] bg-white p-4 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                  Gross Revenue
                </p>
                <p className="text-slate-900 mt-1 text-3xl font-black">
                  Rs. {metrics.grossRevenue.toLocaleString("en-IN")}
                </p>
                <p className="text-slate-600 mt-1 text-xs">
                  Excluding cancelled orders
                </p>
              </article>
              <article className="rounded-2xl border border-[#e6d5bf] bg-white p-4 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                  Pieces Delivered
                </p>
                <p className="text-slate-900 mt-1 text-3xl font-black">
                  {metrics.deliveredPieces}
                </p>
                <p className="text-slate-600 mt-1 text-xs">
                  Out of {metrics.totalPiecesOrdered} ordered pieces
                </p>
              </article>
              <article className="rounded-2xl border border-[#e6d5bf] bg-white p-4 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                  Pickup Completed
                </p>
                <p className="text-slate-900 mt-1 text-3xl font-black">
                  {metrics.pickedUpPieces}
                </p>
                <p className="text-slate-600 mt-1 text-xs">
                  Pending admin actions: {metrics.pendingOrders}
                </p>
              </article>
            </div>
          </section>

          <section
            id="catalog"
            className="grid scroll-mt-24 gap-6 xl:grid-cols-[1.3fr_1fr]"
          >
            <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5 shadow-sm">
              <h2 className="text-slate-900 text-2xl font-black">
                Category Performance
              </h2>
              <p className="text-slate-600 mt-1 text-sm">
                Items, sold pieces, and revenue by category.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-[#efdfcd] text-xs uppercase tracking-wide">
                      <th className="pb-2 pr-3 font-bold">Category</th>
                      <th className="pb-2 pr-3 font-bold">Items</th>
                      <th className="pb-2 pr-3 font-bold">Pieces</th>
                      <th className="pb-2 font-bold">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.categorySummary.map(([category, summary]) => (
                      <tr
                        key={category}
                        className="border-b border-[#f3e7d9] last:border-b-0"
                      >
                        <td className="text-slate-900 py-2 pr-3 font-semibold">
                          {category}
                        </td>
                        <td className="text-slate-700 py-2 pr-3">
                          {summary.items}
                        </td>
                        <td className="text-slate-700 py-2 pr-3">
                          {summary.pieces}
                        </td>
                        <td className="py-2 font-semibold text-[#8a4f2b]">
                          Rs. {summary.revenue.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5 shadow-sm">
              <h2 className="text-slate-900 text-2xl font-black">
                Top Products
              </h2>
              <p className="text-slate-600 mt-1 text-sm">
                Highest moving products by sold pieces.
              </p>
              <div className="mt-4 space-y-2">
                {metrics.topProducts.map(({ product, pieces }) => (
                  <div
                    key={product._id}
                    className="rounded-xl border border-[#efe0ce] bg-[#fffaf4] p-3"
                  >
                    <p className="text-slate-900 text-sm font-bold">
                      {product.name}
                    </p>
                    <p className="text-slate-600 text-xs">{product.category}</p>
                    <p className="mt-1 text-xs font-semibold text-[#8a4f2b]">
                      {pieces} pieces | Rs.{" "}
                      {(pieces * product.offerPrice).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
                {!metrics.topProducts.length && (
                  <p className="text-slate-600 rounded-xl bg-[#fff6ec] p-3 text-sm">
                    No product movement available yet.
                  </p>
                )}
              </div>
            </article>
          </section>

          <section
            id="fulfillment"
            className="grid scroll-mt-24 gap-6 xl:grid-cols-2"
          >
            <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5 shadow-sm">
              <h2 className="text-slate-900 text-2xl font-black">
                Fulfillment Status
              </h2>
              <div className="mt-4 space-y-2">
                <div className="text-slate-700 rounded-xl bg-[#fff6ec] p-3 text-sm font-semibold">
                  In Transit Orders:{" "}
                  <span className="text-[#8a4f2b]">
                    {metrics.statusSummary.inTransit}
                  </span>
                </div>
                <div className="text-slate-700 rounded-xl bg-[#eefaf1] p-3 text-sm font-semibold">
                  Delivered Orders:{" "}
                  <span className="text-green-700">
                    {metrics.statusSummary.delivered}
                  </span>
                </div>
                <div className="text-slate-700 rounded-xl bg-[#edf5ff] p-3 text-sm font-semibold">
                  Picked-up Orders:{" "}
                  <span className="text-blue-700">
                    {metrics.statusSummary.pickedUp}
                  </span>
                </div>
                <div className="text-slate-700 rounded-xl bg-[#fff4f4] p-3 text-sm font-semibold">
                  Cancelled Orders:{" "}
                  <span className="text-red-700">
                    {metrics.statusSummary.cancelled}
                  </span>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5 shadow-sm">
              <h2 className="text-slate-900 text-2xl font-black">
                Order Channels
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#e8d8c7] bg-[#fffaf4] p-4">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                    Delivery
                  </p>
                  <p className="text-slate-900 mt-1 text-3xl font-black">
                    {metrics.deliveryOrders}
                  </p>
                </div>
                <div className="rounded-xl border border-[#e8d8c7] bg-[#fffaf4] p-4">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                    Pickup
                  </p>
                  <p className="text-slate-900 mt-1 text-3xl font-black">
                    {metrics.pickupOrders}
                  </p>
                </div>
              </div>
              <div className="text-slate-700 mt-3 rounded-xl bg-[#f7f0e6] p-3 text-xs font-semibold">
                Pipeline: Processing {metrics.statusSummary.processing}, Packed{" "}
                {metrics.statusSummary.packed}, Ready for Pickup{" "}
                {metrics.statusSummary.readyForPickup}
              </div>
            </article>
          </section>

          <section
            id="orders"
            className="scroll-mt-24 rounded-3xl border border-[#e6d5bf] bg-white p-5 shadow-sm"
          >
            <h2 className="text-slate-900 text-2xl font-black">
              Recent Orders
            </h2>
            <p className="text-slate-600 mt-1 text-sm">
              Includes base orders plus live cart activity from user portal.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-[#efdfcd] text-xs uppercase tracking-wide">
                    <th className="pb-2 pr-3 font-bold">Order ID</th>
                    <th className="pb-2 pr-3 font-bold">Product</th>
                    <th className="pb-2 pr-3 font-bold">Qty</th>
                    <th className="pb-2 pr-3 font-bold">Channel</th>
                    <th className="pb-2 pr-3 font-bold">Status</th>
                    <th className="pb-2 pr-3 font-bold">Date</th>
                    <th className="pb-2 font-bold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedOrders.map((order) => {
                    const product = metrics.findProductByOrderId(
                      order.productId,
                    );
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-[#f3e7d9] last:border-b-0"
                      >
                        <td className="py-2 pr-3 font-semibold text-[#8a4f2b]">
                          {order.id}
                        </td>
                        <td className="text-slate-700 py-2 pr-3">
                          {product?.name ?? "Unknown"}
                        </td>
                        <td className="text-slate-700 py-2 pr-3">
                          {order.qty}
                        </td>
                        <td className="text-slate-700 py-2 pr-3 capitalize">
                          {order.channel}
                        </td>
                        <td className="text-slate-700 py-2 pr-3 capitalize">
                          {order.status.replaceAll("_", " ")}
                        </td>
                        <td className="text-slate-700 py-2 pr-3">
                          {order.placedAt}
                        </td>
                        <td className="text-slate-500 py-2 text-xs font-semibold">
                          {"source" in order ? "Live Cart" : "Base Data"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section
            id="data-crud"
            className="grid scroll-mt-24 gap-6 xl:grid-cols-[0.9fr_1.1fr]"
          >
            <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5 shadow-sm xl:col-span-2">
              <h2 className="text-slate-900 text-2xl font-black">
                Bulk CSV Import
              </h2>
              <p className="text-slate-600 mt-1 text-sm">
                Upload CSV files to add or update multiple categories and
                products directly in MongoDB.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label
                  className={`flex items-center justify-center rounded-xl border border-[#8a4f2b] px-4 py-3 text-sm font-semibold text-[#8a4f2b] ${
                    importingCategoriesCsv
                      ? "cursor-not-allowed bg-[#f4e7d7] opacity-70"
                      : "cursor-pointer bg-[#fff8ef] hover:bg-[#fff2e3]"
                  }`}
                >
                  {importingCategoriesCsv
                    ? "Validating Categories CSV..."
                    : "Import Categories CSV"}
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    disabled={importingCategoriesCsv}
                    onChange={(event) => handleCsvImport(event, "categories")}
                  />
                </label>
                <label
                  className={`flex items-center justify-center rounded-xl border border-[#8a4f2b] px-4 py-3 text-sm font-semibold text-[#8a4f2b] ${
                    importingProductsCsv
                      ? "cursor-not-allowed bg-[#f4e7d7] opacity-70"
                      : "cursor-pointer bg-[#fff8ef] hover:bg-[#fff2e3]"
                  }`}
                >
                  {importingProductsCsv
                    ? "Validating Products CSV..."
                    : "Import Products CSV"}
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    disabled={importingProductsCsv}
                    onChange={(event) => handleCsvImport(event, "products")}
                  />
                </label>
              </div>
              <div className="mt-2 grid gap-2 text-xs text-slate-600 md:grid-cols-2">
                <p>
                  <span className="font-semibold text-slate-900">Selected categories file:</span>{" "}
                  {selectedCategoriesCsvFile || "None"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Selected products file:</span>{" "}
                  {selectedProductsCsvFile || "None"}
                </p>
              </div>
              {pendingCategoriesCount > 0 && (
                <div className="mt-3 rounded-xl border border-[#e5d1b6] bg-[#fff8ef] p-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Categories Ready To Add ({pendingCategoriesCount})
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    CSV validated successfully. Click button below to save these categories.
                  </p>
                  {previewCategories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {previewCategories.slice(0, 15).map((item) => (
                        <span
                          key={item.slug}
                          className="rounded-full border border-[#d9bf9d] bg-white px-2 py-1 text-xs font-semibold text-[#8a4f2b]"
                        >
                          {item.name}
                        </span>
                      ))}
                      {previewCategories.length > 15 && (
                        <span className="rounded-full border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                          +{previewCategories.length - 15} more
                        </span>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleConfirmCategoriesImport}
                    disabled={committingCategoriesCsv}
                    className="mt-3 rounded-xl bg-[#8a4f2b] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {committingCategoriesCsv ? "Adding Categories..." : "Add"}
                  </button>
                </div>
              )}
              {pendingProductsCount > 0 && (
                <div className="mt-3 rounded-xl border border-[#e5d1b6] bg-[#fff8ef] p-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Products Ready To Add ({pendingProductsCount})
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    CSV validated successfully. Click button below to save these products.
                  </p>
                  {previewProducts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {previewProducts.slice(0, 12).map((item) => (
                        <span
                          key={item.slug}
                          className="rounded-full border border-[#d9bf9d] bg-white px-2 py-1 text-xs font-semibold text-[#8a4f2b]"
                        >
                          {item.name}
                        </span>
                      ))}
                      {previewProducts.length > 12 && (
                        <span className="rounded-full border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                          +{previewProducts.length - 12} more
                        </span>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleConfirmProductsImport}
                    disabled={committingProductsCsv}
                    className="mt-3 rounded-xl bg-[#8a4f2b] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {committingProductsCsv ? "Adding Products..." : "Add"}
                  </button>
                </div>
              )}
              <p className="mt-2 text-xs text-slate-500">
                CSV upload rules: `.csv` only, max size 2MB. Invalid rows are skipped and listed below.
              </p>
              <div className="mt-4 grid gap-4 text-xs md:grid-cols-2">
                {/* Categories CSV */}
                <div className="rounded-xl bg-[#f7f2ea] p-4">
                  <h3 className="text-slate-900 mb-2 font-semibold">
                    Categories CSV Headers
                  </h3>
                  <code className="text-slate-700 block whitespace-pre-wrap break-words">
                    name, slug, description, image, sortOrder, isActive
                  </code>
                </div>

                {/* Products CSV */}
                <div className="rounded-xl bg-[#f7f2ea] p-4">
                  <h3 className="text-slate-900 mb-2 font-semibold">
                    Products CSV Headers
                  </h3>
                  <code className="text-slate-700 block whitespace-pre-wrap break-words">
                    name, slug, image, category, ageGroup, mrp, offerPrice,
                    shortDescription, description, material, finish, dimensions,
                    weight, inTheBox, features, safety, rating, reviewCount,
                    legacyId, isActive
                  </code>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <a
                  href="/samples/categories-import.csv"
                  className="rounded-full border border-[#8a4f2b] px-3 py-1.5 font-semibold text-[#8a4f2b] hover:bg-[#fff2e3]"
                  download
                >
                  Download Categories CSV Sample
                </a>
                <a
                  href="/samples/products-import.csv"
                  className="rounded-full border border-[#8a4f2b] px-3 py-1.5 font-semibold text-[#8a4f2b] hover:bg-[#fff2e3]"
                  download
                >
                  Download Products CSV Sample
                </a>
              </div>
              {bulkImportIssues.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm font-semibold text-amber-800">
                    Import Issues ({bulkImportIssues.length})
                  </p>
                  <ul className="mt-2 max-h-44 list-disc space-y-1 overflow-auto pl-4 text-xs text-amber-900">
                    {bulkImportIssues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5 shadow-sm">
              <h2 className="text-slate-900 text-2xl font-black">
                Category CRUD
              </h2>
              <p className="text-slate-600 mt-1 text-sm">
                Create, rename, and delete categories.
              </p>

              <div className="mt-4 flex gap-2">
                <input
                  value={categoryInput}
                  onChange={(event) => setCategoryInput(event.target.value)}
                  placeholder="New category"
                  className="w-full rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
                />
                <button
                  onClick={handleAddCategory}
                  className="rounded-xl bg-[#8a4f2b] px-4 py-2 text-xs font-semibold text-white"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 grid gap-2">
                <input
                  value={categoryImage}
                  onChange={(event) => setCategoryImage(event.target.value)}
                  placeholder="/uploads/categories/your-image.png"
                  className="w-full rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
                />
                <label
                  className={`inline-flex w-fit items-center rounded-xl border border-[#8a4f2b] px-3 py-2 text-xs font-semibold text-[#8a4f2b] ${
                    uploadingCategoryImage
                      ? "cursor-not-allowed bg-[#f4e7d7] opacity-70"
                      : "cursor-pointer hover:bg-[#fff6ed]"
                  }`}
                >
                  {uploadingCategoryImage
                    ? "Uploading..."
                    : "Upload Category Image"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                    disabled={uploadingCategoryImage}
                    onChange={handleCategoryImageUpload}
                  />
                </label>
                <p className="text-xs text-slate-500">
                  Allowed: PNG, JPG, WEBP, SVG. Max image size: 5MB.
                </p>
                <p className="text-xs text-slate-600">
                  Selected file: {selectedCategoryImageFile || "None"}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {managedCategories.map((category) => (
                  <div
                    key={category._id}
                    className="rounded-xl border border-[#efe0ce] bg-[#fffaf4] p-3"
                  >
                    {editingCategoryId === category._id ? (
                      <div className="flex gap-2">
                        <input
                          value={editingCategoryValue}
                          onChange={(event) =>
                            setEditingCategoryValue(event.target.value)
                          }
                          className="w-full rounded-lg border border-[#dcc4a8] px-2 py-1.5 text-sm"
                        />
                        <button
                          onClick={handleSaveCategoryRename}
                          className="rounded-lg bg-[#8a4f2b] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-slate-800 text-sm font-semibold">
                          {category.name}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCategoryId(category._id);
                              setEditingCategoryValue(category.name);
                            }}
                            className="rounded-full border border-[#8a4f2b] px-3 py-1 text-xs font-semibold text-[#8a4f2b]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="border-red-300 text-red-600 rounded-full border px-3 py-1 text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-[#e6d5bf] bg-white p-5 shadow-sm">
              <h2 className="text-slate-900 text-2xl font-black">
                Product CRUD
              </h2>
              <p className="text-slate-600 mt-1 text-sm">
                Create, edit, and delete products.
              </p>

              <form onSubmit={handleSaveProduct} className="mt-4 grid gap-2">
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={productForm.name}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Product name"
                    className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                  />
                  <input
                    value={productForm.slug}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        slug: event.target.value,
                      }))
                    }
                    placeholder="slug-example"
                    className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                  />
                </div>

                <input
                  value={productForm.image}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      image: event.target.value,
                    }))
                  }
                  placeholder="/images/toys/example.svg"
                  className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                />
                <label
                  className={`inline-flex w-fit items-center rounded-xl border border-[#8a4f2b] px-3 py-2 text-xs font-semibold text-[#8a4f2b] ${
                    uploadingProductImage
                      ? "cursor-not-allowed bg-[#f4e7d7] opacity-70"
                      : "cursor-pointer hover:bg-[#fff6ed]"
                  }`}
                >
                  {uploadingProductImage
                    ? "Uploading..."
                    : "Upload Product Image"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                    disabled={uploadingProductImage}
                    onChange={handleProductImageUpload}
                  />
                </label>
                <p className="text-xs text-slate-500">
                  Allowed: PNG, JPG, WEBP, SVG. Max image size: 5MB.
                </p>
                <p className="text-xs text-slate-600">
                  Selected file: {selectedProductImageFile || "None"}
                </p>

                <div className="grid gap-2 md:grid-cols-2">
                  <select
                    value={productForm.category}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                  >
                    {categoryNames.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <input
                    value={productForm.ageGroup}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        ageGroup: event.target.value,
                      }))
                    }
                    placeholder="3+ years"
                    className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={productForm.mrp}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        mrp: event.target.value,
                      }))
                    }
                    placeholder="MRP"
                    type="number"
                    className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                  />
                  <input
                    value={productForm.offerPrice}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        offerPrice: event.target.value,
                      }))
                    }
                    placeholder="Offer Price"
                    type="number"
                    className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                  />
                </div>

                <textarea
                  value={productForm.shortDescription}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      shortDescription: event.target.value,
                    }))
                  }
                  placeholder="Short product description"
                  rows={2}
                  className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                />
                <textarea
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Detailed product description"
                  rows={3}
                  className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                />
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={productForm.material}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        material: event.target.value,
                      }))
                    }
                    placeholder="Material"
                    className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                  />
                  <input
                    value={productForm.finish}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        finish: event.target.value,
                      }))
                    }
                    placeholder="Finish"
                    className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={productForm.dimensions}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        dimensions: event.target.value,
                      }))
                    }
                    placeholder="Dimensions"
                    className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                  />
                  <input
                    value={productForm.weight}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        weight: event.target.value,
                      }))
                    }
                    placeholder="Weight"
                    className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                  />
                </div>
                <textarea
                  value={productForm.inTheBox}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      inTheBox: event.target.value,
                    }))
                  }
                  placeholder="In the box (comma separated)"
                  rows={2}
                  className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                />
                <textarea
                  value={productForm.features}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      features: event.target.value,
                    }))
                  }
                  placeholder="Features (comma separated)"
                  rows={2}
                  className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                />
                <textarea
                  value={productForm.safety}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      safety: event.target.value,
                    }))
                  }
                  placeholder="Safety points (comma separated)"
                  rows={2}
                  className="rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#8a4f2b] px-4 py-2 text-xs font-semibold text-white"
                  >
                    {editingProductId ? "Update Product" : "Create Product"}
                  </button>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="rounded-xl border border-[#8a4f2b] px-4 py-2 text-xs font-semibold text-[#8a4f2b]"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={loadCatalog}
                    className="border-slate-300 text-slate-700 rounded-xl border px-4 py-2 text-xs font-semibold"
                  >
                    {loadingCatalog ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </form>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-[#efdfcd] text-xs uppercase tracking-wide">
                      <th className="pb-2 pr-3 font-bold">Name</th>
                      <th className="pb-2 pr-3 font-bold">Category</th>
                      <th className="pb-2 pr-3 font-bold">Price</th>
                      <th className="pb-2 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managedProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-[#f3e7d9] last:border-b-0"
                      >
                        <td className="text-slate-800 py-2 pr-3 font-semibold">
                          {product.name}
                        </td>
                        <td className="text-slate-700 py-2 pr-3">
                          {product.category}
                        </td>
                        <td className="text-slate-700 py-2 pr-3">
                          Rs. {product.offerPrice}
                        </td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="rounded-full border border-[#8a4f2b] px-3 py-1 text-xs font-semibold text-[#8a4f2b]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="border-red-300 text-red-600 rounded-full border px-3 py-1 text-xs font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
