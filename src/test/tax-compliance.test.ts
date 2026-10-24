import { describe, expect, it } from "vitest";
import { DEMO_EXPERTS, scoreExpert, type Expert } from "@/lib/tax-compliance";

const base: Expert = {
  id: "x", demo: false, name: "T", designation: "ca", company: null,
  specializations: [], industries: [], languages: ["English"], qualifications: null,
  years_experience: null, verified: false, offers_online: true, offers_in_person: false,
  office_address: null, office_city: null, city: null, state: null, rate_inr: null, bio: null,
};

describe("expert matching", () => {
  it("prioritizes industry expertise over service matches", () => {
    const industryExpert = { ...base, industries: ["automotive"] };
    const serviceExpert = { ...base, specializations: ["tax_gst", "transfer_pricing"] };
    expect(scoreExpert(industryExpert, "automotive", ["tax_gst", "transfer_pricing"]))
      .toBeGreaterThan(scoreExpert(serviceExpert, "automotive", ["tax_gst", "transfer_pricing"]));
  });

  it("rewards matching each required service", () => {
    const one = { ...base, specializations: ["tax_gst"] };
    const two = { ...base, specializations: ["tax_gst", "fema"] };
    expect(scoreExpert(two, "", ["tax_gst", "fema"])).toBeGreaterThan(scoreExpert(one, "", ["tax_gst", "fema"]));
  });

  it("does not count the not_sure pseudo-service", () => {
    const e = { ...base, specializations: ["not_sure"] };
    expect(scoreExpert(e, "", ["not_sure"])).toBe(scoreExpert(base, "", ["not_sure"]));
  });

  it("never marks demo experts as verified", () => {
    expect(DEMO_EXPERTS.every((e) => e.demo && !e.verified && e.id === null)).toBe(true);
  });
});
