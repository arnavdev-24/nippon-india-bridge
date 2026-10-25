import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import type { Expert } from "@/lib/tax-compliance";
import type { Booking } from "./BookingStep";
import { Button } from "@/components/ui/button";

export function Confirmation({ reference, expert, booking }: {
  reference: string;
  expert: Expert;
  booking: Booking;
}) {
  const row = (k: string, v: string) => (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span>
    </div>
  );
  return (
    <div className="mx-auto max-w-xl text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
      <h2 className="mt-4 text-2xl font-bold">Consultation request sent</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your request has been sent to the professional. You will be notified when it is confirmed.
      </p>
      <div className="mt-6 rounded-lg border border-border bg-card p-5 text-left shadow-paper">
        {row("Request reference", reference)}
        {row("Professional", expert.name)}
        {row("Requested date", booking.date ? new Date(`${booking.date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—")}
        {row("Requested time", booking.time || "—")}
        {row("Consultation mode", booking.mode === "online" ? "Online" : "In person")}
        <div className="flex justify-between gap-4 py-1.5 text-sm">
          <span className="text-muted-foreground">Booking status</span>
          <span className="rounded-full border border-saffron/60 bg-saffron/10 px-2 py-0.5 text-xs font-semibold text-saffron-foreground">Pending Confirmation</span>
        </div>
      </div>
      <div className="mt-6 rounded-lg bg-muted p-4 text-left text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Next steps</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>The professional reviews your request and confirms or proposes another time.</li>
          <li>Once confirmed, meeting details appear under My Consultations.</li>
          <li>Questions? Contact us at support@nippon2bharat.example.</li>
        </ol>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/consultations"><Button>View My Consultations</Button></Link>
        <Link to="/dashboard"><Button variant="outline">Back to dashboard</Button></Link>
      </div>
    </div>
  );
}
