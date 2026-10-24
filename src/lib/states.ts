import type { IndustryKey } from "@/lib/tax-compliance";

/**
 * State market-intelligence dataset for Japanese SMEs evaluating India.
 * All figures are APPROXIMATE and intended for relative comparison only.
 */
export const STATE_DATA_SOURCES =
  "MoSPI GSDP (FY2023-24, current prices, converted at ~₹83/USD), Census 2011 with 2024 population projections, state industrial policies, Japan Industrial Township (JIT) listings, JETRO India business reports — approximate, for comparison only.";

export type StateKey =
  | "maharashtra" | "tamil_nadu" | "gujarat" | "karnataka" | "telangana"
  | "andhra_pradesh" | "haryana" | "uttar_pradesh" | "delhi" | "west_bengal";

export type MetricKey = "industrialDemand" | "consumerDemand" | "costIndex" | "talentDepth" | "easeOfBusiness";

export type PriorityKey = "industrialDemand" | "consumerDemand" | "lowCost" | "talentDepth" | "easeOfBusiness";

export type PriorityWeights = Record<PriorityKey, number>;

export interface StateProfile {
  key: StateKey;
  name: string;
  code: string;
  capital: string;
  /** Gross State Domestic Product, USD bn (approx.) */
  gsdpUsdBn: number;
  /** Population, millions (approx. 2024 projection) */
  population: number;
  urbanisationPct: number;
  keyClusters: { city: string; industries: string }[];
  japanesePresence: string[];
  /** Ordered by strength – first entries are the strongest fits. */
  strongSectors: IndustryKey[];
  incentives: string[];
  singleWindow: string;
  ports: string;
  languages: { business: string; local: string };
  consumerNote: string;
  /** 1–10 indexes */
  industrialDemand: number;
  consumerDemand: number;
  /** higher = more expensive */
  costIndex: number;
  talentDepth: number;
  easeOfBusiness: number;
}

