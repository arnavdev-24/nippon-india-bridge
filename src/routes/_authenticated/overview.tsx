import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BrainCircuit, Cpu, Leaf } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectorNav } from "@/components/sectors/SectorUI";
import { DEMO_COMPANIES } from "@/lib/sectors";
export const Route = createFileRoute("/_authenticated/overview")({
  head: () => ({ meta: [{ title: "Sector Platform — Japan2Nippon" }, { name: "description", content: "Japan2Nippon sector dashboards for semiconductors, AI innovation and green technology." }, { property: "og:title", content: "Sector Platform — Japan2Nippon" }, { property: "og:description", content: "Japan2Nippon sector dashboards for semiconductors, AI innovation and green technology." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Overview,
});
const TILES = [
  { to: "/semiconductor", title: "Semiconductor Connect", desc: "Chip design, PCB, components, testing, OSAT.", icon: Cpu, sector: "semiconductor" },
  { to: "/ai-innovation", title: "AI Innovation Exchange", desc: "Startups, researchers, universities, talent.", icon: BrainCircuit, sector: "ai" },
  { to: "/greentech", title: "GreenTech Alliance", desc: "Solar, wind, EV, recycling, efficiency.", icon: Leaf, sector: "greentech" },
] as const;
function Overview() {
  const stats = [
    ["Sample partner profiles", DEMO_COMPANIES.length],
    ["Sectors", TILES.length],
    ["Verified companies", 0],
  ] as const;
  return (
    <>
      <SectorNav />
      <PageHeader kanji="橋" title="Sector Platform" desc="Discover Indian partners in semiconductors, AI and green technology." />
      <div className="mb-8 grid grid-cols-3 gap-3">
        {stats.map(([l, v]) => (
          <div key={l} className="rounded-lg border border-border bg-card p-4"><div className="text-3xl font-bold text-primary">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
        ))}
      </div>
      <p className="mb-6 text-xs text-muted-foreground">Figures reflect demo data.</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TILES.map((t) => (
          <Link key={t.to} to={t.to} className="group rounded-lg border border-border bg-card p-6 shadow-paper transition-colors hover:border-primary">
            <div className="flex items-center justify-between"><t.icon className="h-7 w-7 text-primary" /><ArrowUpRight className="h-4 w-4 text-muted-foreground" /></div>
            <h3 className="mt-5 text-xl font-bold">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            {"sector" in t && <p className="mt-2 text-xs text-primary">{DEMO_COMPANIES.filter((c) => c.sector === t.sector).length} sample profiles</p>}
          </Link>
        ))}
      </div>
    </>
  );
}
