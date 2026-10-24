// Market Entry Diagnostic — a pure, deterministic rules engine (no network).
// Encodes widely published Indian FDI, GST and licensing rules for a first-pass
// diagnosis of a Japanese company's India entry. Indicative guidance only.
import type { IndustryKey, ServiceKey } from "@/lib/tax-compliance";

export type EntityType = "wos" | "jv" | "liaison" | "branch" | "project";
export type FdiRoute = "automatic" | "government" | "automatic_with_conditions";

export const ENTITY_TYPES: { key: EntityType; name: string; desc: string }[] = [
  { key: "wos", name: "Wholly-owned subsidiary", desc: "Indian Pvt Ltd company 100% owned by the Japanese parent." },
  { key: "jv", name: "Joint venture", desc: "Indian company co-owned with an Indian or other partner." },
  { key: "liaison", name: "Liaison office", desc: "Representative office — market research and liaison only, no revenue." },
  { key: "branch", name: "Branch office", desc: "Extension of the parent for permitted activities (export/import, consultancy)." },
  { key: "project", name: "Project office", desc: "Temporary office to execute a specific contract won in India." },
];

export const DISCLAIMER = "Indicative guidance based on public rules — confirm with a licensed CA/CS.";

export interface MarketEntryInput {
  industry: IndustryKey;
  states: string[];
  entity: EntityType;
  investmentInrCr: number;
  expectedTurnoverInrLakh: number;
  sellsGoods: boolean;
  importsGoods: boolean;
  /** Defaults to true when operating in more than one state. */
  interStateSupply?: boolean;
  /** Selling through an e-commerce operator (marketplace). */
  ecommerce?: boolean;
}

export interface Licence { name: string; authority: string; why: string; typicalWeeks: number; source: string }
export interface StateNote { state: string; note: string; source: string }
export interface TimelineStep { label: string; weeks: number; source: string }

export interface Diagnosis {
  fdiRoute: FdiRoute;
  fdiCap: number;
  fdiNote: string;
  fdiSource: string;
  entityNote: string;
  entitySource: string;
  gst: { mustRegister: boolean; threshold: string; reason: string; registrations: number; source: string };
  licences: Licence[];
  stateNotes: StateNote[];
  dtaa: { note: string; source: string };
  timelineWeeks: number;
  steps: TimelineStep[];
  riskFlags: string[];
  recommendedServices: ServiceKey[];
  sources: string[];
  disclaimer: string;
}

const FDI_POLICY = "Consolidated FDI Policy 2020, DPIIT";

// ---------- FDI ----------
const FDI_RULES: Record<IndustryKey, { route: FdiRoute; cap: number; note: string; source: string }> = {
  manufacturing: { route: "automatic", cap: 100, note: "Manufacturing is open to 100% FDI under the automatic route — no prior government approval.", source: `${FDI_POLICY}, para 5.2.5` },
  automotive: { route: "automatic", cap: 100, note: "Automobiles and components: 100% FDI under the automatic route.", source: `${FDI_POLICY}, para 5.2.5` },
  electronics: { route: "automatic", cap: 100, note: "Electronics and semiconductor manufacturing: 100% FDI under the automatic route.", source: `${FDI_POLICY}, para 5.2.5` },
  it_software: { route: "automatic", cap: 100, note: "IT/ITeS and software services: 100% FDI under the automatic route.", source: FDI_POLICY },
  renewable: { route: "automatic", cap: 100, note: "Renewable energy generation and distribution: 100% FDI under the automatic route.", source: `${FDI_POLICY}, para 5.2.25 (power)` },
  logistics: { route: "automatic", cap: 100, note: "Warehousing, freight and logistics services: 100% FDI under the automatic route.", source: FDI_POLICY },
  healthcare: {
    route: "automatic_with_conditions", cap: 100,
    note: "Medical devices: 100% automatic. Pharmaceuticals: greenfield 100% automatic; brownfield up to 74% automatic, beyond 74% requires government approval.",
    source: `${FDI_POLICY}, para 5.2.29 (pharmaceuticals)`,
  },
  food_agri: {
    route: "automatic_with_conditions", cap: 100,
    note: "Food product manufacturing: 100% automatic. Trading (incl. e-commerce) of food products manufactured in India is 100% via the government route; multi-brand retail is restricted (51%, government route).",
    source: `${FDI_POLICY}, paras 5.2.1 & 5.2.15`,
  },
  consumer_retail: {
    route: "automatic_with_conditions", cap: 100,
    note: "Single-brand retail: 100% automatic; above 51% FDI, 30% of goods value must be sourced from India. Multi-brand retail capped at 51% via government route; e-commerce inventory model not permitted.",
    source: `${FDI_POLICY}, para 5.2.15 (trading)`,
  },
  other: {
    route: "automatic_with_conditions", cap: 100,
    note: "Most sectors allow 100% automatic FDI, but sectoral caps apply (e.g. defence 74% automatic, beyond via government route; some sectors prohibited). Verify your exact activity.",
    source: `${FDI_POLICY}, chapter 5`,
  },
};