export const STATE_PROFILES: StateProfile[] = [
  {
    key: "maharashtra", name: "Maharashtra", code: "MH", capital: "Mumbai",
    gsdpUsdBn: 460, population: 127, urbanisationPct: 48,
    keyClusters: [
      { city: "Mumbai", industries: "Finance, HQs, consumer brands" },
      { city: "Pune / Chakan", industries: "Automotive, engineering, IT" },
      { city: "Aurangabad (AURIC)", industries: "Auto components, pharma" },
      { city: "Nashik", industries: "Electricals, agri-processing" },
    ],
    japanesePresence: ["Bridgestone (Pune)", "Mitsubishi Electric, NTT Data (Pune/Mumbai)", "Large Japanese trading-house offices in Mumbai"],
    strongSectors: ["automotive", "manufacturing", "it_software", "consumer_retail", "healthcare", "logistics"],
    incentives: ["Package Scheme of Incentives: SGST refund & electricity duty exemption", "Mega-project status with customised packages", "Capital subsidy for less-developed regions (Vidarbha/Marathwada)"],
    singleWindow: "MAITRI (Maharashtra Industry, Trade & Investment Facilitation Cell)",
    ports: "JNPT (Nhava Sheva) – India's largest container port; Mumbai Port; Samruddhi Expressway; Mumbai–Ahmedabad DFC",
    languages: { business: "English, Hindi", local: "Marathi" },
    consumerNote: "Highest absolute consumption; affluent, brand-aware urban buyers in Mumbai/Pune, price-sensitive rural interior.",
    industrialDemand: 9, consumerDemand: 9, costIndex: 9, talentDepth: 9, easeOfBusiness: 7,
  },
  {
    key: "tamil_nadu", name: "Tamil Nadu", code: "TN", capital: "Chennai",
    gsdpUsdBn: 330, population: 77, urbanisationPct: 53,
    keyClusters: [
      { city: "Chennai (Sriperumbudur / Oragadam)", industries: "Automotive, electronics manufacturing" },
      { city: "Coimbatore", industries: "Pumps, textiles machinery, foundries" },
      { city: "Hosur", industries: "Two-wheelers, EVs, auto components" },
      { city: "Tiruppur", industries: "Knitwear & apparel exports" },
    ],
    japanesePresence: ["One Hub Chennai & Ponneri JIT", "Nissan (Renault-Nissan), Yamaha, Komatsu", "Hitachi, Toshiba JSW, ~1/4 of Japanese firms' Indian sites"],
    strongSectors: ["automotive", "electronics", "manufacturing", "renewable", "healthcare", "logistics"],
    incentives: ["TN Industrial Policy 2021: capital & turnover-linked subsidies", "Dedicated Japan Desk at Guidance Tamil Nadu", "EV and electronics component special incentives"],
    singleWindow: "Guidance Tamil Nadu – TN Single Window Portal",
    ports: "Chennai, Kamarajar (Ennore) & V.O. Chidambaranar (Tuticorin) ports; Chennai–Bengaluru Industrial Corridor",
    languages: { business: "English", local: "Tamil" },
    consumerNote: "Highly urbanised, value-for-quality buyers; strong local brand loyalty and preference for Tamil-language marketing.",
    industrialDemand: 9, consumerDemand: 7, costIndex: 6, talentDepth: 9, easeOfBusiness: 8,
  },
  {
    key: "gujarat", name: "Gujarat", code: "GJ", capital: "Gandhinagar",
    gsdpUsdBn: 290, population: 72, urbanisationPct: 45,
    keyClusters: [
      { city: "Ahmedabad / Sanand", industries: "Automotive, engineering" },
      { city: "Mandal–Becharaji", industries: "Japanese auto suppliers" },
      { city: "Dholera SIR", industries: "Semiconductors, electronics" },
      { city: "Vadodara / Bharuch / Dahej", industries: "Chemicals, petrochemicals, pharma" },
    ],
    japanesePresence: ["Mandal–Becharaji JIT (Maruti Suzuki / Suzuki Motor Gujarat)", "Toyota Tsusho & Japanese supplier park at Mandal", "Hitachi Hi-Rel, TDK (Sanand)"],
    strongSectors: ["manufacturing", "automotive", "electronics", "renewable", "logistics", "food_agri"],
    incentives: ["Gujarat Industrial Policy 2020: capital & interest subsidy", "Gujarat Semiconductor Policy: top-up on central ISM support", "Land at concessional rates in GIDC estates"],
    singleWindow: "iNDEXTb / Invest Gujarat single window (IFP portal)",
    ports: "Mundra (largest private port), Kandla (Deendayal), Pipavav, Hazira; Western DFC",
    languages: { business: "English, Hindi", local: "Gujarati" },
    consumerNote: "Entrepreneurial, value-conscious middle class; strong trader networks drive B2B distribution.",
    industrialDemand: 9, consumerDemand: 6, costIndex: 5, talentDepth: 6, easeOfBusiness: 9,
  },
  {
    key: "karnataka", name: "Karnataka", code: "KA", capital: "Bengaluru",
    gsdpUsdBn: 300, population: 68, urbanisationPct: 42,
    keyClusters: [
      { city: "Bengaluru", industries: "IT services, R&D centres, startups, aerospace" },
      { city: "Bidadi", industries: "Automotive (Toyota)" },
      { city: "Tumakuru", industries: "Machine tools, JIT industrial park" },
      { city: "Mysuru / Mangaluru", industries: "Electronics, petrochemicals" },
    ],
    japanesePresence: ["Tumakuru JIT (Japanese Industrial Township)", "Toyota Kirloskar Motor (Bidadi)", "Sony, Rakuten, Hitachi R&D centres in Bengaluru"],
    strongSectors: ["it_software", "electronics", "automotive", "healthcare", "manufacturing", "food_agri"],
    incentives: ["Karnataka Industrial Policy 2020–25: capital subsidy & stamp-duty exemption", "ESDM & semiconductor policy incentives", "Startup and R&D grants (Karnataka Innovation Authority)"],
    singleWindow: "Invest Karnataka – Udyog Mitra / Ease of Doing Business single window",
    ports: "New Mangalore Port; close links to Chennai & Krishnapatnam ports; Kempegowda International Airport cargo",
    languages: { business: "English", local: "Kannada" },
    consumerNote: "Bengaluru has India's richest young tech workforce – early adopters of premium & digital products.",
    industrialDemand: 7, consumerDemand: 8, costIndex: 8, talentDepth: 10, easeOfBusiness: 7,
  },
  {
    key: "telangana", name: "Telangana", code: "TS", capital: "Hyderabad",
    gsdpUsdBn: 180, population: 38, urbanisationPct: 47,
    keyClusters: [
      { city: "Hyderabad", industries: "IT/ITeS, global capability centres" },
      { city: "Genome Valley", industries: "Life sciences, vaccines, pharma" },
      { city: "Pharma City / Jadcherla", industries: "API manufacturing" },
      { city: "Zaheerabad", industries: "Automotive, NIMZ" },
    ],
    japanesePresence: ["Daifuku (Hyderabad)", "Japanese pharma & IT tie-ups (e.g. Takeda partnerships)", "Toyota Tsusho investments in Hyderabad"],
    strongSectors: ["it_software", "healthcare", "electronics", "food_agri", "manufacturing"],
    incentives: ["TS-iPASS: statutory 15-day clearance with deemed approval", "T-IDEA incentives: power cost reimbursement & SGST refund", "Life-sciences & EV specific policies"],
    singleWindow: "TS-iPASS (Telangana State Industrial Project Approval & Self-Certification System)",
    ports: "Land-locked – uses Krishnapatnam, Visakhapatnam & Chennai ports; Hyderabad dry port & air cargo hub",
    languages: { business: "English, Hindi", local: "Telugu, Urdu" },
    consumerNote: "Fast-growing affluent Hyderabad metro; tech and pharma salaries fuel premium consumption.",
    industrialDemand: 7, consumerDemand: 7, costIndex: 6, talentDepth: 8, easeOfBusiness: 9,
  },
  {
    key: "andhra_pradesh", name: "Andhra Pradesh", code: "AP", capital: "Amaravati",
    gsdpUsdBn: 170, population: 54, urbanisationPct: 30,
    keyClusters: [
      { city: "Sri City", industries: "Multi-product SEZ: FMCG, electronics, auto parts" },
      { city: "Visakhapatnam", industries: "Steel, pharma, port logistics" },
      { city: "Anantapur", industries: "Automotive (Kia)" },
      { city: "Tirupati", industries: "Electronics manufacturing clusters" },
    ],
    japanesePresence: ["Sri City JIT – Isuzu Motors, Unicharm, Toray, Kobelco", "Japanese desk at Sri City", "Daikin plant (Sri City)"],
    strongSectors: ["manufacturing", "food_agri", "logistics", "electronics", "automotive", "renewable"],
    incentives: ["AP Industrial Development Policy: power & SGST reimbursement", "Plug-and-play sheds in Sri City and APIIC parks", "Low land prices along Chennai–Vizag corridor"],
    singleWindow: "AP Single Desk Portal (APIIC / Single Window)",
    ports: "Visakhapatnam, Krishnapatnam, Gangavaram & Kakinada ports – longest east-coast coastline",
    languages: { business: "English", local: "Telugu" },
    consumerNote: "Largely semi-urban and rural, price-sensitive buyers; strong agri-income linked demand.",
    industrialDemand: 7, consumerDemand: 5, costIndex: 4, talentDepth: 6, easeOfBusiness: 8,
  },
  {
    key: "haryana", name: "Haryana", code: "HR", capital: "Chandigarh",
    gsdpUsdBn: 135, population: 30, urbanisationPct: 38,
    keyClusters: [
      { city: "Gurugram / Manesar", industries: "Automotive, two-wheelers, corporate HQs" },
      { city: "Faridabad", industries: "Engineering, auto components" },
      { city: "Bawal / Dharuhera", industries: "Auto suppliers" },
      { city: "Panipat / Sonipat", industries: "Textiles, food processing" },
    ],
    japanesePresence: ["Maruti Suzuki (Gurugram, Manesar, Kharkhoda)", "Honda Motorcycle & Scooter India (Manesar)", "Large Japanese corporate community in Gurugram"],
    strongSectors: ["automotive", "manufacturing", "logistics", "consumer_retail", "food_agri", "it_software"],
    incentives: ["Haryana Enterprises & Employment Policy 2020: SGST & capital subsidy", "Stamp duty refund in backward blocks", "Logistics, warehousing & retail policy incentives"],
    singleWindow: "HEPC – Haryana Enterprise Promotion Centre (Invest Haryana portal)",
    ports: "Inland container depots (Garhi Harsaru, Rewari); Western & Eastern DFC junction; KMP Expressway",
    languages: { business: "English, Hindi", local: "Hindi, Haryanvi" },
    consumerNote: "Highest per-capita income among large states; Gurugram expatriate and professional premium market.",
    industrialDemand: 8, consumerDemand: 7, costIndex: 8, talentDepth: 7, easeOfBusiness: 7,
  },
  {
    key: "uttar_pradesh", name: "Uttar Pradesh", code: "UP", capital: "Lucknow",
    gsdpUsdBn: 300, population: 240, urbanisationPct: 24,
    keyClusters: [
      { city: "Noida / Greater Noida", industries: "Mobile phones, electronics, IT" },
      { city: "Kanpur", industries: "Leather, defence, chemicals" },
      { city: "Lucknow", industries: "Services, food processing" },
      { city: "Yamuna Expressway (YEIDA)", industries: "Electronics, semiconductors, data centres" },
    ],
    japanesePresence: ["Japanese industrial city planned at YEIDA", "Honda Cars (Greater Noida, legacy)", "Yamaha Motor (Surajpur), Japanese electronics suppliers in Noida"],
    strongSectors: ["electronics", "food_agri", "consumer_retail", "manufacturing", "logistics"],
    incentives: ["UP Industrial Investment & Employment Promotion Policy 2022: capital subsidy up to 25%", "UP Electronics Manufacturing Policy: land & interest subsidy", "Stamp duty exemption and SGST incentives"],
    singleWindow: "Nivesh Mitra (UP single window) & Invest UP",
    ports: "Land-locked – Eastern DFC, Dadri multimodal logistics hub, Jewar (Noida) International Airport",
    languages: { business: "Hindi, English", local: "Hindi" },
    consumerNote: "India's largest consumer base by population; mass-market, highly price-sensitive with pockets of affluence in NCR.",
    industrialDemand: 7, consumerDemand: 8, costIndex: 3, talentDepth: 7, easeOfBusiness: 7,
  },
  {
    key: "delhi", name: "Delhi (NCT)", code: "DL", capital: "New Delhi",
    gsdpUsdBn: 135, population: 22, urbanisationPct: 98,
    keyClusters: [
      { city: "Connaught Place / Aerocity", industries: "Corporate offices, consulting, finance" },
      { city: "Okhla / Narela", industries: "Light manufacturing, printing" },
      { city: "Chandni Chowk / Karol Bagh", industries: "Wholesale trade & distribution" },
    ],
    japanesePresence: ["Embassy of Japan, JETRO New Delhi, JICA India office", "Japan Chamber of Commerce & Industry in India (JCCII)", "Regional HQs of Japanese trading houses"],
    strongSectors: ["consumer_retail", "it_software", "healthcare", "logistics"],
    incentives: ["Delhi EV Policy incentives", "Startup Policy support", "Limited industrial land – focus on services and trade"],
    singleWindow: "Delhi Single Window (Invest Delhi / Department of Industries)",
    ports: "IGI Airport – India's busiest air-cargo hub; Tughlakabad ICD; DFC access via NCR",
    languages: { business: "English, Hindi", local: "Hindi, Punjabi" },
    consumerNote: "Very high per-capita income and premium urban consumers; gateway to national and government buyers.",
    industrialDemand: 4, consumerDemand: 9, costIndex: 10, talentDepth: 8, easeOfBusiness: 6,
  },
  {
    key: "west_bengal", name: "West Bengal", code: "WB", capital: "Kolkata",
    gsdpUsdBn: 210, population: 100, urbanisationPct: 32,
    keyClusters: [
      { city: "Kolkata", industries: "Services, trading, IT" },
      { city: "Durgapur / Asansol", industries: "Steel, engineering" },
      { city: "Haldia", industries: "Petrochemicals, port-based industry" },
      { city: "Siliguri", industries: "Tea, gateway to North-East & Nepal/Bhutan" },
    ],
    japanesePresence: ["Japanese Industrial Park plans and JICA projects", "Mitsubishi Chemical (Haldia, legacy PTA plant)", "Japanese trading-house branches in Kolkata"],
    strongSectors: ["food_agri", "manufacturing", "logistics", "consumer_retail", "it_software"],
    incentives: ["West Bengal Incentive Scheme: SGST refund & power subsidy", "Low-cost land banks via WBIDC", "MSME and food-processing support"],
    singleWindow: "Silpasathi (WB single window)",
    ports: "Syama Prasad Mookerjee Port (Kolkata & Haldia); gateway to North-East, Bangladesh, Nepal",
    languages: { business: "English, Hindi", local: "Bengali" },
    consumerNote: "Large, culturally distinct market; price-conscious buyers with strong preference for Bengali-language engagement.",
    industrialDemand: 6, consumerDemand: 6, costIndex: 4, talentDepth: 7, easeOfBusiness: 5,
  },
];

