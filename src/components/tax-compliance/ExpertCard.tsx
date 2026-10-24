import { useState } from "react";
import { BadgeCheck, Globe, MapPin, MonitorSmartphone, Users } from "lucide-react";
import { industryName, serviceName, type Expert } from "@/lib/tax-compliance";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function initials(name: string) {
  return name.replace(/^Demo — /, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function ExpertCard({ expert, onBook }: { expert: Expert; onBook: (e: Expert) => void }) {
  const [open, setOpen] = useState(false);
  const e = expert;

  const body = (
    <>
      {e.bio && <p className="mt-3 text-sm">{e.bio}</p>}
      <dl className="mt-4 space-y-2 text-sm">
        <div><dt className="font-semibold">Areas of specialization</dt><dd className="mt-1 flex flex-wrap gap-1">{e.specializations.map((s) => <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{serviceName(s)}</span>)}</dd></div>
        <div><dt className="font-semibold">Industries served</dt><dd className="mt-1 flex flex-wrap gap-1">{e.industries.map((s) => <span key={s} className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{industryName(s)}</span>)}</dd></div>
        <div><dt className="font-semibold">Qualifications</dt><dd>{e.qualifications ?? "Not provided"}</dd></div>
        <div><dt className="font-semibold">Languages</dt><dd>{e.languages.join(", ") || "English"}</dd></div>
        {e.offers_in_person && (e.office_address || e.office_city) && (
          <div><dt className="font-semibold">Office</dt><dd>{[e.office_address, e.office_city].filter(Boolean).join(", ")}</dd></div>
        )}
      </dl>
    </>
  );

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-paper">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-ink-foreground">
          {initials(e.name)}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold">{e.name}</h3>
            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
              {e.designation === "ca" ? "CA" : "CS"}
            </span>
            {e.verified ? (
              <span className="flex items-center gap-1 text-xs font-medium text-success"><BadgeCheck className="h-3.5 w-3.5" /> Verified</span>
            ) : (
              <span className="text-xs text-muted-foreground">Not yet verified</span>
            )}
            {e.demo && <span className="rounded bg-saffron/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-saffron-foreground uppercase">Demo profile</span>}
          </div>
          {e.company && <div className="text-sm text-muted-foreground">{e.company}</div>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {e.years_experience != null && <span>{e.years_experience} yrs experience</span>}
        {(e.city || e.state) && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{[e.city, e.state].filter(Boolean).join(", ")}</span>}
        <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{e.languages.join(", ") || "English"}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {e.industries.slice(0, 3).map((s) => <span key={s} className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{industryName(s)}</span>)}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        {e.offers_online && <span className="flex items-center gap-1"><MonitorSmartphone className="h-3.5 w-3.5" /> Online</span>}
        {e.offers_in_person && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> In person</span>}
        {e.rate_inr != null && <span className="ml-auto text-sm font-semibold text-foreground">₹{e.rate_inr.toLocaleString("en-IN")}/hr</span>}
      </div>

      <div className="mt-4 flex gap-2 border-t border-border pt-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="outline" size="sm" className="flex-1">View Profile</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{e.name} — {e.designation === "ca" ? "Chartered Accountant" : "Company Secretary"}</DialogTitle></DialogHeader>
            {e.demo && <p className="rounded bg-saffron/15 px-3 py-2 text-xs text-saffron-foreground">This is a demo profile shown for illustration. It is not a real, verified professional.</p>}
            {body}
          </DialogContent>
        </Dialog>
        <Button size="sm" className="flex-1" onClick={() => onBook(e)}>Book a Consultation</Button>
      </div>
    </div>
  );
}
