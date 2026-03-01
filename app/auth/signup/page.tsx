"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCommerce } from "@/app/commerce-store";

export default function SignupPage() {
  const router = useRouter();
  const { refreshUserState } = useCommerce();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        setMessage(String(payload?.message || "Signup failed."));
        setLoading(false);
        return;
      }

      await refreshUserState();
      router.push("/profile");
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-16">
      <section className="grid overflow-hidden rounded-3xl border border-[#e5d5c2] bg-white shadow-sm md:grid-cols-[1fr_460px]">
        <article className="bg-[linear-gradient(140deg,#fff8f0,#f1dfc8)] p-6 md:p-10">
          <p className="inline-flex rounded-full border border-[#d4b28f] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#8a4f2b]">
            New PineToyzz Member
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900">
            Create Your Shopping Account
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Register once and keep your profile details, addresses, cart,
            wishlist, and orders synced securely.
          </p>
          <div className="mt-6 grid gap-2 text-sm font-semibold text-slate-700">
            <p>Address Book and Checkout Ready</p>
            <p>Order History and Status Tracking</p>
            <p>Saved Items Across Devices</p>
          </div>
        </article>

        <article className="p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-900">Create Account</h2>
          <p className="mt-1 text-xs text-slate-600">
            Fill details to start shopping with full account flow.
          </p>
          <form onSubmit={onSubmit} className="mt-5 grid gap-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Email"
              className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone number"
              className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Password (minimum 8 chars)"
              className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
            />
            {message && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                {message}
              </p>
            )}
            <button
              disabled={loading}
              className="rounded-xl bg-[#8a4f2b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#724026] disabled:opacity-70"
              type="submit"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-600">
            Already have account?{" "}
            <Link href="/auth/login" className="font-semibold text-[#8a4f2b] underline">
              Login
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
