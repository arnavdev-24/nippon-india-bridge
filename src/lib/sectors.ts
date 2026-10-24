export type Sector = "semiconductor" | "ai" | "greentech";

export type DemoCompany = {
  id: string;
  name: string;
  sector: Sector;
  type: string;
  state: string;
  city: string;
  capabilities: string[];
  budgetInr: number; // minimum engagement in lakh INR
  objectives: string[];
  bio: string;
};

export const SECTORS: Record<
  Sector,
  { title: string; kanji: string; tagline: string; types: string[]; capabilities: string[] }
> = {
  semiconductor: {
    title: "Semiconductor Connect",
    kanji: "半",
    tagline: "Chip design, components, testing, suppliers and manufacturing partnerships.",
    types: ["Chip design", "PCB manufacturer", "Component supplier", "Testing lab", "OSAT / manufacturing"],
    capabilities: ["VLSI design", "Embedded firmware", "PCB assembly", "ATE testing", "Packaging", "Power electronics"],
  },
  ai: {
    title: "AI Innovation Exchange",
    kanji: "智",
    tagline: "AI solutions, startups, research collaborations and talent matching.",
    types: ["AI startup", "Developer studio", "Research lab", "University"],
    capabilities: ["Computer vision", "NLP / LLM", "Predictive maintenance", "Robotics AI", "MLOps", "Japanese-language AI"],
  },
  greentech: {
    title: "GreenTech Alliance",
    kanji: "緑",
    tagline: "Clean energy, EVs, recycling and sustainability partnerships.",
    types: ["Solar", "Wind", "EV & charging", "Battery recycling", "Waste management", "Energy efficiency"],
    capabilities: ["EPC delivery", "Battery chemistry", "Energy audits", "Waste-to-energy", "Carbon accounting", "Grid integration"],
  },
};

const c = (
  id: string, name: string, sector: Sector, type: string, state: string, city: string,
  capabilities: string[], budgetInr: number, objectives: string[], bio: string,
): DemoCompany => ({ id, name, sector, type, state, city, capabilities, budgetInr, objectives, bio });

/** Fictional sample companies for demonstrating the journey. Not real businesses. */
export const DEMO_COMPANIES: DemoCompany[] = [
  c("s1", "Silicon Kaveri Design (Demo)", "semiconductor", "Chip design", "Karnataka", "Bengaluru", ["VLSI design", "Embedded firmware"], 40, ["Joint venture", "Technology licensing"], "Mixed-signal ASIC design team seeking Japanese fab and IP partners."),
  c("s2", "Sabarmati Circuits (Demo)", "semiconductor", "PCB manufacturer", "Gujarat", "Ahmedabad", ["PCB assembly", "Power electronics"], 15, ["Contract manufacturing", "Supplier"], "Multilayer PCB and SMT assembly for automotive and industrial electronics."),
  c("s3", "Deccan Test Labs (Demo)", "semiconductor", "Testing lab", "Telangana", "Hyderabad", ["ATE testing", "Packaging"], 25, ["Pilot project", "Supplier"], "Reliability and wafer-level test services for fabless companies."),
  c("s4", "Noida Components Hub (Demo)", "semiconductor", "Component supplier", "Uttar Pradesh", "Noida", ["Power electronics"], 8, ["Distribution", "Supplier"], "Passive and discrete component sourcing for EMS manufacturers."),
  c("s5", "Dholera OSAT Partners (Demo)", "semiconductor", "OSAT / manufacturing", "Gujarat", "Dholera", ["Packaging", "ATE testing"], 120, ["Joint venture", "Investment"], "Assembly, test and packaging venture exploring Japanese equipment partners."),
  c("a1", "Nagarik Vision AI (Demo)", "ai", "AI startup", "Karnataka", "Bengaluru", ["Computer vision", "Predictive maintenance"], 20, ["Pilot project", "Joint development"], "Factory-floor defect detection for automotive lines."),
  c("a2", "Bhasha Bridge Labs (Demo)", "ai", "AI startup", "Maharashtra", "Pune", ["NLP / LLM", "Japanese-language AI"], 12, ["Joint development", "Licensing"], "Multilingual document AI covering Japanese, English and Hindi."),
  c("a3", "IIT-style Robotics Research Group (Demo)", "ai", "Research lab", "Tamil Nadu", "Chennai", ["Robotics AI", "Computer vision"], 30, ["Research collaboration"], "Academic group researching collaborative robot perception."),
  c("a4", "Cyberabad ML Studio (Demo)", "ai", "Developer studio", "Telangana", "Hyderabad", ["MLOps", "NLP / LLM"], 10, ["Talent", "Contract development"], "Dedicated ML engineering teams for offshore product development."),
  c("a5", "Hooghly Technical University AI Centre (Demo)", "ai", "University", "West Bengal", "Kolkata", ["Predictive maintenance", "MLOps"], 5, ["Research collaboration", "Talent"], "Graduate AI talent pipeline and sponsored research programmes."),
  c("g1", "Thar Solar EPC (Demo)", "greentech", "Solar", "Rajasthan", "Jodhpur", ["EPC delivery", "Grid integration"], 80, ["Joint venture", "Investment"], "Utility-scale solar EPC seeking Japanese module and inverter partners."),
  c("g2", "Coromandel Wind Services (Demo)", "greentech", "Wind", "Tamil Nadu", "Tirunelveli", ["Grid integration"], 60, ["Joint venture"], "Wind farm O&M and repowering services."),
  c("g3", "ReCell Battery Loop (Demo)", "greentech", "Battery recycling", "Haryana", "Gurugram", ["Battery chemistry"], 25, ["Pilot project", "Technology licensing"], "Lithium-ion black-mass recovery pilot plant."),
  c("g4", "Pune EV Charge Grid (Demo)", "greentech", "EV & charging", "Maharashtra", "Pune", ["Grid integration", "Energy audits"], 18, ["Distribution", "Pilot project"], "Fleet charging networks for two- and three-wheelers."),
  c("g5", "Ganga Waste-to-Energy (Demo)", "greentech", "Waste management", "Uttar Pradesh", "Kanpur", ["Waste-to-energy", "Carbon accounting"], 35, ["Pilot project", "Investment"], "Municipal and industrial waste conversion projects."),
  c("g6", "EffiWatt Audits (Demo)", "greentech", "Energy efficiency", "Gujarat", "Vadodara", ["Energy audits", "Carbon accounting"], 3, ["Supplier", "Pilot project"], "Factory energy audits and Scope 1–2 carbon reporting."),
];

