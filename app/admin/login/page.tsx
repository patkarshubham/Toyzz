"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ADMIN_DEMO_EMAIL,
  ADMIN_DEMO_PASSWORD,
  ADMIN_SESSION_VALUE,
  ADMIN_STORAGE_KEY,
  validateAdminCredentials,
} from "@/app/lib/admin-auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_DEMO_EMAIL);
  const [password, setPassword] = useState(ADMIN_DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const valid = validateAdminCredentials(email, password);

    if (!valid) {
      setError("Invalid admin credentials.");
      setLoading(false);
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_STORAGE_KEY, ADMIN_SESSION_VALUE);
    }

    router.push("/admin");
    router.refresh();
    setLoading(false);
  };

  return (
    <main className="mx-auto flex w-full max-w-md px-4 py-14 md:py-20">
      <section className="w-full rounded-3xl border border-[#e7d2b8] bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
          PineToyzz Admin Portal
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Login to manage catalog, revenue, delivery, pickup, and order flow.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Admin email"
            className="w-full rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-[#e4d2bc] px-3 py-2 text-sm outline-none focus:border-[#8a4f2b]"
          />

          {error && (
            <p className="rounded-xl bg-red-50 p-2 text-xs font-semibold text-red-700">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-full bg-[#8a4f2b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#704123] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login as Admin"}
          </button>
        </form>
      </section>
    </main>
  );
}
