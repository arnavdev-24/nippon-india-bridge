import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calculator,
  CalendarCheck,
  Handshake,
  Truck,
  Languages,
  ClipboardList,
  Inbox,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Sparkles,
  Leaf,
  Wheat,
  Building2,
  Clock,
  Briefcase,
  Award,
  SlidersHorizontal,
  MapPin,
} from "lucide-react";
import { useMyProfile } from "@/lib/profile";
import { useT } from "@/lib/i18n";
import { useRole } from "@/lib/role-context";
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
  const { effectiveRole } = useRole();

  const greeting =
    lang === "ja"
      ? "お帰りなさい"
      : lang === "hi"
      ? "नमस्ते, आपका स्वागत है"
      : "Welcome back";

  const roleTitle =
    effectiveRole === "japanese_company"
      ? "Japanese SME Enterprise Member"
      : effectiveRole === "indian_company"
      ? "Indian Corporate & Commercial Partner"
      : "Vetted Professional Practice (CA / CS / Trainer)";

  const dashboardSubtitle =
    effectiveRole === "japanese_company"
      ? lang === "ja"
        ? "日印ビジネス展開コンソール · 規制対応・市場調査・提携先発掘を一元管理"
        : "Bilateral expansion command center · Compliance, ground intelligence, and commercial alliances."
      : effectiveRole === "indian_company"
      ? lang === "ja"
        ? "日印パートナーシップ中枢 · 日本企業からの提携・販売代理店・共同開発の引合を受信"
        : "Bilateral commercial hub · Inbound inquiries, distribution network management, and JV proposals."
      : lang === "ja"
      ? "専門家・講師コンソール · 日本企業向け税務・法務相談およびビジネス語学研修の管理"
      : "Bilateral practice desk · Tax advisory, statutory compliance, and corporate cultural training.";

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-12">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif text-muted-foreground">
            <span>{greeting}</span>
            <span>·</span>
            <span className="font-sans font-medium text-foreground">{roleTitle}</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {p?.company_name || p?.full_name || (effectiveRole === "japanese_company" ? "Enterprise Console" : effectiveRole === "indian_company" ? "Partner Commercial Hub" : "Practice Console")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{dashboardSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary font-medium">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>{lang === "ja" ? "日印経済回廊" : "Japan–India Corridor"}</span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/profile">{lang === "ja" ? "組織プロフィール" : "Organization Profile"}</Link>
          </Button>
        </div>
      </div>

      {/* Role-Specific Hero Banner */}
      {effectiveRole === "japanese_company" ? (
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

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  1. Industry & States
                </span>
                <span>→</span>
                <span className="flex items-center gap-1.5">2. FDI Route, GST & Licences</span>
                <span>→</span>
                <span className="flex items-center gap-1.5">3. Matched CA / CS</span>
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
      ) : effectiveRole === "indian_company" ? (
        <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-r from-card to-primary/5 p-6 md:p-8 shadow-paper">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-serif font-bold tracking-widest text-primary uppercase">
                <Building2 className="h-4 w-4" />
                <span>{lang === "ja" ? "日印提携ゲートウェイ" : "Commercial Partnership Gateway"}</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                {lang === "ja"
                  ? "進出日本企業との提携・販売網マッチング"
                  : "Inbound Japanese Enterprise Alliances"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {lang === "ja"
                  ? "日本の製造業・精密機器・クリーンテック企業が、現地販売代理店、保税倉庫、合弁生産パートナーを求めています。"
                  : "Japanese manufacturers and technology SMEs are actively searching for vetted Indian distributors, bonded warehouses, and joint-venture manufacturing partners."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  Matched by industry, states served and capabilities
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">Requests arrive in your Connections inbox</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Button asChild size="lg" className="shadow-paper">
                <Link to="/connections">
                  {lang === "ja" ? "引合・リクエストを確認" : "View Inbound Requests"}
                  <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/distributors">
                  {lang === "ja" ? "自社能力を登録" : "Manage Hub Listing"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-r from-card to-primary/5 p-6 md:p-8 shadow-paper">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-serif font-bold tracking-widest text-primary uppercase">
                <Award className="h-4 w-4" />
                <span>{lang === "ja" ? "専門業務デスク" : "Vetted Professional Practice Desk"}</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                {lang === "ja"
                  ? "日印専門相談・ビジネス語学コンソール"
                  : "Bilateral Advisory & Cultural Training Console"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {lang === "ja"
                  ? "インド進出を計画する日本企業経営陣との1対1相談、会社設立・GST・移転価格の助言、およびビジネス日本語研修を管理します。"
                  : "Manage direct consultation bookings from Japanese CXOs navigating Indian company incorporation, GST filings, DTAA withholding, and executive language training."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Direct Consultation Booking Active
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">Automatic Concurrency Slot Locking</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Button asChild size="lg" className="shadow-paper">
                <Link to="/consultations">
                  {lang === "ja" ? "相談予約を確認" : "Manage Consultations"}
                  <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/profile">
                  {lang === "ja" ? "AI評価・資格情報" : "AI Profile Score"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Role-Specific Core Expansion Hubs */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-xs font-serif font-bold tracking-widest text-primary uppercase">
            {effectiveRole === "japanese_company"
              ? lang === "ja" ? "主要展開モジュール" : "Expansion Modules"
              : effectiveRole === "indian_company"
              ? lang === "ja" ? "パートナー業務モジュール" : "Commercial Partner Desks"
              : lang === "ja" ? "提供サービス・管理デスク" : "Practice Desks"}
          </div>
          <span className="text-xs text-muted-foreground">
            {lang === "ja" ? "リアルタイム連携機能" : "Real-time bilateral infrastructure"}
          </span>
        </div>

        {effectiveRole === "japanese_company" ? (
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
                <span className="text-[11px] font-medium text-emerald-600">CA / CS directory</span>
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
                  Match your machinery and consumer products with regional distributors filtered by warehousing facilities and state presence.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-emerald-600">Filter by state & capability</span>
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
        ) : effectiveRole === "indian_company" ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Inbound Inquiries */}
            <Link
              to="/connections"
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-600 font-medium">
                    INBOUND LEADS
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Inbound Connections
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Review partnership requests, distribution inquiries, and collaboration proposals sent directly by Japanese SMEs.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-primary">Active Leads Inbox</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            {/* Distributor Network */}
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
                    DISTRIBUTION
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Distributor Hub Listing
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Manage your coverage territories, bonded warehouse capacity, cold-chain features, and import certifications.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-emerald-600">Register as Distributor</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            {/* Joint Venture Proposals */}
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
                    MAKE IN INDIA
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Joint Venture Desk
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Post and update your co-manufacturing capabilities, technology transfer proposals, and factory certifications.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-primary">Manage JV Proposal</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            {/* Dealer Fieldwork Surveys */}
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
                    PAID FIELDWORK
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Dealer Surveys &amp; Fieldwork
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Access paid survey opportunities commissioned by Japanese brands to understand state-by-state demand and pricing.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-primary">Fieldwork Campaigns</span>
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
                    VIDEO CALLS
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Bilateral Meetings
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Scheduled alignment calls with Japanese business owners and expansion directors.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-muted-foreground">Meeting Schedule</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            {/* Organization Profile */}
            <Link
              to="/profile"
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    VERIFICATION
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Company Accreditation
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Maintain your legal incorporation details, GSTIN, industrial license, and bilateral corridor trust score.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-emerald-600">GSTIN & licence details</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-600 font-medium">
                    APPOINTMENTS
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Scheduled Consultations
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Review booked advisory sessions with Japanese corporates, meeting agendas, and shared background dossiers.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-primary">Client Calendar</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            {/* Time Slot Locking */}
            <Link
              to="/tutors"
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    SLOT LOCKING
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Availability &amp; Slots
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Open and manage your consultation and training calendar slots with atomic concurrency locking to prevent double bookings.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-emerald-600">Real-time Slots</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            {/* Advisors Directory Listing */}
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
                    DIRECTORY
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Vetted Directory Listing
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Verify how your professional practice is displayed to Japanese companies seeking ICAI/ICSI certified experts.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-primary">Public Practice View</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            {/* Direct Inquiries */}
            <Link
              to="/connections"
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    INQUIRIES
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Client Messages &amp; RFPs
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Direct inquiries regarding GST registration, Transfer Pricing audits, WOS incorporation, or language training packages.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-primary">Inquiries Inbox</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            {/* Tax Compliance Tool Preview */}
            <Link
              to="/tax-compliance"
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <SlidersHorizontal className="h-5 w-5" />
                  </div>
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    DIAGNOSTIC
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Compliance Diagnostic
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Review the 3-stage statutory compliance questionnaire that incoming Japanese firms run before engaging your firm.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-primary">Diagnostic Preview</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            {/* Professional Profile & AI Assessment */}
            <Link
              to="/profile"
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    CREDENTIALS
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                  Credentials &amp; AI Score
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Set hourly consultation rate, upload résumé, and run streaming AI profile assessment to verify your score.
                </p>
              </div>
              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-emerald-600">AI profile assessment</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Strategic Sector Corridors */}
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
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/state-intelligence">
                <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
                {lang === "ja" ? "州別インテリジェンス" : "State Intelligence"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/overview">
                {lang === "ja" ? "全産業マップ" : "Sector Overview"}
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
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