export type Cluster = { state: string; sector: Sector; cluster: string; note: string };
/** Illustrative industrial clusters for orientation; verify with state agencies before decisions. */
export const CLUSTERS: Cluster[] = [
  { state: "Gujarat", sector: "semiconductor", cluster: "Dholera / Sanand", note: "Announced fab and OSAT projects" },
  { state: "Karnataka", sector: "semiconductor", cluster: "Bengaluru", note: "Chip-design centres" },
  { state: "Telangana", sector: "semiconductor", cluster: "Hyderabad", note: "Design and test services" },
  { state: "Uttar Pradesh", sector: "semiconductor", cluster: "Noida", note: "Electronics manufacturing" },
  { state: "Tamil Nadu", sector: "semiconductor", cluster: "Chennai / Sriperumbudur", note: "Electronics assembly" },
  { state: "Karnataka", sector: "ai", cluster: "Bengaluru", note: "Startup density" },
  { state: "Telangana", sector: "ai", cluster: "Hyderabad", note: "Global capability centres" },
  { state: "Maharashtra", sector: "ai", cluster: "Pune / Mumbai", note: "Enterprise AI, fintech" },
  { state: "Tamil Nadu", sector: "ai", cluster: "Chennai", note: "Robotics & research" },
  { state: "West Bengal", sector: "ai", cluster: "Kolkata", note: "Academic talent" },
  { state: "Rajasthan", sector: "greentech", cluster: "Jodhpur / Bikaner", note: "Solar resource" },
  { state: "Gujarat", sector: "greentech", cluster: "Kutch", note: "Solar & wind parks" },
  { state: "Tamil Nadu", sector: "greentech", cluster: "Tirunelveli", note: "Wind corridor" },
  { state: "Maharashtra", sector: "greentech", cluster: "Pune", note: "EV ecosystem" },
  { state: "Haryana", sector: "greentech", cluster: "Gurugram / Manesar", note: "Auto & recycling" },
  { state: "Uttar Pradesh", sector: "greentech", cluster: "Kanpur", note: "Waste management" },
];

