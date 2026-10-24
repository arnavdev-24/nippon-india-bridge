import { useState } from "react";
import { Cpu, BrainCircuit, Leaf, Search, Filter, ShieldAlert } from "lucide-react";
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
  const list = all.filter(
    (c) =>
      (!type || c.type === type) &&
      (!cap || c.capabilities.includes(cap)) &&
      (!state || c.state === state) &&
      `${c.name} ${c.bio} ${c.city}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <SectorNav />

      <PageHeader
        kanji={s.kanji}
        title={s.title}
        desc={s.tagline}
        action={
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-xs">
            <Icon className="h-6 w-6" />
          </div>
        }
      />

      {/* Domain Type Filter Pills */}
      <div>
        <div className="mb-2 text-xs font-mono font-medium text-muted-foreground uppercase">
          Domain Sub-Segments
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
          {s.types.map((t) => {
            const count = all.filter((c) => c.type === t).length;
            const active = type === t;
            return (
              <button
                key={t}
                onClick={() => setType(active ? "" : t)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  active
                    ? "border-primary bg-primary/10 font-semibold text-primary shadow-xs"
                    : "border-border/80 bg-card hover:border-primary/50 text-foreground"
                }`}
              >
                <div className="text-xs font-semibold">{t}</div>
                <div className="mt-1 text-[10px] text-muted-foreground">{count} profiles</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Toolbar Container */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-paper">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Search Partners">
            <div className="relative">
              <Input
                value={q}
                placeholder="Company name, keyword, city…"
                onChange={(e) => setQ(e.target.value)}
                className="text-xs pl-3"
              />
            </div>
          </Field>
          <Field label="Core Capability">
            <Choice
              value={cap}
              onChange={setCap}
              options={s.capabilities}
              placeholder="All technical capabilities"
            />
          </Field>
          <Field label="Target Industrial State">
            <Choice
              value={state}
              onChange={setState}
              options={[...new Set(all.map((c) => c.state))]}
              placeholder="All states"
            />
          </Field>
        </div>

        {(q || type || cap || state) && (
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>
              Showing <span className="font-semibold text-foreground">{list.length}</span> matching partner candidate(s)
            </span>
            <button
              onClick={() => {
                setQ("");
                setType("");
                setCap("");
                setState("");
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Candidate Cards Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Enterprise &amp; Technical Candidates</span>
          <span className="text-[11px] font-mono">Bilateral NDA Exchange Enabled</span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CompanyCard key={c.id} c={c} />
          ))}
          {list.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground bg-card/40">
              No matching profiles found for the selected filter combination. Try resetting your search parameters.
            </div>
          )}
        </div>
      </div>

      {extra}

      {/* Opportunity Map */}
      <section className="rounded-xl border border-border/80 bg-card p-6 shadow-paper">
        <div className="mb-4 border-b border-border/60 pb-3">
          <h2 className="text-xl font-bold tracking-tight">Industrial Cluster &amp; Opportunity Map</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Geographic distribution of manufacturing clusters and specialized Japanese Industrial Townships (JITs).
          </p>
        </div>
        <OpportunityMap
          sector={sector}
          selected={state || undefined}
          onSelect={(v) => setState(v === state ? "" : v)}
        />
      </section>

      {/* Pilot Board */}
      <PilotBoard
        sector={sector}
        kind={sector === "greentech" ? "carbon" : "challenge"}
        title={sector === "greentech" ? "Carbon Reduction Challenge Board" : "Commercial Pilot Exchange"}
      />
    </div>
  );
}
