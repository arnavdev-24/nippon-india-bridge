import { describe, expect, it } from "vitest";
import { agriMatch, AGRI_PARTNERS, impactTotals, SEED_AGRI_PILOTS } from "@/lib/agri";
import { CANDIDATES, matchCandidate } from "@/lib/talent";

const jal = AGRI_PARTNERS.find((x) => x.id === "ag2")!;
describe("agri matching", () => {
  it("full match scores 100 with reasons", () => {
    const r = agriMatch(jal, { solution: "Smart irrigation", state: "Maharashtra" });
    expect(r.score).toBe(100);
    expect(r.reasons).toEqual(["Offers Smart irrigation", "Located in Maharashtra"]);
  });
  it("partial match is weighted", () => { expect(agriMatch(jal, { solution: "Smart irrigation", state: "Punjab" }).score).toBe(67); });
  it("impact only counts pilots with a selected partner", () => { expect(impactTotals(SEED_AGRI_PILOTS).waterKl).toBe(18000); });
});
describe("talent matching", () => {
  const kavya = CANDIDATES.find((x) => x.id === "t3")!;
  it("lists matching and missing skills", () => {
    const m = matchCandidate(kavya, { skills: ["Python", "ROS"] });
    expect(m.matching).toEqual(["Python"]); expect(m.missing).toEqual(["ROS"]);
  });
  it("perfect fit is 100", () => { expect(matchCandidate(kavya, { skills: ["Python"], industry: "AI", level: "Mid-level", jlpt: "N3" }).score).toBe(100); });
  it("language below requirement is flagged", () => { expect(matchCandidate(kavya, { skills: [], jlpt: "N1" }).lang).toBe("Below"); });
});
