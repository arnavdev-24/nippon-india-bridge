// India heat map logic, ported from the test_1.html report engine.
import INDIA from "./india-map.json";
import type { CustomQuestion, ResponseRow } from "./campaigns";

export const INDIA_MAP = INDIA as { w: number; h: number; paths: Record<string, string>; cent: Record<string, [number, number]> };
export const STATE_NAMES = Object.keys(INDIA_MAP.paths);

const ZONES: Record<string, string[]> = {
  "north india": ["Delhi", "Haryana", "Punjab", "Uttar Pradesh", "Rajasthan", "Himachal Pradesh", "Uttarakhand", "Jammu and Kashmir", "Chandigarh"],
  "south india": ["Karnataka", "Tamil Nadu", "Kerala", "Andhra Pradesh", "Telangana"],
  "west india": ["Maharashtra", "Gujarat", "Goa"],
  "east india": ["West Bengal", "Odisha", "Bihar", "Jharkhand"],
  "central india": ["Madhya Pradesh", "Chhattisgarh"],
  northeast: ["Assam", "Arunachal Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Tripura", "Sikkim"],
  "north east": ["Assam", "Arunachal Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Tripura", "Sikkim"],
};
const ALIAS: Record<string, string> = {
  up: "Uttar Pradesh", mp: "Madhya Pradesh", ap: "Andhra Pradesh", tn: "Tamil Nadu", wb: "West Bengal", "j&k": "Jammu and Kashmir", "jammu & kashmir": "Jammu and Kashmir", "jammu kashmir": "Jammu and Kashmir", orissa: "Odisha", uttaranchal: "Uttarakhand", pondicherry: "Puducherry", andaman: "Andaman and Nicobar Islands", dadra: "Dadra and Nagar Haveli and Daman and Diu", daman: "Dadra and Nagar Haveli and Daman and Diu",
  delhi: "Delhi", "new delhi": "Delhi", ncr: "Delhi", "delhi ncr": "Delhi", noida: "Uttar Pradesh", ghaziabad: "Uttar Pradesh", gurgaon: "Haryana", gurugram: "Haryana", faridabad: "Haryana", ambala: "Haryana", karnal: "Haryana",
  mumbai: "Maharashtra", pune: "Maharashtra", nagpur: "Maharashtra", nashik: "Maharashtra", thane: "Maharashtra",
  ahmedabad: "Gujarat", surat: "Gujarat", vadodara: "Gujarat", rajkot: "Gujarat",
  bengaluru: "Karnataka", bangalore: "Karnataka", mysuru: "Karnataka", mysore: "Karnataka", hubli: "Karnataka", mangaluru: "Karnataka",
  chennai: "Tamil Nadu", coimbatore: "Tamil Nadu", madurai: "Tamil Nadu", thanjavur: "Tamil Nadu",
  hyderabad: "Telangana", warangal: "Telangana", vijayawada: "Andhra Pradesh", visakhapatnam: "Andhra Pradesh", guntur: "Andhra Pradesh",
  kolkata: "West Bengal", burdwan: "West Bengal", howrah: "West Bengal", bhubaneswar: "Odisha", cuttack: "Odisha",
  lucknow: "Uttar Pradesh", kanpur: "Uttar Pradesh", varanasi: "Uttar Pradesh", agra: "Uttar Pradesh",
  jaipur: "Rajasthan", jodhpur: "Rajasthan", udaipur: "Rajasthan", ludhiana: "Punjab", amritsar: "Punjab", jalandhar: "Punjab",
  bhopal: "Madhya Pradesh", indore: "Madhya Pradesh", raipur: "Chhattisgarh", patna: "Bihar", ranchi: "Jharkhand",
  kochi: "Kerala", cochin: "Kerala", thiruvananthapuram: "Kerala", guwahati: "Assam", dehradun: "Uttarakhand", shimla: "Himachal Pradesh", srinagar: "Jammu and Kashmir",
};
const LOOKUP: Record<string, string> = {};
STATE_NAMES.forEach((n) => (LOOKUP[n.toLowerCase()] = n));
Object.entries(ALIAS).forEach(([k, v]) => (LOOKUP[k] = v));

/** "Punjab / Haryana (Paddy-Wheat Belt)" → ["Punjab","Haryana"]; zone words only used when no explicit state/city. */
export function resolveStates(text: string): string[] {
  const tokens = String(text || "").toLowerCase().replace(/&/g, "/").split(/[/,()\-–—;|]+|\band\b/).map((t) => t.trim()).filter(Boolean);
  const explicit = new Set<string>(), zone = new Set<string>();
  tokens.forEach((t) => {
    const clean = t.replace(/\b(region|state|states|belt|zone)\b/g, "").trim();
    if (LOOKUP[clean]) explicit.add(LOOKUP[clean]);
    else if (LOOKUP[t]) explicit.add(LOOKUP[t]);
    else if (ZONES[clean]) ZONES[clean].forEach((s) => zone.add(s));
  });
  return [...(explicit.size ? explicit : zone)].filter((s) => INDIA_MAP.paths[s]);
}

