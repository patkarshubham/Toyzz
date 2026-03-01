"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_STORAGE_KEY } from "@/app/lib/admin-auth-client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-[#8a4f2b] px-4 py-2 text-xs font-semibold text-[#8a4f2b] transition hover:bg-[#f3e2d0] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
