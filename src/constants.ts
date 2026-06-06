import { FalseCeilingType, NoidaProject, Testimonial } from "./types";

export const BRAND_NAME = "Renowix";
export const NOIDA_PHONE = "+91 98715 00000"; // Mock premium lead phone
export const SUPPORT_EMAIL = "contact@renowix.com";

export const NOIDA_LOCATIONS = [
  "Noida Sector 62 & 63 (Commercial Hub)",
  "Noida Sector 150 (Premium Residential)",
  "Noida Extension / Greater Noida West",
  "Noida Sector 137 & Express Way",
  "Noida Sector 74, 75 & 76",
  "Noida Sector 50 & 51 (Central Noida)",
  "Noida Sector 15, 16 & 18 (Metro Belt)",
  "Sector 120, 121 & 122",
  "Sector 93, 104 & 110",
  "Other Noida / Greater Noida area"
];

export const CEILING_TYPES: FalseCeilingType[] = [
  {
    id: "gypsum",
    name: "Gypsum Board Ceiling",
    startingPrice: 99,
    material: "Premium USG Boral / Saint-Gobain Gypsum Board",
    highlight: "Seamless & Modern Luxury",
    description: "Our highly sought-after residential ceiling choice in Noida. Completely flat, jointless surface that allows for mesmerizing cove light styling.",
    detailedDescription: "Gypsum false ceilings are composed of prefabricated plasterboard panels suspended via specialized rust-proof galvanized steel frames. It yields a smooth, monolithic, flat drywall finish that is absolutely crack-resistant. Perfect for sleek recessed spotlights and glowing cove designs. (Excludes lighting & wiring work)",
    features: [
      "100% Seamless matte finish with zero joints visible",
      "Excellent thermal insulation (keeps rooms up to 3°C cooler)",
      "Excellent acoustic dampening (soft-echo absorption)",
      "Fire-resistant & moisture-resistant premium variants",
      "Perfect paint-retaining plaster finish"
    ],
    imageUrl: "https://renowix.in/wp-content/uploads/2026/06/IMG-20260604-WA0002.jpg",
    pros: ["Super quick clean install", "Absolutely flat surface", "Superb cove light integration"],
    bestFor: "Living Rooms, Bedrooms, and modern Duplex Apartments."
  },
  {
    id: "pop",
    name: "POP Plaster False Ceiling",
    startingPrice: 139,
    material: "High-Purity Sakarni/Berger Plaster of Paris",
    highlight: "Carved Elegance & Intricate Shapes",
    description: "Highly versatile hand-curved plaster ceilings. Perfect for multi-tiered circular domes, floral cornices, and ultra-durable architectural shapes.",
    detailedDescription: "POP (Plaster of Paris) ceilings are handcrafted directly on-site by our master artisans. POP powder is mixed with water and layered over solid metal mesh structures to form complex curvilinear designs, step cornices, and custom deep ceiling basins. (Excludes lighting & wiring work)",
    features: [
      "Unlimited freedom of design—curved, circular, arches, and custom shapes",
      "Extremely long-lasting (virtually zero structural sag over decades)",
      "Highly durable plaster shells that resist impact",
      "Seamless integration with ornate chandeliers or hanging pendant fixtures",
      "Uniform density with custom localized structural reinforcements"
    ],
    imageUrl: "https://renowix.in/wp-content/uploads/2026/06/IMG-20260604-WA0004.jpg",
    pros: ["Extremely flexible designs", "Durable with 20+ years life", "No peeling or corner gaps"],
    bestFor: "Grand Entrance Foyers, Dining Halls, Master Bedrooms, and Temple (Pooja) Rooms."
  },
  {
    id: "pvc",
    name: "PVC Accent & Panel Ceiling",
    startingPrice: 119,
    material: "Heavy-Duty Interlocking Polyvinyl Chloride Panels",
    highlight: "100% Waterproof & Rich Timber Accents",
    description: "Highly modern, budget-friendly ceilings with realistic wood grain finishes. Completely waterproof, making it the top choice for balconies & bathrooms.",
    detailedDescription: "Our PVC false ceilings utilize interlocking, hollow-core light panels that attach directly to hidden steel framing. They require absolutely zero paint and offer incredibly realistic simulated timber textures that give a high-end designer chalet feel to your spaces. (Excludes lighting & wiring work)",
    features: [
      "100% Waterproof, termite-proof, and anti-fungal material",
      "Highly realistic premium wood textures & modern metallic strips",
      "No painting or finishing required—instant polished look post-installation",
      "Exceptionally lightweight, reducing bulk weight on your building structure",
      "Easiest cleaning—can be wiped down with a damp cloth effortlessly"
    ],
    imageUrl: "https://renowix.in/wp-content/uploads/2026/06/IMG-20260604-WA0005.jpg",
    pros: ["Zero painting required", "100% moisture immune", "Stunning wooden finish styling"],
    bestFor: "Balconies, Kitchens, Bathrooms, Semi-open Patios, and Accent Walls."
  },
  {
    id: "grid",
    name: "Modular Grid False Ceiling",
    startingPrice: 99,
    material: "Mineral Fiber Board / Armstrong Steel Grid System",
    highlight: "Easy Maintenance & Acoustic Balance",
    description: "A functional, highly modular ceiling system designed for commercial corridors, home offices, and workspaces. Extremely easy wire & AC access.",
    detailedDescription: "Grid ceilings are composed of square acoustic lay-in ceiling tiles supported by an exposed premium aluminum T-grid framework. They allow for individual tiles to be lifted out in seconds, offering continuous access to your concealed high-voltage cables, AC ducts, and plumbing lines. (Excludes lighting & wiring work)",
    features: [
      "100% convenient accessibility to wiring, conduits, and ventilation",
      "Superior NRC (Noise Reduction Coefficient) to cancel external office echoes",
      "Individually replaceable tiles minimize lifetime replacement costs",
      "Perfect flat alignment for clean commercial slim LED panel grids",
      "Resistant to sag and warping under general humidity"
    ],
    imageUrl: "https://renowix.in/wp-content/uploads/2026/06/f244f107a82c59a086cde1763c2a42ad.jpg",
    pros: ["Instant layout access", "Highly budget-friendly price", "Acoustic control/Noise damping"],
    bestFor: "Commercial Offices, Tech Labs in Sector 62/63, Private Studios, Home Workstations, and Corridors."
  }
];

