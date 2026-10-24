import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Download, FileSpreadsheet, Plus, Send, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResponseForm } from "@/components/campaigns/ResponseForm";
import { parseSheetRows, templateHeaders, type ParsedRow, type ResponseRow, type RowError } from "@/lib/campaigns";
import { downloadSheet, questionsOf, readSheet, surveyLink, type Campaign } from "@/lib/campaigns-data";

export function SurveyLinkCard({ c }: { c: Campaign }) {
  const [qr, setQr] = useState("");
  const [link, setLink] = useState("");
  useEffect(() => {
    const l = surveyLink(c.public_token);
    setLink(l);
    import("qrcode").then((m) => m.toDataURL(l, { margin: 1, width: 220 })).then(setQr).catch(() => setQr(""));
  }, [c.public_token]);
  return (
    <div className="flex flex-wrap items-center gap-5 rounded-lg border border-border bg-card p-5 shadow-paper">
      {qr && <img src={qr} alt="QR code for the dealer survey" className="h-32 w-32 rounded border border-border" />}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">Public dealer survey link</div>
        <p className="text-xs text-muted-foreground">Dealers open this without signing in. {c.status === "fieldwork_live" ? "Accepting responses." : "Opens when fieldwork is live."}</p>
        <code className="mt-2 block truncate rounded bg-muted px-2 py-1 text-xs">{link}</code>
        <div className="mt-2 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(link); toast.success("Link copied"); }}><Copy /> Copy link</Button>
          {qr && <Button size="sm" variant="outline" asChild><a href={qr} download="dealer-survey-qr.png"><Download /> QR code</a></Button>}
        </div>
      </div>
    </div>
  );
}

async function insertRows(c: Campaign, rows: ParsedRow[], source: "upload" | "manual") {
  const { data, error } = await supabase.from("campaign_responses").insert(rows.map((r) => ({
    campaign_id: c.id, dealer_name: r.dealer_name, territory: r.territory, gstin: r.gstin, price_rating: r.price_rating, margin: r.margin, pilot_volume: r.pilot_volume, answers: r.answers, source,
  }))).select("id");
  if (error) throw error;
  const contacts = data.map((d, i) => ({ response_id: d.id, campaign_id: c.id, contact_name: rows[i]!.contact_name, phone: rows[i]!.phone, email: rows[i]!.email }));
  const ce = await supabase.from("campaign_response_contacts").insert(contacts);
  if (ce.error) throw ce.error;
  return data.length;
}

