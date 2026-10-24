import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Empty } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useMyProfile } from "@/lib/profile";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/connections")({
  head: () => ({ meta: [{ title: "Connections — nippon2japan" }, { name: "description", content: "Your connection requests." }, { property: "og:title", content: "Connections" }, { property: "og:description", content: "Manage requests with advisors, partners and tutors." }] }),
  component: Connections,
});

const KIND: Record<string, string> = { advisory: "Tax & compliance", jv: "Joint venture", tutoring: "Language training", distribution: "Distribution" };

function Connections() {
  const { t } = useT();
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["connections", me?.id],
    enabled: !!me,
    queryFn: async () => {
      const { data, error } = await supabase.from("connection_requests")
        .select("*, from:profiles!connection_requests_from_user_fkey(full_name, company_name), to:profiles!connection_requests_to_user_fkey(full_name, company_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  async function respond(id: string, status: "accepted" | "declined") {
    const { error } = await supabase.from("connection_requests").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["connections"] });
  }
  const incoming = data.filter((r) => r.to_user === me?.id);
  const outgoing = data.filter((r) => r.from_user === me?.id);

  return (
    <>
      <PageHeader kanji="縁" title={t("connections")} />
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-bold">Received</h2>
          {incoming.length === 0 ? <Empty>No requests yet.</Empty> : incoming.map((r) => (
            <Row key={r.id} name={r.from?.company_name || r.from?.full_name} kind={r.kind} msg={r.message} status={r.status}
              actions={r.status === "pending" && <div className="flex gap-2"><Button size="sm" onClick={() => respond(r.id, "accepted")}>Accept</Button><Button size="sm" variant="outline" onClick={() => respond(r.id, "declined")}>Decline</Button></div>} />
          ))}
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold">Sent</h2>
          {outgoing.length === 0 ? <Empty>You haven't reached out yet.</Empty> : outgoing.map((r) => (
            <Row key={r.id} name={r.to?.company_name || r.to?.full_name} kind={r.kind} msg={r.message} status={r.status} />
          ))}
        </section>
      </div>
    </>
  );
}

function Row({ name, kind, msg, status, actions }: { name?: string | null; kind: string; msg: string | null; status: string; actions?: React.ReactNode }) {
  const color = status === "accepted" ? "text-success" : status === "declined" ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="mb-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div><b>{name || "Unknown"}</b> <span className="text-xs text-muted-foreground">· {KIND[kind]}</span></div>
        <span className={`text-xs capitalize ${color}`}>{status}</span>
      </div>
      {msg && <p className="mt-2 text-sm text-muted-foreground">{msg}</p>}
      {actions && <div className="mt-3">{actions}</div>}
    </div>
  );
}
