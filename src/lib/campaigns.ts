// Pure logic for Product Survey Campaigns (ported from the test.html report engine).

export const CAMPAIGN_STATUSES = ["draft", "submitted", "quoted", "accepted", "fieldwork_live", "data_review", "report_ready", "delivered"] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];
export const STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: "Draft", submitted: "Submitted", quoted: "Quoted", accepted: "Accepted",
  fieldwork_live: "Fieldwork Live", data_review: "Data Review", report_ready: "Report Ready", delivered: "Delivered",
};

export const BIS_STATUSES = { not_started: "Not started", in_progress: "Application in progress", certified: "Certified (self-declared)", not_required: "Not required" } as const;
export const DEALER_TYPES = ["Distributor", "Wholesaler", "Retail showroom", "Dealer network", "FPO / Cooperative", "Service centre", "E-commerce seller"];

export type QuestionType = "choice" | "rating" | "number" | "text";
export type CustomQuestion = { id: string; label: string; type: QuestionType; options: string[]; section: "localization" | "commercial" };

export const CORE_HEADERS = ["Dealer Name", "Operating Territory", "GSTIN / Trade License", "Price Acceptance Rating (1-5)", "Required Margin (%)", "Pilot Trial Volume"] as const;
export const CONTACT_HEADERS = ["Contact Person", "Phone", "Email"] as const;

export type CoreKey = "name" | "territory" | "gstin" | "priceScore" | "margin" | "pilot";
export const CORE_KEYS: Record<CoreKey, string[]> = {
  name: ["dealer", "company", "showroom", "agency", "business", "stockist"],
  territory: ["territory", "state", "region", "location", "city"],
  gstin: ["gstin", "license", "gst", "form 20b"],
  priceScore: ["price", "mrp", "acceptance", "rating", "willingness", "competitiveness"],
  margin: ["margin", "markup", "discount"],
  pilot: ["pilot", "demo", "volume", "commitment", "pairs", "units", "batch"],
};

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
/** Format check only — this is not a government verification. */
export const isValidGstinFormat = (v: string) => GSTIN_RE.test(v.trim().toUpperCase());

const STATE_GST_CODES: Record<string, string> = {
  punjab: "03", haryana: "06", delhi: "07", rajasthan: "08", "uttar pradesh": "09",
  bihar: "10", assam: "18", "west bengal": "19", odisha: "21", "madhya pradesh": "23",
  gujarat: "24", maharashtra: "27", karnataka: "29", "andhra pradesh": "37", "tamil nadu": "33",
  kerala: "32", telangana: "36",
};

/** Generate a 15-character provisional GSTIN if the uploaded data omitted a GSTIN column. */
export function generateProvisionalGstin(territory: string, index: number): string {
  const t = territory.toLowerCase();
  let code = "99";
  for (const [st, sc] of Object.entries(STATE_GST_CODES)) {
    if (t.includes(st)) { code = sc; break; }
  }
  const num = String(index + 1).padStart(4, "0");
  return `${code}UNVER${num}A1Z0`;
}

/** Sample agri-machinery questions matching the attached spreadsheet. */
export const AGRI_SAMPLE_QUESTIONS: Omit<CustomQuestion, "id">[] = [
  { label: "Engine & Fuel Preference", type: "choice", options: ["Single-Cylinder Diesel Demanded", "Petrol Engine Acceptable", "Electric / Battery Swappable Alternative"], section: "localization" },
  { label: "Soil Clearance Adaptation", type: "text", options: [], section: "localization" },
  { label: "Local Repair SLA", type: "text", options: [], section: "commercial" },
  { label: "Subsidy / Budni Requirement", type: "text", options: [], section: "commercial" },
  { label: "Notes for Japanese Mechanical Engineers", type: "text", options: [], section: "localization" },
];

/** Detect core columns by keyword; returns header for each core key ("" when missing). */
export function detectColumns(headers: string[]) {
  const used = new Set<string>();
  const order: CoreKey[] = ["gstin", "margin", "pilot", "territory", "name", "priceScore"];
  const map = {} as Record<CoreKey, string>;
  for (const k of order) {
    const h = headers.find((x) => !used.has(x) && CORE_KEYS[k].some((kw) => x.toLowerCase().includes(kw))) ?? "";
    if (h) used.add(h);
    map[k] = h;
  }
  return map;
}

export type ParsedRow = {
  dealer_name: string; territory: string; gstin: string; price_rating: number | null; margin: string; pilot_volume: string;
  answers: Record<string, string | number>; contact_name: string; phone: string; email: string;
};
export type RowError = { row: number; message: string };

const s = (v: unknown) => (v === null || v === undefined ? "" : String(v).trim());

