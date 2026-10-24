import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Empty } from "@/components/PageHeader";
import { RequestDialog } from "@/components/RequestDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMyProfile } from "@/lib/profile";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/joint-ventures")({
  head: () => ({ meta: [{ title: "Joint Ventures — nippon2japan" }, { name: "description", content: "Find Japan–India joint venture partners." }, { property: "og:title", content: "Joint Ventures" }, { property: "og:description", content: "Post and browse JV proposals." }] }),
  component: JV,
});

function JV() {
  const { t } = useT();
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"all" | "japanese_partner" | "indian_partner">("all");
  const { data = [] } = useQuery({
    queryKey: ["jv"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jv_proposals").select("*, owner:profiles!jv_proposals_owner_id_fkey(full_name, company_name, account_type)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const list = tab === "all" ? data : data.filter((p) => p.seeking === tab);

  async function remove(id: string) {
    const { error } = await supabase.from("jv_proposals").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["jv"] });
  }

  return (
    <>
      <PageHeader kanji="合" title={t("jv")} desc={t("jvDesc")} action={<NewProposal />} />
      <div className="mb-8 rounded-lg bg-ink p-6 text-ink-foreground">
        <div className="text-xs tracking-widest text-saffron uppercase">Case study</div>
        <h3 className="mt-2 text-2xl font-bold">Maruti Suzuki — 1982</h3>
        <p className="mt-2 max-w-3xl text-sm opacity-80">Suzuki Motor Corporation partnered with India's Maruti Udyog. Japanese engineering + Indian scale created India's largest carmaker — still ~40% market share today.</p>
      </div>
      <div className="mb-6 flex gap-2">
        {([["all", "All"], ["japanese_partner", "Seeking Japanese partner"], ["indian_partner", "Seeking Indian partner"]] as const).map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full border px-4 py-1.5 text-sm ${tab === k ? "border-ink bg-ink text-ink-foreground" : "border-border text-muted-foreground"}`}>{v}</button>
        ))}
      </div>
      {list.length === 0 ? <Empty>No proposals yet. Be the first to post one.</Empty> : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((p) => (
            <div key={p.id} className="rounded-lg border border-border bg-card p-6 shadow-paper">
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-accent px-2 py-0.5 text-accent-foreground">{p.industry || "General"}</span>
                <span className="text-muted-foreground">{p.seeking === "japanese_partner" ? "🇯🇵 Seeking Japanese partner" : "🇮🇳 Seeking Indian partner"}</span>
              </div>
              <h3 className="mt-3 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="text-sm">
                  <div className="font-medium">{p.owner?.company_name || p.owner?.full_name}</div>
                  {p.investment_range && <div className="text-xs text-muted-foreground">Investment: {p.investment_range}</div>}
                </div>
                {me?.id === p.owner_id ? (
                  <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 /></Button>
                ) : (
                  <RequestDialog toUser={p.owner_id} toName={p.owner?.company_name || "owner"} kind="jv" label="Express interest" defaultMessage={`We're interested in your proposal "${p.title}".`} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function NewProposal() {
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", description: "", industry: "", investment_range: "", seeking: me?.account_type === "indian_company" ? "japanese_partner" : "indian_partner" });
  async function save() {
    if (!me) return;
    const { error } = await supabase.from("jv_proposals").insert({ ...f, owner_id: me.id });
    if (error) { toast.error(error.message); return; }
    toast.success("Proposal posted");
    qc.invalidateQueries({ queryKey: ["jv"] });
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus /> Post proposal</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New joint venture proposal</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input className="mt-1" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea className="mt-1" rows={4} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Industry</Label><Input className="mt-1" value={f.industry} onChange={(e) => setF({ ...f, industry: e.target.value })} /></div>
            <div><Label>Investment range</Label><Input className="mt-1" placeholder="₹5–20 Cr" value={f.investment_range} onChange={(e) => setF({ ...f, investment_range: e.target.value })} /></div>
          </div>
          <div><Label>Looking for</Label>
            <select className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={f.seeking} onChange={(e) => setF({ ...f, seeking: e.target.value })}>
              <option value="indian_partner">Indian partner</option>
              <option value="japanese_partner">Japanese partner</option>
            </select>
          </div>
          <Button className="w-full" onClick={save} disabled={!f.title || !f.description}>Post</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
