import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BrainCircuit, Cpu, Leaf, Wheat, MapPin, Building2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectorNav } from "@/components/sectors/SectorUI";
import { DEMO_COMPANIES, SECTORS } from "@/lib/sectors";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/overview")({
  head: () => ({
    meta: [
      { title: "Sector Platform — nippon2japan" },
      {
        name: "description",
        content: "Bilateral sector dashboards for semiconductors, AI innovation, greentech, and sustainable agriculture.",
      },
      { property: "og:title", content: "Sector Platform — nippon2japan" },
      {
        property: "og:description",
        content: "Discover Indian partners and industrial clusters in semiconductors, AI, greentech, and sustainable agriculture.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

const TILES = [
  {
    to: "/semiconductor",
    title: "Semiconductor Connect",
    kanji: "半",
    desc: "Chip design, PCB assembly, discrete components, wafer-level testing, and OSAT packaging.",
    icon: Cpu,
    sector: "semiconductor" as const,
    clusters: "Dholera (GJ) · Bengaluru (KA) · Noida (UP)",
  },
  {
    to: "/ai-innovation",
    title: "AI Innovation Exchange",
    kanji: "智",
    desc: "Industrial computer vision, multilingual LLMs, factory robotics perception, and offshore R&D labs.",
    icon: BrainCircuit,
    sector: "ai" as const,
    clusters: "Bengaluru (KA) · Pune (MH) · Hyderabad (TS)",
  },
  {
    to: "/greentech",
    title: "GreenTech Alliance",
    kanji: "緑",
    desc: "Utility solar EPC, EV battery lifecycle & recycling, waste-to-energy, and industrial decarbonization.",
    icon: Leaf,
    sector: "greentech" as const,
    clusters: "Jodhpur (RJ) · Ahmedabad (GJ) · Chennai (TN)",
  },
  {
    to: "/sustainable-agriculture",
    title: "Sustainable Agriculture Exchange",
    kanji: "農",
    desc: "Precision farm machinery, solar cold storage, drip irrigation, and food value chain processing.",
    icon: Wheat,
    sector: "agri" as const,
    clusters: "Pune (MH) · Ludhiana (PB) · Nashik (MH)",
  },
] as const;

function Overview() {
  const stats = [
    { label: "Bilateral Priority Sectors", value: "4", note: "Semiconductor, AI, GreenTech, Agri" },
    { label: "Mapped Enterprise Profiles", value: String(DEMO_COMPANIES.length + 8), note: "Verified & demo candidates" },
    { label: "Dedicated Industrial Townships", value: "12", note: "Special JIT investment zones" },
    { label: "FDI Automatic Approval", value: "100%", note: "No prior government clearance required" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <SectorNav />

      <PageHeader
        kanji="産"
        title="Bilateral Sector Platforms"
        desc="Curated industrial corridors connecting Japanese engineering precision with India's highest-growth manufacturing and technology clusters."
      />

      {/* Institutional Sector Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/80 bg-card p-5 shadow-paper">
            <div className="font-serif text-3xl font-extrabold text-primary">{s.value}</div>
            <div className="mt-1 text-xs font-semibold text-foreground">{s.label}</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Sector Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {TILES.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-7 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="h-6 w-6" />
                </div>
                <span className="font-serif text-2xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                  {t.kanji}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold group-hover:text-primary transition-colors">
                {t.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t.desc}
              </p>
            </div>

            <div className="mt-6 border-t border-border/60 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                <MapPin className="h-3 w-3 text-primary shrink-0" />
                <span>{t.clusters}</span>
              </div>
              <div className="flex items-center text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                Enter Corridor <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Corridor Regulatory Policy Notice */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-6 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          <div>
            <div className="font-semibold text-foreground">Bilateral Incentive Alignment</div>
            <div className="mt-0.5 text-[11px]">
              Eligible for India Semiconductor Mission (ISM), Production Linked Incentives (PLI), and JETRO Overseas Supply Chain Diversification subsidies.
            </div>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="text-xs shrink-0">
          <Link to="/tax-compliance">Check Eligibility</Link>
        </Button>
      </div>
    </div>
  );
}
