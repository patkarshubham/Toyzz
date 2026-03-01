import Link from "next/link";
import FeaturedToyGrid from "@/components/Home/FeaturedToyGrid";
import FaqAccordion from "@/components/Home/FaqAccordion";

const categories = [
  "Building Blocks",
  "Stacking & Sorting",
  "Pull-Along Toys",
  "Wooden Vehicles",
  "Pretend Play",
  "Educational Montessori",
  "Puzzles & Brain Games",
  "Musical Toys",
  "Dollhouse & Mini Furniture",
  "Animal Figurines",
  "Outdoor Wooden Toys",
  "Balance & Coordination",
];

const flowSteps = [
  {
    title: "Discover",
    text: "Browse handcrafted categories and open any product page for complete details.",
  },
  {
    title: "Save & Compare",
    text: "Shortlist toys in wishlist, compare price offers, then move selected items to cart.",
  },
  {
    title: "Checkout Smoothly",
    text: "Add address, check pincode delivery, and place order in one simple checkout panel.",
  },
];

const highlights = [
  "Pine wood handcrafted build",
  "Non-toxic child-safe finish",
  "Rounded edges and splinter-safe polish",
  "MRP and offer pricing on every toy",
  "Wishlist + cart + pincode delivery flow",
  "Fast checkout designed for parents",
];

const faqs = [
  {
    question: "Are PineToyzz products safe for children?",
    answer:
      "Yes. Our toys are made from pine wood with rounded edges and non-toxic child-safe finishes. Please follow the recommended age guidance on each product.",
  },
  {
    question: "Do all products show MRP and offer price?",
    answer:
      "Yes. Every product card and detail page clearly displays MRP, offer price, and discount percentage.",
  },
  {
    question: "How can I check delivery availability?",
    answer:
      "Add products to cart, go to the Cart page, enter your pincode in the address section, and click Check Delivery to verify serviceability and ETA.",
  },
  {
    question: "Can I move products from wishlist to cart?",
    answer:
      "Yes. In the Cart page wishlist section, click Move to Cart for any saved product.",
  },
  {
    question: "What payment options are available?",
    answer:
      "You can pay via Credit/Debit Card, UPI, or Cash on Delivery (COD) where eligible.",
  },
  {
    question: "How do returns and refunds work?",
    answer:
      "You can raise return or refund requests within our policy window. Approved refunds are processed to the original payment method.",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_0%_20%,#f4e2ce_0%,transparent_30%),radial-gradient(circle_at_100%_0%,#efd8bf_0%,transparent_35%),linear-gradient(180deg,#fff9f3_0%,#fff4e8_100%)]">
      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-8 pt-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:pt-20">
        <div className="animate-rise-up">
          <p className="mb-3 inline-block rounded-full border border-[#dcb892] bg-[#f5e1ca] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#7c4526]">
            PineToyzz handcrafted collection
          </p>
          <h1 className="text-slate-900 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Creative Wooden Toys,
            <span className="block text-[#8a4f2b]">
              Smooth Shopping Experience
            </span>
          </h1>
          <p className="text-slate-700 mt-5 max-w-2xl text-base leading-relaxed md:text-lg">
            Explore premium pine-wood toyz with rich product view, wishlist,
            smart cart, pincode delivery check, and quick checkout flow built
            for easy shopping.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-[#8a4f2b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6f3f22]"
            >
              Start Shopping
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-[#8a4f2b] px-6 py-3 text-sm font-semibold text-[#8a4f2b] transition hover:bg-[#f3e2d0]"
            >
              About PineToyzz
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="animate-rise-up rounded-3xl border border-[#e8d6bf] bg-white/90 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-black text-[#8a4f2b]">100% pine wood</p>
            <p className="text-slate-600 mt-2 text-sm">
              Natural grain texture, rounded edges, child-safe finish.
            </p>
          </article>
          <article className="animate-rise-up rounded-3xl border border-[#e8d6bf] bg-white/90 p-5 shadow-sm backdrop-blur [animation-delay:120ms]">
            <p className="text-sm font-black text-[#8a4f2b]">
              Easy cart journey
            </p>
            <p className="text-slate-600 mt-2 text-sm">
              Add, edit, wishlist, address, pincode, and place order fast.
            </p>
          </article>
          <article className="animate-rise-up rounded-3xl border border-[#e8d6bf] bg-white/90 p-5 shadow-sm backdrop-blur [animation-delay:220ms] md:col-span-2">
            <p className="text-sm font-black text-[#8a4f2b]">
              Offer pricing always visible
            </p>
            <p className="text-slate-600 mt-2 text-sm">
              Every product clearly shows MRP, offer price, and discount.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="rounded-3xl border border-[#e7d2b8] bg-white p-6 md:p-8">
          <h2 className="text-slate-900 text-3xl font-black">
            Why Parents Choose PineToyzz
          </h2>
          <p className="text-slate-600 mt-2 max-w-3xl text-sm">
            We focus on safe materials, premium craft quality, transparent
            pricing, and a shopping journey that is simple from discovery to
            checkout.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((point) => (
              <div
                key={point}
                className="rounded-xl bg-[#fff6ec] p-3 text-sm font-semibold text-[#7d4b2a]"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-slate-900 text-3xl font-black">
            How Shopping Flows
          </h2>
          <Link
            href="/shop"
            className="rounded-full border border-[#8a4f2b] px-4 py-2 text-xs font-semibold text-[#8a4f2b]"
          >
            Open Full Flow
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {flowSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-3xl border border-[#e7d2b8] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
                Step {index + 1}
              </p>
              <h3 className="text-slate-900 mt-2 text-xl font-extrabold">
                {step.title}
              </h3>
              <p className="text-slate-600 mt-2 text-sm">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <FeaturedToyGrid />

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-slate-900 text-3xl font-black">
            All Pine Wood Categories
          </h2>
          <span className="rounded-full bg-[#f1dfcb] px-4 py-2 text-sm font-semibold text-[#8a4f2b]">
            {categories.length} Categories
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category}
              className="rounded-2xl border border-[#e8d6bf] bg-white p-4 shadow-sm transition hover:bg-[#fff8f1]"
            >
              <h3 className="text-slate-900 text-lg font-extrabold">
                {category}
              </h3>
              <p className="text-slate-600 mt-2 text-sm">
                Handcrafted in solid pine wood with non-toxic finish and rounded
                edges.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-slate-900 text-3xl font-black">
            Frequently Asked Questions
          </h2>
          <Link
            href="/contact"
            className="rounded-full border border-[#8a4f2b] px-4 py-2 text-xs font-semibold text-[#8a4f2b]"
          >
            Need More Help?
          </Link>
        </div>

        <FaqAccordion items={faqs} />
      </section>
    </main>
  );
}
