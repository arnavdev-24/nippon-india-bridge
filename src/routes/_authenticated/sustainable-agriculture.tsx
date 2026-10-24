import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sprout, MapPin, Droplets, Zap, Recycle, Cloud } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { SectorNav } from "@/components/sectors/SectorUI";
import { Choice, Field } from "@/components/hubs/HubControls";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AGRI_PARTNERS, AGRI_PARTNER_TYPES, AGRI_REGIONS, AGRI_SOLUTIONS, COLLAB, CROPS, IMPACT_KEYS, SEED_AGRI_PILOTS, agriMatch, impactTotals, type AgriNeeds, type AgriPilot } from "@/lib/agri";
import { MAP_GRID } from "@/lib/sectors";

const META = "Sustainable Agriculture Exchange — Japan2Nippon";
const DESC = "Find Indian agritech startups, farms, suppliers and research labs for sustainable farming pilots.";
export const Route = createFileRoute("/_authenticated/sustainable-agriculture")({
  head: () => ({ meta: [{ title: META }, { name: "description", content: DESC }, { property: "og:title", content: META }, { property: "og:description", content: DESC }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Page,
});

const KEY = "n2j-agri-pilots-v1";
const ICON = { waterKl: Droplets, energyKwh: Zap, wasteT: Recycle, co2T: Cloud };

function Page() {
  const [needs, setNeeds] = useState<AgriNeeds>({});
  const [pilots, setPilots] = useState<AgriPilot[]>(SEED_AGRI_PILOTS);
  useEffect(() => { try { const r = localStorage.getItem(KEY); if (r) setPilots(JSON.parse(r)); } catch { /* ignore */ } }, []);
  const save = (p: AgriPilot[]) => { setPilots(p); localStorage.setItem(KEY, JSON.stringify(p)); };
  const set = (k: keyof AgriNeeds) => (v: string) => setNeeds((n) => ({ ...n, [k]: v || undefined }));
  const any = Object.values(needs).some(Boolean);
  const ranked = useMemo(() => AGRI_PARTNERS.map((p) => ({ p, ...agriMatch(p, needs) }))
    .filter((x) => !any || x.score > 0).sort((a, b) => b.score - a.score), [needs, any]);
  const totals = impactTotals(pilots);

  return (
    <>
      <SectorNav />
      <PageHeader kanji="農" title="Sustainable Agriculture Exchange" desc="Connect Japanese agri-technology with Indian farmers, agritech startups, suppliers and research institutions." action={<Sprout className="h-10 w-10 text-primary" />} />
      <p className="mb-6 rounded-md border border-primary/30 bg-primary/5 p-3 text-xs">Demo mode: all partner profiles, match scores and impact figures are fictional illustrations, not verified organisations or real-world results.</p>

      <section className="mb-10">
        <h2 className="mb-3 text-2xl font-bold">Sustainable farming solutions</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {AGRI_SOLUTIONS.map((s) => (
            <button key={s} onClick={() => set("solution")(needs.solution === s ? "" : s)} className={`rounded-lg border p-4 text-left text-sm ${needs.solution === s ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}>
              <div className="font-semibold">{s}</div>
              <div className="text-xs text-muted-foreground">{AGRI_PARTNERS.filter((p) => p.solutions.includes(s)).length} demo partners</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-1 text-2xl font-bold">Agritech partner finder & smart matchmaking</h2>
        <p className="mb-4 text-sm text-muted-foreground">Rule-based score from the criteria you choose — a simulation, not an assessment.</p>
        <div className="mb-5 grid gap-4 border-y border-border py-5 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="Keyword / technology"><Input value={needs.keyword ?? ""} placeholder="e.g. drone, solar" onChange={(e) => set("keyword")(e.target.value)} /></Field>
          <Field label="Solution"><Choice value={needs.solution ?? ""} onChange={set("solution")} options={AGRI_SOLUTIONS} /></Field>
          <Field label="Crop"><Choice value={needs.crop ?? ""} onChange={set("crop")} options={CROPS} /></Field>
          <Field label="State"><Choice value={needs.state ?? ""} onChange={set("state")} options={[...new Set(AGRI_PARTNERS.map((p) => p.state))].sort()} /></Field>
          <Field label="Partner type"><Choice value={needs.type ?? ""} onChange={set("type")} options={AGRI_PARTNER_TYPES} /></Field>
          <Field label="Collaboration"><Choice value={needs.collab ?? ""} onChange={set("collab")} options={COLLAB} /></Field>
        </div>
        {any && <Button variant="outline" size="sm" className="mb-4" onClick={() => setNeeds({})}>Clear criteria</Button>}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ranked.map(({ p, score, reasons }) => (
            <div key={p.id} className="rounded-lg border border-border bg-card p-5 shadow-paper">
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs font-medium uppercase tracking-wide text-primary">{p.type}</div>
                {any && <Badge variant={score >= 70 ? "default" : "secondary"}>{score}% simulated match</Badge>}
              </div>
              <h3 className="mt-2 font-bold">{p.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.city}, {p.state}</div>
              <p className="mt-2 text-sm">{p.bio}</p>
              <dl className="mt-3 space-y-1 text-xs">
                <div><b>Crops:</b> {p.crops.join(", ")}</div>
                <div><b>Technologies:</b> {p.technologies.join(", ")}</div>
                <div><b>Interests:</b> {p.collab.join(", ")}</div>
              </dl>
              {any && reasons.length > 0 && <p className="mt-3 text-xs text-primary">Why relevant: {reasons.join(" · ")}</p>}
              <Badge variant="outline" className="mt-3">Demo · unverified</Badge>
            </div>
          ))}
          {ranked.length === 0 && <p className="text-sm text-muted-foreground">No demo partners meet any of these criteria.</p>}
        </div>
      </section>

      <RegionMap selected={needs.state} onSelect={(s) => set("state")(needs.state === s ? "" : s)} />
      <PilotExchange pilots={pilots} save={save} />

      <section className="mb-12">
        <h2 className="mb-1 text-2xl font-bold">Impact dashboard</h2>
        <p className="mb-4 text-sm text-muted-foreground">Illustrative estimates from demo pilots with a selected partner — not measured real-world impact.</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {IMPACT_KEYS.map(([k, label, unit]) => { const I = ICON[k]; return (
            <div key={k} className="rounded-lg border border-border bg-card p-5">
              <I className="h-5 w-5 text-primary" />
              <div className="mt-2 text-2xl font-bold">{totals[k].toLocaleString("en-IN")} <span className="text-sm font-normal">{unit}</span></div>
              <div className="text-xs text-muted-foreground">{label} (illustrative)</div>
            </div>); })}
        </div>
      </section>
    </>
  );
}

function RegionMap({ selected, onSelect }: { selected?: string; onSelect: (s: string) => void }) {
  const region = AGRI_REGIONS.find((r) => r.state === selected);
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-2xl font-bold">Regional opportunity map</h2>
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="grid grid-cols-7 gap-1.5" style={{ gridTemplateRows: "repeat(9, 2.6rem)" }}>
          {Object.entries(MAP_GRID).map(([st, [col, row]]) => {
            const r = AGRI_REGIONS.some((x) => x.state === st); const n = AGRI_PARTNERS.filter((p) => p.state === st).length;
            return (
              <button key={st} title={st} disabled={!r} onClick={() => onSelect(st)} style={{ gridColumn: col + 1, gridRow: row + 1 }}
                className={`w-12 rounded text-[10px] leading-tight ${selected === st ? "bg-primary text-primary-foreground" : r ? "bg-primary/15 hover:bg-primary/30" : "bg-muted text-muted-foreground"}`}>
                {st.slice(0, 3)}{n ? <div className="font-bold">{n}</div> : null}
              </button>);
          })}
        </div>
        <div className="rounded-lg border border-border bg-card p-5 text-sm">
          {region ? (<>
            <h3 className="text-lg font-bold">{region.state}</h3>
            <p className="mt-2"><b>Key crops:</b> {region.crops}</p>
            <p><b>Farming need:</b> {region.need}</p>
            <p><b>Technology opportunity:</b> {region.tech}</p>
            <p className="mt-2"><b>Demo partners:</b> {AGRI_PARTNERS.filter((p) => p.state === region.state).map((p) => p.name).join(", ") || "None yet"}</p>
          </>) : <p className="text-muted-foreground">Select a highlighted state to see crops, needs and partners. Numbers show demo partner counts. Regional notes are general orientation only.</p>}
        </div>
      </div>
    </section>
  );
}

function PilotExchange({ pilots, save }: { pilots: AgriPilot[]; save: (p: AgriPilot[]) => void }) {
  const [f, setF] = useState({ title: "", theme: "", state: "", problem: "", budget: "" });
  const [prop, setProp] = useState<Record<string, { partner: string; summary: string; cost: string; weeks: string }>>({});
  function post() {
    if (!f.title.trim() || !f.theme || !f.state || !f.problem.trim() || !(Number(f.budget) > 0)) return toast.error("Fill in all challenge fields with a valid budget.");
    save([{ id: crypto.randomUUID(), title: f.title.trim(), theme: f.theme, state: f.state, problem: f.problem.trim(), budgetLakh: Number(f.budget), status: "open", proposals: [], impact: { waterKl: 1000, energyKwh: 500, wasteT: 10, co2T: 5 } }, ...pilots]);
    setF({ title: "", theme: "", state: "", problem: "", budget: "" }); toast.success("Challenge posted (saved in this browser)");
  }
  function submit(id: string) {
    const d = prop[id];
    if (!d?.partner || !d.summary?.trim() || !(Number(d.cost) > 0) || !(Number(d.weeks) > 0)) return toast.error("Complete the proposal fields.");
    save(pilots.map((p) => p.id === id ? { ...p, proposals: [...p.proposals, { id: crypto.randomUUID(), partner: d.partner, summary: d.summary.trim(), costLakh: Number(d.cost), weeks: Number(d.weeks) }] } : p));
    setProp({ ...prop, [id]: { partner: "", summary: "", cost: "", weeks: "" } }); toast.success("Proposal submitted");
  }
  return (
    <section className="mb-10">
      <h2 className="mb-1 text-2xl font-bold">Agriculture pilot project exchange</h2>
      <p className="mb-4 text-sm text-muted-foreground">Simulation stored in this browser only.</p>
      <div className="mb-6 grid gap-3 rounded-lg border border-border bg-card p-5 md:grid-cols-2">
        <Field label="Challenge title"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Theme"><Choice value={f.theme} onChange={(v) => setF({ ...f, theme: v })} options={["Water usage", "Soil degradation", "Crop waste", "Sustainable farming"]} placeholder="Select theme" /></Field>
        <Field label="State"><Choice value={f.state} onChange={(v) => setF({ ...f, state: v })} options={AGRI_REGIONS.map((r) => r.state)} placeholder="Select state" /></Field>
        <Field label="Budget (lakh INR)"><Input type="number" min={1} value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value })} /></Field>
        <div className="md:col-span-2"><Field label="Problem description"><Textarea value={f.problem} onChange={(e) => setF({ ...f, problem: e.target.value })} /></Field></div>
        <Button onClick={post} className="md:w-fit">Post challenge</Button>
      </div>
      <div className="space-y-4">
        {pilots.map((p) => { const d = prop[p.id] ?? { partner: "", summary: "", cost: "", weeks: "" }; return (
          <div key={p.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold">{p.title}</h3>
              <Badge variant={p.status === "open" ? "secondary" : "default"}>{p.status === "open" ? "Open for proposals" : "Partner selected"}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{p.theme} · {p.state} · ₹{p.budgetLakh} lakh</p>
            <p className="mt-2 text-sm">{p.problem}</p>
            <div className="mt-3 space-y-2">
              {p.proposals.map((x) => (
                <div key={x.id} className={`flex flex-wrap items-center justify-between gap-2 rounded border p-3 text-sm ${p.selected === x.id ? "border-primary" : "border-border"}`}>
                  <div><b>{x.partner}</b> — {x.summary} <span className="text-muted-foreground">(₹{x.costLakh} lakh, {x.weeks} wks)</span></div>
                  {p.status === "open" ? <Button size="sm" onClick={() => { save(pilots.map((q) => q.id === p.id ? { ...q, status: "partner_selected", selected: x.id } : q)); toast.success("Partner selected for pilot"); }}>Select partner</Button>
                    : p.selected === x.id && <Badge>Selected</Badge>}
                </div>))}
              {p.proposals.length === 0 && <p className="text-xs text-muted-foreground">No proposals yet.</p>}
            </div>
            {p.status === "open" && (
              <div className="mt-4 grid gap-2 border-t border-border pt-4 md:grid-cols-[1fr_2fr_6rem_6rem_auto]">
                <Choice value={d.partner} onChange={(v) => setProp({ ...prop, [p.id]: { ...d, partner: v } })} options={AGRI_PARTNERS.map((a) => a.name)} placeholder="Proposing partner" />
                <Input placeholder="Proposal summary" aria-label="Proposal summary" value={d.summary} onChange={(e) => setProp({ ...prop, [p.id]: { ...d, summary: e.target.value } })} />
                <Input type="number" placeholder="₹ lakh" aria-label="Cost" value={d.cost} onChange={(e) => setProp({ ...prop, [p.id]: { ...d, cost: e.target.value } })} />
                <Input type="number" placeholder="Weeks" aria-label="Weeks" value={d.weeks} onChange={(e) => setProp({ ...prop, [p.id]: { ...d, weeks: e.target.value } })} />
                <Button variant="outline" onClick={() => submit(p.id)}>Submit proposal</Button>
              </div>)}
          </div>); })}
      </div>
    </section>
  );
}