const ENTITY_RULES: Record<EntityType, { note: string; source: string }> = {
  wos: { note: "Incorporate a Pvt Ltd company via MCA SPICe+; report foreign investment to RBI (FC-GPR) within 30 days of share allotment.", source: "Companies Act 2013; FEMA (Non-Debt Instruments) Rules 2019" },
  jv: { note: "Incorporate via MCA SPICe+ with a shareholders' agreement; the foreign stake must stay within the sector cap; FC-GPR within 30 days of allotment.", source: "Companies Act 2013; FEMA (Non-Debt Instruments) Rules 2019" },
  liaison: { note: "Requires RBI approval via an AD Category-I bank (parent: 3-year profit track record, net worth ≥ USD 50,000). Cannot earn revenue in India.", source: "FEMA 22(R)/2016-RB; RBI Master Direction on Establishment of LO/BO/PO" },
  branch: { note: "Requires RBI approval via an AD Category-I bank (parent: 5-year profit track record, net worth ≥ USD 100,000). Only permitted activities; no manufacturing or retail.", source: "FEMA 22(R)/2016-RB; RBI Master Direction on Establishment of LO/BO/PO" },
  project: { note: "Set up via an AD Category-I bank under general permission once an Indian contract is secured; limited to executing that project.", source: "FEMA 22(R)/2016-RB; RBI Master Direction on Establishment of LO/BO/PO" },
};

// ---------- GST ----------
export const SPECIAL_CATEGORY_STATES = ["Manipur", "Mizoram", "Nagaland", "Tripura"];
const GST_SOURCE = "CGST Act 2017 s.22 & s.24; Notification 10/2019-CT";

function gstDiagnosis(i: MarketEntryInput, interState: boolean) {
  const special = i.states.length > 0 && i.states.every((s) => SPECIAL_CATEGORY_STATES.includes(s));
  const goodsLimit = special ? 20 : 40;
  const servicesLimit = special ? 10 : 20;
  const limit = i.sellsGoods ? goodsLimit : servicesLimit;
  const threshold = `₹${limit} lakh aggregate turnover (${i.sellsGoods ? "goods" : "services"}${special ? ", special-category state" : ""})`;
  const registrations = Math.max(1, i.states.length);
  const reasons: string[] = [];
  if (i.sellsGoods && interState) reasons.push("inter-state supply of goods requires registration regardless of turnover (s.24)");
  if (i.ecommerce) reasons.push("suppliers through e-commerce operators must register regardless of turnover (s.24)");
  if (i.importsGoods) reasons.push("importers need a GSTIN (with IEC) to clear goods and claim IGST credit on imports");
  if (i.expectedTurnoverInrLakh > limit) reasons.push(`expected turnover ₹${i.expectedTurnoverInrLakh} lakh exceeds the ₹${limit} lakh threshold (s.22)`);
  const mustRegister = reasons.length > 0;
  const reason = mustRegister
    ? `Registration required: ${reasons.join("; ")}.`
    : `Below the ${threshold} threshold with no mandatory trigger — registration optional (voluntary registration allows input tax credit).`;
  return { mustRegister, threshold, reason, registrations, source: GST_SOURCE };
}

