import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LayoutDashboard, Calculator, CalendarCheck, Handshake, Truck, Languages, ClipboardList, Inbox, LogOut, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { LangToggle, useT, type TKey } from "@/lib/i18n";
import { ACCOUNT_TYPES, EXPERT_TYPES, useMyProfile } from "@/lib/profile";
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

const nav: { to: string; key: TKey; icon: typeof Inbox }[] = [
  { to: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { to: "/advisors", key: "advisors", icon: Calculator },
  { to: "/joint-ventures", key: "jv", icon: Handshake },
  { to: "/distributors", key: "distributors", icon: Truck },
  { to: "/tutors", key: "tutors", icon: Languages },
  { to: "/surveys", key: "surveys", icon: ClipboardList },
  { to: "/consultations", key: "consultations", icon: CalendarCheck },
  { to: "/connections", key: "connections", icon: Inbox },
  { to: "/profile", key: "profile", icon: UserRound },
];

function Shell() {
  const { t } = useT();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyProfile();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-sidebar p-4 text-sidebar-foreground md:flex">
        <div className="px-2 py-2"><Logo light /></div>
        <nav className="mt-6 flex-1 space-y-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              activeProps={{ className: "bg-sidebar-accent !text-sidebar-foreground border-l-2 border-sidebar-primary" }}>
              <n.icon className="h-4 w-4" /> {t(n.key)}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border pt-4 text-xs">
          <div className="truncate px-2 font-medium">{profile?.full_name ?? "—"}</div>
          <div className="truncate px-2 text-sidebar-foreground/60">{profile?.account_type ? ACCOUNT_TYPES[profile.account_type as keyof typeof ACCOUNT_TYPES] : ""}</div>
          <button onClick={signOut} className="mt-3 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sidebar-foreground/75 hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" /> {t("signOut")}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="md:hidden"><Logo /></div>
          <nav className="flex gap-1 overflow-x-auto md:hidden">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="rounded p-2 text-muted-foreground" activeProps={{ className: "text-primary" }}>
                <n.icon className="h-4 w-4" />
              </Link>
            ))}
          </nav>
          <div className="ml-auto"><LangToggle /></div>
        </header>
        <main className="flex-1 px-6 py-8 md:px-10">
          {isLoading ? null : profile && !profile.account_type ? <Onboarding /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}

function Onboarding() {
  const qc = useQueryClient();
  const { data: profile } = useMyProfile();
  const [f, setF] = useState({ account_type: "japanese_company", expert_type: "ca", full_name: profile?.full_name ?? "", company_name: "" });
  async function save() {
    if (!profile) return;
    const { error } = await supabase.from("profiles").update({
      account_type: f.account_type, expert_type: f.account_type === "expert" ? f.expert_type : null,
      full_name: f.full_name, company_name: f.company_name,
    }).eq("id", profile.id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["my-profile"] });
  }
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-3xl font-bold">Tell us about you</h1>
      <p className="mt-2 text-muted-foreground">Choose how you'll use nippon2japan.</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {Object.entries(ACCOUNT_TYPES).map(([k, v]) => (
          <button key={k} onClick={() => setF({ ...f, account_type: k })}
            className={`rounded-md border p-3 text-left text-sm ${f.account_type === k ? "border-primary bg-primary/5" : "border-border text-muted-foreground"}`}>{v}</button>
        ))}
      </div>
      {f.account_type === "expert" && (
        <select value={f.expert_type} onChange={(e) => setF({ ...f, expert_type: e.target.value })} className="mt-4 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
          {Object.entries(EXPERT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div><Label>Name</Label><Input className="mt-2" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
        <div><Label>Company / practice</Label><Input className="mt-2" value={f.company_name} onChange={(e) => setF({ ...f, company_name: e.target.value })} /></div>
      </div>
      <Button className="mt-6" onClick={save}>Continue</Button>
    </div>
  );
}
