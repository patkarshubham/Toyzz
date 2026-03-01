export type ToyProduct = {
  id: number;
  slug: string;
  name: string;
  image: string;
  category: string;
  ageGroup: string;
  mrp: number;
  offerPrice: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  material: string;
  finish: string;
  dimensions: string;
  weight: string;
  inTheBox: string[];
  features: string[];
  safety: string[];
};

export const toyProducts: ToyProduct[] = [
  {
    id: 1,
    slug: "pine-cube-starter-box",
    name: "Pine Cube Starter Box",
    image: "/images/toys/pine-cube-starter-box.svg",
    category: "Building Blocks",
    ageGroup: "3+ years",
    mrp: 1999,
    offerPrice: 1499,
    rating: 4.8,
    reviewCount: 212,
    shortDescription:
      "50 handcrafted pine blocks for open-ended construction play.",
    description:
      "Designed for early builders, this set includes smooth-edged pine cubes and rectangular blocks that support spatial learning, creativity, and hand-eye coordination.",
    material: "Solid pine wood",
    finish: "Water-based non-toxic polish",
    dimensions: "Box: 30 x 22 x 10 cm",
    weight: "1.45 kg",
    inTheBox: ["50 pine blocks", "Storage box", "Idea booklet"],
    features: [
      "Rounded corners",
      "Natural grain finish",
      "Long-lasting joinery",
    ],
    safety: [
      "BIS-friendly material",
      "Lead-free color accents",
      "Choking-safe block size",
    ],
  },
  {
    id: 2,
    slug: "rainbow-ring-stacker",
    name: "Rainbow Ring Stacker",
    image: "/images/toys/rainbow-ring-stacker.svg",
    category: "Stacking & Sorting",
    ageGroup: "2+ years",
    mrp: 1299,
    offerPrice: 949,
    rating: 4.7,
    reviewCount: 176,
    shortDescription:
      "Pine ring stacker to build grip strength and color sorting skills.",
    description:
      "This handcrafted stacker uses pine rings in graded sizes to help toddlers practice sequence learning, balancing, and fine motor control in a safe way.",
    material: "Pine wood core",
    finish: "Plant-based matte coat",
    dimensions: "18 x 10 x 10 cm",
    weight: "420 g",
    inTheBox: ["1 base peg", "6 rings", "Topper knob"],
    features: [
      "Easy-grip ring profile",
      "Stable base",
      "Fade-resistant colors",
    ],
    safety: ["Smooth sanded finish", "Non-toxic dyes", "Splinter-checked"],
  },
  {
    id: 3,
    slug: "elephant-pull-toy",
    name: "Elephant Pull Toy",
    image: "/images/toys/elephant-pull-toy.svg",
    category: "Pull-Along Toys",
    ageGroup: "2+ years",
    mrp: 1499,
    offerPrice: 1099,
    rating: 4.9,
    reviewCount: 134,
    shortDescription:
      "Cute pine elephant pull toy with silent wheels and cotton rope.",
    description:
      "Made for early walkers, the elephant pull toy encourages movement and confidence. The wheel profile is designed for indoor flooring with low noise.",
    material: "Carved pine body",
    finish: "Natural wax + water-based color",
    dimensions: "17 x 10 x 13 cm",
    weight: "510 g",
    inTheBox: ["Elephant pull toy", "Braided pull cord"],
    features: ["Quiet wheel coating", "Balanced body", "Anti-tip wheel width"],
    safety: ["Soft cotton pull string", "Rounded ear edges", "No sharp axles"],
  },
  {
    id: 4,
    slug: "classic-pine-train",
    name: "Classic Pine Train",
    image: "/images/toys/classic-pine-train.svg",
    category: "Wooden Vehicles",
    ageGroup: "3+ years",
    mrp: 2299,
    offerPrice: 1699,
    rating: 4.8,
    reviewCount: 201,
    shortDescription: "Interlocking pine train set with detachable wagons.",
    description:
      "A handcrafted train with three detachable wagons that supports pretend play and sequencing activities. Strong wheel joints ensure long life.",
    material: "Pine wood and beech axles",
    finish: "Non-toxic satin coat",
    dimensions: "38 x 8 x 10 cm",
    weight: "920 g",
    inTheBox: ["Engine", "3 wagons", "8 cargo blocks"],
    features: [
      "Magnetic wagon links",
      "Chunky grip design",
      "Durable wheel pins",
    ],
    safety: [
      "Rounded couplers",
      "Nontoxic surface",
      "No detachable tiny parts",
    ],
  },
  {
    id: 5,
    slug: "mini-kitchen-set",
    name: "Mini Kitchen Set",
    image: "/images/toys/mini-kitchen-set.svg",
    category: "Pretend Play",
    ageGroup: "4+ years",
    mrp: 2899,
    offerPrice: 2199,
    rating: 4.7,
    reviewCount: 165,
    shortDescription: "Pine play-kitchen accessories for role-play learning.",
    description:
      "Includes miniature handcrafted kitchen tools and food shapes made from pine to encourage storytelling, social interaction, and practical play.",
    material: "Premium pine components",
    finish: "Food-grade safe coat",
    dimensions: "Box: 32 x 24 x 11 cm",
    weight: "1.15 kg",
    inTheBox: [
      "Pan",
      "Spatula",
      "Cutting board",
      "Vegetable set",
      "Storage tray",
    ],
    features: [
      "Realistic toy proportions",
      "Easy clean surface",
      "Durable joinery",
    ],
    safety: [
      "Rounded handles",
      "Non-toxic polish",
      "Tested for edge smoothness",
    ],
  },
  {
    id: 6,
    slug: "montessori-lock-board",
    name: "Montessori Lock Board",
    image: "/images/toys/montessori-lock-board.svg",
    category: "Educational Montessori",
    ageGroup: "3+ years",
    mrp: 2099,
    offerPrice: 1599,
    rating: 4.8,
    reviewCount: 244,
    shortDescription: "Pine activity board with latches, toggles, and sliders.",
    description:
      "An all-in-one pine lock board designed to build concentration, finger control, and daily living skills through tactile activity modules.",
    material: "Pine board with metal fittings",
    finish: "Safe matte coating",
    dimensions: "30 x 22 x 3 cm",
    weight: "980 g",
    inTheBox: ["Lock board", "Activity guide"],
    features: [
      "Multiple real-life locks",
      "Compact travel size",
      "Strong fasteners",
    ],
    safety: ["Burr-free hardware", "Smooth edges", "Child-safe screw caps"],
  },
  {
    id: 7,
    slug: "forest-puzzle-pack",
    name: "Forest Puzzle Pack",
    image: "/images/toys/forest-puzzle-pack.svg",
    category: "Puzzles & Brain Games",
    ageGroup: "5+ years",
    mrp: 1199,
    offerPrice: 849,
    rating: 4.6,
    reviewCount: 137,
    shortDescription:
      "Animal-themed pine puzzle set for memory and logic training.",
    description:
      "A set of layered and interlock puzzles crafted from pine to improve visual matching, patience, and logical sequencing.",
    material: "Laser-cut pine sheets",
    finish: "Child-safe color seal",
    dimensions: "24 x 18 x 4 cm",
    weight: "360 g",
    inTheBox: ["3 puzzle boards", "12 puzzle cards"],
    features: [
      "Progressive difficulty",
      "Travel friendly",
      "High-contrast illustrations",
    ],
    safety: [
      "Smooth cut lines",
      "Non-toxic paint",
      "Age-appropriate piece sizing",
    ],
  },
  {
    id: 8,
    slug: "pine-rhythm-kit",
    name: "Pine Rhythm Kit",
    image: "/images/toys/pine-rhythm-kit.svg",
    category: "Musical Toys",
    ageGroup: "3+ years",
    mrp: 1699,
    offerPrice: 1249,
    rating: 4.7,
    reviewCount: 101,
    shortDescription:
      "Handcrafted musical toy kit with xylophone and rhythm sticks.",
    description:
      "This pine rhythm kit helps children explore tempo and sound patterns while improving hand control and auditory attention.",
    material: "Pine body with aluminum keys",
    finish: "Water-based polish",
    dimensions: "28 x 14 x 6 cm",
    weight: "620 g",
    inTheBox: ["Mini xylophone", "2 mallets", "Rhythm clappers"],
    features: [
      "Soft tone tuning",
      "Comfort grip mallets",
      "Compact carrying size",
    ],
    safety: ["Rounded key ends", "Splinter-free body", "Secure key mounts"],
  },
  {
    id: 9,
    slug: "tiny-chair-and-table",
    name: "Tiny Chair & Table",
    image: "/images/toys/tiny-chair-and-table.svg",
    category: "Dollhouse & Mini Furniture",
    ageGroup: "4+ years",
    mrp: 1499,
    offerPrice: 1129,
    rating: 4.8,
    reviewCount: 84,
    shortDescription:
      "Mini pine furniture set for dollhouse storytelling play.",
    description:
      "A handcrafted miniature furniture set that adds realistic environment building to dollhouse and pretend play sessions.",
    material: "Hand-cut pine wood",
    finish: "Natural wax finish",
    dimensions: "Pack: 16 x 12 x 6 cm",
    weight: "210 g",
    inTheBox: ["2 chairs", "1 table", "1 bench"],
    features: [
      "Stable base feet",
      "Lightweight pieces",
      "Natural wood texture",
    ],
    safety: ["Rounded corners", "No toxic varnish", "Manual quality checked"],
  },
  {
    id: 10,
    slug: "woodland-animal-set",
    name: "Woodland Animal Set",
    image: "/images/toys/woodland-animal-set.svg",
    category: "Animal Figurines",
    ageGroup: "3+ years",
    mrp: 1399,
    offerPrice: 999,
    rating: 4.9,
    reviewCount: 193,
    shortDescription:
      "Set of handcrafted pine forest animals for imaginative play.",
    description:
      "Includes hand-polished pine animal figures that help with vocabulary, storytelling, and open-ended scene creation.",
    material: "Solid pine figurines",
    finish: "Natural pigment coating",
    dimensions: "Box: 20 x 14 x 5 cm",
    weight: "340 g",
    inTheBox: ["8 animal figurines", "Story prompt card"],
    features: ["Detailed engraving", "Easy grip shapes", "Durable polish"],
    safety: [
      "Rounded ears/tails",
      "No sharp paint chips",
      "Child-safe pigments",
    ],
  },
  {
    id: 11,
    slug: "garden-sand-scoop",
    name: "Garden Sand Scoop",
    image: "/images/toys/garden-sand-scoop.svg",
    category: "Outdoor Wooden Toys",
    ageGroup: "3+ years",
    mrp: 999,
    offerPrice: 699,
    rating: 4.6,
    reviewCount: 72,
    shortDescription:
      "Outdoor pine scoop and mold set for garden and sand play.",
    description:
      "Built with sealed pine for outdoor durability, this set is ideal for sand, mud kitchen, and texture exploration activities.",
    material: "Treated pine wood",
    finish: "Moisture-resistant safe coat",
    dimensions: "Pack: 24 x 16 x 7 cm",
    weight: "290 g",
    inTheBox: ["1 scoop", "2 molds", "1 mini rake"],
    features: [
      "Outdoor-friendly finish",
      "Ergonomic handles",
      "Lightweight design",
    ],
    safety: [
      "Rounded handle edges",
      "Weather-safe coating",
      "No metal sharp points",
    ],
  },
  {
    id: 12,
    slug: "balance-beam-trio",
    name: "Balance Beam Trio",
    image: "/images/toys/balance-beam-trio.svg",
    category: "Balance & Coordination",
    ageGroup: "5+ years",
    mrp: 3299,
    offerPrice: 2599,
    rating: 4.8,
    reviewCount: 90,
    shortDescription: "Three-piece pine balance beams for active indoor play.",
    description:
      "Encourages gross motor development and confidence through safe, low-height balance challenges. Modular beam segments allow multiple layouts.",
    material: "Reinforced pine planks",
    finish: "Anti-slip safe coating",
    dimensions: "Each beam: 60 x 8 x 4 cm",
    weight: "2.4 kg",
    inTheBox: ["3 beam pieces", "2 connectors", "Setup guide"],
    features: [
      "Modular assembly",
      "Strong load support",
      "Textured walking surface",
    ],
    safety: ["Low rise profile", "Rounded beam edges", "Anti-skid pads"],
  },
  {
    id: 13,
    slug: "balance-beam-trio-one",
    name: "Balance Beam Trio Complex",
    image: "/images/toys/balance-beam-trio.svg",
    category: "Balance & Coordination",
    ageGroup: "7+ years",
    mrp: 3999,
    offerPrice: 2999,
    rating: 4.8,
    reviewCount: 90,
    shortDescription: "Three-piece pine balance beams for active indoor play.",
    description:
      "Encourages gross motor development and confidence through safe, low-height balance challenges. Modular beam segments allow multiple layouts.",
    material: "Reinforced pine planks",
    finish: "Anti-slip safe coating",
    dimensions: "Each beam: 60 x 8 x 4 cm",
    weight: "2.4 kg",
    inTheBox: ["3 beam pieces", "2 connectors", "Setup guide"],
    features: [
      "Modular assembly",
      "Strong load support",
      "Textured walking surface",
    ],
    safety: ["Low rise profile", "Rounded beam edges", "Anti-skid pads"],
  },
];

export const toyCategories = [
  "All",
  ...new Set(toyProducts.map((item) => item.category)),
];

export const findToyBySlug = (slug: string) =>
  toyProducts.find((item) => item.slug === slug);
