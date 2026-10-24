import { useState } from "react";
import { Cpu, BrainCircuit, Leaf } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Choice, Field } from "@/components/hubs/HubControls";
import { DEMO_COMPANIES, SECTORS, type Sector } from "@/lib/sectors";
import { CompanyCard, OpportunityMap, PilotBoard, SectorNav } from "./SectorUI";

const ICONS = { semiconductor: Cpu, ai: BrainCircuit, greentech: Leaf };

export function SectorDashboard({ sector, extra }: { sector: Sector; extra?: React.ReactNode }) {
  const s = SECTORS[sector];
  const Icon = ICONS[sector];
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [cap, setCap] = useState("");
  const [state, setState] = useState("");
  const all = DEMO_COMPANIES.filter((c) => c.sector === sector);
  const list = all.filter((c) =>
    (!type || c.type === type) && (!cap || c.capabilities.includes(cap)) && (!state || c.state === state) &&
    `${c.name} ${c.bio} ${c.city}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <SectorNav />
      <PageHeader kanji={s.kanji} title={s.title} desc={s.tagline} action={<Icon className="h-10 w-10 text-primary" />} />
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        {s.types.map((t) => (
          <button key={t} onClick={() => setType(type === t ? "" : t)}
            className={`rounded-lg border p-4 text-left text-sm transition-colors ${type === t ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}>
            <div className="font-semibold">{t}</div>
            <div className="text-xs text-muted-foreground">{all.filter((c) => c.type === t).length} sample profiles</div>
          </button>
        ))}
      </div>
      <section className="mb-6 grid gap-4 border-y border-border py-5 sm:grid-cols-3">
        <Field label="Search"><Input value={q} placeholder="Company, city, keyword…" onChange={(e) => setQ(e.target.value)} /></Field>
        <Field label="Capability"><Choice value={cap} onChange={setCap} options={s.capabilities} placeholder="All capabilities" /></Field>
        <Field label="State"><Choice value={state} onChange={setState} options={[...new Set(all.map((c) => c.state))]} placeholder="All states" /></Field>
      </section>
      <p className="mb-4 text-xs text-muted-foreground">All profiles below are fictional demo data for illustrating the journey; none are verified businesses.</p>
      <div className="mb-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => <CompanyCard key={c.id} c={c} />)}
        {list.length === 0 && <p className="text-sm text-muted-foreground">No profiles match these filters.</p>}
      </div>
      {extra}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">India opportunity map</h2>
        <OpportunityMap sector={sector} selected={state || undefined} onSelect={(v) => setState(v === state ? "" : v)} />
      </section>
      <PilotBoard sector={sector} kind={sector === "greentech" ? "carbon" : "challenge"} title={sector === "greentech" ? "Carbon Reduction Challenge Board" : "Sector challenges & pilots"} />
    </>
  );
}
