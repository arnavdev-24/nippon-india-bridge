import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Empty } from "@/components/PageHeader";
import { INDUSTRIES, SERVICES, STATUS_META, industryName, serviceName } from "@/lib/tax-compliance";
import { useMyProfile } from "@/lib/profile";
import { useRole } from "@/lib/role-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/integrations/supabase/types";

type Request = Tables<"consultation_requests">;

export const Route = createFileRoute("/_authenticated/consultations")({
  head: () => ({
    meta: [
      { title: "My Consultations — nippon2japan" },
      { name: "description", content: "Track your tax and compliance consultation requests." },
      { property: "og:title", content: "My Consultations" },
      { property: "og:description", content: "Pending, confirmed and completed consultations with Indian compliance experts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Consultations,
});

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, className: "border-border bg-muted text-muted-foreground" };
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${meta.className}`}>{meta.label}</span>;
}

function RequestCard({ r, role, onAction }: {
  r: Request;
  role: "company" | "expert";
  onAction: (id: string, status: "pending" | "confirmed" | "completed" | "cancelled", patch?: Partial<Request>) => Promise<void>;
}) {
  const [rescheduling, setRescheduling] = useState(false);
  const [date, setDate] = useState(r.preferred_date ?? "");
  const [time, setTime] = useState(r.preferred_time ?? "");
  const row = (k: string, v: string | null) => v ? (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span>
    </div>
  ) : null;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-paper">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="font-mono text-xs text-muted-foreground">{r.reference}</span>
          <h3 className="font-bold">{role === "company" ? r.expert_name : r.company_name}</h3>
        </div>
        <StatusBadge status={r.status} />
      </div>
      <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
        <div>
          {row("Mode", r.mode === "online" ? "Online" : "In person")}
          {row("Date", r.preferred_date ? new Date(`${r.preferred_date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : null)}
          {row("Time", r.preferred_time)}
          {row("Fee", r.fee_inr != null ? `₹${r.fee_inr.toLocaleString("en-IN")}/hr` : null)}
        </div>
        <div>
          {row("Industry", industryName(r.industry))}
          {row("Services", r.services.map(serviceName).join(", "))}
          {row("Location", r.location_notes)}
        </div>
      </div>
      {r.problem_description && <p className="mt-2 rounded bg-muted px-3 py-2 text-xs text-muted-foreground">{r.problem_description}</p>}

      {rescheduling && (
        <div className="mt-3 flex flex-wrap items-end gap-2 rounded-md border border-border p-3">
          <div><Label>New date</Label><Input type="date" className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><Label>New time</Label><Input className="mt-1" placeholder="e.g. 14:00" value={time} onChange={(e) => setTime(e.target.value)} /></div>
          <Button size="sm" disabled={!date || !time}
            onClick={async () => { await onAction(r.id, "pending", { preferred_date: date, preferred_time: time }); setRescheduling(false); }}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setRescheduling(false)}>Close</Button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        {role === "expert" && r.status === "pending" && (
          <Button size="sm" onClick={() => onAction(r.id, "confirmed")}>Confirm consultation</Button>
        )}
        {role === "expert" && r.status === "confirmed" && (
          <Button size="sm" variant="outline" onClick={() => onAction(r.id, "completed")}>Mark completed</Button>
        )}
        {role === "company" && r.status === "pending" && !rescheduling && (
          <Button size="sm" variant="outline" onClick={() => setRescheduling(true)}>Reschedule</Button>
        )}
        {(r.status === "pending" || r.status === "confirmed") && (
          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onAction(r.id, "cancelled")}>Cancel</Button>
        )}
        {role === "company" && (
          <span className="ml-auto self-center text-xs text-muted-foreground">Contact the professional via Connections once confirmed.</span>
        )}
      </div>
    </div>
  );
}

