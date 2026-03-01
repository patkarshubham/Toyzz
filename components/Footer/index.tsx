import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-[#e8d6bf] bg-[#f7efe6]">
      <div className="text-slate-700 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-sm md:flex-row md:px-6 md:text-left">
        <p>© 2026 PineToyzz Handmade.</p>
        <Link
          href="/terms-and-conditions"
          className="hover:font-semibold hover:text-[#8a4f2b] hover:underline"
        >
          Terms and Conditions
        </Link>
        <Link
          href="/privacy-policy"
          className="hover:font-semibold hover:text-[#8a4f2b] hover:underline"
        >
          Privacy Policy
        </Link>
        <Link
          href="/about"
          className="hover:font-semibold hover:text-[#8a4f2b] hover:underline"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="hover:font-semibold hover:text-[#8a4f2b] hover:underline"
        >
          Contact
        </Link>
        <p>
          Pine wood toys crafted with natural polish and rounded child-safe
          edges.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
