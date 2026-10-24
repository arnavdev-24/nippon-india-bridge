import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { isValidGstinFormat, validateResponse, type CustomQuestion, type ParsedRow } from "@/lib/campaigns";

const empty = (): ParsedRow => ({ dealer_name: "", territory: "", gstin: "", price_rating: null, margin: "", pilot_volume: "", answers: {}, contact_name: "", phone: "", email: "" });

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-border bg-card p-5">
      <legend className="px-2 text-sm font-semibold"><span className="mr-2 text-primary">{n}.</span>{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function QuestionInput({ q, value, onChange }: { q: CustomQuestion; value: string | number | undefined; onChange: (v: string | number) => void }) {
  const wide = q.type === "text";
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <Label>{q.label}</Label>
      {q.type === "choice" ? (
        <select className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>{q.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : q.type === "rating" ? (
        <Rating value={value === undefined || value === "" ? null : Number(value)} onChange={(v) => onChange(v)} />
      ) : q.type === "number" ? (
        <Input className="mt-1" type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
      ) : (
        <Textarea className="mt-1" rows={2} maxLength={2000} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function Rating({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="mt-1 flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} onClick={() => onChange(n)} className={`h-10 w-10 rounded-md border text-sm ${value === n ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>
      ))}
    </div>
  );
}

export function ResponseForm({ questions, onSubmit, submitLabel = "Submit response" }: { questions: CustomQuestion[]; onSubmit: (r: ParsedRow) => Promise<boolean>; submitLabel?: string }) {
  const [r, setR] = useState<ParsedRow>(empty);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const set = <K extends keyof ParsedRow>(k: K, v: ParsedRow[K]) => setR((p) => ({ ...p, [k]: v }));
  const setA = (id: string, v: string | number) => setR((p) => ({ ...p, answers: { ...p.answers, [id]: v } }));
  const gstinBad = r.gstin.length > 0 && !isValidGstinFormat(r.gstin);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = { ...r, gstin: r.gstin.trim().toUpperCase(), dealer_name: r.dealer_name.trim(), answers: Object.fromEntries(Object.entries(r.answers).filter(([, v]) => v !== "")) };
    const errs = validateResponse(clean, questions);
    setErrors(errs);
    if (errs.length) return;
    setBusy(true);
    const ok = await onSubmit(clean);
    setBusy(false);
    if (ok) setR(empty());
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Section n={1} title="Business Credentials">
        <div><Label>Dealer / business name *</Label><Input className="mt-1" maxLength={200} value={r.dealer_name} onChange={(e) => set("dealer_name", e.target.value)} /></div>
        <div><Label>Operating territory (states)</Label><Input className="mt-1" placeholder="e.g. Punjab / Haryana" value={r.territory} onChange={(e) => set("territory", e.target.value)} /></div>
        <div><Label>GSTIN *</Label><Input className="mt-1 font-mono uppercase" maxLength={15} value={r.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} />
          <p className={`mt-1 text-xs ${gstinBad ? "text-destructive" : "text-muted-foreground"}`}>{gstinBad ? "Format looks incorrect (15 characters, e.g. 03AAACK2214F1Z8)." : "Format check only — not a government verification."}</p></div>
        <div><Label>Contact person</Label><Input className="mt-1" value={r.contact_name} onChange={(e) => set("contact_name", e.target.value)} /></div>
        <div><Label>Phone</Label><Input className="mt-1" type="tel" maxLength={20} value={r.phone} onChange={(e) => set("phone", e.target.value)} /></div>
        <div><Label>Email</Label><Input className="mt-1" type="email" value={r.email} onChange={(e) => set("email", e.target.value)} /></div>
      </Section>
      {questions.some((q) => q.section === "localization") && (
        <Section n={2} title="Product Localization">
          {questions.filter((q) => q.section === "localization").map((q) => <QuestionInput key={q.id} q={q} value={r.answers[q.id]} onChange={(v) => setA(q.id, v)} />)}
        </Section>
      )}
      <Section n={3} title="Commercials & Pilot">
        <div><Label>Price acceptance rating (1-5) *</Label><Rating value={r.price_rating} onChange={(v) => set("price_rating", v)} /></div>
        <div><Label>Required margin (%)</Label><Input className="mt-1" placeholder="e.g. 14% - 18%" value={r.margin} onChange={(e) => set("margin", e.target.value)} /></div>
        <div className="sm:col-span-2"><Label>Pilot trial volume</Label><Input className="mt-1" placeholder="e.g. 1 Demo Unit + 5 Orders" value={r.pilot_volume} onChange={(e) => set("pilot_volume", e.target.value)} /></div>
        {questions.filter((q) => q.section === "commercial").map((q) => <QuestionInput key={q.id} q={q} value={r.answers[q.id]} onChange={(v) => setA(q.id, v)} />)}
      </Section>
      {errors.length > 0 && <ul className="rounded-md border border-destructive/40 p-3 text-sm text-destructive">{errors.map((e) => <li key={e}>• {e}</li>)}</ul>}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Submitting…" : submitLabel}</Button>
    </form>
  );
}
