"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useCommerce } from "@/app/commerce-store";
import { toyProducts } from "@/app/data/toys";

const featuredToys = toyProducts.slice(0, 8);

export default function FeaturedToyGrid() {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useCommerce();

  const handleBuyNow = (id: number) => {
    addToCart(id);
    router.push("/cart");
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-slate-900 text-3xl font-black">
          Featured Toyz On Home
        </h2>
        <Link
          href="/shop"
          className="rounded-full bg-[#8a4f2b] px-4 py-2 text-xs font-semibold text-white"
        >
          View All Toyz
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featuredToys.map((toy) => {
          const discount = Math.round(
            ((toy.mrp - toy.offerPrice) / toy.mrp) * 100,
          );
          const inWishlist = wishlist.includes(toy.id);

          return (
            <article
              key={toy.id}
              className="group overflow-hidden rounded-2xl border border-[#e8d6bf] bg-white shadow-sm transition hover:shadow-md"
            >
              <Link
                href={`/shop/${toy.slug}`}
                className="relative block h-52 overflow-hidden bg-[#fff8ef]"
              >
                <Image
                  src={toy.image}
                  alt={toy.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
                <span className="text-green-700 absolute right-3 top-3 rounded-full bg-success/10 px-2 py-1 text-[11px] font-bold">
                  {discount}% OFF
                </span>
              </Link>

              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#8a4f2b]">
                      {toy.category}
                    </p>
                    <h3 className="text-slate-900 mt-1 line-clamp-1 text-base font-extrabold">
                      {toy.name}
                    </h3>
                    <p className="text-slate-600 mt-1 text-xs">
                      Age: {toy.ageGroup}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleWishlist(toy.id)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d8c2a8] text-[#8a4f2b] transition hover:bg-[#f4e6d6]"
                    aria-label={
                      inWishlist
                        ? `Remove ${toy.name} from wishlist`
                        : `Add ${toy.name} to wishlist`
                    }
                  >
                    {inWishlist ? <FaHeart size={14} /> : <FiHeart size={14} />}
                  </button>
                </div>

                <div className="mt-3 flex items-end gap-2">
                  <p className="text-slate-900 text-lg font-black">
                    Rs. {toy.offerPrice}
                  </p>
                  <p className="text-slate-500 text-xs line-through">
                    Rs. {toy.mrp}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(toy.id)}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-[#8a4f2b] px-3 text-xs font-semibold text-white transition hover:bg-[#704123]"
                  >
                    <FiShoppingCart size={14} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(toy.id)}
                    className="inline-flex h-9 items-center justify-center rounded-xl bg-[#f59e0b] px-3 text-xs font-semibold text-white transition hover:bg-[#d48806]"
                  >
                    Buy Now
                  </button>
                </div>

                <Link
                  href={`/shop/${toy.slug}`}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 mt-2 inline-flex w-full items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold transition"
                >
                  Open Product
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
