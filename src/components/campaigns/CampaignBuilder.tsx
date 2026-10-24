import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, Plus, Rocket, Wand2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AGRI_SAMPLE_QUESTIONS, BIS_STATUSES, CORE_HEADERS, DEALER_TYPES, type CustomQuestion, type QuestionType } from "@/lib/campaigns";
import { INDIAN_STATES, INDUSTRIES } from "@/lib/campaigns-data";
import { useMyProfile } from "@/lib/profile";

const sel = "mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
const newId = () => Math.random().toString(36).slice(2, 10);

function Chips({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = value.includes(o);
        return <button type="button" key={o} onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}
          className={`rounded-full border px-2.5 py-1 text-xs ${on ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{o}</button>;
      })}
    </div>
  );
}

export function CampaignBuilder() {
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [f, setF] = useState({ product_name_en: "", product_name_jp: "", industry: INDUSTRIES[0]!, description: "", target_price_jpy: "", mrp_inr: "", target_states: [] as string[], dealer_types: [] as string[], target_responses: "20", deadline: "", bis_status: "not_started", vendor_id: "" });
  const [qs, setQs] = useState<CustomQuestion[]>([]);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const { data: vendors = [] } = useQuery({
    queryKey: ["survey-vendors"], enabled: open,
    queryFn: async () => (await supabase.from("profiles").select("id, full_name, company_name, city, state").eq("account_type", "dealer")).data ?? [],
  });

  const upd = (i: number, p: Partial<CustomQuestion>) => setQs(qs.map((q, j) => (j === i ? { ...q, ...p } : q)));

  async function save(submit: boolean) {
    if (!me) return;
    if (!f.product_name_en.trim()) { toast.error("Product name (English) is required"); return; }
    if (submit && !f.vendor_id) { toast.error("Choose an Indian vendor to send the request to"); return; }
    if (submit && f.target_states.length === 0) { toast.error("Select at least one target state"); return; }
    const clean = qs.map((q) => ({ ...q, label: q.label.trim(), options: q.options.map((o) => o.trim()).filter(Boolean) })).filter((q) => q.label);
    if (clean.some((q) => q.type === "choice" && q.options.length < 2)) { toast.error("Choice questions need at least 2 options"); return; }
    setBusy(true);
    let photo_path: string | null = null;
    if (photo) {
      photo_path = `${me.id}/${Date.now()}-${photo.name.replace(/[^\w.-]/g, "_")}`;
      const up = await supabase.storage.from("campaign-photos").upload(photo_path, photo);
      if (up.error) { setBusy(false); { toast.error(`Photo upload failed: ${up.error.message}`); return; } }
    }
    const num = (v: string) => (v === "" ? null : Math.max(0, Math.round(Number(v))));
    const { data, error } = await supabase.from("survey_campaigns").insert({
      sme_id: me.id, vendor_id: f.vendor_id || null, product_name_en: f.product_name_en.trim(), product_name_jp: f.product_name_jp.trim(),
      industry: f.industry, description: f.description.trim(), photo_path, target_price_jpy: num(f.target_price_jpy), mrp_inr: num(f.mrp_inr),
      target_states: f.target_states, dealer_types: f.dealer_types, target_responses: Math.max(1, num(f.target_responses) ?? 1), deadline: f.deadline || null,
      bis_status: f.bis_status, custom_questions: clean, status: submit ? "submitted" : "draft",
    }).select("id").single();
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(submit ? "Campaign sent to the vendor" : "Draft saved");
    qc.invalidateQueries({ queryKey: ["campaigns"] });
    setOpen(false);
    navigate({ to: "/campaigns/$id", params: { id: data.id } });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Rocket /> Launch New Product Campaign</Button></DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader><DialogTitle>Launch New Product Campaign</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Product name (EN) *</Label><Input className="mt-1" value={f.product_name_en} onChange={(e) => set("product_name_en", e.target.value)} /></div>
          <div><Label>製品名 (JP)</Label><Input className="mt-1" value={f.product_name_jp} onChange={(e) => set("product_name_jp", e.target.value)} /></div>
          <div><Label>Industry</Label><select className={sel} value={f.industry} onChange={(e) => set("industry", e.target.value)}>{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</select></div>
          <div><Label>Product photo</Label><Input className="mt-1" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} /></div>
          <div className="sm:col-span-2"><Label>Description</Label><Textarea className="mt-1" rows={3} value={f.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div><Label>Target price (JPY)</Label><Input className="mt-1" type="number" min={0} value={f.target_price_jpy} onChange={(e) => set("target_price_jpy", e.target.value)} /></div>
          <div><Label>Estimated India retail MRP (INR)</Label><Input className="mt-1" type="number" min={0} value={f.mrp_inr} onChange={(e) => set("mrp_inr", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Target states *</Label><Chips options={INDIAN_STATES} value={f.target_states} onChange={(v) => set("target_states", v)} /></div>
          <div className="sm:col-span-2"><Label>Dealer types</Label><Chips options={DEALER_TYPES} value={f.dealer_types} onChange={(v) => set("dealer_types", v)} /></div>
          <div><Label>Responses wanted</Label><Input className="mt-1" type="number" min={1} max={1000} value={f.target_responses} onChange={(e) => set("target_responses", e.target.value)} /></div>
          <div><Label>Deadline</Label><Input className="mt-1" type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></div>
          <div><Label>BIS certification status</Label><select className={sel} value={f.bis_status} onChange={(e) => set("bis_status", e.target.value)}>{Object.entries(BIS_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
          <div><Label>Send request to Indian vendor *</Label>
            <select className={sel} value={f.vendor_id} onChange={(e) => set("vendor_id", e.target.value)}>
              <option value="">{vendors.length ? "Select a vendor" : "No vendor accounts registered yet"}</option>
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.company_name || v.full_name || "Vendor"}{v.state ? ` · ${v.state}` : ""}</option>)}
            </select></div>
        </div>

        <div className="mt-2 rounded-md border border-border bg-muted/40 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Lock className="h-4 w-4" /> Fixed core questions (always included)</div>
          <div className="flex flex-wrap gap-1.5">{CORE_HEADERS.map((h) => <span key={h} className="rounded border border-border bg-card px-2 py-1 text-xs">{h}</span>)}</div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label>Custom questions ({qs.length}/10)</Label>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={() => setQs(AGRI_SAMPLE_QUESTIONS.map((q) => ({ ...q, id: newId() })))}><Wand2 /> Use agri-machinery sample</Button>
              <Button type="button" size="sm" variant="outline" disabled={qs.length >= 10} onClick={() => setQs([...qs, { id: newId(), label: "", type: "choice", options: [], section: "localization" }])}><Plus /> Add question</Button>
            </div>
          </div>
          {qs.map((q, i) => (
            <div key={q.id} className="rounded-md border border-border p-3">
              <div className="flex gap-2">
                <Input placeholder={`Question ${i + 1}`} value={q.label} onChange={(e) => upd(i, { label: e.target.value })} />
                <select className="h-10 rounded-md border border-input bg-background px-2 text-sm" value={q.type} onChange={(e) => upd(i, { type: e.target.value as QuestionType })}>
                  <option value="choice">Choice</option><option value="rating">Rating 1-5</option><option value="number">Number</option><option value="text">Text</option>
                </select>
                <select className="h-10 rounded-md border border-input bg-background px-2 text-sm" value={q.section} onChange={(e) => upd(i, { section: e.target.value as CustomQuestion["section"] })}>
                  <option value="localization">Localization</option><option value="commercial">Commercial</option>
                </select>
                <Button type="button" size="icon" variant="ghost" onClick={() => setQs(qs.filter((_, j) => j !== i))}><X /></Button>
              </div>
              {q.type === "choice" && (
                <Input className="mt-2" placeholder="Options, separated by commas" value={q.options.join(",")} onChange={(e) => upd(i, { options: e.target.value.split(",") })} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={busy} onClick={() => save(false)}>Save draft</Button>
          <Button disabled={busy} onClick={() => save(true)}>{busy ? "Saving…" : "Submit to vendor"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
