import { describe, expect, it } from "vitest";
import { aggregate, buildMetrics, parsePilot, resolveStates, type MapDealer } from "./india-heatmap";
import { isIndianSide, SIGNUP_ACCOUNT_TYPES } from "./profile";

describe("India heat map", () => {
  it("resolves states, cities and zones from territory text", () => {
    expect(resolveStates("Punjab / Haryana (Paddy-Wheat Belt)")).toEqual(["Punjab", "Haryana"]);
    expect(resolveStates("Ludhiana")).toEqual(["Punjab"]);
    expect(resolveStates("South India")).toContain("Kerala");
  });
  it("counts pilot ranges at their midpoint", () => {
    expect(parsePilot("10-20 units")).toBe(15);
    expect(parsePilot("1 Demo Unit + 5")).toBe(6);
  });
  it("splits a multi-state dealer evenly for sums", () => {
    const r = { id: "1", dealer_name: "A", territory: "Punjab / Haryana", gstin: "", price_rating: 4, margin: "15%", pilot_volume: "10", answers: {} };
    const d: MapDealer = { r, name: "A", states: ["Punjab", "Haryana"], price: 4, margin: 15, pilot: 10, score: 50 };
    const pilot = buildMetrics([r], []).find((m) => m.id === "pilot")!;
    expect(aggregate([d], pilot, null, true)["Punjab"]?.value).toBe(5);
    expect(aggregate([d], pilot, null, false)["Punjab"]?.value).toBe(10);
  });
});

describe("profiles", () => {
  it("Indian company profiles run dealer surveys; no separate vendor sign-up", () => {
    expect(isIndianSide({ account_type: "indian_company" })).toBe(true);
    expect(isIndianSide({ account_type: "japanese_company" })).toBe(false);
    expect(Object.keys(SIGNUP_ACCOUNT_TYPES)).not.toContain("dealer");
  });
});
