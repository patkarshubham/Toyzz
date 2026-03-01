"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiShield,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiZap,
} from "react-icons/fi";
import { useCommerce } from "@/app/commerce-store";
import type { ToyProduct } from "@/app/data/toys";

export default function ToyDetailClient({ toy }: { toy: ToyProduct }) {
  const router = useRouter();
  const { addToCart } = useCommerce();
  const discountPercent = Math.round(
    ((toy.mrp - toy.offerPrice) / toy.mrp) * 100,
  );

  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState(
    "Enter pincode to check delivery",
  );
  const [deliveryOk, setDeliveryOk] = useState<boolean | null>(null);

  const savings = toy.mrp - toy.offerPrice;

  const buyHighlights = useMemo(
    () => [
      "100% handcrafted pine wood",
      "Non-toxic child-safe finish",
      "Rounded and smooth edges",
      "Easy returns and support",
    ],
    [],
  );

  const handleBuyNow = () => {
    addToCart(toy.id);
    router.push("/cart");
  };

  const checkDelivery = () => {
    const value = pincode.trim();
    if (!/^\d{6}$/.test(value)) {
      setDeliveryOk(false);
      setDeliveryMsg("Please enter a valid 6-digit pincode.");
      return;
    }

    const serviceablePrefixes = [
      "110",
      "122",
      "201",
      "302",
      "400",
      "411",
      "500",
      "560",
      "600",
      "700",
    ];

    const prefix = value.slice(0, 3);
    if (!serviceablePrefixes.includes(prefix)) {
      setDeliveryOk(false);
      setDeliveryMsg("Currently not serviceable for this pincode.");
      return;
    }

    const etaDays = Number(value[value.length - 1]) % 2 === 0 ? "2-3" : "3-5";
    setDeliveryOk(true);
    setDeliveryMsg(`Delivery available. Estimated delivery in ${etaDays} days.`);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
      <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-[#8a4f2b]">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#8a4f2b]">
          Shop
        </Link>
        <span>/</span>
        <span className="text-slate-700">{toy.name}</span>
      </nav>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_1.05fr_0.9fr]">
        <div className="rounded-2xl border border-[#e8d6bf] bg-white p-4">
          <div className="relative h-[460px] overflow-hidden rounded-xl bg-[#fff8ef]">
            <Image
              src={toy.image}
              alt={toy.name}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 40vw"
              priority
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative h-20 overflow-hidden rounded-lg border border-[#eadbc8] bg-[#fff8ef]"
              >
                <Image
                  src={toy.image}
                  alt={`${toy.name} preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#e8d6bf] bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
              {toy.category}
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">
              {toy.name}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 font-bold text-green-700">
                <FiStar size={12} /> {toy.rating}
              </span>
              <span className="font-semibold text-slate-600">
                {toy.reviewCount} ratings
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {toy.shortDescription}
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {buyHighlights.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <FiCheckCircle className="mt-0.5 text-[#8a4f2b]" size={15} />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#e8d6bf] bg-white p-5">
            <h2 className="text-lg font-black text-slate-900">About this item</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {toy.description}
            </p>

            <h3 className="mt-4 text-sm font-black text-slate-900">Key Features</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {toy.features.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#e8d6bf] bg-white p-5">
            <h2 className="text-lg font-black text-slate-900">Specifications</h2>
            <div className="mt-3 divide-y divide-[#f1e3d1] rounded-xl border border-[#efe0ce]">
              {[
                ["Age Group", toy.ageGroup],
                ["Material", toy.material],
                ["Finish", toy.finish],
                ["Dimensions", toy.dimensions],
                ["Weight", toy.weight],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[120px_1fr] gap-3 p-3 text-sm">
                  <span className="font-semibold text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-900">In The Box</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {toy.inTheBox.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-[#e8d6bf] bg-white p-5 lg:sticky lg:top-24">
          <p className="text-sm text-slate-500 line-through">MRP: Rs. {toy.mrp}</p>
          <p className="mt-1 text-3xl font-black text-slate-900">
            Rs. {toy.offerPrice}
          </p>
          <p className="mt-1 text-sm font-bold text-green-700">
            Save Rs. {savings} ({discountPercent}% off)
          </p>

          <div className="mt-4 rounded-xl bg-[#fff7ed] p-3 text-sm font-semibold text-[#8a4f2b]">
            Inclusive of all taxes
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p className="inline-flex items-center gap-2">
              <FiTruck className="text-[#8a4f2b]" size={15} />
              Fast delivery available
            </p>
            <p className="inline-flex items-center gap-2">
              <FiShield className="text-[#8a4f2b]" size={15} />
              Secure checkout
            </p>
            <p className="inline-flex items-center gap-2">
              <FiZap className="text-[#8a4f2b]" size={15} />
              Easy returns
            </p>
          </div>

          <div className="mt-5 grid gap-2">
            <button
              onClick={() => addToCart(toy.id)}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-[#8a4f2b] px-4 text-sm font-semibold text-white transition hover:bg-[#704123]"
            >
              <FiShoppingCart size={15} />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#f59e0b] px-4 text-sm font-semibold text-white transition hover:bg-[#d48806]"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-[#eadbc8] p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Delivery
            </p>
            <div className="mt-2 flex gap-2">
              <input
                placeholder="Enter pincode"
                value={pincode}
                onChange={(event) => setPincode(event.target.value.replace(/\D/g, ""))}
                maxLength={6}
                className="w-full rounded-lg border border-[#d9c3a7] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
              />
              <button
                onClick={checkDelivery}
                className="rounded-lg border border-[#8a4f2b] px-3 py-2 text-xs font-semibold text-[#8a4f2b]"
              >
                Check
              </button>
            </div>
            <p
              className={`mt-2 text-xs font-semibold ${
                deliveryOk === null
                  ? "text-slate-500"
                  : deliveryOk
                    ? "text-green-700"
                    : "text-red-600"
              }`}
            >
              {deliveryMsg}
            </p>
          </div>
        </aside>
      </section>

      <section className="mt-6 rounded-2xl border border-[#e8d6bf] bg-white p-5">
        <h2 className="text-lg font-black text-slate-900">Safety Information</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {toy.safety.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
