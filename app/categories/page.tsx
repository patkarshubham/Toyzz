import Image from "next/image";
import Link from "next/link";
import { toyCategories, toyProducts } from "@/app/data/toys";

type CategoryMeta = {
  summary: string;
  bestFor: string;
  impactOnKids: string[];
};

const categoryMeta: Record<string, CategoryMeta> = {
  "Building Blocks": {
    summary: "Open-ended pine block sets for shape, structure, and creativity.",
    bestFor: "3+ years",
    impactOnKids: [
      "Builds spatial intelligence and early geometry understanding.",
      "Improves fine motor grip through stacking and balancing.",
      "Encourages independent creativity and problem-solving.",
    ],
  },
  "Stacking & Sorting": {
    summary: "Rings, towers, and sorting toys for foundational learning.",
    bestFor: "2+ years",
    impactOnKids: [
      "Strengthens hand control and finger precision.",
      "Supports color, size, and pattern recognition.",
      "Develops concentration through repetitive play.",
    ],
  },
  "Pull-Along Toys": {
    summary: "Movement toys that motivate early walkers to explore.",
    bestFor: "2+ years",
    impactOnKids: [
      "Improves walking confidence and gross motor movement.",
      "Enhances coordination between body and direction control.",
      "Creates active play habits at an early stage.",
    ],
  },
  "Wooden Vehicles": {
    summary: "Durable pine cars and trains for pretend travel stories.",
    bestFor: "3+ years",
    impactOnKids: [
      "Supports narrative and imagination-based play.",
      "Builds motion understanding and sequencing skills.",
      "Encourages social sharing during group play.",
    ],
  },
  "Pretend Play": {
    summary: "Role-play toys that mirror real-world routines.",
    bestFor: "4+ years",
    impactOnKids: [
      "Improves communication and expressive language.",
      "Develops emotional understanding through role simulation.",
      "Boosts confidence in everyday task imitation.",
    ],
  },
  "Educational Montessori": {
    summary: "Hands-on toys designed for practical and focused learning.",
    bestFor: "3+ years",
    impactOnKids: [
      "Improves attention span and independent task completion.",
      "Strengthens logic and structured thinking.",
      "Builds life-skill confidence with tactile activities.",
    ],
  },
  "Puzzles & Brain Games": {
    summary: "Interlocking and layered challenges for cognitive growth.",
    bestFor: "5+ years",
    impactOnKids: [
      "Enhances logical reasoning and memory recall.",
      "Develops patience and trial-and-error resilience.",
      "Improves visual matching and pattern analysis.",
    ],
  },
  "Musical Toys": {
    summary: "Rhythm and sound toys made with child-safe pine materials.",
    bestFor: "3+ years",
    impactOnKids: [
      "Improves auditory sensitivity and rhythm recognition.",
      "Supports sensory learning through sound exploration.",
      "Strengthens hand-eye coordination via instrument play.",
    ],
  },
  "Dollhouse & Mini Furniture": {
    summary: "Mini pine furniture sets for scene-building play.",
    bestFor: "4+ years",
    impactOnKids: [
      "Improves storytelling depth and creativity.",
      "Strengthens planning while building play scenes.",
      "Supports social and collaborative pretend play.",
    ],
  },
  "Animal Figurines": {
    summary: "Smooth pine animals for vocabulary and nature-based stories.",
    bestFor: "3+ years",
    impactOnKids: [
      "Expands vocabulary and object recognition.",
      "Supports memory through naming and grouping activities.",
      "Encourages curiosity about animals and environment.",
    ],
  },
  "Outdoor Wooden Toys": {
    summary: "Weather-friendly toys for active outdoor engagement.",
    bestFor: "3+ years",
    impactOnKids: [
      "Promotes physical activity and sensory exploration.",
      "Builds confidence in open-space play.",
      "Improves balance and coordination with movement tasks.",
    ],
  },
  "Balance & Coordination": {
    summary: "Balance-focused toys for posture and body control.",
    bestFor: "3+ years",
    impactOnKids: [
      "Strengthens body control and stability.",
      "Improves focus and movement planning.",
      "Builds confidence in physical challenges.",
    ],
  },
};

const palette = [
  "from-[#fff4ea] to-[#f4dfc7]",
  "from-[#f7f2ff] to-[#e7ddff]",
  "from-[#eef8ff] to-[#d8ecff]",
  "from-[#ecfff2] to-[#d7f6e2]",
];

const toSlug = (category: string) =>
  category.toLowerCase().replace(/&/g, "and").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

export default function CategoriesPage() {
  const categories = toyCategories.filter((item) => item !== "All");

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-10 md:px-6 md:py-14">
      <section className="rounded-3xl border border-[#e7d2b8] bg-[linear-gradient(120deg,#fff9f3_0%,#f7e6d4_100%)] p-6 md:p-8">
        <h1 className="text-3xl font-black text-slate-900 md:text-5xl">
          All Pine Wood Categories
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-base">
          Explore every handcrafted PineToyzz category with unique purpose,
          developmental impact, age fit, and related product visuals.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`#${toSlug(category)}`}
              className="rounded-full border border-[#d9bea1] bg-white px-3 py-1.5 text-xs font-semibold text-[#7a4627] hover:bg-[#f7ecde]"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => {
          const product = toyProducts.find((item) => item.category === category);
          const info = categoryMeta[category];

          if (!info || !product) {
            return null;
          }

          return (
            <article
              key={category}
              id={toSlug(category)}
              className="scroll-mt-24 overflow-hidden rounded-3xl border border-[#e6d4be] bg-white shadow-sm"
            >
              <div className={`relative h-48 bg-gradient-to-br ${palette[index % palette.length]}`}>
                <Image
                  src={product.image}
                  alt={category}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1280px) 100vw, 33vw"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8a4f2b]">
                  {info.bestFor}
                </span>
              </div>

              <div className="p-5">
                <h2 className="text-xl font-black text-slate-900">{category}</h2>
                <p className="mt-2 text-sm text-slate-700">{info.summary}</p>

                <p className="mt-4 text-xs font-black uppercase tracking-wide text-[#8a4f2b]">
                  Impact on Kids
                </p>
                <ul className="mt-2 space-y-1.5">
                  {info.impactOnKids.map((point) => (
                    <li key={point} className="text-sm text-slate-700">
                      - {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="rounded-full border border-[#8a4f2b] px-3 py-1.5 text-xs font-semibold text-[#8a4f2b] hover:bg-[#f5e8d9]"
                  >
                    View Product
                  </Link>
                  <Link
                    href="/shop"
                    className="rounded-full bg-[#8a4f2b] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#704123]"
                  >
                    Shop Category
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
