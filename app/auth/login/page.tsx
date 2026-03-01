"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCommerce } from "@/app/commerce-store";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUserState } = useCommerce();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        setMessage(String(payload?.message || "Login failed."));
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
      <section className="grid overflow-hidden rounded-3xl border border-[#e5d5c2] bg-white shadow-sm md:grid-cols-[1fr_420px]">
        <article className="bg-[linear-gradient(135deg,#fff7ed,#f5e1cc)] p-6 md:p-10">
          <p className="inline-flex rounded-full border border-[#d4b28f] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#8a4f2b]">
            PineToyzz Account
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900">
            Login To Continue Shopping
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Manage your profile, saved addresses, cart, wishlist, and order
            history in one place with secure account access.
          </p>
          <div className="mt-6 grid gap-2 text-sm font-semibold text-slate-700">
            <p>Profile + Address Management</p>
            <p>Secure Order Tracking</p>
            <p>Persistent Wishlist and Cart Sync</p>
          </div>
        </article>

        <article className="p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-900">Login</h2>
          <p className="mt-1 text-xs text-slate-600">
            Use your registered email and password.
          </p>
          <form onSubmit={onSubmit} className="mt-5 grid gap-3">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Enter email"
              className="rounded-xl border border-[#dcc8af] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Enter password"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-600">
            New customer?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#8a4f2b] underline">
              Create account
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