/** Pilot units; ranges like "10-20" count as their midpoint. */
export function parsePilot(v: string) {
  const s = String(v || "").replace(/[–—]/g, "-");
  let total = 0, m: RegExpExecArray | null;
  const re = /(\d+)\s*-\s*(\d+)|(\d+)/g;
  while ((m = re.exec(s))) total += m[3] !== undefined ? +m[3] : (+m[1] + +m[2]) / 2;
  return total;
}
export function parseMargin(v: string) {
  const n = (String(v || "").match(/\d+(\.\d+)?/g) || []).slice(0, 2).map(Number);
  return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null;
}

export const HEAT_STOPS: [number, number[]][] = [[0, [255, 255, 255]], [0.18, [255, 244, 170]], [0.38, [254, 214, 64]], [0.58, [240, 160, 20]], [0.78, [236, 100, 24]], [1, [196, 18, 28]]];
export function heatColor(t: number) {
  t = Math.max(0, Math.min(1, t));
  for (let i = 1; i < HEAT_STOPS.length; i++) {
    if (t <= HEAT_STOPS[i][0]) {
      const [t0, c0] = HEAT_STOPS[i - 1], [t1, c1] = HEAT_STOPS[i];
      const f = (t - t0) / (t1 - t0);
      return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * f)).join(",")})`;
    }
  }
  return "rgb(196,18,28)";
}

export type MapDealer = { r: ResponseRow; name: string; states: string[]; price: number | null; margin: number | null; pilot: number; score: number };
export type MapMetric = { id: string; group: string; label: string; kind: "sum" | "avg"; fmt: (v: number) => string; cat?: { q: CustomQuestion; counts: Record<string, number> }; val: (d: MapDealer, catValue: string | null) => number | null };

const fmtN = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
const answerOf = (d: MapDealer, q: CustomQuestion) => { const v = d.r.answers[q.id]; return v === undefined || v === null || v === "" ? "Unspecified" : String(v).trim(); };

export function buildMetrics(rows: ResponseRow[], questions: CustomQuestion[]): MapMetric[] {
  const m: MapMetric[] = [
    { id: "count", group: "Core metrics", label: "Dealer concentration (# of dealers)", kind: "sum", val: () => 1, fmt: fmtN },
    { id: "pilot", group: "Core metrics", label: "Pilot / trial demand (units)", kind: "sum", val: (d) => d.pilot, fmt: (v) => Math.round(v).toLocaleString() },
    { id: "price", group: "Core metrics", label: "Avg price acceptance (1–5)", kind: "avg", val: (d) => d.price, fmt: (v) => `${v.toFixed(2)} / 5` },
    { id: "margin", group: "Core metrics", label: "Avg margin demanded (%)", kind: "avg", val: (d) => d.margin, fmt: (v) => `${v.toFixed(1)}%` },
    { id: "score", group: "Core metrics", label: "Avg partner readiness score", kind: "avg", val: (d) => d.score, fmt: (v) => `${Math.round(v)} / 100` },
  ];
  questions.forEach((q) => {
    const counts: Record<string, number> = {};
    rows.forEach((r) => { const v = r.answers[q.id]; const k = v === undefined || v === null || v === "" ? "Unspecified" : String(v).trim(); counts[k] = (counts[k] ?? 0) + 1; });
    const uniq = Object.keys(counts).length, total = rows.length;
    if (uniq < 2 || uniq > 8 || (uniq / total > 0.7 && total > 2)) return;
    m.push({ id: `cat:${q.id}`, group: "By survey question (share of dealers)", label: q.label.length > 70 ? `${q.label.slice(0, 67)}…` : q.label, kind: "avg", cat: { q, counts }, fmt: (v) => `${Math.round(v)}%`, val: (d, cv) => (answerOf(d, q) === cv ? 100 : 0) });
  });
  return m;
}

export type StateAgg = { value: number | null; dealers: MapDealer[] };
export function aggregate(dealers: MapDealer[], metric: MapMetric, catValue: string | null, split: boolean) {
  const acc: Record<string, { sum: number; vw: number; dealers: MapDealer[] }> = {};
  dealers.forEach((d) => {
    if (!d.states.length) return;
    const w = split ? 1 / d.states.length : 1;
    d.states.forEach((s) => {
      const a = acc[s] ?? (acc[s] = { sum: 0, vw: 0, dealers: [] });
      a.dealers.push(d);
      const v = metric.val(d, catValue);
      if (v === null || v === undefined || Number.isNaN(v)) return;
      a.sum += w * v; a.vw += w;
    });
  });
  const out: Record<string, StateAgg> = {};
  Object.entries(acc).forEach(([s, a]) => (out[s] = { dealers: a.dealers, value: a.vw > 0 ? (metric.kind === "sum" ? a.sum : a.sum / a.vw) : null }));
  return out;
}
