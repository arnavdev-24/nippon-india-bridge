import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Choice, Field } from "@/components/hubs/HubControls";
import { CompanyCard, SectorNav } from "@/components/sectors/SectorUI";
import { DEMO_COMPANIES, OBJECTIVES, SECTORS, partnerFit, type Sector } from "@/lib/sectors";
export const Route = createFileRoute("/_authenticated/partner-finder")({
  head: () => ({ meta: [{ title: "Strategic Partner Finder — Japan2Nippon" }, { name: "description", content: "Match with Indian suppliers, manufacturers, startups, labs and technology partners by sector, state, budget and objectives." }, { property: "og:title", content: "Strategic Partner Finder — Japan2Nippon" }, { property: "og:description", content: "Match with Indian suppliers, manufacturers, startups, labs and technology partners by sector, state, budget and objectives." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Finder,
});
const SEC: Record<string, Sector> = { Semiconductor: "semiconductor", AI: "ai", GreenTech: "greentech" };
function Finder() {
  const [f, setF] = useState({ sector: "", type: "", state: "", capability: "", budget: "", objective: "" });
  const sector = SEC[f.sector];
  const types = sector ? SECTORS[sector].types : Object.values(SECTORS).flatMap((s) => s.types);
  const caps = sector ? SECTORS[sector].capabilities : Object.values(SECTORS).flatMap((s) => s.capabilities);
  const needs = { sector, type: f.type || undefined, state: f.state || undefined, capability: f.capability || undefined, budget: f.budget ? Number(f.budget) : undefined, objective: f.objective || undefined };
  const active = Object.values(needs).filter((v) => v !== undefined).length;
  const ranked = DEMO_COMPANIES.map((c) => ({ c, r: partnerFit(c, needs) })).filter((x) => !active || x.r.length > 0).sort((a, b) => b.r.length - a.r.length);
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  return (
    <>
      <SectorNav />
      <PageHeader kanji="縁" title="Strategic Partner Finder" desc="Recommendations ranked by how many of your criteria each profile meets." />
      <section className="mb-6 grid gap-4 border-y border-border py-5 sm:grid-cols-3">
        <Field label="Sector"><Choice value={f.sector} onChange={set("sector")} options={Object.keys(SEC)} placeholder="All sectors" /></Field>
        <Field label="Partner type"><Choice value={f.type} onChange={set("type")} options={types} placeholder="Any type" /></Field>
        <Field label="State"><Choice value={f.state} onChange={set("state")} options={[...new Set(DEMO_COMPANIES.map((c) => c.state))].sort()} placeholder="Any state" /></Field>
        <Field label="Capability"><Choice value={f.capability} onChange={set("capability")} options={caps} placeholder="Any capability" /></Field>
        <Field label="Budget (₹ lakh)"><Input type="number" min={0} value={f.budget} onChange={(e) => set("budget")(e.target.value)} /></Field>
        <Field label="Business objective"><Choice value={f.objective} onChange={set("objective")} options={OBJECTIVES} placeholder="Any objective" /></Field>
      </section>
      <p className="mb-4 text-xs text-muted-foreground">Ranking is a transparent criteria count on fictional demo profiles — not a real-world validation or verification.</p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ranked.map(({ c, r }) => <CompanyCard key={c.id} c={c} reasons={r} />)}
        {ranked.length === 0 && <p className="text-sm text-muted-foreground">No profiles meet any of these criteria.</p>}
      </div>
    </>
  );
}
