import { describe, expect, it } from "vitest";
import { DEMO_COMPANIES, partnerFit } from "@/lib/sectors";

const silicon = DEMO_COMPANIES.find((c) => c.id === "s1")!;

describe("partnerFit", () => {
  it("lists each met criterion", () => {
    expect(partnerFit(silicon, { sector: "semiconductor", state: "Karnataka", capability: "VLSI design" })).toEqual(["Sector", "State", "Capability"]);
  });
  it("excludes partners above budget", () => {
    expect(partnerFit(silicon, { budget: 30 })).toEqual([]);
    expect(partnerFit(silicon, { budget: 40 })).toEqual(["Within budget"]);
  });
  it("labels every sample profile as demo", () => {
    expect(DEMO_COMPANIES.every((c) => c.name.includes("(Demo)"))).toBe(true);
  });
});