/** Rough cartogram grid positions (col,row) for the opportunity map. */
export const MAP_GRID: Record<string, [number, number]> = {
  "Jammu and Kashmir": [2, 0], Punjab: [2, 1], Haryana: [2, 2], Delhi: [3, 2],
  Rajasthan: [1, 3], "Uttar Pradesh": [3, 3], Bihar: [4, 3], "West Bengal": [5, 4],
  Gujarat: [0, 4], "Madhya Pradesh": [2, 4], Jharkhand: [4, 4], Assam: [6, 3],
  Maharashtra: [1, 5], Chhattisgarh: [3, 5], Odisha: [4, 5],
  Telangana: [2, 6], "Andhra Pradesh": [3, 7], Goa: [0, 6], Karnataka: [1, 7],
  Kerala: [1, 8], "Tamil Nadu": [2, 8],
};

export type FinderNeeds = { sector?: string; type?: string; state?: string; capability?: string; budget?: number; objective?: string };

/** Transparent rule-based score: lists which of the user's criteria a profile meets. */
export function partnerFit(p: DemoCompany, n: FinderNeeds) {
  const reasons: string[] = [];
  if (n.sector && p.sector === n.sector) reasons.push("Sector");
  if (n.type && p.type === n.type) reasons.push("Partner type");
  if (n.state && p.state === n.state) reasons.push("State");
  if (n.capability && p.capabilities.includes(n.capability)) reasons.push("Capability");
  if (n.budget !== undefined && p.budgetInr <= n.budget) reasons.push("Within budget");
  if (n.objective && p.objectives.includes(n.objective)) reasons.push("Objective");
  return reasons;
}

export const OBJECTIVES = ["Joint venture", "Pilot project", "Technology licensing", "Supplier", "Distribution", "Investment", "Research collaboration", "Talent", "Joint development", "Contract manufacturing", "Contract development", "Licensing"];

// ---- Pilot Project Exchange (simulated, stored in this browser) ----
export type Milestone = { title: string; done: boolean };
export type Proposal = { id: string; company: string; summary: string; costInr: number; weeks: number };
export type Pilot = {
  id: string;
  title: string;
  sector: Sector;
  kind: "challenge" | "carbon";
  poster: string;
  state: string;
  problem: string;
  budgetInr: number;
  status: "open" | "partner_selected" | "in_pilot" | "evaluated";
  proposals: Proposal[];
  selected?: string;
  milestones: Milestone[];
  evaluation?: { rating: number; notes: string; decision: string };
};

const KEY = "n2j-pilots-v1";
export const SEED_PILOTS: Pilot[] = [
  { id: "p1", title: "Reduce solder-joint defects on ECU boards", sector: "semiconductor", kind: "challenge", poster: "Japanese tier-1 supplier (Demo)", state: "Tamil Nadu", problem: "2.1% defect rate on reflow line; want AI-assisted inspection within 12 weeks.", budgetInr: 20, status: "open", proposals: [{ id: "x1", company: "Nagarik Vision AI (Demo)", summary: "Camera retrofit + defect model trained on 5k labelled images.", costInr: 14, weeks: 10 }], milestones: [] },
  { id: "p2", title: "Cut compressed-air energy use 20%", sector: "greentech", kind: "carbon", poster: "Auto-parts factory, Gujarat (Demo)", state: "Gujarat", problem: "Compressors run 24/7 with an estimated 30% leakage. Seeking audit and retrofit.", budgetInr: 6, status: "open", proposals: [], milestones: [] },
  { id: "p3", title: "Japanese–English invoice extraction", sector: "ai", kind: "challenge", poster: "Trading house India office (Demo)", state: "Maharashtra", problem: "Manual entry of 3,000 bilingual invoices per month.", budgetInr: 8, status: "in_pilot", selected: "x2", proposals: [{ id: "x2", company: "Bhasha Bridge Labs (Demo)", summary: "Document AI pipeline with human review.", costInr: 7, weeks: 8 }], milestones: [{ title: "Data sharing agreement", done: true }, { title: "Model baseline", done: true }, { title: "Accuracy ≥ 95% on test set", done: false }, { title: "Go/no-go review", done: false }] },
];

export function loadPilots(): Pilot[] {
  if (typeof window === "undefined") return SEED_PILOTS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Pilot[]) : SEED_PILOTS;
  } catch {
    return SEED_PILOTS;
  }
}
export function savePilots(p: Pilot[]) {
  localStorage.setItem(KEY, JSON.stringify(p));
}
export const DEFAULT_MILESTONES = ["Scope & success metrics agreed", "Pilot setup", "Mid-pilot review", "Results evaluation"];
