import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calculator,
  CalendarCheck,
  Handshake,
  Scale,
  Truck,
  Languages,
  ClipboardList,
  Inbox,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Cpu,
  Sparkles,
  Leaf,
  Wheat,
  Building2,
  Users,
} from "lucide-react";
import { useMyProfile } from "@/lib/profile";
import { useT, type TKey } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center — nippon2japan" },
      { name: "description", content: "Your Japan–India business expansion command center." },
      { property: "og:title", content: "Command Center" },
      { property: "og:description", content: "Your Japan–India business expansion command center." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

export default function Dashboard() {
  const { t, lang } = useT();
  const { data: p } = useMyProfile();

  const greeting =
    lang === "ja"
      ? "お帰りなさい"
      : lang === "hi"
      ? "नमस्ते, आपका स्वागत है"
      : "Welcome back";

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-12">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif text-muted-foreground">
            <span>{greeting}</span>
            <span>·</span>
            <span className="font-sans font-medium text-foreground">
              {p?.account_type === "japanese_company"
                ? "Japanese SME Enterprise Member"
                : p?.account_type === "indian_company"
                ? "Indian Corporate Partner"
                : p?.account_type === "expert"
                ? "Vetted Professional Practice"
                : "Corridor Member"}
            </span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {p?.company_name || p?.full_name || "Enterprise Console"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "ja"
              ? "日印ビジネス展開コンソール · 規制対応・市場調査・提携先発掘を一元管理"
              : "Bilateral expansion command center · Compliance, ground intelligence, and commercial alliances."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lang === "ja" ? "回廊接続中 · CEPA準拠" : "Active Corridor · CEPA Compliant"}</span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/profile">{lang === "ja" ? "組織プロフィール" : "Organization Profile"}</Link>
          </Button>
        </div>
      </div>

      {/* Hero Action: Guided 3-Stage Market Entry Diagnostic Banner */}
      <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-r from-card to-primary/5 p-6 md:p-8 shadow-paper">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-serif font-bold tracking-widest text-primary uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>{lang === "ja" ? "進出適合性診断" : "Market Entry Diagnostic"}</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              {lang === "ja"
                ? "税務・法務コンプライアンス適合チェック"
                : "Tax & Compliance Readiness Assessment"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {lang === "ja"
                ? "業種・投資規模・対象州を選択し、100%自動認可ルートやGST要件、最適な現地公認会計士（CA）を特定します。"
                : "Select your sector, proposed engagement, and target states to identify 100% automatic FDI routes, GST requirements, and matched Chartered Accountants."}
            </p>

            {/* Micro Stepper */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                1. Industry Selection
              </span>
              <span>→</span>
              <span className="flex items-center gap-1.5">2. FDI Route Check</span>
              <span>→</span>
              <span className="flex items-center gap-1.5">3. CA Match & Consultation</span>
            </div>
          </div>

          <div className="shrink-0">
            <Button asChild size="lg" className="shadow-paper">
              <Link to="/tax-compliance">
                {lang === "ja" ? "適合性診断を開始する" : "Launch Diagnostic"}
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Core Expansion Hubs: Rich High-Density Cards */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-xs font-serif font-bold tracking-widest text-primary uppercase">
            {lang === "ja" ? "主要展開モジュール" : "Expansion Modules"}
          </div>
          <span className="text-xs text-muted-foreground">
            {lang === "ja" ? "リアルタイム連携機能" : "Real-time bilateral infrastructure"}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Advisors */}
          <Link
            to="/advisors"
            className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calculator className="h-5 w-5" />
                </div>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  CA / CS
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                {t("advisors")}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Connect with vetted Indian Chartered Accountants and Company Secretaries for GST, PAN/TAN, transfer pricing, and incorporation.
              </p>
            </div>
            <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-emerald-600">Verified Practices Available</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>

          {/* Joint Ventures */}
          <Link
            to="/joint-ventures"
            className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Handshake className="h-5 w-5" />
                </div>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  NDA ALLIANCES
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                {t("jv")}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Browse verified technology proposals, video pitch decks, and manufacturer capabilities across Maharashtra, Gujarat, and Karnataka.
              </p>
            </div>
            <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-primary">Video Pitches &amp; Proposals</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>

          {/* Distributors */}
          <Link
            to="/distributors"
            className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  28 STATES
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                {t("distributors")}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Match your machinery and consumer products with audited regional distributors filtered by warehousing facilities and state presence.
              </p>
            </div>
            <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-emerald-600">Warehousing Audited</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>

          {/* Field Dealer Surveys */}
          <Link
            to="/surveys"
            className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  FIELDWORK
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                {t("surveys")}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Design targeted dealer survey campaigns with secure tokens. Analyze real field feedback via India heat maps and Chart.js metrics.
              </p>
            </div>
            <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-primary">Interactive India Heat Map</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>

          {/* Consultations */}
          <Link
            to="/consultations"
            className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  MEETINGS
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                {t("consultations")}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Manage scheduled advisory sessions with Chartered Accountants, legal counsel, and potential joint venture partners.
              </p>
            </div>
            <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Schedule &amp; Notes</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>

          {/* Talent & Cultural Tutors */}
          <Link
            to="/tutors"
            className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Languages className="h-5 w-5" />
                </div>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  JLPT / SKILLS
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                {t("tutors")} &amp; {t("talent")}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Book native Japanese language instructors, business etiquette trainers, and recruit bilingual engineering talent.
              </p>
            </div>
            <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-primary">Concurrency Slot Locking</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>
      </div>

      {/* Sector Platforms Spotlight Strip */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-paper">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="text-xs font-serif font-bold text-primary uppercase">
              {lang === "ja" ? "特設産業クラスター" : "Strategic Sector Corridors"}
            </div>
            <h3 className="text-lg font-bold mt-1">
              {lang === "ja" ? "日印共同産業プラットフォーム" : "Industry-Specific Innovation Dashboards"}
            </h3>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/overview">
              {lang === "ja" ? "全産業マップ" : "Sector Overview"}
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/semiconductor"
            className="group rounded-lg border border-border/70 p-4 transition-colors hover:border-primary hover:bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <Cpu className="h-5 w-5 text-primary" />
              <span className="font-serif font-bold text-muted-foreground/40 group-hover:text-primary">半</span>
            </div>
            <div className="mt-3 text-sm font-semibold">Semiconductor</div>
            <div className="text-[11px] text-muted-foreground">OSAT &amp; Chip Design</div>
          </Link>

          <Link
            to="/ai-innovation"
            className="group rounded-lg border border-border/70 p-4 transition-colors hover:border-primary hover:bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-serif font-bold text-muted-foreground/40 group-hover:text-primary">智</span>
            </div>
            <div className="mt-3 text-sm font-semibold">AI Innovation</div>
            <div className="text-[11px] text-muted-foreground">Vision &amp; Robotics</div>
          </Link>

          <Link
            to="/greentech"
            className="group rounded-lg border border-border/70 p-4 transition-colors hover:border-primary hover:bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-serif font-bold text-muted-foreground/40 group-hover:text-primary">緑</span>
            </div>
            <div className="mt-3 text-sm font-semibold">GreenTech</div>
            <div className="text-[11px] text-muted-foreground">Clean Energy &amp; EV</div>
          </Link>

          <Link
            to="/sustainable-agriculture"
            className="group rounded-lg border border-border/70 p-4 transition-colors hover:border-primary hover:bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <Wheat className="h-5 w-5 text-primary" />
              <span className="font-serif font-bold text-muted-foreground/40 group-hover:text-primary">農</span>
            </div>
            <div className="mt-3 text-sm font-semibold">AgriTech</div>
            <div className="text-[11px] text-muted-foreground">Cold Chain &amp; Machinery</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