/** Fuzzy / keyword match for choice options (e.g. "7.0 HP Air-Cooled Diesel" -> "Single-Cylinder Diesel Demanded"). */
export function matchChoice(raw: unknown, options: string[]): string {
  const val = String(raw ?? "").trim();
  if (!val || !options.length) return val;
  if (options.includes(val)) return val;

  const lower = val.toLowerCase();
  const caseMatch = options.find((o) => o.toLowerCase() === lower);
  if (caseMatch) return caseMatch;

  let bestOpt: string | null = null;
  let bestScore = 0;

  for (const opt of options) {
    const optLower = opt.toLowerCase();
    let score = 0;
    if (lower.includes(optLower) || optLower.includes(lower)) score += 5;
    const tokens = optLower.split(/[^a-z0-9]+/).filter((t) => t.length > 2);
    for (const t of tokens) {
      if (lower.includes(t)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestOpt = opt;
    }
  }

  return bestScore > 0 && bestOpt ? bestOpt : val;
}

/** Match custom questions to sheet headers flexibly (exact -> substring -> semantic keyword overlap). */
export function matchQuestionHeader(qLabel: string, headers: string[], usedHeaders: Set<string>): string | undefined {
  const lower = (x: string) => x.trim().toLowerCase();
  const qLower = lower(qLabel);

  const exact = headers.find((h) => !usedHeaders.has(h) && lower(h) === qLower);
  if (exact) return exact;

  const sub = headers.find((h) => !usedHeaders.has(h) && (lower(h).includes(qLower) || qLower.includes(lower(h))));
  if (sub) return sub;

  const stopWords = new Set(["and", "the", "for", "with", "type", "needs", "key", "notes", "preference"]);
  const qTokens = qLower.split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !stopWords.has(t));

  const synonyms: Record<string, string[]> = {
    engine: ["engine", "fuel", "powertrain", "motor", "hp", "displacement"],
    fuel: ["fuel", "diesel", "petrol", "electric", "battery", "kerosene"],
    soil: ["soil", "clearance", "tillage", "ground", "puddling", "crops"],
    clearance: ["clearance", "ground", "chassis", "underbody", "adaptation"],
    adaptation: ["adaptation", "engineering", "feedback", "modification", "hardware"],
    repair: ["repair", "service", "maintenance", "after-sales", "aftersales", "sla", "dispatch"],
    sla: ["sla", "turnaround", "service", "repair", "dispatch", "warranty"],
    subsidy: ["subsidy", "budni", "smam", "fmtti", "compliance", "scheme", "government", "anudan", "dbt"],
    budni: ["budni", "fmtti", "smam", "test", "subsidy", "compliance"],
    engineer: ["engineer", "engineering", "mechanical", "technical", "feedback", "notes"],
  };

  let bestHeader: string | undefined;
  let bestScore = 0;

  for (const h of headers) {
    if (usedHeaders.has(h)) continue;
    const hLower = lower(h);
    let score = 0;
    for (const t of qTokens) {
      if (hLower.includes(t)) score += 3;
      const syns = synonyms[t] ?? [];
      for (const syn of syns) {
        if (hLower.includes(syn)) score += 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestHeader = h;
    }
  }

  return bestScore >= 2 ? bestHeader : undefined;
}

/** Extract contact name, phone, and email even if combined into a single column. */
export function extractContacts(raw: Record<string, unknown>, headers: string[]) {
  const contactHeader = headers.find((h) => /contact(\s+person)?|decision\s*maker|poc|key\s*decision/i.test(h));
  const contact_name = contactHeader ? s(raw[contactHeader]) : "";

  const phoneHeader = headers.find((h) => /phone|mobile|tel|contact\s*no/i.test(h) && !/email/i.test(h));
  const emailHeader = headers.find((h) => /email|mail/i.test(h) && !/phone/i.test(h));
  const comboHeader = headers.find((h) => /(phone.*email|email.*phone|contact.*phone)/i.test(h));

  let phone = phoneHeader ? s(raw[phoneHeader]) : "";
  let email = emailHeader ? s(raw[emailHeader]) : "";

  if (comboHeader && (!phone || !email)) {
    const combo = s(raw[comboHeader]);
    const emailMatch = combo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      if (!email) email = emailMatch[0];
      const remainder = combo.replace(emailMatch[0], "").replace(/[\/\s,;|-]+$/, "").replace(/^[\/\s,;|-]+/, "").trim();
      if (!phone && remainder) phone = remainder;
    } else if (!phone) {
      phone = combo;
    }
  }

  return { contact_name, phone, email };
}

