import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/hubs/HubControls";
import { SectorDashboard } from "@/components/sectors/SectorDashboard";
import { CompanyCard } from "@/components/sectors/SectorUI";
import { DEMO_COMPANIES, SECTORS } from "@/lib/sectors";
export const Route = createFileRoute("/_authenticated/ai-innovation")({
  head: () => ({ meta: [{ title: "AI Innovation Exchange — Japan2Nippon" }, { name: "description", content: "Connect with Indian AI startups, developers, researchers and universities for joint AI development." }, { property: "og:title", content: "AI Innovation Exchange — Japan2Nippon" }, { property: "og:description", content: "Connect with Indian AI startups, developers, researchers and universities for joint AI development." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <SectorDashboard sector="ai" extra={<Extras />} />,
});
const KEYWORDS: Record<string, string[]> = {
  "Computer vision": ["defect", "inspection", "camera", "image", "vision"],
  "NLP / LLM": ["document", "text", "chat", "invoice", "translation", "language"],
  "Predictive maintenance": ["maintenance", "downtime", "failure", "sensor"],
  "Robotics AI": ["robot", "picking", "arm", "automation"],
  MLOps: ["deploy", "pipeline", "scale", "monitor"],
  "Japanese-language AI": ["japanese", "日本語", "bilingual"],
};
function Extras() {
  const [problem, setProblem] = useState("");
  const caps = Object.entries(KEYWORDS).filter(([, w]) => w.some((x) => problem.toLowerCase().includes(x))).map(([k]) => k);
  const matches = DEMO_COMPANIES.filter((c) => c.sector === "ai" && c.capabilities.some((x) => caps.includes(x)));
  const talent = DEMO_COMPANIES.filter((c) => c.sector === "ai" && (c.objectives.includes("Talent") || c.type === "University" || c.type === "Research lab"));
  return (
    <>
      <section className="mb-12 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold">AI solution matcher</h2>
        <p className="mt-1 text-sm text-muted-foreground">Describe your problem. We match keywords to capabilities — a simple rule-based suggestion, not an AI assessment.</p>
        <div className="mt-4"><Field label="Your business problem"><Textarea value={problem} placeholder="e.g. We need camera inspection to catch defects on our line" onChange={(e) => setProblem(e.target.value)} /></Field></div>
        {problem && <p className="mt-3 text-sm">Detected needs: {caps.length ? caps.join(", ") : "none yet — try words like defect, invoice, robot, maintenance"}</p>}
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{matches.map((c) => <CompanyCard key={c.id} c={c} reasons={c.capabilities.filter((x) => caps.includes(x))} />)}</div>
      </section>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Talent & research directory</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{talent.map((c) => <CompanyCard key={c.id} c={c} />)}</div>
        <p className="mt-3 text-xs text-muted-foreground">Focus areas: {SECTORS.ai.capabilities.join(" · ")}</p>
      </section>
    </>
  );
}
