import Link from "next/link";

export const metadata = {
  title: "404 | PineToyzz",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center px-4 py-16 md:px-6">
      <section className="w-full rounded-3xl border border-[#e8d6bf] bg-[radial-gradient(circle_at_20%_20%,#f6eadc_0%,transparent_35%),#fff9f2] p-8 text-center md:p-12">
        <p className="mx-auto mb-4 inline-block rounded-full bg-[#efdbc5] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
          Error 404
        </p>

        <h1 className="text-4xl font-black text-slate-900 md:text-6xl">
          Oops, Toy Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base">
          The page you are looking for does not exist or may have been moved.
          Let&apos;s get you back to PineToyzz and continue shopping.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#8a4f2b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#704123]"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-[#8a4f2b] px-6 py-3 text-sm font-semibold text-[#8a4f2b] hover:bg-[#f4e7d8]"
          >
            Explore Toys
          </Link>
        </div>
      </section>
    </main>
  );
}