/** Validate one response (shared by form, manual entry and bulk upload). */
export function validateResponse(r: ParsedRow, questions: CustomQuestion[]): string[] {
  const e: string[] = [];
  if (!r.dealer_name) e.push("Dealer name is required");
  if (!isValidGstinFormat(r.gstin)) e.push(`GSTIN "${r.gstin || "(empty)"}" is not in a valid format`);
  if (r.price_rating !== null && (!Number.isInteger(r.price_rating) || r.price_rating < 1 || r.price_rating > 5)) e.push("Price rating must be 1-5");
  if (r.price_rating === null) e.push("Price rating is required");
  for (const q of questions) {
    const v = r.answers[q.id];
    if (v === undefined || v === "") continue;
    if (q.type === "choice" && q.options.length && !q.options.includes(String(v))) e.push(`"${q.label}" must be one of: ${q.options.join(", ")}`);
    if ((q.type === "number" || q.type === "rating") && Number.isNaN(Number(v))) e.push(`"${q.label}" must be a number`);
    if (q.type === "rating" && (Number(v) < 1 || Number(v) > 5)) e.push(`"${q.label}" must be 1-5`);
  }
  return e;
}

/** Turn spreadsheet rows (header → value) into responses, with per-row errors. */
export function parseSheetRows(rows: Record<string, unknown>[], questions: CustomQuestion[]) {
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  const core = detectColumns(headers);
  const errors: RowError[] = [];
  const requiredCore: CoreKey[] = ["name", "territory", "priceScore", "margin", "pilot"];
  const missing = requiredCore.filter((k) => !core[k]);
  if (missing.length) {
    errors.push({ row: 0, message: `Missing columns: ${missing.map((k) => CORE_HEADERS[["name", "territory", "gstin", "priceScore", "margin", "pilot"].indexOf(k)]).join(", ")}` });
    return { valid: [], errors };
  }

  const usedHeaders = new Set<string>(Object.values(core).filter(Boolean));
  const qHeader = new Map<string, string | undefined>();
  for (const q of questions) {
    const h = matchQuestionHeader(q.label, headers, usedHeaders);
    if (h) {
      usedHeaders.add(h);
      qHeader.set(q.id, h);
    }
  }

  const unknown = headers.filter((h) => !Object.values(core).includes(h) && ![...qHeader.values()].includes(h) && !CONTACT_HEADERS.some((c) => c.toLowerCase() === h.trim().toLowerCase()) && !/timestamp|phone|email|contact|crops|s\.no/i.test(h));
  if (unknown.length) errors.push({ row: 0, message: `Ignored columns not in this campaign: ${unknown.join(", ")}` });

  const valid: ParsedRow[] = [];
  rows.forEach((raw, i) => {
    if (Object.values(raw).every((v) => s(v) === "")) return;
    const pr = s(raw[core.priceScore]);
    const rawGstin = core.gstin ? s(raw[core.gstin]).toUpperCase() : "";
    const gstin = rawGstin || generateProvisionalGstin(s(raw[core.territory]), i);

    let margin = s(raw[core.margin]);
    if (/^0\.\d+$/.test(margin)) {
      margin = `${Math.round(Number(margin) * 100)}%`;
    }

    const { contact_name, phone, email } = extractContacts(raw, headers);

    const r: ParsedRow = {
      dealer_name: s(raw[core.name]),
      territory: s(raw[core.territory]),
      gstin,
      price_rating: pr === "" ? null : Number(pr),
      margin,
      pilot_volume: s(raw[core.pilot]),
      answers: {},
      contact_name,
      phone,
      email,
    };

    for (const q of questions) {
      const h = qHeader.get(q.id);
      if (h) {
        const v = s(raw[h]);
        if (v !== "") {
          if (q.type === "choice") {
            r.answers[q.id] = matchChoice(v, q.options);
          } else if (q.type === "number" || q.type === "rating") {
            r.answers[q.id] = Number(v);
          } else {
            r.answers[q.id] = v;
          }
        }
      }
    }

    const e = validateResponse(r, questions);
    if (e.length) e.forEach((m) => errors.push({ row: i + 2, message: m }));
    else valid.push(r);
  });
  return { valid, errors };
}

export type ResponseRow = { id: string; dealer_name: string; territory: string; gstin: string; price_rating: number | null; margin: string; pilot_volume: string; answers: Record<string, unknown> };

/** Sum every integer mentioned in a pilot commitment ("1 Demo Unit + 5 Orders" → 6). */
export const pilotUnits = (v: string) => (v.match(/\d+/g) ?? []).reduce((a, n) => a + Number(n), 0);
const marginLow = (v: string) => { const m = v.match(/\d+(\.\d+)?/); return m ? Number(m[0]) : null; };