export const NOIDA_PROJECTS: NoidaProject[] = [
  {
    id: "1",
    location: "Residential Complex, Noida Sector 150",
    ceilingType: "Multi-tier Gypsum with Ambient Warm Strip Lights",
    priceEstimation: "Calculated from ₹99/sq.ft",
    imageUrl: "https://renowix.in/wp-content/uploads/2026/06/d278461f57c12866efa7d330a15d13b7-1.jpg",
    date: "Completed April 2026"
  },
  {
    id: "2",
    location: "Corporate Office Hub, Sector 62 Noida",
    ceilingType: "Acoustic Armstrong Grid System with Embedded Linear LED Blocks",
    priceEstimation: "Calculated from ₹99/sq.ft",
    imageUrl: "https://renowix.in/wp-content/uploads/2026/06/e75c7d68b1a19d38e0c1ab9be216cdad.jpg",
    date: "Completed March 2026"
  },
  {
    id: "3",
    location: "Luxury Penthouse, Noida Sector 137",
    ceilingType: "Royal POP Dome Ceiling + Premium Teakwood PVC Accent Liners",
    priceEstimation: "Calculated from ₹139/sq.ft",
    imageUrl: "https://renowix.in/wp-content/uploads/2026/06/dbb584e2ab84feda0c9fc31564f3f9fa.jpg",
    date: "Completed May 2026"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Saurabh Jaiswal",
    location: "Noida Sector 150 (Premium Residential Complex)",
    text: "We hired Renowix for our 3 BHK false ceilings. The team recommended Gypsum for the living room and wooden-finish PVC for our balcony. Not only is the lighting layout extremely functional, but the execution was completely scheduled and they finished 3 days early. Highly recommended for premium homes!",
    rating: 5,
    ceilingType: "Gypsum & PVC Ceiling"
  },
  {
    id: "t2",
    name: "Meenakshi Sharma",
    location: "Noida Extension (Greater Noida West)",
    text: "The team set up a transparent quote over WhatsApp. The craftsmanship on our master bedroom's deep tray ceiling is flawless. They used authentic Sakarni POP and USG Boral boards. The home ventilation feels much better now!",
    rating: 5,
    ceilingType: "Intricate POP Plaster Ceiling"
  },
  {
    id: "t3",
    name: "Innovate62 Co-working Space",
    location: "Corporate Hub, Noida Sector 62",
    text: "For our new corporate branch, we needed low-noise acoustic grid ceilings. Renowix gave us the absolute best quote in Noida and got the entire 4500 sq.ft job done in just 10 days. The Armstrong tiles look crisp and neat, and our maintenance team loves the easy overhead wire access.",
    rating: 5,
    ceilingType: "Modular Armstrong Grid Ceiling"
  }
];

