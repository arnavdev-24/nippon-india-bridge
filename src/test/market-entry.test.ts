import { describe, expect, it } from "vitest";
import { diagnose } from "@/lib/market-entry";

describe("Market Entry Diagnostic Engine", () => {
  it("diagnoses 100% automatic FDI route for automotive manufacturing", () => {
    const res = diagnose({
      industry: "automotive",
      states: ["Tamil Nadu"],
      entity: "wos",
      investmentInrCr: 10,
      expectedTurnoverInrLakh: 500,
      sellsGoods: true,
      importsGoods: true,
    });
    expect(res.fdiRoute).toBe("automatic");
    expect(res.fdiCap).toBe(100);
    expect(res.gst.mustRegister).toBe(true);
    expect(res.licences.some((l) => l.authority.includes("MCA"))).toBe(true);
    expect(res.licences.some((l) => l.name.includes("Factory"))).toBe(true);
    expect(res.licences.some((l) => l.name.includes("IEC"))).toBe(true);
  });

  it("handles liaison office correctly: RBI approval required, no GST registration", () => {
    const res = diagnose({
      industry: "it_software",
      states: ["Karnataka"],
      entity: "liaison",
      investmentInrCr: 1,
      expectedTurnoverInrLakh: 0,
      sellsGoods: false,
      importsGoods: false,
    });
    expect(res.gst.mustRegister).toBe(false);
    expect(res.licences.some((l) => l.authority.includes("Reserve Bank of India"))).toBe(true);
    expect(res.riskFlags.some((r) => r.includes("cannot earn revenue"))).toBe(true);
  });

  it("triggers mandatory GST for inter-state supply of goods regardless of turnover", () => {
    const res = diagnose({
      industry: "consumer_retail",
      states: ["Maharashtra", "Gujarat"],
      entity: "wos",
      investmentInrCr: 2,
      expectedTurnoverInrLakh: 10, // Below 40 lakh
      sellsGoods: true,
      importsGoods: false,
      interStateSupply: true,
    });
    expect(res.gst.mustRegister).toBe(true);
    expect(res.gst.reason).toContain("inter-state supply of goods");
    expect(res.gst.registrations).toBe(2);
  });

  it("applies special-category state threshold for North-Eastern states", () => {
    const res = diagnose({
      industry: "food_agri",
      states: ["Nagaland"],
      entity: "wos",
      investmentInrCr: 1,
      expectedTurnoverInrLakh: 15,
      sellsGoods: true,
      importsGoods: false,
      interStateSupply: false,
    });
    expect(res.gst.threshold).toContain("20 lakh");
  });

  it("includes CDSCO regulatory requirements for healthcare", () => {
    const res = diagnose({
      industry: "healthcare",
      states: ["Telangana"],
      entity: "wos",
      investmentInrCr: 15,
      expectedTurnoverInrLakh: 200,
      sellsGoods: true,
      importsGoods: true,
    });
    expect(res.licences.some((l) => l.authority.includes("CDSCO"))).toBe(true);
    expect(res.riskFlags.some((r) => r.includes("CDSCO"))).toBe(true);
  });

  it("flags multi-state risk when multiple states are selected", () => {
    const res = diagnose({
      industry: "electronics",
      states: ["Tamil Nadu", "Karnataka", "Maharashtra"],
      entity: "wos",
      investmentInrCr: 25,
      expectedTurnoverInrLakh: 1000,
      sellsGoods: true,
      importsGoods: true,
    });
    expect(res.riskFlags.some((r) => r.includes("Multi-state operations"))).toBe(true);
    expect(res.stateNotes).toHaveLength(3);
    expect(res.recommendedServices).toContain("tax_gst");
    expect(res.recommendedServices).toContain("incorporation");
  });
});