export function computeKpis(rows: ResponseRow[]) {
  const rated = rows.filter((r) => r.price_rating !== null);
  const counts: Record<string, number> = {};
  rows.forEach((r) => { const m = r.margin.trim() || "Unspecified"; counts[m] = (counts[m] ?? 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return {
    total: rows.length,
    avgPrice: rated.length ? Math.round((rated.reduce((a, r) => a + (r.price_rating ?? 0), 0) / rated.length) * 10) / 10 : null,
    topMargin: top ? top[0] : null,
    pilotDemand: rows.reduce((a, r) => a + pilotUnits(r.pilot_volume), 0),
  };
}

/** Readiness 0-100: base 40, +25 valid GSTIN format, +20 for 15+ pilot units (+10 for 1-14), +15 margin ask 10-20%. */
export function readinessScore(r: Pick<ResponseRow, "gstin" | "pilot_volume" | "margin">) {
  let score = 40;
  if (isValidGstinFormat(r.gstin)) score += 25;
  const u = pilotUnits(r.pilot_volume);
  if (u >= 15) score += 20; else if (u >= 1) score += 10;
  const m = marginLow(r.margin);
  if (m !== null && m >= 10 && m <= 20) score += 15;
  return Math.min(score, 100);
}

export type ChartSpec =
  | { kind: "notes"; question: CustomQuestion; samples: string[] }
  | { kind: "doughnut" | "bar"; question: CustomQuestion; data: { label: string; value: number }[] };

/** One chart per custom question; free text (>70% unique with >2 entries, or long answers) becomes notes. */
export function buildCharts(rows: ResponseRow[], questions: CustomQuestion[]): ChartSpec[] {
  return questions.map((q) => {
    const vals = rows.map((r) => s(r.answers[q.id])).filter(Boolean);
    const counts: Record<string, number> = {};
    vals.forEach((v) => (counts[v] = (counts[v] ?? 0) + 1));
    const unique = Object.keys(counts).length;
    const avgLen = vals.length ? vals.reduce((a, v) => a + v.length, 0) / vals.length : 0;
    if ((unique / (vals.length || 1) > 0.7 && vals.length > 2) || avgLen > 60) return { kind: "notes", question: q, samples: Object.keys(counts) };
    const data = Object.entries(counts).map(([label, value]) => ({ label, value }));
    return { kind: unique <= 4 ? "doughnut" : "bar", question: q, data };
  });
}

/** Split "Punjab / Haryana, Delhi" into states. */
export const splitStates = (t: string) => t.split(/[\/,&]| and /i).map((x) => x.trim()).filter(Boolean);

export function stateBreakdown(rows: ResponseRow[]) {
  const m = new Map<string, { state: string; responses: number; ratingSum: number; rated: number; pilot: number }>();
  rows.forEach((r) => splitStates(r.territory || "Unspecified").forEach((st) => {
    const e = m.get(st) ?? { state: st, responses: 0, ratingSum: 0, rated: 0, pilot: 0 };
    e.responses++; e.pilot += pilotUnits(r.pilot_volume);
    if (r.price_rating !== null) { e.ratingSum += r.price_rating; e.rated++; }
    m.set(st, e);
  }));
  return [...m.values()].map((e) => ({ state: e.state, responses: e.responses, pilot: e.pilot, avgPrice: e.rated ? Math.round((e.ratingSum / e.rated) * 10) / 10 : null })).sort((a, b) => b.responses - a.responses);
}

/** Top red flags: lowest price ratings / zero pilot commitment, with the dealer's longest text answer. */
export function redFlags(rows: ResponseRow[], questions: CustomQuestion[], limit = 5) {
  const textQs = questions.filter((q) => q.type === "text");
  return rows
    .filter((r) => (r.price_rating !== null && r.price_rating <= 2) || pilotUnits(r.pilot_volume) === 0)
    .map((r) => {
      const note = textQs.map((q) => s(r.answers[q.id])).sort((a, b) => b.length - a.length)[0] ?? "";
      const reasons = [r.price_rating !== null && r.price_rating <= 2 ? `Price rating ${r.price_rating}/5` : "", pilotUnits(r.pilot_volume) === 0 ? "No pilot commitment" : ""].filter(Boolean);
      return { id: r.id, dealer: r.dealer_name, territory: r.territory, reasons, note, severity: (r.price_rating ?? 3) - (pilotUnits(r.pilot_volume) === 0 ? 1 : 0) };
    })
    .sort((a, b) => a.severity - b.severity)
    .slice(0, limit);
}

export const templateHeaders = (questions: CustomQuestion[]) => [...CORE_HEADERS, ...questions.map((q) => q.label), ...CONTACT_HEADERS];