export const FAQ_ITEMS = [
  {
    q: "What is your starting rate, and are there any hidden fees?",
    a: "Our basic installation services start from ₹99/sq.ft for Premium Gypsum and Grid ceilings, ₹119/sq.ft for PVC accent panels, and ₹139/sq.ft for high-purity POP plaster. Please note that starting rates do not include any electrical or lighting wiring work. Final rates are determined by design steps, room complexity, center highlights, curves, or specific custom specifications. We provide clear, itemized invoices before any work begins."
  },
  {
    q: "How long does a typical home false ceiling installation take?",
    a: "A standard BHK (approximately 1,000 sq.ft of ceiling space) takes about 7 to 10 working days for Gypsum or PVC boards. POP ceilings take slightly longer (around 12 to 14 days) because POP has to dry and cure completely before sanding & painting can begin. We pre-plan our schedules to minimize disruption."
  },
  {
    q: "How do I request a site measurement and consultation?",
    a: "Simply fill out our brief Callback Request form on this page with your location and requirements. Our engineering specialist will call you within 15 minutes to review options, guide you on design trends, and coordinate a site measurement layout check with our local supervisor."
  },
  {
    q: "Will false ceilings lower my room height significantly?",
    a: "Not at all. A simple single-tier dropped ceiling requires only about 3.5 to 5 inches of space, which is just enough to conceal electrical wiring and slim LED driver modules. If your ceiling height is standard (e.g. 10 feet), a classic border cove false ceiling will preserve the full central headroom while elevating the room's dynamic scale."
  },
  {
    q: "Do false ceilings help in reducing AC bills and noise?",
    a: "Absolutely! The dead-air space between your structural concrete roof and the false ceiling acts as a powerful natural thermal insulation buffer. It blocks hot overhead conduction (crucial for Noida top-floor apartments during 45°C summers) and traps cold air, slashing AC electricity bills by up to 20% while dampening room echo."
  },
  {
    q: "What warranty does Renowix provide on materials & service?",
    a: "We offer a reassuring 10-Year Rust & Sag Warranty on all our structural galvanized iron (GI) suspension channel framework, and a 3-Year Craftsmanship Warranty covering any minor cracking or joint issues. We rely strictly on verified premium materials from Saint-Gobain, USG Boral, and Sakarni."
  }
];

export const SERVICE_BENEFITS = [
  {
    title: "Eco-Insulated Materials",
    description: "Keeps homes dramatically cooler during severe Noida summer peaks, reducing air-conditioning loads.",
    icon: "thermometer-snowflake"
  },
  {
    title: "10-Year Sag Warranty",
    description: "Our high-tensile steel frames resist warping and structural sags, keeping ceilings level forever.",
    icon: "shield-check"
  },
  {
    title: "Dust-Shield Clean Install",
    description: "We use modern HEPA dust-extracting vacuums and sanding shields to protect existing furniture during installation.",
    icon: "sparkles"
  },
  {
    title: "Direct-Design Specialist Team",
    description: "No middlemen! Your home is measured and designed by seasoned, full-time Renowix renovation professionals.",
    icon: "ruler"
  }
];
