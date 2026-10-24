import { CAMPAIGN_STATUSES, STATUS_LABEL, type CampaignStatus } from "@/lib/campaigns";

export function StatusBadge({ status }: { status: string }) {
  const s = status as CampaignStatus;
  const tone = s === "delivered" ? "border-success text-success" : s === "draft" ? "border-border text-muted-foreground" : "border-primary/50 text-primary";
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${tone}`}>{STATUS_LABEL[s] ?? status}</span>;
}

export function StatusTrack({ status }: { status: string }) {
  const idx = CAMPAIGN_STATUSES.indexOf(status as CampaignStatus);
  return (
    <ol className="mb-8 flex flex-wrap gap-1 text-xs">
      {CAMPAIGN_STATUSES.map((s, i) => (
        <li key={s} className={`flex-1 min-w-[90px] border-t-2 pt-2 ${i <= idx ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}>
          <span className="font-medium">{i + 1}. {STATUS_LABEL[s]}</span>
        </li>
      ))}
    </ol>
  );
}

export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string | undefined }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-paper">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
