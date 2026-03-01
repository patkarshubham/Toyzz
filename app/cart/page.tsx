"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCommerce } from "@/app/commerce-store";
import { toyProducts } from "@/app/data/toys";
import type { ToyProduct } from "@/app/data/toys";
import { toToyProducts } from "@/app/lib/catalog-normalizer";

type PaymentMethod = "card" | "upi" | "cod";

export default function CartPage() {
  const {
    user,
    cart,
    wishlist,
    address,
    delivery,
    updateCartQty,
    removeFromCart,
    toggleWishlist,
    moveWishlistToCart,
    setAddressField,
    checkPincode,
    placeOrder,
  } = useCommerce();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [businessConsent, setBusinessConsent] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderOk, setOrderOk] = useState(false);
  const [catalogProducts, setCatalogProducts] =
    useState<ToyProduct[]>(toyProducts);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        const json = await response.json();
        if (Array.isArray(json?.data) && json.data.length) {
          setCatalogProducts(toToyProducts(json.data));
        }
      } catch {
        setCatalogProducts(toyProducts);
      }
    };

    loadCatalog();
  }, []);

  const cartItems = useMemo(
    () =>
      catalogProducts
        .filter((item) => cart[item.id])
        .map((item) => ({ ...item, qty: cart[item.id] })),
    [cart, catalogProducts],
  );

  const wishlistItems = useMemo(
    () => catalogProducts.filter((item) => wishlist.includes(item.id)),
    [wishlist, catalogProducts],
  );

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.offerPrice * item.qty,
      0,
    );
    const shipping = subtotal > 3000 ? 0 : subtotal > 0 ? 99 : 0;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [cartItems]);

  const validatePayment = () => {
    if (paymentMethod === "cod") return true;

    if (paymentMethod === "upi") {
      return /.+@.+/.test(upiId.trim());
    }

    const sanitizedNumber = card.number.replace(/\s/g, "");
    return (
      !!card.holder.trim() &&
      /^\d{16}$/.test(sanitizedNumber) &&
      /^\d{2}\/\d{2}$/.test(card.expiry) &&
      /^\d{3}$/.test(card.cvv)
    );
  };

  const onPlaceOrder = async () => {
    if (!businessConsent) {
      setOrderOk(false);
      setOrderMessage("Please accept checkout terms before placing order.");
      return;
    }

    if (!validatePayment()) {
      setOrderOk(false);
      setOrderMessage("Please complete valid payment details.");
      return;
    }

    const result = await placeOrder();
    setOrderMessage(result.message);
    setOrderOk(result.ok);

    if (result.ok) {
      setCard({ holder: "", number: "", expiry: "", cvv: "" });
      setUpiId("");
      setBusinessConsent(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
      <section className="mb-6 rounded-3xl border border-[#e5ceb2] bg-[linear-gradient(130deg,#fff8f0,#f6e4d0)] p-5 md:p-6">
        <h1 className="text-slate-900 text-3xl font-black md:text-4xl">
          Cart & Checkout
        </h1>
        <p className="text-slate-700 mt-2 text-sm">
          Professional business flow: cart review, wishlist management, customer
          details, address, pincode delivery check, and payment confirmation.
        </p>
        {!user && (
          <div className="mt-3 rounded-2xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            Login required for order placement and account sync.
            <Link href="/auth/login" className="ml-1 underline">
              Login
            </Link>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Cart",
            "Wishlist",
            "Address",
            "Delivery",
            "Payment",
            "Confirm",
          ].map((step) => (
            <span
              key={step}
              className="rounded-full border border-[#d4b08a] bg-white px-3 py-1 text-xs font-semibold text-[#7f4829]"
            >
              {step}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <section className="rounded-3xl border border-[#e8d6bf] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-slate-900 text-2xl font-black">
                Cart Products
              </h2>
              <Link
                href="/shop"
                className="rounded-full border border-[#8a4f2b] px-3 py-1 text-xs font-semibold text-[#8a4f2b]"
              >
                Add More Products
              </Link>
            </div>

            {!cartItems.length ? (
              <p className="text-slate-700 rounded-xl bg-[#f4e7d8] p-3 text-sm">
                Your cart is empty. Add products from shop.
              </p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-2xl border border-[#e7d6c4] p-3"
                  >
                    <Link
                      href={`/shop/${item.slug}`}
                      className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#e7d6c4] bg-[#fff8ef]"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-slate-900 font-bold hover:text-[#8a4f2b] hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-slate-500 text-xs">{item.category}</p>
                      <p className="text-sm font-semibold text-[#8a4f2b]">
                        Rs. {item.offerPrice} each
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="border-slate-300 h-7 w-7 rounded-full border text-sm"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="border-slate-300 h-7 w-7 rounded-full border text-sm"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 ml-auto text-xs font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section
            id="wishlist"
            className="rounded-3xl border border-[#e8d6bf] bg-white p-5"
          >
            <h2 className="text-slate-900 text-2xl font-black">
              Wishlist Products
            </h2>
            <div className="mt-4 space-y-3">
              {!wishlistItems.length ? (
                <p className="text-slate-700 rounded-xl bg-[#f4e7d8] p-3 text-sm">
                  Wishlist is empty.
                </p>
              ) : (
                wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#e7d6c4] p-3"
                  >
                    <Link
                      href={`/shop/${item.slug}`}
                      className="text-slate-900 font-bold hover:text-[#8a4f2b] hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-slate-600 text-sm">
                      Rs. {item.offerPrice}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => moveWishlistToCart(item.id)}
                        className="rounded-full bg-[#8a4f2b] px-3 py-1 text-xs font-semibold text-white"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(item.id)}
                        className="rounded-full border border-[#8a4f2b] px-3 py-1 text-xs font-semibold text-[#8a4f2b]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-[#e8d6bf] bg-white p-5">
            <h2 className="text-slate-900 text-2xl font-black">
              Customer & Address Details
            </h2>
            <div className="mt-4 grid gap-2">
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  placeholder="Customer Name"
                  value={address.fullName}
                  onChange={(event) =>
                    setAddressField("fullName", event.target.value)
                  }
                  className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={address.email}
                  onChange={(event) =>
                    setAddressField("email", event.target.value)
                  }
                  className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
                />
              </div>

              <input
                placeholder="Phone"
                value={address.phone}
                onChange={(event) =>
                  setAddressField("phone", event.target.value)
                }
                className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
              />
              <textarea
                placeholder="Address line 1"
                rows={2}
                value={address.line1}
                onChange={(event) =>
                  setAddressField("line1", event.target.value)
                }
                className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
              />
              <input
                placeholder="Address line 2 (optional)"
                value={address.line2}
                onChange={(event) =>
                  setAddressField("line2", event.target.value)
                }
                className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
              />

              <div className="grid gap-2 md:grid-cols-2">
                <input
                  placeholder="City"
                  value={address.city}
                  onChange={(event) =>
                    setAddressField("city", event.target.value)
                  }
                  className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
                />
                <input
                  placeholder="State"
                  value={address.state}
                  onChange={(event) =>
                    setAddressField("state", event.target.value)
                  }
                  className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
                />
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(event) =>
                    setAddressField(
                      "pincode",
                      event.target.value.replace(/\D/g, ""),
                    )
                  }
                  maxLength={6}
                  className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
                />
                <button
                  onClick={() => checkPincode(address.pincode)}
                  className="rounded-xl bg-[#8a4f2b] px-4 py-2 text-xs font-semibold text-white"
                >
                  Check Delivery
                </button>
              </div>

              <p
                className={`text-xs font-semibold ${
                  delivery.checked
                    ? delivery.isServiceable
                      ? "text-green-700"
                      : "text-red-600"
                    : "text-slate-600"
                }`}
              >
                {delivery.message}
                {delivery.isServiceable && delivery.eta
                  ? ` ETA: ${delivery.eta}`
                  : ""}
              </p>
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <section className="rounded-3xl border border-[#e8d6bf] bg-white p-5">
            <h2 className="text-slate-900 text-2xl font-black">
              Order Summary
            </h2>
            <div className="mt-4 space-y-1 text-sm">
              <div className="text-slate-700 flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="text-slate-700 flex justify-between">
                <span>Shipping</span>
                <span>Rs. {totals.shipping.toFixed(2)}</span>
              </div>
              <div className="text-slate-700 flex justify-between">
                <span>Tax (5%)</span>
                <span>Rs. {totals.tax.toFixed(2)}</span>
              </div>
              <div className="text-slate-900 mt-2 flex justify-between border-t border-[#efe1cf] pt-2 text-base font-black">
                <span>Final Total</span>
                <span>Rs. {totals.total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e8d6bf] bg-white p-5">
            <h2 className="text-slate-900 text-2xl font-black">Payment</h2>
            <div className="mt-3 grid gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Credit / Debit Card
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                />
                UPI
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>
            </div>

            {paymentMethod === "card" && (
              <div className="mt-3 grid gap-2">
                <input
                  placeholder="Card Holder Name"
                  value={card.holder}
                  onChange={(event) =>
                    setCard((prev) => ({ ...prev, holder: event.target.value }))
                  }
                  className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm"
                />
                <input
                  placeholder="Card Number"
                  value={card.number}
                  onChange={(event) =>
                    setCard((prev) => ({ ...prev, number: event.target.value }))
                  }
                  className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(event) =>
                      setCard((prev) => ({
                        ...prev,
                        expiry: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="CVV"
                    value={card.cvv}
                    onChange={(event) =>
                      setCard((prev) => ({ ...prev, cvv: event.target.value }))
                    }
                    className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="mt-3 grid gap-2">
                <input
                  placeholder="UPI ID (example@bank)"
                  value={upiId}
                  onChange={(event) => setUpiId(event.target.value)}
                  className="w-full rounded-xl border border-[#e6d6c4] px-3 py-2 text-sm"
                />
              </div>
            )}

            {paymentMethod === "cod" && (
              <p className="mt-3 rounded-xl bg-[#fff6ec] p-3 text-xs font-semibold text-[#7f4829]">
                COD available only for serviceable pincodes and eligible order
                values.
              </p>
            )}

            <label className="text-slate-600 mt-3 flex items-start gap-2 text-xs">
              <input
                type="checkbox"
                checked={businessConsent}
                onChange={(event) => setBusinessConsent(event.target.checked)}
                className="mt-0.5"
              />
              I agree to PineToyzz terms, privacy policy, and authorize payment
              for this order.
            </label>

            <button
              onClick={onPlaceOrder}
              className="hover:bg-slate-700 mt-4 w-full rounded-full bg-[#8a4f2b] px-4 py-3 text-sm font-semibold text-white"
            >
              Confirm & Place Order
            </button>

            {orderMessage && (
              <p
                className={`mt-3 rounded-xl p-3 text-sm font-semibold ${
                  orderOk
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {orderMessage}
              </p>
            )}
          </section>
        </aside>
      </section>
    </main>
  );
}