export const PRIORITIES: { key: PriorityKey; label: string }[] = [
  { key: "industrialDemand", label: "Industrial demand" },
  { key: "consumerDemand", label: "Consumer demand" },
  { key: "lowCost", label: "Low cost" },
  { key: "talentDepth", label: "Talent" },
  { key: "easeOfBusiness", label: "Ease of business" },
];

export const DEFAULT_WEIGHTS: PriorityWeights = {
  industrialDemand: 3, consumerDemand: 2, lowCost: 2, talentDepth: 2, easeOfBusiness: 2,
};

export const getState = (key: StateKey) => STATE_PROFILES.find((s) => s.key === key);

/** Map a priority to the state's 1–10 value (cost is inverted: cheaper = higher). */
export function priorityValue(s: StateProfile, p: PriorityKey): number {
  if (p === "lowCost") return 11 - s.costIndex;
  return s[p];
}

/** 0–100 sector fit: top-2 sectors = 100, listed = 70, otherwise 20. "other" = neutral 50. */
export function sectorFit(s: StateProfile, industry: IndustryKey | ""): number {
  if (!industry || industry === "other") return 50;
  const idx = s.strongSectors.indexOf(industry);
  if (idx === -1) return 20;
  if (idx < 2) return 100;
  return Math.max(55, 85 - (idx - 2) * 10);
}

