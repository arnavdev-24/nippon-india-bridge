import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Empty } from "@/components/PageHeader";
import { Kpi, StatusBadge } from "@/components/campaigns/CampaignStatus";
import { useMyProfile } from "@/lib/profile";
import { DEMO_CAMPAIGNS } from "@/lib/campaigns-demo";

const TABS = {
  active: ["submitted", "quoted", "accepted", "fieldwork_live", "data_review", "report_ready"],
  draft: ["draft"],
  delivered: ["delivered"],
} as const;

const DEMO_CAMPAIGNS_LIST = DEMO_CAMPAIGNS.map((c) => ({
  id: c.id,
  product_name_en: c.product_name_en,
  product_name_jp: c.product_name_jp,
  industry: c.industry,
  status: c.status,
  target_responses: c.target_responses,
  deadline: c.deadline,
  target_states: c.target_states,
  quote_price_inr: c.quote_price_inr,
  created_at: c.created_at,
  campaign_responses: [{ count: c.status === "report_ready" ? 20 : c.status === "delivered" ? 25 : 14 }],
}));

export function CampaignList({ role }: { role: "sme" | "vendor" }) {
  const { data: me } = useMyProfile();
  const [tab, setTab] = useState<keyof typeof TABS>(role === "vendor" ? "active" : "active");
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["campaigns", role, me?.id], enabled: !!me,
    queryFn: async () => {
      const q = supabase.from("survey_campaigns").select("id, product_name_en, product_name_jp, industry, status, target_responses, deadline, target_states, quote_price_inr, created_at, campaign_responses(count)").order("created_at", { ascending: false });
      const { data, error } = await (role === "sme" ? q.eq("sme_id", me!.id) : q.eq("vendor_id", me!.id));
      if (error) {
        console.warn("Could not load user campaigns, fallback to defaults:", error.message);
        return [];
      }
      return data ?? [];
    },
  });
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading campaigns…</p>;
  if (error) return <p className="text-sm text-destructive">Could not load campaigns: {(error as Error).message}</p>;

  const existingIds = new Set(data.map((c) => c.id));
  const allCampaigns = [...data, ...DEMO_CAMPAIGNS_LIST.filter((d) => !existingIds.has(d.id))];

  const rows = allCampaigns.filter((c) => (TABS[tab] as readonly string[]).includes(c.status));
  const count = (c: (typeof allCampaigns)[number]) => (c.campaign_responses as unknown as { count: number }[])[0]?.count ?? 0;
  const waiting = role === "sme" ? allCampaigns.filter((c) => c.status === "quoted" || c.status === "report_ready").length : allCampaigns.filter((c) => c.status === "submitted" || c.status === "accepted").length;
  return (
    <>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={role === "sme" ? "Campaigns" : "Assigned requests"} value={String(allCampaigns.length)} />
        <Kpi label="Fieldwork live" value={String(allCampaigns.filter((c) => c.status === "fieldwork_live").length)} />
        <Kpi label="Needs your action" value={String(waiting)} />
        <Kpi label="Delivered reports" value={String(allCampaigns.filter((c) => c.status === "delivered").length)} />
      </div>
      <div className="mb-4 flex gap-1 border-b border-border">
        {(Object.keys(TABS) as (keyof typeof TABS)[]).filter((t) => role === "sme" || t !== "draft").map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-4 py-2 text-sm capitalize ${tab === t ? "border-primary font-medium text-primary" : "border-transparent text-muted-foreground"}`}>
            {t} ({allCampaigns.filter((c) => (TABS[t] as readonly string[]).includes(c.status)).length})
          </button>
        ))}
      </div>
      {rows.length === 0 ? <Empty>{role === "sme" ? "No campaigns here yet." : "No campaign requests assigned to you here."}</Empty> : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground"><tr><th className="p-3">Product</th><th className="p-3">Industry</th><th className="p-3">States</th><th className="p-3">Responses</th><th className="p-3">Deadline</th><th className="p-3">Status</th></tr></thead>
            <tbody className="divide-y divide-border">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40">
                  <td className="p-3">
                    <Link to="/campaigns/$id" params={{ id: c.id }} className="font-semibold hover:text-primary">
                      {c.product_name_en}
                    </Link>
                    {c.id.startsWith("demo-") && (
                      <span className="ml-2 inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        Example
                      </span>
                    )}
                    {c.product_name_jp && <div className="text-xs text-muted-foreground">{c.product_name_jp}</div>}
                  </td>
                  <td className="p-3">{c.industry}</td>
                  <td className="p-3 text-xs">{c.target_states.join(", ") || "—"}</td>
                  <td className="p-3">{role === "vendor" || ["report_ready", "delivered"].includes(c.status) ? `${count(c)} / ${c.target_responses}` : `— / ${c.target_responses}`}</td>
                  <td className="p-3 text-xs">{c.deadline ?? "—"}</td>
                  <td className="p-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
