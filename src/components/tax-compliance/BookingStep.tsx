import { useQuery } from "@tanstack/react-query";
import { MapPin, MonitorSmartphone, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { demoSlots, type Expert } from "@/lib/tax-compliance";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type Booking = { mode: "" | "online" | "in_person"; date: string; time: string; locationNotes: string };

export function BookingStep({ expert, booking, onChange, onBack, onNext }: {
  expert: Expert;
  booking: Booking;
  onChange: (b: Booking) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { data: availability, isLoading } = useQuery({
    queryKey: ["tc-availability", expert.id],
    enabled: !!expert.id,
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("expert_availability").select("*")
        .eq("expert_id", expert.id!).gte("available_date", today)
        .order("available_date", { ascending: true }).limit(30);
      if (error) throw error;
      return data;
    },
  });

  // Real slots published by the expert; otherwise clearly labelled demo slots.
  const realDates = (availability ?? [])
    .filter((a) => booking.mode === "" || a.mode === "both" || a.mode === booking.mode)
    .filter((a) => a.slots.length > 0);
  const usingDemo = realDates.length === 0;
  const dates: { date: string; slots: string[] }[] = usingDemo
    ? demoSlots()
    : realDates.map((a) => ({ date: a.available_date, slots: a.slots }));

  const canContinue = booking.mode !== "" && booking.date !== "" && booking.time !== "";

  return (
    <div>
      <h2 className="text-2xl font-bold">How would you like to meet your expert?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Booking with {expert.name}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {expert.offers_online && (
          <button
            onClick={() => onChange({ ...booking, mode: "online", date: "", time: "" })}
            className={`rounded-lg border bg-card p-5 text-left shadow-paper ${booking.mode === "online" ? "border-primary ring-1 ring-ring" : "border-border hover:border-primary/50"}`}
          >
            <MonitorSmartphone className="h-6 w-6 text-primary" />
            <div className="mt-3 font-bold">Online Consultation</div>
            <div className="mt-1 text-xs text-muted-foreground">Video meeting — pick a date and time slot below.</div>
          </button>
        )}
        {expert.offers_in_person && (
          <button
            onClick={() => onChange({ ...booking, mode: "in_person", date: "", time: "" })}
            className={`rounded-lg border bg-card p-5 text-left shadow-paper ${booking.mode === "in_person" ? "border-primary ring-1 ring-ring" : "border-border hover:border-primary/50"}`}
          >
            <Users className="h-6 w-6 text-primary" />
            <div className="mt-3 font-bold">In-Person Consultation</div>
            <div className="mt-1 text-xs text-muted-foreground">Meet at the expert's office or a mutually agreed location.</div>
          </button>
        )}
      </div>

      {booking.mode === "in_person" && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4 text-sm">
          {expert.office_address || expert.office_city ? (
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span><span className="font-semibold">Expert's office:</span> {[expert.office_address, expert.office_city].filter(Boolean).join(", ")}</span></p>
          ) : (
            <p className="text-muted-foreground">Office location will be shared once the expert confirms.</p>
          )}
          <div className="mt-3">
            <Label htmlFor="tc-loc">Preferred meeting location (optional, subject to mutual agreement)</Label>
            <Textarea id="tc-loc" className="mt-2" rows={2} maxLength={300} value={booking.locationNotes}
              onChange={(e) => onChange({ ...booking, locationNotes: e.target.value })}
              placeholder="e.g. Our hotel in Chennai, or your office" />
          </div>
        </div>
      )}

      {booking.mode !== "" && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Select a date and time</h3>
            {usingDemo && (
              <span className="rounded bg-saffron/15 px-2 py-1 text-xs font-medium text-saffron-foreground">
                Demo slots — illustrative only; the expert has not published a live calendar
              </span>
            )}
          </div>
          {isLoading && expert.id ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading availability…</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {dates.map((d) => (
                <div key={d.date} className="rounded-lg border border-border bg-card p-3">
                  <div className="text-sm font-bold">
                    {new Date(`${d.date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {d.slots.map((t) => {
                      const active = booking.date === d.date && booking.time === t;
                      return (
                        <button key={t} onClick={() => onChange({ ...booking, date: d.date, time: t })}
                          className={`rounded border px-2 py-1 text-xs ${active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Your request is sent as <span className="font-semibold">Pending Confirmation</span> — nothing is booked until the professional confirms.
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!canContinue}>Continue</Button>
      </div>
    </div>
  );
}
