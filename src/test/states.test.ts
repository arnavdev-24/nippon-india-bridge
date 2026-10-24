import { describe, expect, it } from "vitest";
import { STATE_PROFILES, scoreStatesForIndustry } from "@/lib/states";

describe("State Market Intelligence Engine", () => {
  it("contains all 10 core industrial states", () => {
    expect(STATE_PROFILES).toHaveLength(10);
    const keys = STATE_PROFILES.map((s) => s.key);
    expect(keys).toContain("maharashtra");
    expect(keys).toContain("tamil_nadu");
    expect(keys).toContain("gujarat");
    expect(keys).toContain("karnataka");
  });

  it("ranks automotive-strong states top for automotive industry", () => {
    const ranked = scoreStatesForIndustry("automotive");
    const top3 = ranked.slice(0, 3).map((r) => r.state.key);
    expect(top3).toContain("tamil_nadu");
    expect(top3.some((k) => k === "maharashtra" || k === "gujarat" || k === "haryana")).toBe(true);
  });

  it("ranks IT-strong states top for software industry", () => {
    const ranked = scoreStatesForIndustry("it_software");
    const top3 = ranked.slice(0, 3).map((r) => r.state.key);
    expect(top3).toContain("karnataka");
  });

  it("respects lowCost priority when heavily weighted", () => {
    const defaultRanked = scoreStatesForIndustry("manufacturing");
    const lowCostRanked = scoreStatesForIndustry("manufacturing", {
      industrialDemand: 1,
      consumerDemand: 1,
      lowCost: 10,
      talentDepth: 1,
      easeOfBusiness: 1,
    });
    // West Bengal has costIndex 4 (low cost), so should rank higher when low cost is weighted
    const wbDefaultRank = defaultRanked.findIndex((r) => r.state.key === "west_bengal");
    const wbLowCostRank = lowCostRanked.findIndex((r) => r.state.key === "west_bengal");
    expect(wbLowCostRank).toBeLessThan(wbDefaultRank);
  });

  it("produces scores within valid 0-100 range", () => {
    const ranked = scoreStatesForIndustry("electronics");
    for (const r of ranked) {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
      expect(r.state.gsdpUsdBn).toBeGreaterThan(0);
    }
  });
});