export function Fieldwork({ c, responses }: { c: Campaign; responses: (ResponseRow & { source: string })[] }) {
  const qc = useQueryClient();
  const qs = questionsOf(c);
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<{ imported: number; errors: RowError[] } | null>(null);
  const [manual, setManual] = useState(false);
  const editable = c.status === "fieldwork_live" || c.status === "data_review";
  const refresh = () => qc.invalidateQueries({ queryKey: ["campaign", c.id] });

  async function handleFile(file: File) {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) { toast.error("Upload an .xlsx, .xls or .csv file"); return; }
    setBusy(true);
    try {
      const rows = await readSheet(file);
      if (!rows.length) { toast.error("The file has no rows"); return; }
      const { valid, errors } = parseSheetRows(rows, qs);
      const imported = valid.length ? await insertRows(c, valid, "upload") : 0;
      setReport({ imported, errors });
      if (imported) toast.success(`${imported} responses imported`); else toast.error("No rows imported — see errors below");
      refresh();
    } catch (e) {
      toast.error(`Upload failed: ${(e as Error).message}`);
    } finally { setBusy(false); }
  }

  async function del(id: string) {
    const { error } = await supabase.from("campaign_responses").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  async function setStatus(status: "data_review" | "fieldwork_live") {
    if (status === "data_review" && responses.length === 0) { toast.error("Add at least one response before submitting"); return; }
    const { error } = await supabase.from("survey_campaigns").update({ status }).eq("id", c.id);
    if (error) { toast.error(error.message); return; }
    toast.success(status === "data_review" ? "Data submitted — review it and publish the report" : "Fieldwork reopened");
    refresh();
  }

  const pct = Math.min(100, Math.round((responses.length / c.target_responses) * 100));
  return (
    <section className="space-y-5">
      <SurveyLinkCard c={c} />
      <div className="rounded-lg border border-border bg-card p-5 shadow-paper">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><div className="text-sm font-semibold">Progress</div><div className="text-xs text-muted-foreground">{responses.length} of {c.target_responses} responses</div></div>
          <div className="flex flex-wrap gap-2">
            {c.status === "fieldwork_live" && <Button onClick={() => setStatus("data_review")}><Send /> Submit Data</Button>}
            {c.status === "data_review" && <Button variant="outline" onClick={() => setStatus("fieldwork_live")}>Reopen fieldwork</Button>}
          </div>
        </div>
        <Progress value={pct} className="mt-3" />
      </div>

      {editable && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><FileSpreadsheet className="h-4 w-4 text-primary" /> Bulk upload</div>
            <p className="mt-1 text-xs text-muted-foreground">Use the template — headers must match this campaign's questions.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => downloadSheet([templateHeaders(qs)], "Responses", `${c.product_name_en.replace(/\W+/g, "-")}-template.xlsx`)}><Download /> Download Excel Template</Button>
              <Button size="sm" variant="ghost" asChild><a href="/downloads/sample-agri-dealer-responses.xlsx" download>Sample file (agri)</a></Button>
            </div>
            <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => fileRef.current?.click()}
              className={`mt-3 cursor-pointer rounded-md border-2 border-dashed p-6 text-center text-sm ${drag ? "border-primary bg-primary/5" : "border-border text-muted-foreground"}`}>
              <Upload className="mx-auto mb-2 h-5 w-5" />{busy ? "Importing…" : "Drag & drop .xlsx / .csv here, or click to browse"}
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
            </div>
            {report && (
              <div className="mt-3 text-xs">
                <div className="font-medium">{report.imported} imported · {report.errors.length} issues</div>
                {report.errors.length > 0 && <ul className="mt-1 max-h-40 overflow-y-auto text-destructive">{report.errors.map((e, i) => <li key={i}>{e.row ? `Row ${e.row}: ` : ""}{e.message}</li>)}</ul>}
              </div>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-sm font-semibold">Manual entry</div>
            <p className="mt-1 text-xs text-muted-foreground">Record a response collected by phone or in person.</p>
            <Dialog open={manual} onOpenChange={setManual}>
              <DialogTrigger asChild><Button size="sm" className="mt-3"><Plus /> Add response</Button></DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader><DialogTitle>Add dealer response</DialogTitle></DialogHeader>
                <ResponseForm questions={qs} submitLabel="Save response" onSubmit={async (r) => {
                  try { await insertRows(c, [r], "manual"); toast.success("Response saved"); refresh(); setManual(false); return true; }
                  catch (e) { toast.error((e as Error).message); return false; }
                }} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs text-muted-foreground"><tr><th className="p-3">Dealer</th><th className="p-3">Territory</th><th className="p-3">GSTIN</th><th className="p-3">Price</th><th className="p-3">Source</th><th className="p-3" /></tr></thead>
          <tbody className="divide-y divide-border">
            {responses.map((r) => (
              <tr key={r.id}><td className="p-3 font-medium">{r.dealer_name}</td><td className="p-3 text-xs">{r.territory}</td><td className="p-3 font-mono text-xs">{r.gstin}</td><td className="p-3">{r.price_rating ?? "—"}</td><td className="p-3 text-xs capitalize">{r.source}</td>
                <td className="p-3 text-right">{editable && <Button size="icon" variant="ghost" aria-label="Delete response" onClick={() => del(r.id)}><Trash2 /></Button>}</td></tr>
            ))}
            {responses.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No responses yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
