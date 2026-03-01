import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About PineToyzz | Premium Pine Wood Handcrafted Toys",
  description:
    "Learn how PineToyzz creates premium handcrafted pine wood toys through careful material selection, child-safe finishing, strict quality checks, and purposeful play design.",
};

const brandPillars = [
  {
    title: "Premium Pine Selection",
    text: "We hand-pick pine wood for grain quality, durability, and smooth touch.",
    image: "/images/hero/wood-cut.jpg",
  },
  {
    title: "Child-Safe Finishing",
    text: "Every toy receives rounded-edge sanding and non-toxic protective finishing.",
    image: "/images/toys/rainbow-ring-stacker.svg",
  },
  {
    title: "Learning-Led Design",
    text: "Each toy is built to support creativity, focus, coordination, and confidence.",
    image: "/images/toys/montessori-lock-board.svg",
  },
];

const workflow = [
  {
    step: "Step 1",
    title: "Wood Sourcing & Cutting",
    text: "Seasoned pine logs are selected, moisture-balanced, and precision-cut into toy-grade components.",
    image: "/images/workflow/sourcing-cutting.svg",
  },
  {
    step: "Step 2",
    title: "Handcraft Shaping",
    text: "Artisans shape parts manually to preserve natural grain and maintain balanced dimensions.",
    image: "/images/workflow/handcraft-shaping.svg",
  },
  {
    step: "Step 3",
    title: "Safety Sanding & Edge Softening",
    text: "Multiple sanding stages remove splinters and create rounded touch-safe edges.",
    image: "/images/workflow/safety-sanding.svg",
  },
  {
    step: "Step 4",
    title: "Non-Toxic Coating",
    text: "Water-based child-safe coatings are applied for durability and skin-safe handling.",
    image: "/images/workflow/non-toxic-coating.svg",
  },
  {
    step: "Step 5",
    title: "Quality Validation",
    text: "Each piece is checked for finish consistency, assembly strength, and safe usage readiness.",
    image: "/images/workflow/quality-validation.svg",
  },
  {
    step: "Step 6",
    title: "Final Packing & Dispatch",
    text: "Products are packed with protective care notes and shipped with transparent tracking flow.",
    image: "/images/workflow/packing-dispatch.svg",
  },
];

const qualityChecklist = [
  "Rounded corners and smooth edges",
  "Lead-free, non-toxic child-safe coatings",
  "Manual inspection before packaging",
  "Durable joinery for long-life usage",
  "Clear age guidance and safety notes",
  "Eco-aware materials and reduced plastic usage",
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-12 md:px-6 md:py-16">
      <section className="grid gap-6 rounded-3xl border border-[#e8d6bf] bg-[radial-gradient(circle_at_10%_20%,#f6eadc_0%,transparent_35%),#fffaf4] p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div>
          <p className="mb-3 inline-block rounded-full bg-[#ecdac5] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
            About PineToyzz
          </p>
          <h1 className="text-slate-900 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
            Premium Pine Wood Toys Crafted for Safe, Intelligent Play
          </h1>
          <p className="text-slate-700 mt-4 max-w-3xl text-sm leading-relaxed md:text-base">
            PineToyzz creates handcrafted wooden toys designed for modern
            families who value safety, quality, and long-term developmental
            impact. Our products are made with purpose: to inspire imagination,
            support skill growth, and deliver trusted premium quality.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-[#8a4f2b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#704123]"
            >
              Explore Toy Collection
            </Link>
            <Link
              href="/categories"
              className="rounded-full border border-[#8a4f2b] px-6 py-3 text-sm font-semibold text-[#8a4f2b] hover:bg-[#f4e7d8]"
            >
              Browse Categories
            </Link>
          </div>
        </div>

        <article className="overflow-hidden rounded-2xl border border-[#eadbc8] bg-white shadow-sm">
          <div className="relative h-[320px] bg-[linear-gradient(180deg,#fff8ef_0%,#f6e4cf_100%)] md:h-full">
            <Image
              src="/images/hero/boy.svg"
              alt="PineToyzz premium handcrafted toys"
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {brandPillars.map((item) => (
          <article
            key={item.title}
            className="overflow-hidden rounded-2xl border border-[#e7d3bc] bg-white shadow-sm"
          >
            <div className="h-320 relative bg-[linear-gradient(180deg,#fff8ef_0%,#f8e8d5_100%)]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain p-2"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-extrabold text-[#8a4f2b]">
                {item.title}
              </h2>
              <p className="text-slate-700 mt-2 text-sm">{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-[#e8d6bf] bg-white p-6 md:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-slate-900 text-2xl font-black md:text-3xl">
            Premium Toy Manufacturing Workflow
          </h2>
          <span className="rounded-full bg-[#f3e2cf] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
            End-to-End Craft Process
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workflow.map((item) => (
            <article
              key={item.step}
              className="overflow-hidden rounded-2xl border border-[#e9d9c8] bg-[#fffdfb] shadow-sm"
            >
              <div className="relative h-36 bg-[linear-gradient(180deg,#fff9f1_0%,#f8e8d8_100%)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 1280px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8a4f2b]">
                  {item.step}
                </p>
                <h3 className="text-slate-900 mt-1 text-lg font-extrabold">
                  {item.title}
                </h3>
                <p className="text-slate-700 mt-2 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-[#e8d6bf] bg-white p-6 md:p-8">
          <h2 className="text-slate-900 text-2xl font-black md:text-3xl">
            Quality & Safety Checklist
          </h2>
          <p className="text-slate-700 mt-3 text-sm leading-relaxed">
            Every PineToyzz product follows strict internal quality checks
            before dispatch to ensure consistent premium quality and child-safe
            use.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {qualityChecklist.map((point) => (
              <div
                key={point}
                className="rounded-xl bg-[#fff6ec] px-3 py-2 text-sm font-semibold text-[#7c4728]"
              >
                {point}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[#e8d6bf] bg-[#fffaf4] p-6">
          <h2 className="text-slate-900 text-xl font-black">
            Our Promise to Parents
          </h2>
          <p className="text-slate-700 mt-3 text-sm leading-relaxed">
            We combine premium craftsmanship with clear pricing and dependable
            shopping experience. From product discovery to cart, pincode check,
            and checkout, we keep everything smooth and transparent.
          </p>
          <div className="mt-5 space-y-2">
            <Link
              href="/shop"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#8a4f2b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#704123]"
            >
              Shop Premium Toys
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#8a4f2b] px-4 py-2.5 text-sm font-semibold text-[#8a4f2b] hover:bg-[#f4e7d8]"
            >
              Contact PineToyzz
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
