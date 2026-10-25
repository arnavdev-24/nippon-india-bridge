import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  STATE_PROFILES,
  PRIORITIES,
  DEFAULT_WEIGHTS,
  scoreStatesForIndustry,
  STATE_DATA_SOURCES,
  type StateKey,
  type PriorityKey,
  type PriorityWeights,
} from "@/lib/states";
import { INDUSTRIES, type IndustryKey } from "@/lib/tax-compliance";
import {
  MapPin,
  Building2,
  TrendingUp,
  Anchor,
  ShieldCheck,
  Check,
  ArrowRight,
  SlidersHorizontal,
  Coins,
  GraduationCap,
  Sparkles,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/state-intelligence")({
  head: () => ({
    meta: [
      { title: "State Market Intelligence — nippon2bharat" },
      { name: "description", content: "Comparative economic, logistics, and industrial cluster data across Indian states for Japanese SMEs." },
      { property: "og:title", content: "State Market Intelligence" },
      { property: "og:description", content: "State-by-state economic and regulatory comparison." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StateIntelligencePage,
});

function StateIntelligencePage() {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey | "">("automotive");
  const [weights, setWeights] = useState<PriorityWeights>(DEFAULT_WEIGHTS);
  const [comparedKeys, setComparedKeys] = useState<StateKey[]>(["tamil_nadu", "gujarat", "maharashtra"]);

  const rankedStates = scoreStatesForIndustry(selectedIndustry, weights);

  const toggleCompared = (key: StateKey) => {
    if (comparedKeys.includes(key)) {
      if (comparedKeys.length > 1) {
        setComparedKeys(comparedKeys.filter((k) => k !== key));
      }
    } else {
      if (comparedKeys.length >= 3) {
        setComparedKeys([...comparedKeys.slice(1), key]);
      } else {
        setComparedKeys([...comparedKeys, key]);
      }
    }
  };

  const adjustWeight = (key: PriorityKey, delta: number) => {
    const current = weights[key] ?? 2;
    const next = Math.max(0, Math.min(5, current + delta));
    setWeights({ ...weights, [key]: next });
  };

  const comparedProfiles = comparedKeys
    .map((k) => STATE_PROFILES.find((s) => s.key === k))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-16">
      <PageHeader
        kanji="州"
        title="State Market Intelligence"
        desc="Comparative economic, logistics, and industrial cluster intelligence across 10 major Indian industrial and consumer hubs — aligned with Japanese investment corridors."
      />

      {/* 1. Industry & Criteria Control Panel */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-paper space-y-6">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-primary uppercase">
            Step 1 · Sector &amp; Strategic Priorities
          </span>
          <h3 className="text-lg font-bold mt-0.5">Select Target Industry</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => {
              const active = selectedIndustry === ind.key;
              return (
                <button
                  key={ind.key}
                  type="button"
                  onClick={() => setSelectedIndustry(ind.key)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <ind.icon className="mr-1.5 inline-block h-3.5 w-3.5" />
                  {ind.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border/60 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                Step 2 · Priority Weightings
              </span>
              <h4 className="text-sm font-bold mt-0.5">Adjust Decision Weights (0–5)</h4>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-7"
              onClick={() => setWeights(DEFAULT_WEIGHTS)}
            >
              Reset to Defaults
            </Button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PRIORITIES.map((p) => {
              const w = weights[p.key] ?? 2;
              return (
                <div
                  key={p.key}
                  className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span>{p.label}</span>
                    <span className="font-mono text-primary font-bold">{w}x</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={w <= 0}
                      onClick={() => adjustWeight(p.key, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-xs font-bold hover:bg-muted disabled:opacity-40"
                    >
                      -
                    </button>
                    <div className="flex-1 bg-border/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${(w / 5) * 100}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={w >= 5}
                      onClick={() => adjustWeight(p.key, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-xs font-bold hover:bg-muted disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Top Ranked States for Selected Sector */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <div>
            <div className="text-xs font-serif font-bold text-primary uppercase">
              Ranking Results
            </div>
            <h3 className="text-lg font-bold mt-0.5">
              Ranked States for {INDUSTRIES.find((i) => i.key === selectedIndustry)?.name ?? "Selected Sector"}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            Select up to 3 states to compare side-by-side
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rankedStates.slice(0, 6).map(({ state, score, fit }, rankIdx) => {
            const isCompared = comparedKeys.includes(state.key);
            return (
              <div
                key={state.key}
                className={`relative rounded-xl border p-5 shadow-paper transition-all flex flex-col justify-between ${
                  isCompared
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border/80 bg-card hover:border-primary/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono font-bold text-primary">
                      Rank #{rankIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCompared(state.key)}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                        isCompared
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isCompared ? "✓ Selected" : "+ Compare"}
                    </button>
                  </div>

                  <h4 className="mt-3 text-xl font-bold">{state.name}</h4>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    GSDP: ${state.gsdpUsdBn}B USD · Population: {state.population}M · Capital: {state.capital}
                  </div>

                  {/* Score bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Corridor Fit Score</span>
                      <span className="font-mono font-bold text-primary">{score} / 100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-border/60 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  {/* Japanese Presence Tag */}
                  <div className="mt-4 rounded-lg bg-muted/40 p-2.5 text-xs">
                    <span className="font-semibold text-foreground text-[11px] block">
                      Japanese Footprint &amp; JIT:
                    </span>
                    <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-2">
                      {state.japanesePresence[0]}
                    </p>
                  </div>

                  {/* Clusters preview */}
                  <div className="mt-3 text-xs">
                    <span className="text-muted-foreground text-[11px]">Industrial Hubs: </span>
                    <span className="font-medium text-foreground">
                      {state.keyClusters.map((c) => c.city).slice(0, 3).join(", ")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Single Window: {state.singleWindow.split(" ")[0]}
                  </span>
                  <Link
                    to="/tax-compliance"
                    className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <span>Diagnose</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Deep Side-by-Side Comparison Matrix */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-paper space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <div className="text-xs font-serif font-bold text-primary uppercase">
              Deep Bilateral Matrix
            </div>
            <h3 className="text-lg font-bold mt-0.5">Side-by-Side State Evaluation</h3>
          </div>
          <div className="text-xs text-muted-foreground">
            Comparing: {comparedProfiles.map((p) => p.name).join(" vs ")}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] font-mono text-muted-foreground uppercase">
                <th className="py-3 pr-4 font-medium w-1/4">Metric / Dimension</th>
                {comparedProfiles.map((p) => (
                  <th key={p.key} className="py-3 pr-4 font-bold text-foreground text-sm">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {/* Economy */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">GSDP (USD Bn) &amp; Population</td>
                {comparedProfiles.map((p) => (
                  <td key={p.key} className="py-3 pr-4">
                    <span className="font-mono font-bold text-primary">${p.gsdpUsdBn}B</span>
                    <span className="text-muted-foreground ml-1.5">({p.population}M pop, {p.urbanisationPct}% urban)</span>
                  </td>
                ))}
              </tr>

              {/* Japanese Presence */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Japanese Footprint &amp; JITs</td>
                {comparedProfiles.map((p) => (
                  <td key={p.key} className="py-3 pr-4 text-muted-foreground leading-relaxed">
                    <ul className="list-disc pl-3.5 space-y-1">
                      {p.japanesePresence.map((j, i) => (
                        <li key={i}>{j}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Industrial Clusters */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Key Manufacturing Clusters</td>
                {comparedProfiles.map((p) => (
                  <td key={p.key} className="py-3 pr-4 text-muted-foreground leading-relaxed">
                    <div className="space-y-1">
                      {p.keyClusters.map((c, i) => (
                        <div key={i}>
                          <span className="font-medium text-foreground">{c.city}:</span> {c.industries}
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Single Window Portal */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Single Window Clearance</td>
                {comparedProfiles.map((p) => (
                  <td key={p.key} className="py-3 pr-4 text-foreground font-medium">
                    {p.singleWindow}
                  </td>
                ))}
              </tr>

              {/* Logistics & Ports */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Logistics &amp; Port Access</td>
                {comparedProfiles.map((p) => (
                  <td key={p.key} className="py-3 pr-4 text-muted-foreground leading-relaxed">
                    {p.ports}
                  </td>
                ))}
              </tr>

              {/* State Industrial Incentives */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">State Capital &amp; SGST Incentives</td>
                {comparedProfiles.map((p) => (
                  <td key={p.key} className="py-3 pr-4 text-muted-foreground leading-relaxed">
                    <ul className="list-disc pl-3.5 space-y-1">
                      {p.incentives.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Languages */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Languages for Business &amp; Operations</td>
                {comparedProfiles.map((p) => (
                  <td key={p.key} className="py-3 pr-4">
                    <span className="text-foreground">Business: {p.languages.business}</span>
                    <span className="block text-muted-foreground text-[11px]">Local: {p.languages.local}</span>
                  </td>
                ))}
              </tr>

              {/* Consumer Buyer Profile */}
              <tr>
                <td className="py-3 pr-4 font-semibold text-foreground">Consumer &amp; B2B Profile</td>
                {comparedProfiles.map((p) => (
                  <td key={p.key} className="py-3 pr-4 text-muted-foreground leading-relaxed">
                    {p.consumerNote}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sources & Transparency Note */}
      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
        <div>
          <span className="font-semibold text-foreground">Methodology &amp; Sources: </span>
          {STATE_DATA_SOURCES}
        </div>
      </div>

      {/* Next Step Call to Action */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-foreground">Ready to Validate Your Entry Plan?</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Run the statutory FDI &amp; GST diagnostic for your top-choice state, or discover verified distributors.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Button asChild size="sm" className="shadow-paper">
            <Link to="/tax-compliance">
              Launch Diagnostic
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/distributors">Find Distributors</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
