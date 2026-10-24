import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Choice, Field } from "@/components/hubs/HubControls";
import { toast } from "sonner";
import {
  CLUSTERS, DEFAULT_MILESTONES, MAP_GRID, SECTORS, loadPilots, savePilots,
  type DemoCompany, type Pilot, type Sector,
} from "@/lib/sectors";
import { STATES } from "@/lib/hubs";

export function DemoBadge() {
  return <span className="rounded border border-dashed border-primary/50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">Demo · unverified</span>;
}

export function CompanyCard({ c, reasons }: { c: DemoCompany; reasons?: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-paper">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{c.type}</div>
          <h3 className="mt-1 font-bold">{c.name}</h3>
        </div>
        <DemoBadge />
      </div>
      <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{c.city}, {c.state}</div>
      <div className="mt-3 flex flex-wrap gap-1">
        {c.capabilities.map((x) => <span key={x} className="rounded bg-secondary px-2 py-0.5 text-xs">{x}</span>)}
      </div>
      {reasons && reasons.length > 0 && (
        <p className="mt-3 text-xs text-primary">Meets your criteria: {reasons.join(" · ")}</p>
      )}
      {open && (
        <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
          <p>{c.bio}</p>
          <p className="text-muted-foreground">Objectives: {c.objectives.join(", ")}</p>
          <p className="text-muted-foreground">Typical engagement from ₹{c.budgetInr} lakh</p>
          <p className="text-xs text-muted-foreground">Fictional sample profile. Verification status: not verified.</p>
        </div>
      )}
      <div className="mt-auto flex gap-2 pt-4">
        <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>{open ? "Hide profile" : "View profile"}</Button>
        <Button size="sm" onClick={() => toast.success(`Demo request to ${c.name} simulated — no message was sent.`)}>Send request</Button>
      </div>
    </div>
  );
}

export function OpportunityMap({ sector, selected, onSelect }: { sector?: Sector | undefined; selected?: string | undefined; onSelect?: (s: string) => void }) {
  const clusters = CLUSTERS.filter((c) => !sector || c.sector === sector);
  const counts = new Map<string, number>();
  clusters.forEach((c) => counts.set(c.state, (counts.get(c.state) ?? 0) + 1));
  const active = selected ? clusters.filter((c) => c.state === selected) : [];
  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div className="grid w-fit gap-1" style={{ gridTemplateColumns: "repeat(7, 2.75rem)", gridTemplateRows: "repeat(9, 2.75rem)" }} aria-label="Indian opportunity map">
        {Object.entries(MAP_GRID).map(([state, [col, row]]) => {
          const n = counts.get(state) ?? 0;
          return (
            <button key={state} title={state} onClick={() => onSelect?.(state)}
              style={{ gridColumn: col + 1, gridRow: row + 1 }}
              className={`rounded text-[9px] font-medium leading-tight transition-colors ${selected === state ? "bg-primary text-primary-foreground" : n ? "bg-primary/20 hover:bg-primary/40" : "bg-secondary text-muted-foreground"}`}>
              {state.split(" ").map((w) => w[0]).join("").slice(0, 3)}
              {n > 0 && <span className="block">{n}</span>}
            </button>
          );
        })}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Stylised map. Tiles show illustrative clusters per state — verify with state investment agencies before decisions.</p>
        {selected ? (
          <div className="mt-3 space-y-2">
            <h4 className="font-bold">{selected}</h4>
            {active.length ? active.map((c) => (
              <div key={c.cluster + c.sector} className="rounded border border-border p-3 text-sm">
                <div className="font-medium">{c.cluster} <span className="text-xs text-muted-foreground">· {SECTORS[c.sector].title}</span></div>
                <div className="text-muted-foreground">{c.note}</div>
              </div>
            )) : <p className="text-sm text-muted-foreground">No listed clusters for this sector yet.</p>}
          </div>
        ) : <p className="mt-3 text-sm">Select a state tile to see clusters.</p>}
      </div>
    </div>
  );
}

export function usePilots() {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  useEffect(() => setPilots(loadPilots()), []);
  const update = (next: Pilot[]) => { setPilots(next); savePilots(next); };
  return [pilots, update] as const;
}