// ---------- Licences ----------
const L = {
  spice: { name: "Company incorporation (SPICe+ incl. DIN, name reservation)", authority: "Ministry of Corporate Affairs (MCA)", why: "Legal entity for a subsidiary or JV.", typicalWeeks: 3, source: "Companies Act 2013, s.7" },
  panTan: { name: "PAN & TAN", authority: "Income Tax Department (issued with SPICe+)", why: "Mandatory tax identifiers; TAN needed to deduct TDS.", typicalWeeks: 1, source: "Income-tax Act 1961, s.139A & s.203A" },
  fcgpr: { name: "FC-GPR filing on FIRMS portal", authority: "Reserve Bank of India (via AD bank)", why: "Report issue of shares to the foreign investor within 30 days of allotment.", typicalWeeks: 2, source: "FEMA (Mode of Payment & Reporting of NDI) Regulations 2019" },
  rbiLoBo: { name: "RBI approval for liaison/branch/project office", authority: "Reserve Bank of India (via AD Category-I bank)", why: "Foreign company establishing a place of business without incorporating.", typicalWeeks: 6, source: "FEMA 22(R)/2016-RB" },
  fcRegistration: { name: "Foreign company registration (Form FC-1)", authority: "Ministry of Corporate Affairs (MCA)", why: "Required within 30 days of establishing a place of business in India.", typicalWeeks: 2, source: "Companies Act 2013, s.380" },
  gst: { name: "GST registration (one per state)", authority: "GSTN / State & Central tax authorities", why: "Mandatory per the GST diagnosis; separate GSTIN in each state of operation.", typicalWeeks: 1, source: GST_SOURCE },
  iec: { name: "Importer-Exporter Code (IEC)", authority: "DGFT", why: "Required for any import or export of goods.", typicalWeeks: 1, source: "Foreign Trade (D&R) Act 1992, s.7" },
  shops: { name: "Shops & Establishment registration", authority: "State Labour Department", why: "Every office/commercial establishment in the state.", typicalWeeks: 2, source: "State Shops & Establishments Acts" },
  ptax: { name: "Professional tax registration", authority: "State Commercial Tax Department", why: "Employer registration in states that levy professional tax.", typicalWeeks: 1, source: "Constitution Art. 276; State P-Tax Acts" },
  factory: { name: "Factory licence & building plan approval", authority: "State Directorate of Industrial Safety & Health", why: "Any manufacturing premises with 10+ workers (with power).", typicalWeeks: 8, source: "Factories Act 1948, s.6–7" },
  pcb: { name: "Consent to Establish / Operate (CTE/CTO)", authority: "State Pollution Control Board", why: "Industrial units before construction (CTE) and before production (CTO).", typicalWeeks: 10, source: "Water Act 1974 s.25; Air Act 1981 s.21" },
  cdscoDevice: { name: "Medical device import/manufacturing licence", authority: "CDSCO / State Licensing Authority", why: "All medical devices are regulated by risk class (A–D).", typicalWeeks: 16, source: "Medical Devices Rules 2017" },
  cdscoDrug: { name: "Drug manufacturing / import licence", authority: "CDSCO / State Drug Controller", why: "Manufacture or import of pharmaceuticals.", typicalWeeks: 20, source: "Drugs & Cosmetics Act 1940; New Drugs and Clinical Trials Rules 2019" },
  fssai: { name: "FSSAI licence (central or state)", authority: "Food Safety and Standards Authority of India", why: "Any food business operator; central licence for importers.", typicalWeeks: 6, source: "Food Safety and Standards Act 2006, s.31" },
  bis: { name: "BIS Compulsory Registration (CRS) / ISI", authority: "Bureau of Indian Standards", why: "Notified electronics and IT goods cannot be sold without registration.", typicalWeeks: 12, source: "BIS Act 2016; Electronics & IT Goods (Compulsory Registration) Order 2021" },
  almm: { name: "ALMM listing / MNRE approvals", authority: "Ministry of New & Renewable Energy (MNRE)", why: "Solar modules for government-linked projects must be on the Approved List of Models and Manufacturers.", typicalWeeks: 12, source: "MNRE ALMM Order 2019 (as amended)" },
  stpi: { name: "STPI / SEZ unit registration (optional)", authority: "STPI / SEZ Development Commissioner", why: "Optional — single-window export benefits and customs-duty exemptions.", typicalWeeks: 6, source: "STP Scheme (FTP 2023); SEZ Act 2005" },
  importCustoms: { name: "Customs registration at port (AD code)", authority: "CBIC / Indian Customs (ICEGATE)", why: "Register AD code and bank account at each port of import.", typicalWeeks: 1, source: "Customs Act 1962" },
} satisfies Record<string, Licence>;

