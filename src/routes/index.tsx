import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calculator,
  Handshake,
  Truck,
  Languages,
  ClipboardList,
  ArrowRight,
  ShieldCheck,
  Building2,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Cpu,
  Sparkles,
  Leaf,
  Wheat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LangToggle, useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "nippon2bharat — Japan–India SME Expansion & Industrial Corridor" },
      {
        name: "description",
        content:
          "Institutional platform connecting Japanese SMEs with Indian Chartered Accountants, Joint Venture partners, industrial distributors, bilingual talent, and paid on-ground dealer surveys.",
      },
      { property: "og:title", content: "nippon2bharat — Japan–India SME Expansion & Industrial Corridor" },
      {
        property: "og:description",
        content: "Tax & compliance, joint ventures, distributors, and field dealer intelligence — in one unified corridor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

export default function Index() {
  const { t, lang } = useT();
  const [signedIn, setSignedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"match" | "clusters" | "survey">("match");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/15 selection:text-primary">
      {/* Editorial Top Utility Bar */}
      <div className="border-b border-border/60 bg-muted/30 px-6 py-1.5 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-medium tracking-wide">
              {lang === "ja" ? "日印経済回廊 · 連携ゲートウェイ" : "Japan–India Industrial Expansion Corridor"}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span>100% Automatic FDI Route (Mfg)</span>
            <span>·</span>
            <span>12 Japanese Industrial Townships (JIT)</span>
            <span>·</span>
            <span>India–Japan CEPA</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
              <Link to="/overview" className="transition-colors hover:text-foreground">
                {lang === "ja" ? "産業分野" : "Sectors"}
              </Link>
              <Link to="/advisors" className="transition-colors hover:text-foreground">
                {lang === "ja" ? "税務・法務" : "Tax & Legal"}
              </Link>
              <Link to="/joint-ventures" className="transition-colors hover:text-foreground">
                {lang === "ja" ? "合弁・技術交流" : "Joint Ventures"}
              </Link>
              <Link to="/distributors" className="transition-colors hover:text-foreground">
                {lang === "ja" ? "販売網" : "Distributors"}
              </Link>
              <Link to="/surveys" className="transition-colors hover:text-foreground">
                {lang === "ja" ? "市場調査" : "Field Surveys"}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Button asChild variant={signedIn ? "default" : "ink"} size="sm">
              <Link to={signedIn ? "/dashboard" : "/auth"}>{signedIn ? t("dashboard") : t("signIn")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section: Editorial & Tactile */}
      <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Mission & Metrics */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary font-medium tracking-wide">
              <span className="font-serif">検印</span>
              <span>{lang === "ja" ? "日印経済回廊のために設計" : "Built for the Japan–India business corridor"}</span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
              {lang === "ja" ? (
                <>
                  日本の中小企業に、
                  <br />
                  <span className="text-primary font-serif">確かなインド進出</span>の道を。
                </>
              ) : (
                <>
                  Precision expansion for
                  <br />
                  <span className="text-primary font-serif">Japanese SMEs</span> into India.
                </>
              )}
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {lang === "ja"
                ? "現地公認会計士（CA）による税務・法人設立から、提携先JV発掘、州別販売店マッチング、現地有償ディーラー調査まで。不透明な仲介者を排した確かなビジネス回廊。"
                : "From Chartered Accountants for GST and FDI compliance, to Joint Venture partners, state-level distributors, and real-time dealer surveys — a direct, institutional corridor."}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="shadow-paper">
                <Link to={signedIn ? "/dashboard" : "/auth"}>
                  {signedIn ? (lang === "ja" ? "ダッシュボードを開く" : "Open Dashboard") : (lang === "ja" ? "進出ポータルを開始" : "Enter Platform")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/overview">
                  {lang === "ja" ? "4大重点分野を見る" : "Explore Priority Sectors"}
                </Link>
              </Button>
            </div>

            {/* Grounded Bilateral Trust Metrics */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border/80 pt-8">
              <div>
                <div className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">1,400+</div>
                <div className="mt-1 text-xs text-muted-foreground leading-snug">
                  {lang === "ja" ? "在インド日系企業拠点" : "Japanese companies in India"}
                </div>
              </div>
              <div>
                <div className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-primary">12</div>
                <div className="mt-1 text-xs text-muted-foreground leading-snug">
                  {lang === "ja" ? "日系専用工業団地 (JIT)" : "Dedicated Industrial Parks"}
                </div>
              </div>
              <div>
                <div className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">28</div>
                <div className="mt-1 text-xs text-muted-foreground leading-snug">
                  {lang === "ja" ? "全土ディストリビューター網" : "States distributor coverage"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Tactile Corridor Dossier */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-paper">
              {/* Dossier Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary font-serif font-bold text-xs">
                    印
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-wide text-foreground">
                      {lang === "ja" ? "日印商談コンソール" : "Corridor Operations Console"}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Verified Match Preview</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  LIVE · JIT-PUNE
                </span>
              </div>

              {/* Console Tabs */}
              <div className="mt-4 flex gap-1 rounded-lg bg-muted/60 p-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab("match")}
                  className={`flex-1 rounded-md py-1.5 transition-colors ${
                    activeTab === "match" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang === "ja" ? "企業マッチング" : "JV Matching"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("clusters")}
                  className={`flex-1 rounded-md py-1.5 transition-colors ${
                    activeTab === "clusters" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang === "ja" ? "拠点クラスター" : "Hub Clusters"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("survey")}
                  className={`flex-1 rounded-md py-1.5 transition-colors ${
                    activeTab === "survey" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang === "ja" ? "現地ディーラー調査" : "Field Survey"}
                </button>
              </div>

              {/* Tab 1: Live JV Match Preview */}
              {activeTab === "match" && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-lg border border-border/80 bg-background/50 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">Nagoya Precision Tech (SME)</span>
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                        96% Compatibility
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Objective: Joint Venture & CNC Component Sourcing
                    </div>
                    <div className="my-3 flex items-center justify-center">
                      <div className="h-px flex-1 bg-border" />
                      <span className="px-2 text-[10px] font-mono text-muted-foreground">EXCHANGE ROUTE</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">Deccan Precision Engineering</span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <MapPin className="h-3 w-3 text-primary" /> Pune, MH
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Capability: ISO 9001 · Automotive Tier-1 Supply Chain
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded border border-border/70 p-2.5">
                      <div className="text-muted-foreground">FDI Regulatory Route</div>
                      <div className="mt-0.5 font-semibold text-emerald-600">100% Automatic (RBI)</div>
                    </div>
                    <div className="rounded border border-border/70 p-2.5">
                      <div className="text-muted-foreground">Compliance Intake</div>
                      <div className="mt-0.5 font-semibold text-foreground">CA Verified & GST Ready</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Clusters */}
              {activeTab === "clusters" && (
                <div className="mt-5 space-y-3 text-xs">
                  <div className="rounded border border-border/80 p-3">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Supa Japanese Industrial Township</span>
                      <span className="text-[10px] text-primary">Maharashtra</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Key hub for automotive components, precision engineering, and consumer machinery.
                    </p>
                  </div>
                  <div className="rounded border border-border/80 p-3">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Neemrana Industrial Zone</span>
                      <span className="text-[10px] text-primary">Rajasthan</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Over 50 Japanese manufacturers with dedicated social infrastructure and logistics.
                    </p>
                  </div>
                  <div className="rounded border border-border/80 p-3">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Dholera Special Investment Region</span>
                      <span className="text-[10px] text-primary">Gujarat</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Semiconductor fab facilities, high-speed rail corridor, and green energy grid.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Dealer Survey Fieldwork */}
              {activeTab === "survey" && (
                <div className="mt-5 space-y-3">
                  <div className="rounded-lg border border-border/80 bg-background/50 p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Agri-Machinery Field Study</span>
                      <span className="text-[10px] font-mono text-primary">RUNNING</span>
                    </div>
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      Targeting rural machinery dealers across Punjab, Haryana, and Uttar Pradesh.
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] border-t border-border/50 pt-2">
                      <span className="text-muted-foreground">Responses Collected:</span>
                      <span className="font-semibold text-foreground">48 verified dealers</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Avg. Dealer Willingness:</span>
                      <span className="font-semibold text-emerald-600">8.4 / 10 Score</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-border/60">
                <Button asChild variant="outline" className="w-full text-xs" size="sm">
                  <Link to="/tax-compliance">
                    {lang === "ja" ? "進出適合性診断を開始する" : "Run Expansion Assessment"}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Stage Market Entry Corridor Architecture */}
      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-border/80">
            <div>
              <div className="text-xs font-serif font-bold tracking-widest text-primary uppercase">
                {lang === "ja" ? "段階的進出フレームワーク" : "Three-Stage Expansion Architecture"}
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
                {lang === "ja" ? "確実なインド展開を実現する3段階" : "Structured for institutional rigor"}
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              {lang === "ja"
                ? "法務基盤の整備から現地実態調査、そして商流提携まで。一貫した安全保障とコンプライアンスを提供します。"
                : "A proven, sequenced entry path designed to de-risk market exploration and eliminate predatory intermediaries."}
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Stage 1 */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-background p-7 shadow-paper">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-primary">STAGE 01</span>
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  {lang === "ja" ? "法務・税務・法人設立" : "Compliance & Legal Anchor"}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {lang === "ja"
                    ? "公認会計士（CA）および会社秘書役（CS）と直接接続。GST登録、PAN/TAN取得、FDI認可ルートの選定、移転価格税制の事前対策。"
                    : "Direct consultation with vetted Indian Chartered Accountants and CS firms. GST registration, RBI FDI documentation, and cross-border transfer pricing setup."}
                </p>
              </div>
              <div className="mt-6 border-t border-border/60 pt-4">
                <Link to="/advisors" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
                  {lang === "ja" ? "専門家ディレクトリを見る" : "Browse Compliance Experts"} →
                </Link>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-background p-7 shadow-paper">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-primary">STAGE 02</span>
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  {lang === "ja" ? "現場ディーラー実態調査" : "Ground Dealer Intelligence"}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {lang === "ja"
                    ? "製品コンセプトや価格受容性を、現地28州の流通店・小規模ディーラーに有償アンケート調査。Chart.jsとインド全土ヒートマップで即座に分析。"
                    : "Commission paid surveys with real local dealers across industrial states. View real-time feedback with interactive Indian state heatmaps and price tolerance charts."}
                </p>
              </div>
              <div className="mt-6 border-t border-border/60 pt-4">
                <Link to="/surveys" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
                  {lang === "ja" ? "調査キャンペーンを設計" : "Design Dealer Campaign"} →
                </Link>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-background p-7 shadow-paper">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-primary">STAGE 03</span>
                  <Handshake className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  {lang === "ja" ? "合弁・販売網・人材獲得" : "Alliances & Distribution"}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {lang === "ja"
                    ? "検証済みのインド現地JVパートナー、倉庫監査済みのディストリビューター、日本語・異文化トレーニング講師との安全な商談連携。"
                    : "Form joint ventures with vetted Indian manufacturers, establish warehousing distributor networks, and onboard certified bilingual talent and cultural tutors."}
                </p>
              </div>
              <div className="mt-6 border-t border-border/60 pt-4">
                <Link to="/distributors" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
                  {lang === "ja" ? "販売代理店を探す" : "Find Vetted Distributors"} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Priority Sectors Showcase */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border/80">
          <div>
            <div className="text-xs font-serif font-bold tracking-widest text-primary uppercase">
              {lang === "ja" ? "重点協力産業" : "Priority Bilateral Sectors"}
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
              {lang === "ja" ? "日印で共創が加速する4大産業" : "Four strategic growth domains"}
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/overview">
              {lang === "ja" ? "セクター全容を見る" : "All Sector Dashboards"}
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Semiconductor */}
          <Link
            to="/semiconductor"
            className="group rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                半
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold">Semiconductor</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Chip design, OSAT, component sourcing and fab packaging alliances under India's ISM framework.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
              Explore Corridor <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </Link>

          {/* AI Innovation */}
          <Link
            to="/ai-innovation"
            className="group rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                智
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold">AI &amp; Innovation</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Multilingual NLP, factory computer vision, robotics perception and offshore development labs.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
              Explore Corridor <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </Link>

          {/* GreenTech */}
          <Link
            to="/greentech"
            className="group rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                緑
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold">GreenTech &amp; Clean Energy</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Utility-scale solar EPC, EV battery lifecycle, recycling, and industrial energy decarbonization.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
              Explore Corridor <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </Link>

          {/* Sustainable Agriculture */}
          <Link
            to="/sustainable-agriculture"
            className="group rounded-xl border border-border/80 bg-card p-6 shadow-paper transition-all hover:border-primary hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wheat className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                農
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold">AgriTech &amp; Food Processing</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Precision farming machinery, solar cold-chain storage, and sustainable food value chains.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
              Explore Corridor <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Institutional Callout & Bottom Conversion */}
      <section className="border-t border-border bg-ink text-ink-foreground py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-serif text-primary-foreground/70">
                <span>印日経済連携協定 (CEPA) 活用推進</span>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                {lang === "ja"
                  ? "日印ビジネスの新しい標準を、貴社の事業に。"
                  : "Ready to establish your Japan–India commercial presence?"}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-ink-foreground/70">
                {lang === "ja"
                  ? "数分で進出適合性診断を完了し、認証済みの専門家や提携候補と直接つながることができます。"
                  : "Complete our tax & market readiness assessment in under 5 minutes to access verified partners and advisory teams."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild variant="saffron" size="lg">
                <Link to="/auth">{t("getStarted")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-ink-foreground/20 text-ink-foreground hover:bg-ink-foreground/10">
                <Link to="/overview">{lang === "ja" ? "プラットフォーム概要" : "View Overview"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-border/80 bg-background py-10 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-foreground">nippon2bharat</span>
            <span>·</span>
            <span>Bilateral SME Expansion Infrastructure</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Tokyo · Bengaluru · Mumbai · New Delhi</span>
            <span>© {new Date().getFullYear()} nippon2bharat</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