export function PilotBoard({ kind, sector, title }: { kind?: Pilot["kind"]; sector?: Sector; title: string }) {
  const [pilots, setPilots] = usePilots();
  const [form, setForm] = useState({ title: "", poster: "", state: "", problem: "", budget: "", sector: sector ?? "" });
  const [open, setOpen] = useState<string | null>(null);
  const list = pilots.filter((p) => (!kind || p.kind === kind) && (!sector || p.sector === sector));
  const patch = (id: string, fn: (p: Pilot) => Pilot) => setPilots(pilots.map((p) => (p.id === id ? fn(p) : p)));

  function post() {
    if (!form.title.trim() || !form.problem.trim() || !form.sector) { toast.error("Add a title, sector and problem description."); return; }
    const p: Pilot = {
      id: crypto.randomUUID(), title: form.title.trim(), sector: form.sector as Sector, kind: kind ?? "challenge",
      poster: form.poster.trim() || "Your company", state: form.state, problem: form.problem.trim(),
      budgetInr: Number(form.budget) || 0, status: "open", proposals: [], milestones: [],
    };
    setPilots([p, ...pilots]);
    setForm({ ...form, title: "", problem: "", budget: "" });
    toast.success("Challenge posted (saved in this browser only).");
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <span className="text-xs text-muted-foreground">Simulated — saved only in this browser, not shared with other users.</span>
      </div>
      <div className="grid gap-3 rounded-lg border border-border bg-card p-5 sm:grid-cols-2">
        <Field label="Challenge title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Posted by"><Input value={form.poster} placeholder="Company or factory" onChange={(e) => setForm({ ...form, poster: e.target.value })} /></Field>
        {!sector && <Field label="Sector"><Choice value={form.sector} onChange={(v) => setForm({ ...form, sector: v })} options={["semiconductor", "ai", "greentech"]} placeholder="Choose sector" /></Field>}
        <Field label="State"><Choice value={form.state} onChange={(v) => setForm({ ...form, state: v })} options={STATES} placeholder="Any state" /></Field>
        <Field label="Budget (₹ lakh)"><Input type="number" min={0} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></Field>
        <div className="sm:col-span-2"><Field label="Problem description"><Textarea value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} /></Field></div>
        <div><Button onClick={post}>Post challenge</Button></div>
      </div>
      {list.map((p) => (
        <PilotItem key={p.id} p={p} expanded={open === p.id} toggle={() => setOpen(open === p.id ? null : p.id)} patch={(fn) => patch(p.id, fn)} />
      ))}
      {list.length === 0 && <p className="text-sm text-muted-foreground">No challenges yet.</p>}
    </section>
  );
}

const STATUS_LABEL: Record<Pilot["status"], string> = { open: "Open for proposals", partner_selected: "Partner selected", in_pilot: "Pilot in progress", evaluated: "Evaluated" };

