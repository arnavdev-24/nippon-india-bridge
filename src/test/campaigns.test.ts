import { describe, expect, it } from "vitest";
import { buildCharts, computeKpis, isValidGstinFormat, parseSheetRows, readinessScore, type CustomQuestion, type ResponseRow } from "@/lib/campaigns";

const q = (id: string, type: CustomQuestion["type"], options: string[] = []): CustomQuestion => ({ id, label: id, type, options, section: "localization" });
const row = (o: Partial<ResponseRow>): ResponseRow => ({ id: Math.random().toString(), dealer_name: "D", territory: "Punjab", gstin: "03AAACK2214F1Z8", price_rating: 3, margin: "14% - 18%", pilot_volume: "5", answers: {}, ...o });

describe("product survey campaigns", () => {
  it("checks GSTIN format only", () => {
    expect(isValidGstinFormat("03AAACK2214F1Z8")).toBe(true);
    expect(isValidGstinFormat("03AAACK2214F1X8")).toBe(false);
  });
  it("readiness score: valid GSTIN + 15+ pilot units + 14% margin = 100", () => {
    expect(readinessScore({ gstin: "03AAACK2214F1Z8", pilot_volume: "15+ Units Dealership Contract", margin: "14% - 18%" })).toBe(100);
    expect(readinessScore({ gstin: "bad", pilot_volume: "0 Units (Feedback Only)", margin: "8% - 12%" })).toBe(55);
    expect(readinessScore({ gstin: "bad", pilot_volume: "0 Units", margin: "25%" })).toBe(40);
  });
  it("KPIs come from rows", () => {
    const k = computeKpis([row({ price_rating: 2, pilot_volume: "1 Demo Unit + 5 Orders" }), row({ price_rating: 4, margin: "20% - 25%", pilot_volume: "15+" }), row({ price_rating: 3 })]);
    expect(k).toEqual({ total: 3, avgPrice: 3, topMargin: "14% - 18%", pilotDemand: 26 });
  });
  it("free text with >70% unique answers shows as notes, ≤4 answers doughnut, more bar", () => {
    const notes = buildCharts([row({ answers: { n: "a" } }), row({ answers: { n: "b" } }), row({ answers: { n: "c" } })], [q("n", "text")]);
    expect(notes[0].kind).toBe("notes");
    const d = buildCharts([1, 1, 2, 2, 3].map((v) => row({ answers: { c: `x${v}` } })), [q("c", "choice")]);
    expect(d[0].kind).toBe("doughnut");
    const b = buildCharts([1, 1, 2, 2, 3, 3, 4, 4, 5, 5].map((v) => row({ answers: { c: `x${v}` } })), [q("c", "choice")]);
    expect(b[0].kind).toBe("bar");
  });
  it("bulk upload rejects bad GSTIN and maps spreadsheet headers", () => {
    const base = { "Dealer Name": "Khalsa", "Operating Territory": "Punjab", "GSTIN / Trade License": "03AAACK2214F1Z8", "Price Acceptance Rating (1-5)": 2, "Required Margin (%)": "14%", "Pilot Trial Volume": "5", "Engine": "Diesel" };
    const r = parseSheetRows([base, { ...base, "GSTIN / Trade License": "XYZ" }], [{ ...q("e", "choice", ["Diesel"]), label: "Engine" }]);
    expect(r.valid).toHaveLength(1);
    expect(r.valid[0].answers.e).toBe("Diesel");
    expect(r.errors.some((e) => e.row === 3)).toBe(true);
  });
});