function Consultations() {
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const { effectiveRole } = useRole();
  const isExpert = effectiveRole === "expert";

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["tc-requests", me?.id],
    enabled: !!me,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultation_requests").select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function setStatus(id: string, status: "confirmed" | "completed" | "cancelled" | "pending", patch: Partial<Request> = {}) {
    const { error } = await supabase.from("consultation_requests").update({ ...patch, status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["tc-requests"] });
  }

  const mine = requests.filter((r) => r.company_id === me?.id);
  const incoming = requests.filter((r) => r.expert_id === me?.id);
  const groups: { key: string; label: string; list: Request[] }[] = [
    { key: "pending", label: "Pending", list: mine.filter((r) => r.status === "pending") },
    { key: "confirmed", label: "Confirmed", list: mine.filter((r) => r.status === "confirmed") },
    { key: "completed", label: "Completed", list: mine.filter((r) => r.status === "completed") },
    { key: "cancelled", label: "Cancelled", list: mine.filter((r) => r.status === "cancelled") },
  ];

  return (
    <>
      <PageHeader kanji="相" title="My Consultations" desc="Track consultation requests with Indian compliance experts." />
      {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
        <div className="space-y-10">
          {groups.map((g) => (
            <section key={g.key}>
              <h2 className="mb-3 text-lg font-bold">{g.label} <span className="text-sm font-normal text-muted-foreground">({g.list.length})</span></h2>
              {g.list.length === 0 ? <Empty>No {g.label.toLowerCase()} consultations.</Empty> : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {g.list.map((r) => <RequestCard key={r.id} r={r} role="company" onAction={setStatus} />)}
                </div>
              )}
            </section>
          ))}

          {isExpert && (
            <section className="border-t border-border pt-8">
              <h2 className="mb-3 text-lg font-bold">Incoming requests to you</h2>
              {incoming.length === 0 ? <Empty>No requests yet.</Empty> : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {incoming.map((r) => <RequestCard key={r.id} r={r} role="expert" onAction={setStatus} />)}
                </div>
              )}
              <ExpertSettings />
            </section>
          )}
        </div>
      )}
    </>
  );
}