function licencesFor(i: MarketEntryInput, gstMust: boolean): Licence[] {
  const out: Licence[] = [];
  const incorporated = i.entity === "wos" || i.entity === "jv";
  if (incorporated) out.push(L.spice, L.panTan, L.fcgpr);
  else out.push(L.rbiLoBo, L.fcRegistration, L.panTan);
  if (gstMust && i.entity !== "liaison") out.push(L.gst);
  if (i.importsGoods && i.entity !== "liaison") out.push(L.iec, L.importCustoms);
  const manufactures = incorporated; // LO/BO/PO cannot manufacture
  switch (i.industry) {
    case "manufacturing":
    case "automotive":
      if (manufactures) out.push(L.factory, L.pcb);
      break;
    case "electronics":
      out.push(L.bis);
      if (manufactures) out.push(L.factory, L.pcb);
      break;
    case "healthcare":
      out.push(L.cdscoDevice, L.cdscoDrug);
      break;
    case "food_agri":
      out.push(L.fssai);
      if (manufactures) out.push(L.factory, L.pcb);
      break;
    case "renewable":
      out.push(L.almm);
      if (manufactures) out.push(L.pcb);
      break;
    case "it_software":
      if (incorporated) out.push(L.stpi);
      break;
    default:
      break;
  }
  out.push(L.shops, L.ptax);
  // dedupe by name, preserving order
  return out.filter((l, idx) => out.findIndex((x) => x.name === l.name) === idx);
}

// ---------- State notes ----------
const STATE_NOTES: Record<string, { note: string; source: string }> = {
  "Tamil Nadu": { note: "Chennai–Sriperumbudur–Oragadam auto & electronics corridor; TN Industrial Policy 2021 capital subsidies; Guidance Tamil Nadu single window.", source: "Tamil Nadu Industrial Policy 2021" },
  Gujarat: { note: "Sanand/Mandal auto cluster (Japanese industrial park), Dholera SIR semiconductor hub; Gujarat Industrial Policy 2020; iNDEXTb.", source: "Gujarat Industrial Policy 2020" },
  Karnataka: { note: "Bengaluru IT, electronics & aerospace hub; Tumakuru Japanese Industrial Township; Karnataka Udyog Mitra single window.", source: "Karnataka Industrial Policy 2020–25" },
  Maharashtra: { note: "Pune–Chakan auto cluster, Mumbai finance hub, Supa Japanese industrial park (MIDC); MAITRI single window.", source: "Maharashtra Industrial Policy 2019" },
  Telangana: { note: "Hyderabad pharma/life sciences (Genome Valley) and IT; TS-iPASS single window with deemed approvals.", source: "Telangana TS-iPASS Act 2014" },
  "Uttar Pradesh": { note: "Noida/Greater Noida electronics & mobile manufacturing; Nivesh Mitra single window; UP Electronics Manufacturing Policy.", source: "UP Industrial Investment & Employment Promotion Policy 2022" },
  Haryana: { note: "Gurugram/Manesar auto cluster (Maruti Suzuki, Honda) and corporate HQs; HEPP 2020; Haryana Enterprise Promotion Centre.", source: "Haryana Enterprises & Employment Policy 2020" },
  "Andhra Pradesh": { note: "Sri City integrated township with many Japanese manufacturers; AP single-desk portal.", source: "AP Industrial Development Policy 2023–27" },
  Rajasthan: { note: "Neemrana/Ghiloth Japanese Investment Zones on the Delhi–Mumbai corridor; RIPS 2024 incentives.", source: "Rajasthan Investment Promotion Scheme 2024" },
  Delhi: { note: "Corporate/liaison office base and services hub; limited industrial land — manufacturing usually in NCR states.", source: "Delhi Industrial Policy 2010–21" },
  "West Bengal": { note: "Kolkata gateway to East India & ASEAN; Silpa Sathi single window.", source: "West Bengal Industrial Policy" },
  "Madhya Pradesh": { note: "Pithampur (Indore) auto & pharma cluster; Invest MP single window; land at concessional rates.", source: "MP Industrial Promotion Policy 2014 (as amended)" },
  Kerala: { note: "Kochi IT parks and port logistics; K-SWIFT single window.", source: "Kerala Industrial Policy 2023" },
  Odisha: { note: "Metals, chemicals and port-led industry (Paradip); GO-SWIFT single window.", source: "Odisha Industrial Policy Resolution 2022" },
  Punjab: { note: "Ludhiana light engineering and food processing; Invest Punjab single window.", source: "Punjab Industrial & Business Development Policy 2022" },
};
const NORTH_EAST = ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"];

