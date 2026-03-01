"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaHeart } from "react-icons/fa";
import {
  FiChevronDown,
  FiHeart,
  FiSearch,
  FiShoppingCart,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import { useCommerce } from "@/app/commerce-store";
import { toyProducts } from "@/app/data/toys";
import { toCategoryNames, toToyProducts } from "@/app/lib/catalog-normalizer";

type SortKey = "relevance" | "priceLow" | "priceHigh" | "discount";

export default function ShopPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("relevance");
  const [products, setProducts] = useState(toyProducts);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const { addToCart, toggleWishlist, wishlist, cartCount, wishlistCount } =
    useCommerce();

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        const productsJson = await productsRes.json();
        const categoriesJson = await categoriesRes.json();

        const fetchedProducts = Array.isArray(productsJson?.data)
          ? toToyProducts(productsJson.data)
          : toyProducts;
        const fetchedCategories = Array.isArray(categoriesJson?.data)
          ? toCategoryNames(categoriesJson.data)
          : toCategoryNames(fetchedProducts.map((item) => item.category));

        setProducts(fetchedProducts.length ? fetchedProducts : toyProducts);
        setCategories(["All", ...(fetchedCategories.length ? fetchedCategories : toCategoryNames(toyProducts.map((item) => item.category)))]);
      } catch {
        setProducts(toyProducts);
        setCategories(["All", ...toCategoryNames(toyProducts.map((item) => item.category))]);
      }
    };

    loadCatalog();
  }, []);

  const visibleProducts = useMemo(() => {
    const base =
      activeCategory === "All"
        ? products
        : products.filter((item) => item.category === activeCategory);

    const searched = base.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.ageGroup.toLowerCase().includes(q)
      );
    });

    const sorted = [...searched];

    if (sortBy === "priceLow") {
      sorted.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortBy === "priceHigh") {
      sorted.sort((a, b) => b.offerPrice - a.offerPrice);
    } else if (sortBy === "discount") {
      sorted.sort(
        (a, b) =>
          (b.mrp - b.offerPrice) / b.mrp - (a.mrp - a.offerPrice) / a.mrp,
      );
    }

    return sorted;
  }, [activeCategory, products, searchQuery, sortBy]);

  const handleBuyNow = (id: number) => {
    addToCart(id);
    router.push("/cart");
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
      <section className="mb-5 rounded-3xl border border-[#e5ceb2] bg-[linear-gradient(120deg,#fff8f0,#f6e1ca)] p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
              PineToyzz Marketplace
            </h1>
            <p className="mt-1 text-sm text-slate-700">
              Discover, compare, wishlist, and add products quickly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#d2b08b] bg-white px-3 py-1 text-xs font-semibold text-[#7f4829]">
              Wishlist {wishlistCount}
            </span>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-full bg-[#8a4f2b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#704123]"
            >
              <FiShoppingCart size={14} />
              Cart ({cartCount})
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="flex items-center gap-2 rounded-2xl border border-[#dec5a9] bg-white px-3 py-2">
            <FiSearch className="text-slate-500" size={16} />
            <input
              placeholder="Search by toy name, category, age group"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortKey)}
              className="h-full min-w-[210px] appearance-none rounded-2xl border border-[#dec5a9] bg-white px-3 py-2 pr-9 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="discount">Best Discount</option>
            </select>
            <FiChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>
      </section>

      <section className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? "bg-[#8a4f2b] text-white"
                  : "border border-[#d8c2a8] bg-white text-slate-700 hover:bg-[#f3e4d3]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="text-sm font-semibold text-slate-600">
          {visibleProducts.length} products found
        </p>
      </section>

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e7d4be] bg-white p-3 text-sm font-semibold text-slate-700">
          <FiTruck className="mr-2 inline-block text-[#8a4f2b]" size={15} />
          Fast Delivery Check by Pincode
        </div>
        <div className="rounded-2xl border border-[#e7d4be] bg-white p-3 text-sm font-semibold text-slate-700">
          <FiShield className="mr-2 inline-block text-[#8a4f2b]" size={15} />
          Safe Checkout and Secure Payment
        </div>
        <div className="rounded-2xl border border-[#e7d4be] bg-white p-3 text-sm font-semibold text-slate-700">
          <FiHeart className="mr-2 inline-block text-[#8a4f2b]" size={15} />
          Save Products in Wishlist
        </div>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((item) => {
            const discountPercent = Math.round(
              ((item.mrp - item.offerPrice) / item.mrp) * 100,
            );
            const inWishlist = wishlist.includes(item.id);

            return (
              <article
                key={item.id}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[#e8d6bf] bg-white shadow-sm transition hover:shadow-md"
                onClick={() => router.push(`/shop/${item.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/shop/${item.slug}`);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="relative h-52 overflow-hidden bg-[#fff8ef]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-green-100 px-2 py-1 text-[11px] font-bold text-green-700">
                    {discountPercent}% OFF
                  </span>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#8a4f2b] shadow transition hover:bg-[#f4e6d6]"
                    aria-label={
                      inWishlist
                        ? `Remove ${item.name} from wishlist`
                        : `Add ${item.name} to wishlist`
                    }
                  >
                    {inWishlist ? <FaHeart size={14} /> : <FiHeart size={14} />}
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#8a4f2b]">
                    {item.category}
                  </p>
                  <h2 className="mt-1 line-clamp-1 text-base font-extrabold text-slate-900">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-600">Age: {item.ageGroup}</p>

                  <div className="mt-3 flex items-end gap-2">
                    <p className="text-lg font-black text-slate-900">
                      Rs. {item.offerPrice}
                    </p>
                    <p className="text-xs text-slate-500 line-through">
                      Rs. {item.mrp}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(item.id);
                      }}
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-[#8a4f2b] px-3 text-xs font-semibold text-white transition hover:bg-[#704123]"
                    >
                      <FiShoppingCart size={14} />
                      Add to Cart
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleBuyNow(item.id);
                      }}
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-[#f59e0b] px-3 text-xs font-semibold text-white transition hover:bg-[#d48806]"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