function ExpertSettings() {
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const selectCls = "h-9 w-full rounded-md border border-input bg-background px-2 text-sm";

  const { data: ep } = useQuery({
    queryKey: ["tc-my-expert-profile", me?.id],
    enabled: !!me,
    queryFn: async () => {
      const { data, error } = await supabase.from("expert_profiles").select("*").eq("expert_id", me!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: avail = [] } = useQuery({
    queryKey: ["tc-my-availability", me?.id],
    enabled: !!me,
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase.from("expert_availability").select("*")
        .eq("expert_id", me!.id).gte("available_date", today).order("available_date");
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState<{ industries: string[]; specializations: string[]; languages: string; qualifications: string; years: string; online: boolean; inPerson: boolean; office: string; officeCity: string } | null>(null);
  const f = form ?? {
    industries: ep?.industries ?? [], specializations: ep?.specializations ?? [],
    languages: (ep?.languages ?? ["English"]).join(", "), qualifications: ep?.qualifications ?? "",
    years: ep?.years_experience != null ? String(ep.years_experience) : "",
    online: ep?.offers_online ?? true, inPerson: ep?.offers_in_person ?? false,
    office: ep?.office_address ?? "", officeCity: ep?.office_city ?? "",
  };

  const [slot, setSlot] = useState({ date: "", times: "", mode: "both" });

  async function saveProfile() {
    if (!me) return;
    const payload = {
      expert_id: me.id,
      industries: f.industries, specializations: f.specializations,
      languages: f.languages.split(",").map((s) => s.trim()).filter(Boolean),
      qualifications: f.qualifications.trim() || null,
      years_experience: f.years ? Number(f.years) : null,
      offers_online: f.online, offers_in_person: f.inPerson,
      office_address: f.office.trim() || null, office_city: f.officeCity.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("expert_profiles").upsert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Expert profile saved");
    qc.invalidateQueries({ queryKey: ["tc-my-expert-profile"] });
    qc.invalidateQueries({ queryKey: ["tc-experts"] });
  }

  async function addAvailability() {
    if (!me || !slot.date) return;
    const slots = slot.times.split(",").map((s) => s.trim()).filter(Boolean);
    if (!slots.length) { toast.error("Enter at least one time slot"); return; }
    const { error } = await supabase.from("expert_availability").upsert(
      { expert_id: me.id, available_date: slot.date, slots, mode: slot.mode },
      { onConflict: "expert_id,available_date,mode" },
    );
    if (error) { toast.error(error.message); return; }
    toast.success("Availability saved");
    setSlot({ date: "", times: "", mode: "both" });
    qc.invalidateQueries({ queryKey: ["tc-my-availability"] });
  }

  async function removeAvailability(id: string) {
    const { error } = await supabase.from("expert_availability").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["tc-my-availability"] });
  }

  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-card p-5 shadow-paper">
        <h3 className="font-bold">Your expert profile</h3>
        <p className="mt-1 text-xs text-muted-foreground">Shown to companies in Tax & Compliance Connect matching.</p>
        <div className="mt-4 space-y-4">
          <div>
            <Label>Industries served</Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {INDUSTRIES.map((i) => (
                <button key={i.key} onClick={() => setForm({ ...f, industries: toggle(f.industries, i.key) })}
                  className={`rounded-full border px-2.5 py-1 text-xs ${f.industries.includes(i.key) ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}>
                  {i.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Specializations</Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SERVICES.filter((s) => s.key !== "not_sure").map((s) => (
                <button key={s.key} onClick={() => setForm({ ...f, specializations: toggle(f.specializations, s.key) })}
                  className={`rounded-full border px-2.5 py-1 text-xs ${f.specializations.includes(s.key) ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Languages (comma separated)</Label><Input className="mt-1" value={f.languages} onChange={(e) => setForm({ ...f, languages: e.target.value })} /></div>
            <div><Label>Years of experience</Label><Input className="mt-1" type="number" min={0} value={f.years} onChange={(e) => setForm({ ...f, years: e.target.value })} /></div>
            <div><Label>Qualifications</Label><Input className="mt-1" placeholder="e.g. FCA, DISA" value={f.qualifications} onChange={(e) => setForm({ ...f, qualifications: e.target.value })} /></div>
            <div className="flex items-end gap-4 pb-1 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={f.online} onChange={(e) => setForm({ ...f, online: e.target.checked })} /> Online</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={f.inPerson} onChange={(e) => setForm({ ...f, inPerson: e.target.checked })} /> In person</label>
            </div>
            <div><Label>Office address</Label><Input className="mt-1" value={f.office} onChange={(e) => setForm({ ...f, office: e.target.value })} /></div>
            <div><Label>Office city</Label><Input className="mt-1" value={f.officeCity} onChange={(e) => setForm({ ...f, officeCity: e.target.value })} /></div>
          </div>
          <p className="text-xs text-muted-foreground">Verification status is granted by the platform after document review — it cannot be self-assigned.</p>
          <Button size="sm" onClick={saveProfile}>Save expert profile</Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-paper">
        <h3 className="font-bold">Your availability</h3>
        <p className="mt-1 text-xs text-muted-foreground">Only dates and slots you publish here are shown as real bookable times.</p>
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <div><Label>Date</Label><Input type="date" className="mt-1" value={slot.date} onChange={(e) => setSlot({ ...slot, date: e.target.value })} /></div>
          <div><Label>Slots (comma separated)</Label><Input className="mt-1" placeholder="10:00, 14:00" value={slot.times} onChange={(e) => setSlot({ ...slot, times: e.target.value })} /></div>
          <div><Label>Mode</Label>
            <select className={`${selectCls} mt-1`} value={slot.mode} onChange={(e) => setSlot({ ...slot, mode: e.target.value })}>
              <option value="both">Both</option><option value="online">Online</option><option value="in_person">In person</option>
            </select></div>
          <Button size="sm" onClick={addAvailability} disabled={!slot.date}>Add</Button>
        </div>
        <ul className="mt-4 space-y-2">
          {avail.length === 0 && <li className="text-xs text-muted-foreground">No upcoming availability published.</li>}
          {avail.map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded border border-border px-3 py-2 text-sm">
              <span>{a.available_date} · {a.slots.join(", ")} · <span className="text-muted-foreground">{a.mode}</span></span>
              <button className="text-xs text-destructive" onClick={() => removeAvailability(a.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
