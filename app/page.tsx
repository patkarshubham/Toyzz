import Link from "next/link";
import FeaturedToyGrid from "@/components/Home/FeaturedToyGrid";
import FaqAccordion from "@/components/Home/FaqAccordion";
import Image from "next/image";
import HeroTypewriter from "@/components/Home/HeroTypewriter";

const categories = [
  {
    name: "Building Blocks",
    image: "/images/toys/pine-cube-starter-box.svg",
    skill: "Spatial Skills",
    vibe: "STEM Play",
    tone: "from-[#fff4ea] to-[#f3ddc5]",
  },
  {
    name: "Stacking & Sorting",
    image: "/images/toys/rainbow-ring-stacker.svg",
    skill: "Fine Motor",
    vibe: "Toddler Basics",
    tone: "from-[#f7f2ff] to-[#e9ddff]",
  },
  {
    name: "Pull-Along Toys",
    image: "/images/toys/elephant-pull-toy.svg",
    skill: "Movement",
    vibe: "Active Play",
    tone: "from-[#eef8ff] to-[#dbedff]",
  },
  {
    name: "Wooden Vehicles",
    image: "/images/toys/classic-pine-train.svg",
    skill: "Sequencing",
    vibe: "Adventure Play",
    tone: "from-[#fff6ee] to-[#f2e1cb]",
  },
  {
    name: "Pretend Play",
    image: "/images/toys/mini-kitchen-set.svg",
    skill: "Imagination",
    vibe: "Role Play",
    tone: "from-[#fff0f3] to-[#ffdfe8]",
  },
  {
    name: "Educational Montessori",
    image: "/images/toys/montessori-lock-board.svg",
    skill: "Focus",
    vibe: "Practical Learning",
    tone: "from-[#effff5] to-[#daf6e5]",
  },
  {
    name: "Puzzles & Brain Games",
    image: "/images/toys/forest-puzzle-pack.svg",
    skill: "Problem Solving",
    vibe: "Logic Growth",
    tone: "from-[#f5f7ff] to-[#e5eaff]",
  },
  {
    name: "Musical Toys",
    image: "/images/toys/pine-rhythm-kit.svg",
    skill: "Rhythm",
    vibe: "Sound Discovery",
    tone: "from-[#fff8ea] to-[#ffecc6]",
  },
  {
    name: "Dollhouse & Mini Furniture",
    image: "/images/toys/tiny-chair-and-table.svg",
    skill: "Storytelling",
    vibe: "Mini World",
    tone: "from-[#fff5ef] to-[#ffe3d2]",
  },
  {
    name: "Animal Figurines",
    image: "/images/toys/woodland-animal-set.svg",
    skill: "Vocabulary",
    vibe: "Nature Stories",
    tone: "from-[#f3fff2] to-[#dcf6db]",
  },
  {
    name: "Outdoor Wooden Toys",
    image: "/images/toys/garden-sand-scoop.svg",
    skill: "Outdoor Confidence",
    vibe: "Sensory Activity",
    tone: "from-[#eefcff] to-[#d9f1f7]",
  },
  {
    name: "Balance & Coordination",
    image: "/images/toys/balance-beam-trio.svg",
    skill: "Body Control",
    vibe: "Physical Growth",
    tone: "from-[#f4f2ff] to-[#e6e1ff]",
  },
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
  {
    title: "Pine Wood Handcrafted Build",
    text: "Natural pine texture supports sensory play and curiosity.",
    image: "/images/toys/pine-cube-starter-box.svg",
  },
  {
    title: "Non-Toxic Child-Safe Finish",
    text: "Safe coatings reduce worry and encourage daily confident play.",
    image: "/images/toys/rainbow-ring-stacker.svg",
  },
  {
    title: "Rounded Splinter-Safe Edges",
    text: "Comfortable grip helps children practice independent handling.",
    image: "/images/toys/elephant-pull-toy.svg",
  },
  {
    title: "Learning Through Play",
    text: "Play routines improve focus, memory, and problem-solving.",
    image: "/images/toys/forest-puzzle-pack.svg",
  },
  {
    title: "Motor Skill Development",
    text: "Stacking and movement toys strengthen hand-eye coordination.",
    image: "/images/toys/montessori-lock-board.svg",
  },
  {
    title: "Creative Story Building",
    text: "Role-play and figurines expand imagination and language growth.",
    image: "/images/toys/woodland-animal-set.svg",
  },
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

const toCategorySlug = (category: string) =>
  category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default function Home() {
  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_0%_20%,#f4e2ce_0%,transparent_30%),radial-gradient(circle_at_100%_0%,#efd8bf_0%,transparent_35%),linear-gradient(180deg,#fff9f3_0%,#fff4e8_100%)]">
      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-8 pt-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:pt-20">
        <div className="animate-rise-up">
          <p className="mb-3 inline-block rounded-full border border-[#dcb892] bg-[#f5e1ca] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#7c4526]">
            PineToyzz handcrafted collection
          </p>
          <h1 className="text-slate-900 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Pine Wooden Toys for Growing Minds -
            <HeroTypewriter />
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

        <div className="relative">
          <div className="absolute -left-4 top-10 h-32 w-32 rounded-full bg-[#f7dfc4] blur-2xl md:h-44 md:w-44" />
          <div className="absolute -right-4 bottom-8 h-32 w-32 rounded-full bg-[#f0d2b3] blur-2xl md:h-44 md:w-44" />

          {/* <article className="relative overflow-hidden rounded-[28px] border border-[#e8d6bf] bg-[#8a4f2b]/10 p-4 shadow-lg backdrop-blur md:p-6"> */}
          {/* <div className="relative h-[300px] w-full overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#fff7ee_0%,#f5e1cb_100%)] md:h-[420px]"> */}
          <div className="relative h-[300px] w-full overflow-hidden rounded-2xl md:h-[450px]">
            <Image
              src="/images/hero/girl.svg"
              alt="Girl enjoying pine wooden toys"
              fill
              priority
              className="object-contain p-3 md:p-5"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          {/* </article> */}
        </div>
      </section>

      <section className="bg-white">
        <FeaturedToyGrid />
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="rounded-3xl border border-[#e7d2b8] bg-white p-6 md:p-10">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-slate-900 text-3xl font-black">
              Why Parents Choose{" "}
              <span className="text-[#7d4b2a]">PineToyzz</span>
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl text-sm">
              We focus on safe materials, premium craft quality, transparent
              pricing, and a shopping journey that is simple from discovery to
              checkout.
            </p>
          </div>

          {/* Content Layout */}
          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* LEFT SIDE IMAGE */}
            <div className="relative h-[460px] w-full">
              <Image
                src="/images/hero/parent.svg"
                alt="Parent"
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* RIGHT SIDE POINTS */}
            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.slice(0, 6).map((point) => (
                <article
                  key={point.title}
                  className="rounded-2xl border border-[#ead8c3] bg-[#fffaf4] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-sm font-extrabold text-[#7d4b2a]">
                    {point.title}
                  </h3>
                  <p className="text-slate-600 mt-1 text-xs leading-relaxed">
                    {point.text}
                  </p>
                </article>
              ))}
            </div>
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

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-6">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/categories"
            className="text-slate-900 text-3xl font-black hover:text-[#8a4f2b]"
          >
            All Pine Wood Categories
          </Link>
          <span className="rounded-full bg-[#f1dfcb] px-4 py-2 text-sm font-semibold text-[#8a4f2b]">
            {categories.length} Categories
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories#${toCategorySlug(category.name)}`}
              className="group overflow-hidden rounded-2xl border border-[#e8d6bf] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`relative h-28 bg-gradient-to-br ${category.tone}`}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain p-2 transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8a4f2b]">
                  {category.vibe}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-slate-900 text-lg font-extrabold">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-[#8a4f2b]">
                  Core Skill: {category.skill}
                </p>
                <p className="text-slate-600 mt-1 text-sm">
                  Premium handcrafted pine toys with child-safe finish and
                  long-life durability.
                </p>
              </div>
            </Link>
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
