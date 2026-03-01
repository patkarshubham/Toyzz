"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCommerce } from "@/app/commerce-store";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import { BiUser } from "react-icons/bi";

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const pathname = usePathname();
  const { cartCount, wishlistCount, user, loadingUser } = useCommerce();

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8d6bf] bg-[#fef8f1]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-[#8a4f2b]"
        >
          PineToyzz
        </Link>

        <nav className="flex items-center gap-3 md:gap-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex text-sm font-semibold transition ${
                pathname === item.href
                  ? "text-[#8a4f2b]"
                  : "text-slate-700 hover:text-[#8a4f2b]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/cart#wishlist"
            className="rounded-full border border-[#8a4f2b] bg-white px-3 py-1.5 text-xs font-semibold text-[#8a4f2b]"
          >
            <FaHeart className="mr-1 inline" /> {wishlistCount}
          </Link>

          <Link
            href="/cart"
            className="rounded-full bg-[#8a4f2b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#704123]"
          >
            <FaCartPlus className="mr-1 inline" /> {cartCount}
          </Link>

          {loadingUser ? (
            <span className="text-slate-500 text-xs font-semibold">
              <BiUser />
            </span>
          ) : user ? (
            <Link
              href="/profile"
              className={`text-sm font-semibold transition ${
                pathname === "/profile"
                  ? "text-[#8a4f2b]"
                  : "text-slate-700 hover:text-[#8a4f2b]"
              }`}
            >
              My Profile
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className={`text-sm font-semibold transition ${
                pathname.startsWith("/auth")
                  ? "text-[#8a4f2b]"
                  : "text-slate-700 hover:text-[#8a4f2b]"
              }`}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