export interface RankedState {
  state: StateProfile;
  score: number;
  fit: number;
  base: number;
}

/**
 * Rank states for an industry and priority weights. Pure function.
 * score = 60% weighted priorities (0–100) + 40% sector fit (0–100).
 */
export function scoreStatesForIndustry(
  industry: IndustryKey | "",
  weights: Partial<PriorityWeights> = DEFAULT_WEIGHTS,
  states: StateProfile[] = STATE_PROFILES,
): RankedState[] {
  const keys = PRIORITIES.map((p) => p.key);
  const w = keys.map((k) => Math.max(0, weights[k] ?? 0));
  const total = w.reduce((a, b) => a + b, 0);
  const eff = total > 0 ? w : keys.map(() => 1);
  const effTotal = total > 0 ? total : keys.length;

  return states
    .map((state) => {
      const base = (keys.reduce((acc, k, i) => acc + priorityValue(state, k) * (eff[i] ?? 0), 0) / effTotal) * 10;
      const fit = sectorFit(state, industry);
      const score = Math.round(Math.min(100, Math.max(0, base * 0.6 + fit * 0.4)));
      return { state, score, fit, base: Math.round(base) };
    })
    .sort((a, b) => b.score - a.score || b.base - a.base || a.state.name.localeCompare(b.state.name));
}
