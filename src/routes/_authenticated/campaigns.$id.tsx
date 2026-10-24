import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge, StatusTrack } from "@/components/campaigns/CampaignStatus";
import { Fieldwork, SurveyLinkCard } from "@/components/campaigns/Fieldwork";
import { Report } from "@/components/campaigns/Report";
import { BIS_STATUSES, CORE_HEADERS } from "@/lib/campaigns";
import { fetchCampaign, fetchResponses, photoUrl, questionsOf, type Campaign } from "@/lib/campaigns-data";
import { useMyProfile } from "@/lib/profile";

export const Route = createFileRoute("/_authenticated/campaigns/$id")({
  head: () => ({ meta: [{ title: "Product Campaign — Japan2Nippon" }, { name: "description", content: "Dealer survey campaign: quote, fieldwork and market viability report." }, { property: "og:title", content: "Product Campaign — Japan2Nippon" }, { property: "og:description", content: "Dealer survey campaign: quote, fieldwork and market viability report." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: CampaignPage,
});

function CampaignPage() {
  const { id } = Route.useParams();
  const { data: me } = useMyProfile();
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const c = await fetchCampaign(id);
      if (!c) return null;
      const [responses, photo] = await Promise.all([fetchResponses(id), photoUrl(c.photo_path)]);
      return { c, responses, photo };
    },
  });
  if (isLoading || !me) return <p className="text-sm text-muted-foreground">Loading campaign…</p>;
  if (error) return <p className="text-sm text-destructive">Could not load: {(error as Error).message}</p>;
  if (!data) return <p className="text-muted-foreground">Campaign not found or you don't have access.</p>;
  const { c, responses, photo } = data;
  const role = me.id === c.sme_id ? "sme" : "vendor";
  const qs = questionsOf(c);
  const showReport = c.status === "report_ready" || c.status === "delivered" || (role === "vendor" && c.status === "data_review");

  return (
    <>
      <Link to="/surveys" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Dealer Surveys</Link>
      <div className="mb-6 flex flex-wrap items-start gap-5 border-b border-border pb-6">
        {photo && <img src={photo} alt={c.product_name_en} className="h-28 w-28 rounded-lg border border-border object-cover" />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-primary">{c.industry}</span><StatusBadge status={c.status} /><span className="text-xs text-muted-foreground">{role === "sme" ? "Your campaign" : "Assigned to you"}</span></div>
          <h1 className="mt-1 text-3xl font-bold">{c.product_name_en}</h1>
          {c.product_name_jp && <p className="text-muted-foreground">{c.product_name_jp}</p>}
          {c.description && <p className="mt-2 max-w-3xl text-sm">{c.description}</p>}
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
            {c.target_price_jpy != null && <div>Target price: ¥{c.target_price_jpy.toLocaleString("ja-JP")}</div>}
            {c.mrp_inr != null && <div>India MRP: ₹{c.mrp_inr.toLocaleString("en-IN")}</div>}
            <div>BIS: {BIS_STATUSES[c.bis_status as keyof typeof BIS_STATUSES] ?? c.bis_status}</div>
            <div>Target: {c.target_responses} responses</div>
            {c.deadline && <div>Deadline: {c.deadline}</div>}
            {c.target_states.length > 0 && <div>States: {c.target_states.join(", ")}</div>}
            {c.dealer_types.length > 0 && <div>Dealer types: {c.dealer_types.join(", ")}</div>}
          </dl>
        </div>
      </div>
      <StatusTrack status={c.status} />
      <ActionPanel c={c} role={role} />
      {c.clarification_note && c.status === "data_review" && (
        <div className="mb-6 rounded-lg border border-primary/40 bg-card p-4 text-sm"><b>Clarification requested by SME:</b> {c.clarification_note}</div>
      )}
      {role === "vendor" && ["fieldwork_live", "data_review", "report_ready", "delivered"].includes(c.status) && (
        <div className="mb-10"><Fieldwork c={c} responses={responses} /></div>
      )}
      {showReport && <Report c={c} responses={responses} role={role} />}
      {!showReport && ["draft", "submitted", "quoted", "accepted"].includes(c.status) && (
        <details className="rounded-lg border border-border bg-card p-5">
          <summary className="cursor-pointer text-sm font-semibold">Survey questions ({CORE_HEADERS.length + qs.length})</summary>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
            {CORE_HEADERS.map((h) => <li key={h}>{h} <span className="text-xs text-muted-foreground">(core)</span></li>)}
            {qs.map((q) => <li key={q.id}>{q.label} <span className="text-xs text-muted-foreground">({q.type}{q.options.length ? `: ${q.options.join(" / ")}` : ""})</span></li>)}
          </ol>
        </details>
      )}
    </>
  );
}

function ActionPanel({ c, role }: { c: Campaign; role: "sme" | "vendor" }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [quote, setQuote] = useState({ price: "", days: "", note: "" });
  const [vendor, setVendor] = useState(c.vendor_id ?? "");
  const [busy, setBusy] = useState(false);
  useEffect(() => setVendor(c.vendor_id ?? ""), [c.vendor_id]);
  const { data: vendors = [] } = useQuery({
    queryKey: ["survey-vendors"], enabled: role === "sme" && c.status === "draft",
    queryFn: async () => (await supabase.from("profiles").select("id, full_name, company_name, state").eq("account_type", "dealer")).data ?? [],
  });

  async function update(patch: Partial<Campaign>, msg: string) {
    setBusy(true);
    const { error } = await supabase.from("survey_campaigns").update(patch).eq("id", c.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(msg);
    qc.invalidateQueries({ queryKey: ["campaign", c.id] });
    qc.invalidateQueries({ queryKey: ["campaigns"] });
  }

  const box = (children: React.ReactNode) => <div className="mb-8 rounded-lg border border-primary/40 bg-card p-5 shadow-paper">{children}</div>;
  const quoteText = c.quote_price_inr != null && <p className="text-sm">Quote: <b>₹{c.quote_price_inr.toLocaleString("en-IN")}</b> · {c.quote_timeline_days} days{c.quote_note && <> · {c.quote_note}</>}</p>;

  if (role === "sme") {
    if (c.status === "draft") return box(<>
      <h3 className="font-bold">Draft — send to an Indian vendor</h3>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div className="min-w-64"><Label>Vendor</Label>
          <select className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={vendor} onChange={(e) => setVendor(e.target.value)}>
            <option value="">{vendors.length ? "Select a vendor" : "No vendor accounts registered yet"}</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.company_name || v.full_name || "Vendor"}{v.state ? ` · ${v.state}` : ""}</option>)}
          </select></div>
        <Button disabled={busy || !vendor} onClick={() => update({ vendor_id: vendor, status: "submitted" }, "Campaign sent to the vendor")}>Submit to vendor</Button>
        <Button variant="ghost" disabled={busy} onClick={async () => {
          const { error } = await supabase.from("survey_campaigns").delete().eq("id", c.id);
          if (error) return toast.error(error.message);
          toast.success("Draft deleted"); qc.invalidateQueries({ queryKey: ["campaigns"] }); navigate({ to: "/surveys" });
        }}>Delete draft</Button>
      </div>
    </>);
    if (c.status === "submitted") return box(<p className="text-sm">Waiting for the vendor to review your request and send a quote.</p>);
    if (c.status === "quoted") return box(<>
      <h3 className="font-bold">Vendor quote received</h3>{quoteText}
      <p className="mt-1 text-xs text-muted-foreground">Accepting records your agreement; no payment is taken in the app.</p>
      <div className="mt-3 flex gap-2">
        <Button disabled={busy} onClick={() => update({ status: "accepted" }, "Quote accepted — the vendor can start fieldwork")}>Accept quote</Button>
        <Button variant="outline" disabled={busy} onClick={() => update({ status: "submitted" }, "Quote declined — the vendor can send a new one")}>Decline</Button>
      </div>
    </>);
    if (c.status === "accepted") return box(<>{quoteText}<p className="mt-1 text-sm">Quote accepted. The vendor will launch the dealer survey.</p></>);
    if (c.status === "fieldwork_live") return box(<p className="text-sm">Fieldwork is live. Dealer responses become visible here once the vendor publishes the report.</p>);
    if (c.status === "data_review") return box(<p className="text-sm">The vendor is reviewing the collected data.</p>);
    return null;
  }

  if (c.status === "submitted") return box(<>
    <h3 className="font-bold">New campaign request — send your quote</h3>
    {c.quote_price_inr != null && <p className="mt-1 text-xs text-muted-foreground">Your previous quote was declined.</p>}
    <div className="mt-3 grid gap-3 sm:grid-cols-3">
      <div><Label>Price (₹)</Label><Input className="mt-1" type="number" min={0} value={quote.price} onChange={(e) => setQuote({ ...quote, price: e.target.value })} /></div>
      <div><Label>Timeline (days)</Label><Input className="mt-1" type="number" min={1} value={quote.days} onChange={(e) => setQuote({ ...quote, days: e.target.value })} /></div>
      <div className="sm:col-span-3"><Label>Note</Label><Textarea className="mt-1" rows={2} value={quote.note} onChange={(e) => setQuote({ ...quote, note: e.target.value })} /></div>
    </div>
    <Button className="mt-3" disabled={busy || quote.price === "" || !(Number(quote.days) >= 1)} onClick={() => update({ status: "quoted", quote_price_inr: Math.max(0, Math.round(Number(quote.price))), quote_timeline_days: Math.round(Number(quote.days)), quote_note: quote.note.trim() || null }, "Request accepted and quote sent")}>Accept request & send quote</Button>
  </>);
  if (c.status === "quoted") return box(<>{quoteText}<p className="mt-1 text-sm">Waiting for the SME to accept your quote.</p></>);
  if (c.status === "accepted") return <div className="mb-8 space-y-3">{box(<>{quoteText}<p className="mt-1 text-sm">The SME accepted your quote. The survey link, QR code and Excel template are ready.</p>
    <Button className="mt-3" disabled={busy} onClick={() => update({ status: "fieldwork_live" }, "Fieldwork is live — dealers can respond")}>Go live with fieldwork</Button></>)}<SurveyLinkCard c={c} /></div>;
  if (c.status === "report_ready") return box(<p className="text-sm">Report published. Waiting for the SME to approve or request clarification.</p>);
  return null;
}