function PilotItem({ p, expanded, toggle, patch }: { p: Pilot; expanded: boolean; toggle: () => void; patch: (fn: (p: Pilot) => Pilot) => void }) {
  const [prop, setProp] = useState({ company: "", summary: "", cost: "", weeks: "" });
  const [ev, setEv] = useState({ rating: "3", notes: "", decision: "Scale up" });
  const done = p.milestones.filter((m) => m.done).length;
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-paper">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{SECTORS[p.sector].title}{p.state && ` · ${p.state}`} · ₹{p.budgetInr} lakh</div>
          <h3 className="mt-1 text-lg font-bold">{p.title}</h3>
          <p className="text-sm text-muted-foreground">{p.poster}</p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{STATUS_LABEL[p.status]}</span>
      </div>
      <p className="mt-3 text-sm">{p.problem}</p>
      <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
        <span>{p.proposals.length} proposals</span>
        {p.milestones.length > 0 && <span>Milestones {done}/{p.milestones.length}</span>}
      </div>
      <Button size="sm" variant="outline" className="mt-3" onClick={toggle}>{expanded ? "Close" : "Open project"}</Button>
      {expanded && (
        <div className="mt-4 space-y-5 border-t border-border pt-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Proposals</h4>
            {p.proposals.map((x) => (
              <div key={x.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-border p-3 text-sm">
                <div><div className="font-medium">{x.company}</div><div className="text-muted-foreground">{x.summary} · ₹{x.costInr} lakh · {x.weeks} weeks</div></div>
                {p.selected === x.id ? <span className="text-xs font-medium text-primary">Selected partner</span> : p.status === "open" && (
                  <Button size="sm" onClick={() => patch((q) => ({ ...q, selected: x.id, status: "partner_selected", milestones: DEFAULT_MILESTONES.map((t) => ({ title: t, done: false })) }))}>Select partner</Button>
                )}
              </div>
            ))}
            {p.status === "open" && (
              <div className="grid gap-2 sm:grid-cols-4">
                <Input placeholder="Your company" aria-label="Proposal company" value={prop.company} onChange={(e) => setProp({ ...prop, company: e.target.value })} />
                <Input placeholder="Approach summary" aria-label="Proposal summary" className="sm:col-span-3" value={prop.summary} onChange={(e) => setProp({ ...prop, summary: e.target.value })} />
                <Input type="number" min={0} placeholder="Cost ₹ lakh" aria-label="Proposal cost" value={prop.cost} onChange={(e) => setProp({ ...prop, cost: e.target.value })} />
                <Input type="number" min={1} placeholder="Weeks" aria-label="Proposal weeks" value={prop.weeks} onChange={(e) => setProp({ ...prop, weeks: e.target.value })} />
                <Button onClick={() => {
                  if (!prop.company.trim() || !prop.summary.trim()) { toast.error("Add company and summary."); return; }
                  patch((q) => ({ ...q, proposals: [...q.proposals, { id: crypto.randomUUID(), company: prop.company.trim(), summary: prop.summary.trim(), costInr: Number(prop.cost) || 0, weeks: Number(prop.weeks) || 0 }] }));
                  setProp({ company: "", summary: "", cost: "", weeks: "" });
                }}>Submit proposal</Button>
              </div>
            )}
          </div>
          {p.milestones.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Milestones</h4>
              {p.milestones.map((m, i) => (
                <label key={m.title} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={m.done} disabled={p.status === "evaluated"}
                    onChange={() => patch((q) => ({ ...q, status: q.status === "partner_selected" ? "in_pilot" : q.status, milestones: q.milestones.map((x, j) => (j === i ? { ...x, done: !x.done } : x)) }))} />
                  {m.title}
                </label>
              ))}
            </div>
          )}
          {p.milestones.length > 0 && p.status !== "evaluated" && done === p.milestones.length && (
            <div className="grid gap-2 sm:grid-cols-3">
              <Field label="Result rating (1–5)"><Choice value={ev.rating} onChange={(v) => setEv({ ...ev, rating: v })} options={["1", "2", "3", "4", "5"]} placeholder="Rating" /></Field>
              <Field label="Decision"><Choice value={ev.decision} onChange={(v) => setEv({ ...ev, decision: v })} options={["Scale up", "Extend pilot", "Stop"]} placeholder="Decision" /></Field>
              <Field label="Evaluation notes"><Input value={ev.notes} onChange={(e) => setEv({ ...ev, notes: e.target.value })} /></Field>
              <Button onClick={() => patch((q) => ({ ...q, status: "evaluated", evaluation: { rating: Number(ev.rating), notes: ev.notes, decision: ev.decision } }))}>Record evaluation</Button>
            </div>
          )}
          {p.evaluation && <p className="text-sm">Evaluation: {p.evaluation.rating}/5 · {p.evaluation.decision}{p.evaluation.notes && ` — ${p.evaluation.notes}`}</p>}
        </div>
      )}
    </div>
  );
}

export function SectorNav() {
  const links = [
    ["/overview", "Overview"], ["/semiconductor", "Semiconductor"], ["/ai-innovation", "AI"], ["/greentech", "GreenTech"],
  ] as const;
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border pb-2 text-sm">
      {links.map(([to, label]) => (
        <Link key={to} to={to} className="whitespace-nowrap rounded px-3 py-1.5 text-muted-foreground hover:text-foreground" activeProps={{ className: "bg-primary/10 !text-primary font-medium" }}>{label}</Link>
      ))}
    </div>
  );
}

export function XButton({ onClick }: { onClick: () => void }) {
  return <button aria-label="Clear" onClick={onClick}><X className="h-4 w-4" /></button>;
}
