import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, X, IndianRupee, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Empty } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { isIndianSide, useMyProfile } from "@/lib/profile";
import { useT } from "@/lib/i18n";
import { CampaignBuilder } from "@/components/campaigns/CampaignBuilder";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { SampleReportButton } from "@/components/campaigns/SampleReport";

export const Route = createFileRoute("/_authenticated/surveys")({
  head: () => ({ meta: [{ title: "Dealer Surveys — nippon2japan" }, { name: "description", content: "Paid questionnaires answered by Indian dealers and vendors." }, { property: "og:title", content: "Dealer Surveys" }, { property: "og:description", content: "Real field insight from local dealers." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Surveys,
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Surveys() {
  const { t } = useT();
  const { data: me } = useMyProfile();
  const company = me?.account_type === "japanese_company";
  const dealer = isIndianSide(me);
  const [tab, setTab] = useState<"campaigns" | "questionnaires">("campaigns");
  return (
    <>
      <PageHeader kanji="調" title={t("surveys")} desc={t("surveysDesc")}
        action={<div className="flex flex-wrap gap-2"><SampleReportButton />{company ? (tab === "campaigns" ? <CampaignBuilder /> : <NewSurvey />) : null}</div>} />
      {(company || dealer) && (
        <div className="mb-6 flex gap-1 rounded-md border border-border bg-card p-1 text-sm w-fit">
          {([["campaigns", "Product Campaigns"], ["questionnaires", "Paid Questionnaires"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded px-4 py-1.5 ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      )}
      {tab === "campaigns" && (company || dealer) ? <CampaignList role={company ? "sme" : "vendor"} />
        : company ? <CompanyView /> : dealer ? <DealerView /> : (
        <Empty>Surveys are created by companies and answered by dealers/vendors.</Empty>
      )}
    </>
  );
}

function CompanyView() {
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["my-surveys", me?.id],
    enabled: !!me,
    queryFn: async () => {
      const { data, error } = await supabase.from("surveys")
        .select("*, survey_responses(*, dealer:profiles!survey_responses_dealer_id_fkey(full_name, company_name, city, state))")
        .eq("company_id", me!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function markPaid(id: string) {
    const { error } = await supabase.from("survey_responses").update({ payout_status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Marked as paid");
    qc.invalidateQueries({ queryKey: ["my-surveys"] });
  }
  async function toggle(id: string, status: string) {
    await supabase.from("surveys").update({ status: status === "open" ? "closed" : "open" }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["my-surveys"] });
  }

  if (data.length === 0) return <Empty>Create your first survey to collect insight from Indian dealers.</Empty>;
  return (
    <div className="space-y-6">
      {data.map((s) => {
        const owed = s.survey_responses.filter((r) => r.payout_status === "pending").length * s.reward_inr;
        return (
          <div key={s.id} className="rounded-lg border border-border bg-card shadow-paper">
            <div className="flex flex-wrap items-start justify-between gap-4 p-6">
              <div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-2 text-xs text-muted-foreground">{(s.questions as string[]).length} questions · {inr(s.reward_inr)} per response</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Payouts pending</div>
                <div className="font-display text-2xl font-bold text-primary">{inr(owed)}</div>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => toggle(s.id, s.status)}>{s.status === "open" ? "Close survey" : "Reopen"}</Button>
              </div>
            </div>
            {s.survey_responses.length > 0 && (
              <div className="divide-y divide-border border-t border-border">
                {s.survey_responses.map((r) => (
                  <details key={r.id} className="px-6 py-3">
                    <summary className="flex cursor-pointer items-center justify-between text-sm">
                      <span><b>{r.dealer?.company_name || r.dealer?.full_name}</b> <span className="text-muted-foreground">{[r.dealer?.city, r.dealer?.state].filter(Boolean).join(", ")}</span></span>
                      {r.payout_status === "paid"
                        ? <span className="flex items-center gap-1 text-success"><CheckCircle2 className="h-4 w-4" /> Paid</span>
                        : <Button size="sm" variant="saffron" onClick={(e) => { e.preventDefault(); markPaid(r.id); }}><IndianRupee /> Mark {inr(s.reward_inr)} paid</Button>}
                    </summary>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
                      {(s.questions as string[]).map((q, i) => (
                        <li key={i}><div className="text-muted-foreground">{q}</div><div>{(r.answers as string[])[i] || "—"}</div></li>
                      ))}
                    </ol>
                  </details>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DealerView() {
  const { data: me } = useMyProfile();
  const { data } = useQuery({
    queryKey: ["dealer-surveys", me?.id],
    enabled: !!me,
    queryFn: async () => {
      const [s, r] = await Promise.all([
        supabase.from("surveys").select("*, company:profiles!surveys_company_id_fkey(company_name, full_name)").eq("status", "open").order("created_at", { ascending: false }),
        supabase.from("survey_responses").select("*").eq("dealer_id", me!.id),
      ]);
      if (s.error) throw s.error;
      if (r.error) throw r.error;
      return { surveys: s.data, responses: r.data };
    },
  });
  if (!data) return null;
  const earned = data.responses.filter((r) => r.payout_status === "paid").length;
  const answered = new Map(data.responses.map((r) => [r.survey_id, r]));
  return (
    <>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Stat label="Surveys completed" value={String(data.responses.length)} />
        <Stat label="Payments received" value={String(earned)} />
        <Stat label="Payments pending" value={String(data.responses.length - earned)} />
      </div>
      {data.surveys.length === 0 ? <Empty>No open surveys right now. Check back soon.</Empty> : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.surveys.map((s) => {
            const r = answered.get(s.id);
            return (
              <div key={s.id} className="rounded-lg border border-border bg-card p-6 shadow-paper">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.company?.company_name || s.company?.full_name}</span>
                  <span className="font-display text-lg font-bold text-primary">{inr(s.reward_inr)}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-4">
                  {r ? <span className="text-sm text-success">Submitted · {r.payout_status === "paid" ? "Paid" : "Payment pending"}</span>
                    : <AnswerDialog survey={s} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-border bg-card p-4"><div className="text-xs text-muted-foreground">{label}</div><div className="font-display text-2xl font-bold">{value}</div></div>;
}

function AnswerDialog({ survey }: { survey: { id: string; title: string; questions: unknown } }) {
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const qs = survey.questions as string[];
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>(qs.map(() => ""));
  async function submit() {
    if (!me) return;
    const { error } = await supabase.from("survey_responses").insert({ survey_id: survey.id, dealer_id: me.id, answers: answers.map((a) => a.slice(0, 2000)) });
    if (error) { toast.error(error.message); return; }
    toast.success("Thank you! Your response was submitted.");
    qc.invalidateQueries({ queryKey: ["dealer-surveys"] });
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>Answer survey</Button></DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{survey.title}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          {qs.map((q, i) => (
            <div key={i}><Label>{i + 1}. {q}</Label>
              <Textarea className="mt-1" rows={2} value={answers[i]} onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))} /></div>
          ))}
          <Button className="w-full" onClick={submit} disabled={answers.some((a) => !a.trim())}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NewSurvey() {
  const { data: me } = useMyProfile();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", description: "", reward_inr: 500 });
  const [qs, setQs] = useState<string[]>(["How do customers in your area perceive Japanese products?", ""]);
  async function save() {
    if (!me) return;
    const questions = qs.map((q) => q.trim()).filter(Boolean);
    const { error } = await supabase.from("surveys").insert({ ...f, company_id: me.id, questions });
    if (error) { toast.error(error.message); return; }
    toast.success("Survey published to dealers");
    qc.invalidateQueries({ queryKey: ["my-surveys"] });
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus /> New survey</Button></DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New dealer survey</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input className="mt-1" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea className="mt-1" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
          <div><Label>Reward per response (₹)</Label><Input type="number" min={0} className="mt-1" value={f.reward_inr} onChange={(e) => setF({ ...f, reward_inr: Math.max(0, Number(e.target.value)) })} /></div>
          <Label>Questions</Label>
          {qs.map((q, i) => (
            <div key={i} className="flex gap-2">
              <Input value={q} onChange={(e) => setQs(qs.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Question ${i + 1}`} />
              <Button size="icon" variant="ghost" onClick={() => setQs(qs.filter((_, j) => j !== i))}><X /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setQs([...qs, ""])}><Plus /> Add question</Button>
          <Button className="w-full" onClick={save} disabled={!f.title || qs.every((q) => !q.trim())}>Publish</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
