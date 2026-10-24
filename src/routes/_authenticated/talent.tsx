import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Star, Send, GitCompare } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Choice, Field, MultiChoice } from "@/components/hubs/HubControls";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CANDIDATES, EDUCATION, EMPLOYMENT, EXPERIENCE_LEVELS, JLPT, TALENT_INDUSTRIES, allSkills, matchCandidate, type Candidate, type Requirements } from "@/lib/talent";

const T = "Talent Match — Japan2Nippon";
const D = "Match Japanese hiring requirements with Indian professionals in semiconductors, AI, green tech and more.";
export const Route = createFileRoute("/_authenticated/talent")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Page,
});

type Req = { id: string; candidate: string; kind: "Interview" | "Collaboration"; status: "Pending" | "Accepted" | "Declined"; at: string };
const KEY = "n2j-talent-v1";

function Page() {
  const [r, setR] = useState<Requirements>({ skills: [] });
  const [sort, setSort] = useState("Match %");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [requests, setRequests] = useState<Req[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [view, setView] = useState<Candidate | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(KEY) ?? "{}"); setShortlist(s.shortlist ?? []); setRequests(s.requests ?? []); } catch { /* ignore */ } }, []);
  const persist = (sl: string[], rq: Req[]) => { setShortlist(sl); setRequests(rq); localStorage.setItem(KEY, JSON.stringify({ shortlist: sl, requests: rq })); };
  const set = <K extends keyof Requirements>(k: K) => (v: string) => setR({ ...r, [k]: v || undefined });

  const ranked = useMemo(() => {
    const list = CANDIDATES.map((c) => ({ c, m: matchCandidate(c, r) }));
    const by: Record<string, (a: (typeof list)[0], b: (typeof list)[0]) => number> = {
      "Match %": (a, b) => b.m.score - a.m.score, "Experience": (a, b) => b.c.years - a.c.years, "Salary (low first)": (a, b) => a.c.salaryLakh - b.c.salaryLakh,
    };
    return list.sort(by[sort]);
  }, [r, sort]);
  const byId = (id: string) => CANDIDATES.find((c) => c.id === id)!;
  const toggleSL = (id: string) => { persist(shortlist.includes(id) ? shortlist.filter((x) => x !== id) : [...shortlist, id], requests); };
  const send = (id: string, kind: Req["kind"]) => {
    if (requests.some((q) => q.candidate === id && q.kind === kind && q.status === "Pending")) { toast.error("A pending request already exists."); return; }
    persist(shortlist, [{ id: crypto.randomUUID(), candidate: id, kind, status: "Pending", at: new Date().toISOString() }, ...requests]);
    toast.success(`${kind} request recorded (simulated — demo candidates are not notified)`);
  };
  const toggleCmp = (id: string) => setCompare(compare.includes(id) ? compare.filter((x) => x !== id) : compare.length >= 3 ? (toast.error("Compare up to 3"), compare) : [...compare, id]);

  return (
    <>
      <PageHeader kanji="人" title="Talent Match" desc="Find Indian professionals whose skills match your hiring requirements." />
      <p className="mb-6 rounded-md border border-primary/30 bg-primary/5 p-3 text-xs">Demo mode: every candidate below is a fictional sample profile and qualifications are self-reported. Match percentages are a simulated rule-based score, not a verification. Requests are stored in this browser only.</p>

      <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Saved candidates", shortlist.length], ["Strong matches (≥70%)", ranked.filter((x) => x.m.score >= 70).length], ["Sent requests", requests.length], ["Pending", requests.filter((q) => q.status === "Pending").length]].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-border bg-card p-4"><div className="text-2xl font-bold">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>))}
      </section>

      <section className="mb-8 rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-xl font-bold">Company requirements</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Industry"><Choice value={r.industry ?? ""} onChange={set("industry")} options={TALENT_INDUSTRIES} placeholder="Any industry" /></Field>
          <Field label="Experience level"><Choice value={r.level ?? ""} onChange={set("level") as (v: string) => void} options={Object.keys(EXPERIENCE_LEVELS)} placeholder="Any level" /></Field>
          <Field label="Education"><Choice value={r.education ?? ""} onChange={set("education")} options={EDUCATION} placeholder="Any" /></Field>
          <Field label="Location"><Choice value={r.location ?? ""} onChange={set("location")} options={[...new Set(CANDIDATES.map((c) => c.location))].sort()} placeholder="Any city" /></Field>
          <Field label="Min. Japanese (JLPT)"><Choice value={r.jlpt ?? ""} onChange={set("jlpt")} options={JLPT} placeholder="Not required" /></Field>
          <Field label="Employment type"><Choice value={r.employment ?? ""} onChange={set("employment")} options={EMPLOYMENT} placeholder="Any" /></Field>
          <Field label="Max salary (lakh INR / yr)"><Input type="number" min={0} value={r.salaryMax ?? ""} onChange={(e) => setR({ ...r, salaryMax: e.target.value === "" ? undefined : Number(e.target.value) })} /></Field>
          <Field label="Sort by"><Choice value={sort} onChange={(v) => setSort(v || "Match %")} options={["Match %", "Experience", "Salary (low first)"]} placeholder="Match %" /></Field>
        </div>
        <div className="mt-4"><div className="mb-2 text-sm font-medium">Required technical skills</div><MultiChoice options={allSkills()} value={r.skills} onChange={(v) => setR({ ...r, skills: v })} /></div>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setR({ skills: [] })}>Reset</Button>
      </section>

      {compare.length > 0 && <div className="mb-4 flex items-center gap-3 text-sm"><span>{compare.length} selected to compare</span><Button size="sm" onClick={() => setShowCompare(true)} disabled={compare.length < 2}><GitCompare className="mr-1 h-4 w-4" />Compare</Button><Button size="sm" variant="ghost" onClick={() => setCompare([])}>Clear</Button></div>}

      <section className="mb-10 space-y-3">
        <h2 className="text-xl font-bold">Ranked candidates</h2>
        {ranked.map(({ c, m }, i) => (
          <div key={c.id} className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[3rem_1fr_auto]">
            <div className="text-2xl font-bold text-primary">#{i + 1}</div>
            <div>
              <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{c.name}</h3><Badge variant="outline">Demo · unverified</Badge><Badge>{m.score}% simulated match</Badge></div>
              <p className="text-sm">{c.headline}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{c.location} · {c.industry} · {c.years} yrs · JLPT {c.jlpt} · ₹{c.salaryLakh}L · {c.availability}</p>
              <div className="mt-2 flex flex-wrap gap-1 text-xs">
                {m.matching.map((s) => <span key={s} className="rounded bg-primary/10 px-2 py-0.5 text-primary">✓ {s}</span>)}
                {m.missing.map((s) => <span key={s} className="rounded bg-muted px-2 py-0.5 text-muted-foreground line-through">{s}</span>)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Experience: {m.exp} · Japanese: {m.lang}</p>
            </div>
            <div className="flex flex-wrap items-start gap-2 md:flex-col">
              <Button size="sm" variant="outline" onClick={() => setView(c)}>View profile</Button>
              <Button size="sm" variant={shortlist.includes(c.id) ? "default" : "outline"} onClick={() => toggleSL(c.id)}><Star className="mr-1 h-3 w-3" />{shortlist.includes(c.id) ? "Shortlisted" : "Shortlist"}</Button>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={compare.includes(c.id)} onChange={() => toggleCmp(c.id)} />Compare</label>
            </div>
          </div>))}
      </section>

      <section className="mb-10 grid gap-6 lg:grid-cols-2">
        <div><h2 className="mb-3 text-xl font-bold">Saved candidates</h2>
          {shortlist.length === 0 ? <p className="text-sm text-muted-foreground">No shortlisted candidates yet.</p> : shortlist.map((id) => (
            <div key={id} className="mb-2 flex items-center justify-between rounded border border-border p-3 text-sm"><span>{byId(id).name}</span>
              <span className="flex gap-2"><Button size="sm" variant="outline" onClick={() => send(id, "Interview")}>Interview</Button><Button size="sm" variant="ghost" onClick={() => toggleSL(id)}>Remove</Button></span></div>))}
        </div>
        <div><h2 className="mb-3 text-xl font-bold">Sent requests</h2>
          {requests.length === 0 ? <p className="text-sm text-muted-foreground">No requests sent yet.</p> : requests.map((q) => (
            <div key={q.id} className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded border border-border p-3 text-sm">
              <span>{q.kind} · {byId(q.candidate).name} <span className="text-xs text-muted-foreground">{new Date(q.at).toLocaleDateString()}</span></span>
              <span className="flex items-center gap-2"><Badge variant={q.status === "Accepted" ? "default" : "secondary"}>{q.status}</Badge>
                {q.status === "Pending" && <><Button size="sm" variant="ghost" title="Simulate candidate response" onClick={() => persist(shortlist, requests.map((x) => x.id === q.id ? { ...x, status: "Accepted" } : x))}>Simulate accept</Button>
                  <Button size="sm" variant="ghost" onClick={() => persist(shortlist, requests.filter((x) => x.id !== q.id))}>Withdraw</Button></>}</span>
            </div>))}
        </div>
      </section>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>{view && (<>
          <DialogHeader><DialogTitle>{view.name}</DialogTitle></DialogHeader>
          <Badge variant="outline" className="w-fit">Fictional demo profile — not a real candidate</Badge>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{view.headline}</p>
            <p><b>Industry:</b> {view.industry}</p><p><b>Experience:</b> {view.years} years</p>
            <p><b>Education:</b> {view.education} — {view.qualifications}</p>
            <p><b>Skills:</b> {view.skills.join(", ")}</p>
            <p><b>Languages:</b> Japanese JLPT {view.jlpt} (self-reported), English {view.english}</p>
            <p><b>Location:</b> {view.location}</p><p><b>Expected salary:</b> ₹{view.salaryLakh} lakh / yr</p>
            <p><b>Availability:</b> {view.availability} · {view.employment.join(", ")}</p>
          </div>
          <div className="flex gap-2"><Button onClick={() => send(view.id, "Interview")}><Send className="mr-1 h-4 w-4" />Interview request</Button><Button variant="outline" onClick={() => send(view.id, "Collaboration")}>Collaboration request</Button></div>
        </>)}</DialogContent>
      </Dialog>

      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>Compare candidates (demo)</DialogTitle></DialogHeader>
          <div className="overflow-x-auto"><table className="w-full text-sm"><tbody>
            {([["Match", (c: Candidate) => `${matchCandidate(c, r).score}%`], ["Headline", (c: Candidate) => c.headline], ["Experience", (c: Candidate) => `${c.years} yrs`], ["Skills", (c: Candidate) => c.skills.join(", ")], ["Education", (c: Candidate) => c.education], ["JLPT", (c: Candidate) => c.jlpt], ["Salary", (c: Candidate) => `₹${c.salaryLakh}L`], ["Availability", (c: Candidate) => c.availability]] as const).map(([l, f]) => (
              <tr key={l} className="border-b border-border"><th className="p-2 text-left">{l}</th>{compare.map((id) => <td key={id} className="p-2 align-top">{f(byId(id))}</td>)}</tr>))}
            <tr><th className="p-2 text-left">Name</th>{compare.map((id) => <td key={id} className="p-2 font-bold">{byId(id).name}</td>)}</tr>
          </tbody></table></div>
        </DialogContent>
      </Dialog>
    </>
  );
}
