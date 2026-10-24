import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Choice, Field } from "@/components/hubs/HubControls";
import { CompanyCard, OpportunityMap, SectorNav } from "@/components/sectors/SectorUI";
import { DEMO_COMPANIES, type Sector } from "@/lib/sectors";
export const Route = createFileRoute("/_authenticated/navigator")({
  head: () => ({ meta: [{ title: "India Opportunity Navigator — Japan2Nippon" }, { name: "description", content: "States, industrial clusters, suppliers and talent across semiconductor, AI and green technology." }, { property: "og:title", content: "India Opportunity Navigator — Japan2Nippon" }, { property: "og:description", content: "States, industrial clusters, suppliers and talent across semiconductor, AI and green technology." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Navigator,
});
const LABELS: Record<string, Sector> = { Semiconductor: "semiconductor", AI: "ai", GreenTech: "greentech" };
function Navigator() {
  const [sector, setSector] = useState("");
  const [state, setState] = useState("");
  const sec = LABELS[sector];
  const companies = DEMO_COMPANIES.filter((c) => (!sec || c.sector === sec) && (!state || c.state === state));
  return (
    <>
      <SectorNav />
      <PageHeader kanji="地" title="India Opportunity Navigator" desc="Explore states, clusters, suppliers and talent for all three sectors." />
      <div className="mb-6 max-w-xs"><Field label="Sector"><Choice value={sector} onChange={setSector} options={Object.keys(LABELS)} placeholder="All sectors" /></Field></div>
      <OpportunityMap sector={sec} selected={state || undefined} onSelect={(v) => setState(v === state ? "" : v)} />
      <h2 className="mb-4 mt-10 text-2xl font-bold">Suppliers & talent {state && `in ${state}`}</h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((c) => <CompanyCard key={c.id} c={c} />)}
        {companies.length === 0 && <p className="text-sm text-muted-foreground">No sample profiles here yet.</p>}
      </div>
    </>
  );
}