export function stateNote(state: string): StateNote {
  const known = STATE_NOTES[state];
  if (known) return { state, ...known };
  if (NORTH_EAST.includes(state))
    return { state, note: "North-East region: central incentives under UNNATI 2024; check state single-window and special-category GST thresholds.", source: "UNNATI Scheme 2024, DPIIT" };
  return { state, note: "Check the state's industrial policy and single-window portal for capital subsidies and land allotment.", source: "State industrial policy" };
}

// ---------- DTAA ----------
const DTAA = {
  note: "India–Japan DTAA caps withholding on dividends, interest, royalties and fees for technical services at 10%. Japanese recipients need a Tax Residency Certificate (TRC) and Form 10F to claim treaty rates; watch Permanent Establishment exposure for staff in India.",
  source: "India–Japan DTAA Arts. 10–12; Income-tax Act s.90(4)–(5)",
};

// ---------- Engine ----------
export function diagnose(input: MarketEntryInput): Diagnosis {
  const interState = input.interStateSupply ?? input.states.length > 1;
  const fdi = { ...FDI_RULES[input.industry] };
  if (input.industry === "healthcare" && input.investmentInrCr > 0 && input.entity === "jv") {
    // JV in pharma often implies a brownfield acquisition — flag the government route possibility.
    fdi.note += " A JV/acquisition in an existing pharma company is brownfield.";
  }
  const entity = ENTITY_RULES[input.entity];
  const gst = gstDiagnosis(input, interState);
  if (input.entity === "liaison") {
    gst.mustRegister = false;
    gst.reason = "A liaison office makes no taxable supplies, so GST registration is generally not required.";
  }
  const licences = licencesFor(input, gst.mustRegister);
  const stateNotes = input.states.map(stateNote);

  const incorporated = input.entity === "wos" || input.entity === "jv";
  const steps: TimelineStep[] = [];
  if (incorporated) {
    steps.push({ label: "Incorporate via MCA SPICe+ (PAN/TAN issued)", weeks: 3, source: L.spice.source });
    if (fdi.route === "government") steps.unshift({ label: "Government approval via FIF portal", weeks: 12, source: FDI_POLICY });
    steps.push({ label: "Open bank account, remit capital, allot shares", weeks: 2, source: "FEMA (NDI) Rules 2019" });
    steps.push({ label: "File FC-GPR with RBI (within 30 days of allotment)", weeks: 2, source: L.fcgpr.source });
  } else {
    steps.push({ label: "RBI approval via AD Category-I bank", weeks: 6, source: L.rbiLoBo.source });
    steps.push({ label: "Register with MCA (Form FC-1) & obtain PAN/TAN", weeks: 2, source: L.fcRegistration.source });
  }
  const setupWeeks = steps.reduce((a, s) => a + s.weeks, 0);
  const setupNames = new Set([L.spice.name, L.panTan.name, L.fcgpr.name, L.rbiLoBo.name, L.fcRegistration.name]);
  const postSetup = licences.filter((l) => !setupNames.has(l.name));
  const licenceWeeks = postSetup.reduce((m, l) => Math.max(m, l.typicalWeeks), 0);
  if (gst.mustRegister && input.entity !== "liaison") steps.push({ label: `GST registration${gst.registrations > 1 ? ` in ${gst.registrations} states` : ""}`, weeks: 1, source: GST_SOURCE });
  if (postSetup.length > 0) steps.push({ label: "Sector licences & state registrations (run in parallel)", weeks: licenceWeeks, source: "See licence checklist" });
  steps.push({ label: "Commence operations", weeks: 0, source: "—" });
  // GST registration overlaps the licence window, so only the longest parallel track counts.
  const timelineWeeks = setupWeeks + Math.max(licenceWeeks, gst.mustRegister ? 1 : 0);

  const risk: string[] = [];
  if (fdi.route === "government") risk.push("Government approval route — expect 10–12+ weeks before investment can be made.");
  if (fdi.route === "automatic_with_conditions") risk.push("Sector conditions apply — confirm your exact activity qualifies for the automatic route.");
  if (input.entity === "liaison") risk.push("A liaison office cannot earn revenue or sign contracts in India.");
  if (input.entity === "branch") risk.push("A branch office is taxed at the higher foreign-company rate and cannot manufacture.");
  if (input.entity === "liaison" || input.entity === "branch" || input.entity === "project")
    risk.push("Liaison/branch/project offices need RBI approval through an AD bank and annual activity certificates.");
  if (input.states.length > 1) risk.push(`Multi-state operations: ${input.states.length} separate GST registrations (one per state) and state-level labour registrations.`);
  if (input.states.length === 0) risk.push("No state selected — location drives GST registration, licences and incentives.");
  if (input.industry === "healthcare") risk.push("CDSCO licensing is often the critical path (4–6 months).");
  if (input.industry === "consumer_retail" && incorporated) risk.push("Single-brand retail above 51% FDI triggers the 30% India sourcing requirement.");
  if (input.importsGoods) risk.push("Import duties and customs valuation of related-party imports may be scrutinised (SVB).");
  if (incorporated || input.entity === "branch") risk.push("Transactions with the Japanese parent are subject to Indian transfer pricing rules.");

  const rec = new Set<ServiceKey>(["tax_gst", "accounting"]);
  rec.add(incorporated ? "incorporation" : "fema");
  if (incorporated) { rec.add("fema"); rec.add("roc_compliance"); rec.add("transfer_pricing"); }
  if (input.entity === "branch") rec.add("transfer_pricing");
  if (input.importsGoods) rec.add("import_export");
  if (["healthcare", "food_agri", "electronics", "renewable", "manufacturing", "automotive"].includes(input.industry)) rec.add("industry_regulatory");
  if (!incorporated) rec.add("incorporation");
  const order: ServiceKey[] = ["incorporation", "fema", "tax_gst", "roc_compliance", "import_export", "transfer_pricing", "industry_regulatory", "accounting"];
  const recommendedServices = order.filter((k) => rec.has(k));

  const sources = Array.from(new Set([
    fdi.source, entity.source, gst.source, ...licences.map((l) => l.source), ...stateNotes.map((s) => s.source), DTAA.source,
  ]));

  return {
    fdiRoute: fdi.route, fdiCap: fdi.cap, fdiNote: fdi.note, fdiSource: fdi.source,
    entityNote: entity.note, entitySource: entity.source,
    gst, licences, stateNotes, dtaa: DTAA, timelineWeeks, steps, riskFlags: risk,
    recommendedServices, sources, disclaimer: DISCLAIMER,
  };
}

export const FDI_ROUTE_LABEL: Record<FdiRoute, string> = {
  automatic: "Automatic route",
  government: "Government route",
  automatic_with_conditions: "Automatic (with conditions)",
};
