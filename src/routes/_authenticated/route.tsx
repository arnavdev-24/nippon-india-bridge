import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  LayoutDashboard,
  Calculator,
  CalendarCheck,
  Handshake,
  Truck,
  Languages,
  ClipboardList,
  Inbox,
  LogOut,
  UserRound,
  Globe2,
  Users,
  ShieldCheck,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { LangToggle, useT, type TKey } from "@/lib/i18n";
import { ACCOUNT_TYPES, EXPERT_TYPES, SIGNUP_ACCOUNT_TYPES, useMyProfile } from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  component: Shell,
});

type NavItem = { to: string; key: TKey; icon: typeof Inbox };

const navGroups: { labelEn: string; labelJa: string; items: NavItem[] }[] = [
  {
    labelEn: "OVERVIEW",
    labelJa: "中枢",
    items: [
      { to: "/dashboard", key: "dashboard", icon: LayoutDashboard },
      { to: "/overview", key: "overview", icon: Globe2 },
    ],
  },
  {
    labelEn: "REGULATORY & TAX",
    labelJa: "法務・税務",
    items: [
      { to: "/advisors", key: "advisors", icon: Calculator },
      { to: "/consultations", key: "consultations", icon: CalendarCheck },
    ],
  },
  {
    labelEn: "COMMERCIAL EXPANSION",
    labelJa: "提携・販売網",
    items: [
      { to: "/joint-ventures", key: "jv", icon: Handshake },
      { to: "/distributors", key: "distributors", icon: Truck },
    ],
  },
  {
    labelEn: "INTELLIGENCE & TALENT",
    labelJa: "調査・人材",
    items: [
      { to: "/surveys", key: "surveys", icon: ClipboardList },
      { to: "/talent", key: "talent", icon: Users },
      { to: "/tutors", key: "tutors", icon: Languages },
    ],
  },
  {
    labelEn: "COMMUNICATIONS",
    labelJa: "連絡・設定",
    items: [
      { to: "/connections", key: "connections", icon: Inbox },
      { to: "/profile", key: "profile", icon: UserRound },
    ],
  },
];

function Shell() {
  const { t, lang } = useT();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Editorial Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 text-sidebar-foreground md:flex">
        <div className="px-1 py-1">
          <Logo light />
          <div className="mt-1 text-[10px] tracking-widest text-sidebar-foreground/50 uppercase font-mono">
            Bilateral Corridor Console
          </div>
        </div>

        {/* Categorized Nav Groups */}
        <nav className="mt-6 flex-1 space-y-5 overflow-y-auto pr-1">
          {navGroups.map((group) => (
            <div key={group.labelEn}>
              <div className="px-2.5 mb-1.5 text-[10px] font-mono font-medium tracking-wider text-sidebar-foreground/40 uppercase">
                {lang === "ja" ? group.labelJa : group.labelEn}
              </div>
              <div className="space-y-0.5">
                {group.items.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    activeProps={{
                      className: "bg-sidebar-accent !text-sidebar-foreground font-semibold border-l-2 border-primary",
                    }}
                  >
                    <n.icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                    <span>{t(n.key)}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border pt-4 text-xs">
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-sidebar-accent text-[11px] font-bold text-primary">
              {profile?.full_name?.charAt(0) || "印"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-sidebar-foreground text-[11px]">
                {profile?.full_name ?? "Member"}
              </div>
              <div className="truncate text-[10px] text-sidebar-foreground/60">
                {profile?.account_type ? ACCOUNT_TYPES[profile.account_type as keyof typeof ACCOUNT_TYPES] : ""}
              </div>
            </div>
          </div>

          <button
            onClick={signOut}
            className="mt-3 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{t("signOut")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/80 bg-background/90 px-6 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Logo />
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-foreground">JETRO × DPIIT Bilateral Trade Corridor</span>
            <span>·</span>
            <span>RBI Automatic FDI Guidelines Active</span>
          </div>

          <div className="flex items-center gap-3">
            <LangToggle />
          </div>
        </header>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="border-b border-border bg-sidebar p-4 text-sidebar-foreground md:hidden">
            <nav className="space-y-4">
              {navGroups.map((group) => (
                <div key={group.labelEn}>
                  <div className="px-2 mb-1 text-[10px] font-mono text-sidebar-foreground/40">
                    {lang === "ja" ? group.labelJa : group.labelEn}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {group.items.map((n) => (
                      <Link
                        key={n.to}
                        to={n.to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded p-2 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent"
                        activeProps={{ className: "bg-sidebar-accent text-sidebar-foreground font-bold" }}
                      >
                        <n.icon className="h-3.5 w-3.5" />
                        <span>{t(n.key)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="mt-4 border-t border-sidebar-border pt-3">
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-xs text-sidebar-foreground/70"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t("signOut")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Routed Content */}
        <main className="flex-1 px-6 py-8 md:px-10 lg:px-12">
          {isLoading ? null : profile && !profile.account_type ? <Onboarding /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}

function Onboarding() {
  const qc = useQueryClient();
  const { data: profile } = useMyProfile();
  const [f, setF] = useState({
    account_type: "japanese_company",
    expert_type: "ca",
    full_name: profile?.full_name ?? "",
    company_name: "",
  });

  async function save() {
    if (!profile) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        account_type: f.account_type,
        expert_type: f.account_type === "expert" ? f.expert_type : null,
        full_name: f.full_name,
        company_name: f.company_name,
      })
      .eq("id", profile.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["my-profile"] });
  }

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 shadow-paper">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Enterprise Registration</span>
      </div>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">Organization Profile Setup</h1>
      <p className="mt-1 text-sm text-muted-foreground">Select your operating entity type to configure your corridor permissions.</p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {Object.entries(SIGNUP_ACCOUNT_TYPES).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setF({ ...f, account_type: k })}
            className={`rounded-lg border p-3 text-left text-xs transition-colors ${
              f.account_type === k
                ? "border-primary bg-primary/5 font-semibold text-foreground shadow-sm"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {f.account_type === "expert" && (
        <select
          value={f.expert_type}
          onChange={(e) => setF({ ...f, expert_type: e.target.value })}
          className="mt-4 h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
        >
          {Object.entries(EXPERT_TYPES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <Label className="text-xs">Representative Name</Label>
          <Input className="mt-1.5 text-xs" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Company / Practice Name</Label>
          <Input className="mt-1.5 text-xs" value={f.company_name} onChange={(e) => setF({ ...f, company_name: e.target.value })} />
        </div>
      </div>

      <Button className="mt-6 w-full" onClick={save}>
        Complete Registration
      </Button>
    </div>
  );
}
