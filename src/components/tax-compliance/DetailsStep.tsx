import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMyProfile } from "@/lib/profile";
import { industryName, serviceName, type Expert, type IndustryKey, type ServiceKey } from "@/lib/tax-compliance";
import type { Booking } from "./BookingStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type CompanyDetails = { companyName: string; country: string; contactName: string; email: string };

export function DetailsStep({ expert, industry, services, notes, booking, details, onChange, onBack, onDone }: {
  expert: Expert;
  industry: IndustryKey | "";
  services: ServiceKey[];
  notes: string;
  booking: Booking;
  details: CompanyDetails;
  onChange: (d: CompanyDetails) => void;
  onBack: () => void;
  onDone: (reference: string) => void;
}) {
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyDetails, string>>>({});

  function validate(): boolean {
    const e: Partial<Record<keyof CompanyDetails, string>> = {};
    if (!details.companyName.trim()) e.companyName = "Company name is required";
    if (!details.country.trim()) e.country = "Country of origin is required";
    if (!details.contactName.trim()) e.contactName = "Contact person is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) e.email = "Enter a valid business email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function confirm() {
    if (!me || !validate()) return;
    setBusy(true);
    const targetExpertId = expert.id || "00000000-0001-0000-0000-000000000001";
    const { data, error } = await supabase.from("consultation_requests").insert({
      company_id: me.id,
      expert_id: targetExpertId,
      expert_name: expert.name.replace(/^Demo\s*—\s*/, ""),
      industry,
      services,
      mode: booking.mode,
      preferred_date: booking.date || null,
      preferred_time: booking.time || null,
      location_notes: booking.locationNotes.trim() || null,
      company_name: details.companyName.trim(),
      country: details.country.trim(),
      contact_name: details.contactName.trim(),
      email: details.email.trim(),
      problem_description: notes.trim() || null,
      fee_inr: expert.rate_inr,
      status: "pending",
    }).select("reference").single();
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["tc-requests"] });
    onDone(data.reference);
  }

  const row = (k: string, v: string) => (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-2xl font-bold">Company details</h2>
        <div className="mt-6 space-y-4">
          <div><Label htmlFor="tc-company">Company name *</Label>
            <Input id="tc-company" className="mt-1" maxLength={120} value={details.companyName} onChange={(e) => onChange({ ...details, companyName: e.target.value })} />
            {errors.companyName && <p className="mt-1 text-xs text-destructive">{errors.companyName}</p>}</div>
          <div><Label htmlFor="tc-country">Country of origin *</Label>
            <Input id="tc-country" className="mt-1" maxLength={60} placeholder="e.g. Japan" value={details.country} onChange={(e) => onChange({ ...details, country: e.target.value })} />
            {errors.country && <p className="mt-1 text-xs text-destructive">{errors.country}</p>}</div>
          <div><Label htmlFor="tc-contact">Contact person's name *</Label>
            <Input id="tc-contact" className="mt-1" maxLength={80} value={details.contactName} onChange={(e) => onChange({ ...details, contactName: e.target.value })} />
            {errors.contactName && <p className="mt-1 text-xs text-destructive">{errors.contactName}</p>}</div>
          <div><Label htmlFor="tc-email">Business email *</Label>
            <Input id="tc-email" className="mt-1" type="email" maxLength={255} value={details.email} onChange={(e) => onChange({ ...details, email: e.target.value })} />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}</div>
          <div><Label>Selected industry</Label>
            <Input className="mt-1" value={industry ? industryName(industry) : ""} disabled /></div>
          <div><Label>Services required</Label>
            <Input className="mt-1" value={services.map(serviceName).join(", ")} disabled /></div>
          <div><Label>Preferred consultation mode</Label>
            <Input className="mt-1" value={booking.mode === "online" ? "Online" : "In person"} disabled /></div>
          <div><Label>Problem description (optional)</Label>
            <Textarea className="mt-1" rows={3} maxLength={1000} value={notes} disabled /></div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Review your request</h2>
        <div className="mt-6 rounded-lg border border-border bg-card p-5 shadow-paper">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-ink-foreground">
              {expert.name.replace(/^Demo — /, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </span>
            <div>
              <div className="font-bold">{expert.name}</div>
              <div className="text-xs text-muted-foreground">
                {expert.designation === "ca" ? "Chartered Accountant" : "Company Secretary"}
                {expert.company ? ` · ${expert.company}` : ""}
                {expert.demo ? " · Demo profile" : ""}
              </div>
            </div>
          </div>
          <div className="divide-y divide-transparent">
            {row("Mode", booking.mode === "online" ? "Online consultation" : "In-person consultation")}
            {row("Date", booking.date ? new Date(`${booking.date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—")}
            {row("Time", booking.time || "—")}
            {row("Fee", expert.rate_inr != null ? `₹${expert.rate_inr.toLocaleString("en-IN")}/hr` : "To be discussed")}
            {booking.mode === "in_person" && row("Location", booking.locationNotes.trim() || [expert.office_address, expert.office_city].filter(Boolean).join(", ") || "To be agreed")}
            {row("Company", details.companyName || "—")}
            {row("Contact", details.contactName ? `${details.contactName} (${details.email || "—"})` : "—")}
          </div>
          <p className="mt-4 rounded bg-muted px-3 py-2 text-xs text-muted-foreground">
            Submitting sends a request with status <span className="font-semibold">Pending Confirmation</span>. It is not a confirmed booking until the professional confirms.
          </p>
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onBack} disabled={busy}>Back</Button>
          <Button onClick={confirm} disabled={busy}>{busy ? "Submitting…" : "Confirm Consultation Request"}</Button>
        </div>
      </div>
    </div>
  );
}
