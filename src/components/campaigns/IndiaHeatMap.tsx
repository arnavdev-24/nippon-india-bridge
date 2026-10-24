import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { readinessScore, type CustomQuestion, type ResponseRow } from "@/lib/campaigns";
import { aggregate, buildMetrics, HEAT_STOPS, heatColor, INDIA_MAP, parseMargin, parsePilot, resolveStates, STATE_NAMES, type MapDealer } from "@/lib/india-heatmap";

const NO_DATA = "#e2e8f0";

export function IndiaHeatMap({ responses, questions, selState, onSelectState }: {
  responses: ResponseRow[]; questions: CustomQuestion[]; selState: string | null; onSelectState: (s: string | null) => void;
}) {
  const dealers: MapDealer[] = useMemo(() => responses.map((r) => ({
    r, name: r.dealer_name || "Trade Partner", states: resolveStates(r.territory),
    price: r.price_rating, margin: parseMargin(r.margin), pilot: parsePilot(r.pilot_volume), score: readinessScore(r),
  })), [responses]);
  const metrics = useMemo(() => buildMetrics(responses, questions), [responses, questions]);
  const [metricId, setMetricId] = useState("count");
  const metric = metrics.find((m) => m.id === metricId) ?? metrics[0];
  const catOptions = metric.cat ? Object.entries(metric.cat.counts).sort((a, b) => b[1] - a[1]) : [];
  const [catPick, setCatPick] = useState<string | null>(null);
  const catValue = metric.cat ? (catPick && metric.cat.counts[catPick] ? catPick : catOptions[0]?.[0] ?? null) : null;
  const [split, setSplit] = useState(true);
  const agg = useMemo(() => aggregate(dealers, metric, catValue, split), [dealers, metric, catValue, split]);
  const [tip, setTip] = useState<{ s: string; x: number; y: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const vals = Object.values(agg).map((a) => a.value).filter((v): v is number => v !== null);
  const min = vals.length ? Math.min(...vals) : 0, max = vals.length ? Math.max(...vals) : 0;
  const tOf = (v: number) => (max === min ? (v > 0 ? 1 : 0) : (v - min) / (max - min));
  const fill = (s: string) => { const a = agg[s]; return a && a.value !== null ? heatColor(tOf(a.value)) : NO_DATA; };
  const ranked = Object.entries(agg).filter(([, a]) => a.value !== null).sort((a, b) => b[1].value! - a[1].value!);
  const mapped = dealers.filter((d) => d.states.length).length;
  const unmapped = dealers.filter((d) => !d.states.length).map((d) => d.name);
  const label = metric.cat ? `Share of dealers answering “${catValue}”` : metric.label;
  const groups = [...new Set(metrics.map((m) => m.group))];
  const delhi = INDIA_MAP.cent["Delhi"];

  function onMove(e: React.MouseEvent) {
    const el = (e.target as Element).closest("[data-state]") as HTMLElement | null;
    const b = boxRef.current?.getBoundingClientRect();
    if (!el || !b) { setTip(null); return; }
    setTip({ s: el.dataset.state!, x: Math.min(e.clientX - b.left + 14, b.width - 230), y: e.clientY - b.top + 14 });
  }
  const pick = (s: string) => onSelectState(selState === s ? null : s);

  let insight: React.ReactNode = "No dealer territories could be matched to Indian states in this dataset.";
  if (ranked.length) {
    const hot = ranked[0], cold = ranked[ranked.length - 1];
    const tied = ranked.filter((r) => r[1].value === hot[1].value).map((r) => r[0]);
    insight = (<>
      <b>Hotspot:</b> {tied.length > 1 && tied.length <= 3 ? tied.join(", ") : hot[0]} ({metric.fmt(hot[1].value!)})
      {ranked.length > 1 && cold[1].value !== hot[1].value && <><br /><b>Coolest covered state:</b> {cold[0]} ({metric.fmt(cold[1].value!)})</>}
      <br /><b>{ranked.length}</b> states have data · {36 - ranked.length} states/UTs with none (grey).
      {metric.kind === "avg" && ranked.some((r) => r[1].dealers.length === 1) && <><br /><span className="text-primary">Some states rest on a single dealer (number beside the name = dealers) – treat as indicative.</span></>}
      {metric.id === "price" && <><br />Low price scores = pricing pushback in that region.</>}
      {metric.id === "margin" && <><br />Red = regions demanding the fattest dealer margins.</>}
    </>);
  }
  const tipAgg = tip ? agg[tip.s] : undefined;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-paper">
      <div className="mb-4 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="mb-1 w-max rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Regional Intelligence</div>
          <h3 className="text-xl font-extrabold">India Heat Map</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{label} · {mapped} of {dealers.length} dealers placed on the map{unmapped.length ? ` (unmapped: ${unmapped.join(", ")})` : ""}</p>
        </div>
        <div className="flex flex-wrap items-end gap-3 text-xs">
          <div>
            <label className="mb-1 block font-bold text-muted-foreground">Map shows</label>
            <select className="max-w-xs rounded-xl border border-input bg-background px-3 py-2" value={metric.id} onChange={(e) => { setMetricId(e.target.value); setCatPick(null); }}>
              {groups.map((g) => <optgroup key={g} label={g}>{metrics.filter((m) => m.group === g).map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</optgroup>)}
            </select>
          </div>
          {metric.cat && (
            <div>
              <label className="mb-1 block font-bold text-muted-foreground">Dealers answering</label>
              <select className="max-w-xs rounded-xl border border-input bg-background px-3 py-2" value={catValue ?? ""} onChange={(e) => setCatPick(e.target.value)}>
                {catOptions.map(([v, n]) => <option key={v} value={v}>{(v.length > 60 ? `${v.slice(0, 57)}…` : v)}  ({n})</option>)}
              </select>
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-1.5 pb-2 font-medium text-muted-foreground">
            <input type="checkbox" checked={split} onChange={(e) => setSplit(e.target.checked)} /> Split multi-state dealers evenly
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div ref={boxRef} className="relative rounded-2xl border border-border bg-muted/40 p-3 lg:col-span-3">
          <div className="mx-auto" style={{ maxWidth: 560 }}>
            <svg viewBox={`0 0 ${INDIA_MAP.w} ${INDIA_MAP.h}`} className="h-auto w-full" onMouseMove={onMove} onMouseLeave={() => setTip(null)}
              onClick={(e) => { const el = (e.target as Element).closest("[data-state]") as HTMLElement | null; if (el) pick(el.dataset.state!); }}>
              {[...STATE_NAMES.filter((n) => n !== selState), ...(selState && INDIA_MAP.paths[selState] ? [selState] : [])].map((n) => (
                <path key={n} data-state={n} d={INDIA_MAP.paths[n]} fill={fill(n)} stroke={n === selState ? "#4f46e5" : "#64748b"} strokeWidth={n === selState ? 2.2 : 0.6} strokeLinejoin="round" style={{ cursor: "pointer", transition: "fill .35s" }} />
              ))}
              {delhi && <>
                <circle data-state="Delhi" cx={delhi[0]} cy={delhi[1]} r={7} fill={fill("Delhi")} stroke={selState === "Delhi" ? "#4f46e5" : "#0f172a"} strokeWidth={selState === "Delhi" ? 2.2 : 1.2} style={{ cursor: "pointer", transition: "fill .35s" }} />
                <text x={delhi[0] + 11} y={delhi[1] - 6} fontSize={10} fill="#475569" fontWeight={600} pointerEvents="none">Delhi</text>
              </>}
            </svg>
          </div>
          {tip && (
            <div className="pointer-events-none absolute z-20 max-w-[220px] rounded-xl bg-foreground px-3 py-2 text-xs text-background shadow-lg" style={{ left: tip.x, top: tip.y }}>
              <div className="font-bold">{tip.s}</div>
              {tipAgg && tipAgg.value !== null ? (<>
                <div className="font-semibold text-amber-300">{metric.fmt(tipAgg.value)}</div>
                <div className="opacity-80">{tipAgg.dealers.length} dealer{tipAgg.dealers.length > 1 ? "s" : ""}</div>
                <div className="mt-1 opacity-60">{tipAgg.dealers.slice(0, 3).map((d) => <div key={d.r.id}>{d.name}</div>)}{tipAgg.dealers.length > 3 && <div>+{tipAgg.dealers.length - 3} more</div>}</div>
              </>) : <div className="opacity-60">No dealer coverage</div>}
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground">
            <span>{vals.length ? `Low · ${metric.fmt(min)}` : "Low"}</span>
            <div className="h-3 w-48 rounded-full border border-border" style={{ background: `linear-gradient(to right,${HEAT_STOPS.map((s) => `rgb(${s[1].join(",")}) ${s[0] * 100}%`).join(",")})` }} />
            <span>{vals.length ? `High · ${metric.fmt(max)}` : "High"}</span>
            <span className="ml-2 flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm border border-border" style={{ background: NO_DATA }} />No data</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-2">
          <div className="rounded-xl bg-primary/5 p-3 text-xs leading-relaxed">{insight}</div>
          {selState && (
            <span className="inline-flex w-max items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              Table filtered: {selState} <button onClick={() => onSelectState(null)} aria-label="Clear state filter"><X className="h-3 w-3" /></button>
            </span>
          )}
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State ranking</div>
          <div className="space-y-1.5 overflow-y-auto pr-1" style={{ maxHeight: 380 }}>
            {ranked.length ? ranked.map(([s, a]) => {
              const t = tOf(a.value!);
              return (
                <button key={s} onClick={() => pick(s)} className={`block w-full rounded-lg px-2 py-1.5 text-left hover:bg-muted ${s === selState ? "bg-primary/5 ring-2 ring-primary/40" : ""}`}>
                  <div className="flex justify-between text-xs"><span className="font-semibold">{s} <span className="font-normal text-muted-foreground">· {a.dealers.length}</span></span><span className="font-bold">{metric.fmt(a.value!)}</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full" style={{ width: `${Math.max(6, t * 100)}%`, background: heatColor(Math.max(t, 0.08)), boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)" }} /></div>
                </button>
              );
            }) : <div className="text-xs text-muted-foreground">No state-level data for this view.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
