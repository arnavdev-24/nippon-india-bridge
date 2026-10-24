import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bookmark, FileDown, FileSpreadsheet, Package, Search } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Kpi } from "@/components/campaigns/CampaignStatus";
import { buildCharts, computeKpis, readinessScore, redFlags, stateBreakdown, type ResponseRow } from "@/lib/campaigns";
import { downloadBlob, downloadSheet, fetchContacts, questionsOf, type Campaign } from "@/lib/campaigns-data";

const COLORS = ["var(--color-primary)", "var(--color-success)", "var(--color-accent-foreground, #334)", "var(--color-muted-foreground)", "var(--color-destructive)", "var(--color-ring)"];

export function Report({ c, responses, role }: { c: Campaign; responses: ResponseRow[]; role: "sme" | "vendor" }) {
  const qc = useQueryClient();
  const qs = questionsOf(c);
  const [search, setSearch] = useState("");
  const [commentary, setCommentary] = useState(c.vendor_commentary);
  const [clar, setClar] = useState("");
  const kpis = computeKpis(responses);
  const charts = useMemo(() => buildCharts(responses, qs), [responses, qs]);
  const ranked = useMemo(() => responses.map((r) => ({ r, score: readinessScore(r) })).sort((a, b) => b.score - a.score), [responses]);
  const flags = redFlags(responses, qs);
  const states = stateBreakdown(responses);
  const { data: contacts } = useQuery({ queryKey: ["campaign-contacts", c.id, c.status], queryFn: () => fetchContacts(c.id) });
  const { data: actions = [] } = useQuery({
    queryKey: ["campaign-actions", c.id],
    queryFn: async () => (await supabase.from("campaign_dealer_actions").select("id, response_id, kind").eq("campaign_id", c.id)).data ?? [],
  });
  const has = (rid: string, kind: string) => actions.find((a) => a.response_id === rid && a.kind === kind);
  const filtered = ranked.filter(({ r }) => [r.dealer_name, r.territory, r.gstin, r.margin, r.pilot_volume].join(" ").toLowerCase().includes(search.toLowerCase()));
  const canAct = role === "sme" && (c.status === "report_ready" || c.status === "delivered");
  const showContacts = (contacts?.size ?? 0) > 0;

  async function toggleAction(rid: string, kind: "shortlist" | "sample") {
    const ex = has(rid, kind);
    const { error } = ex ? await supabase.from("campaign_dealer_actions").delete().eq("id", ex.id)
      : await supabase.from("campaign_dealer_actions").insert({ campaign_id: c.id, response_id: rid, sme_id: c.sme_id, kind });
    if (error) return toast.error(error.message);
    toast.success(ex ? "Removed" : kind === "shortlist" ? "Dealer shortlisted" : "Sample request recorded — the vendor can see it");
    qc.invalidateQueries({ queryKey: ["campaign-actions", c.id] });
  }

  async function update(patch: Partial<Campaign>, msg: string) {
    const { error } = await supabase.from("survey_campaigns").update(patch).eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success(msg);
    qc.invalidateQueries({ queryKey: ["campaign", c.id] });
  }

  const tableRows = () => ranked.map(({ r, score }) => {
    const ct = contacts?.get(r.id);
    return [r.dealer_name, r.territory, r.gstin, r.price_rating ?? "", r.margin, r.pilot_volume, ...qs.map((q) => String(r.answers[q.id] ?? "")), score, ...(showContacts ? [ct?.contact_name ?? "", ct?.phone ?? "", ct?.email ?? ""] : [])];
  });
  const head = ["Dealer", "Territory", "GSTIN", "Price rating", "Margin", "Pilot", ...qs.map((q) => q.label), "Readiness", ...(showContacts ? ["Contact", "Phone", "Email"] : [])];

  async function exportPdf() {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16); doc.text(`${c.product_name_en} — Dealer Survey Report`, 14, 16);
    doc.setFontSize(10);
    doc.text(`Responses: ${kpis.total}   Avg price rating: ${kpis.avgPrice ?? "N/A"}/5   Top margin: ${kpis.topMargin ?? "N/A"}   Pilot demand: ${kpis.pilotDemand} units`, 14, 24);
    autoTable(doc, { startY: 30, head: [["Dealer", "Territory", "GSTIN", "Price", "Margin", "Pilot", "Readiness"]], body: ranked.map(({ r, score }) => [r.dealer_name, r.territory, r.gstin, String(r.price_rating ?? ""), r.margin, r.pilot_volume, String(score)]), styles: { fontSize: 8 } });
    autoTable(doc, { head: [["State", "Responses", "Avg price", "Pilot units"]], body: states.map((s) => [s.state, String(s.responses), String(s.avgPrice ?? "—"), String(s.pilot)]), styles: { fontSize: 8 } });
    if (flags.length) autoTable(doc, { head: [["Red flag", "Dealer", "Detail"]], body: flags.map((f) => [f.reasons.join(", "), f.dealer, f.note]), styles: { fontSize: 8 } });
    if (c.vendor_commentary) autoTable(doc, { head: [["Vendor commentary"]], body: [[c.vendor_commentary]], styles: { fontSize: 9 } });
    downloadBlob(doc.output("blob"), `${c.product_name_en.replace(/\W+/g, "-")}-report.pdf`);
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Market Viability Report</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportPdf}><FileDown /> Export PDF</Button>
          <Button size="sm" variant="outline" onClick={() => downloadSheet([head, ...tableRows()], "Report", `${c.product_name_en.replace(/\W+/g, "-")}-report.xlsx`)}><FileSpreadsheet /> Export Excel</Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Total responses" value={String(kpis.total)} hint={`Target ${c.target_responses}`} />
        <Kpi label="Average price rating" value={kpis.avgPrice === null ? "N/A" : `${kpis.avgPrice} / 5`} hint={c.mrp_inr ? `At ₹${c.mrp_inr.toLocaleString("en-IN")} MRP` : undefined} />
        <Kpi label="Most common margin demand" value={kpis.topMargin ?? "N/A"} />
        <Kpi label="Total pilot demand" value={`${kpis.pilotDemand.toLocaleString()} units`} />
      </div>

      {charts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {charts.map((ch) => (
            <div key={ch.question.id} className="rounded-lg border border-border bg-card p-5 shadow-paper">
              <span className={`rounded px-2 py-0.5 text-xs ${ch.kind === "notes" ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"}`}>{ch.kind === "notes" ? "Qualitative Notes" : "Category Chart"}</span>
              <h3 className="mt-2 text-sm font-bold">{ch.question.label}</h3>
              {ch.kind === "notes" ? (
                <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto text-xs">{ch.samples.map((s) => <li key={s} className="rounded border border-border bg-muted/40 p-2 italic">“{s}”</li>)}{ch.samples.length === 0 && <li className="text-muted-foreground">No answers.</li>}</ul>
              ) : ch.data.length === 0 ? <p className="mt-3 text-xs text-muted-foreground">No answers.</p> : (
                <div className="mt-3 h-52">
                  <ResponsiveContainer>
                    {ch.kind === "doughnut" ? (
                      <PieChart><Pie data={ch.data} dataKey="value" nameKey="label" innerRadius={45} outerRadius={75}>{ch.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
                    ) : (
                      <BarChart data={ch.data}><XAxis dataKey="label" tick={{ fontSize: 9 }} tickFormatter={(v: string) => (v.length > 14 ? `${v.slice(0, 12)}…` : v)} /><YAxis allowDecimals={false} tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" fill="var(--color-primary)" radius={4} /></BarChart>
                    )}
                  </ResponsiveContainer>
                  {ch.kind === "doughnut" && <div className="-mt-2 flex flex-wrap gap-2 text-[10px]">{ch.data.map((d, i) => <span key={d.label} className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />{d.label} ({d.value})</span>)}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card shadow-paper">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div><h3 className="font-bold">Ranked dealers</h3><p className="text-xs text-muted-foreground">Readiness 0-100: GSTIN format, pilot commitment, margin ask. GSTIN is format-checked only.</p></div>
          <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-64 pl-8" placeholder="Search dealers" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground"><tr><th className="p-3">Dealer</th><th className="p-3">Territory</th><th className="p-3">GSTIN</th><th className="p-3">Margin</th><th className="p-3">Pilot</th><th className="p-3">Readiness</th>{showContacts && <th className="p-3">Contact</th>}<th className="p-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(({ r, score }) => {
                const ct = contacts?.get(r.id);
                return (
                  <tr key={r.id}>
                    <td className="p-3 font-semibold">{r.dealer_name}</td><td className="p-3 text-xs">{r.territory}</td><td className="p-3 font-mono text-xs">{r.gstin}</td>
                    <td className="p-3 text-xs">{r.margin || "—"}</td><td className="p-3 text-xs">{r.pilot_volume || "—"}</td>
                    <td className={`p-3 font-bold ${score >= 80 ? "text-success" : "text-primary"}`}>{score} / 100</td>
                    {showContacts && <td className="p-3 text-xs">{ct ? [ct.contact_name, ct.phone, ct.email].filter(Boolean).join(" · ") || "—" : "—"}</td>}
                    <td className="p-3 text-right whitespace-nowrap">
                      {canAct ? (<>
                        <Button size="sm" variant={has(r.id, "shortlist") ? "default" : "outline"} onClick={() => toggleAction(r.id, "shortlist")}><Bookmark /> {has(r.id, "shortlist") ? "Shortlisted" : "Shortlist"}</Button>{" "}
                        <Button size="sm" variant={has(r.id, "sample") ? "default" : "outline"} onClick={() => toggleAction(r.id, "sample")}><Package /> {has(r.id, "sample") ? "Sample requested" : "Request Sample"}</Button>
                      </>) : <span className="text-xs text-muted-foreground">{[has(r.id, "shortlist") && "Shortlisted", has(r.id, "sample") && "Sample requested"].filter(Boolean).join(" · ") || "—"}</span>}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No dealers match.</td></tr>}
            </tbody>
          </table>
        </div>
        {!showContacts && role === "sme" && <p className="border-t border-border p-3 text-xs text-muted-foreground">Dealer contact details are shared once the report is delivered.</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-bold">Top red flags</h3>
          {flags.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No dealer rated the price 2 or below or declined a pilot.</p> : (
            <ol className="mt-3 space-y-3 text-sm">{flags.map((f) => <li key={f.id} className="border-l-2 border-destructive pl-3"><div className="font-medium">{f.dealer} <span className="text-xs text-muted-foreground">{f.territory}</span></div><div className="text-xs text-destructive">{f.reasons.join(" · ")}</div>{f.note && <p className="mt-1 text-xs">{f.note}</p>}</li>)}</ol>
          )}
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-bold">State-wise breakdown</h3>
          <table className="mt-3 w-full text-sm"><thead className="text-left text-xs text-muted-foreground"><tr><th className="py-1">State</th><th>Responses</th><th>Avg price</th><th>Pilot units</th></tr></thead>
            <tbody className="divide-y divide-border">{states.map((s) => <tr key={s.state}><td className="py-1.5">{s.state}</td><td>{s.responses}</td><td>{s.avgPrice ?? "—"}</td><td>{s.pilot}</td></tr>)}</tbody></table>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-bold">Vendor commentary</h3>
        {role === "vendor" && (c.status === "data_review" || c.status === "report_ready") ? (
          <>
            <Textarea className="mt-2" rows={5} maxLength={5000} value={commentary} onChange={(e) => setCommentary(e.target.value)} placeholder="Field observations, context and recommendations for the Japanese team." />
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => update({ vendor_commentary: commentary }, "Commentary saved")}>Save commentary</Button>
              {c.status === "data_review" && <Button size="sm" onClick={() => update({ vendor_commentary: commentary, status: "report_ready" }, "Report published to the SME")}>Publish report</Button>}
            </div>
          </>
        ) : <p className="mt-2 whitespace-pre-wrap text-sm">{c.vendor_commentary || <span className="text-muted-foreground">No commentary yet.</span>}</p>}
      </div>

      {role === "sme" && c.status === "report_ready" && (
        <div className="rounded-lg border border-primary/40 bg-card p-5">
          <h3 className="font-bold">Review this report</h3>
          <Textarea className="mt-2" rows={3} value={clar} onChange={(e) => setClar(e.target.value)} placeholder="What needs clarification? (sent to the vendor)" />
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="outline" disabled={!clar.trim()} onClick={() => update({ clarification_note: clar.trim(), status: "data_review" }, "Clarification requested")}>Request clarification</Button>
            <Button onClick={() => update({ status: "delivered" }, "Report approved and delivered")}>Approve report</Button>
          </div>
        </div>
      )}
    </section>
  );
}
