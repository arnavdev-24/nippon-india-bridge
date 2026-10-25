import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { SIGNUP_ACCOUNT_TYPES as ACCOUNT_TYPES, EXPERT_TYPES } from "@/lib/profile";
import { LangToggle, useT } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authentication — nippon2bharat" },
      { name: "description", content: "Sign in or create a nippon2bharat corridor account." },
      { property: "og:title", content: "Authentication — nippon2bharat" },
      { property: "og:description", content: "Join the Japan–India SME business network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { lang } = useT();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    company_name: "",
    account_type: "japanese_company",
    expert_type: "ca",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({ to: "/dashboard", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: form.full_name,
              company_name: form.company_name,
              account_type: form.account_type,
              expert_type: form.account_type === "expert" ? form.expert_type : null,
            },
          },
        });
        if (error) throw error;
        if (!data.session) setSent(true);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-12 bg-background antialiased">
      {/* Editorial Left Hero Column */}
      <div className="hidden lg:col-span-5 flex-col justify-between border-r border-sidebar-border bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div>
          <Logo light />
          <div className="mt-2 text-xs font-mono tracking-widest text-sidebar-foreground/50 uppercase">
            Bilateral Trade Infrastructure
          </div>
        </div>

        <div className="my-auto py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent px-3 py-1 text-xs text-primary font-medium">
            <span className="font-serif">印日連携</span>
            <span>CEPA &amp; JIT Industrial Corridor</span>
          </div>

          <h2 className="mt-6 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-sidebar-foreground leading-tight">
            一期一会
            <br />
            <span className="text-saffron font-sans font-extrabold text-2xl tracking-normal">
              एक अद्वितीय अवसर
            </span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-sidebar-foreground/70 leading-relaxed max-w-sm">
            Every cross-border alliance is a rare opportunity. We provide the institutional foundation, regulatory clearance, and verified network for Japanese and Indian enterprises.
          </p>

          <div className="mt-8 space-y-3 text-xs text-sidebar-foreground/80">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>Direct access to vetted Chartered Accountants (CA) &amp; CS</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>Distributor discovery by state, category and capability</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>Paid on-ground dealer surveys with real-time heat maps</span>
            </div>
          </div>
        </div>

        <div className="border-t border-sidebar-border/80 pt-6 text-[11px] text-sidebar-foreground/50 flex items-center justify-between">
          <span>Japan–India Business Corridor</span>
          <span>© {new Date().getFullYear()} nippon2bharat</span>
        </div>
      </div>

      {/* Auth Form Right Column */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-16">
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <LangToggle />
            <Button asChild variant="ghost" size="sm">
              <Link to="/">← {lang === "ja" ? "トップへ戻る" : "Back to Home"}</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md py-8">
          {sent ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center shadow-paper">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-2xl font-bold tracking-tight">Check your email</h1>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                We sent a secure activation link to <span className="font-semibold text-foreground">{form.email}</span>. Click it to verify your organization and enter the corridor.
              </p>
              <Button asChild variant="outline" className="mt-6 w-full text-xs">
                <Link to="/auth">Return to Sign In</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border/80 bg-card p-8 shadow-paper">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {mode === "in" ? (lang === "ja" ? "ログイン" : "Sign In") : (lang === "ja" ? "新規アカウント開設" : "Corridor Registration")}
                  </h1>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {mode === "in"
                      ? "Enter your credentials to access your expansion dashboard."
                      : "Register your enterprise, practice, or dealership."}
                  </p>
                </div>
              </div>

              {/* Toggle Mode Tabs */}
              <div className="mt-5 flex gap-1 rounded-lg bg-muted/60 p-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setMode("in")}
                  className={`flex-1 rounded-md py-1.5 transition-colors ${
                    mode === "in" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang === "ja" ? "ログイン" : "Sign In"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("up")}
                  className={`flex-1 rounded-md py-1.5 transition-colors ${
                    mode === "up" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang === "ja" ? "新規登録" : "Create Account"}
                </button>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full text-xs" onClick={google}>
                  Continue with Google
                </Button>
              </div>

              <div className="my-5 flex items-center gap-3 text-[11px] text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                <span>or continue with email</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={submit} className="space-y-4 text-xs">
                {mode === "up" && (
                  <>
                    <div>
                      <Label className="text-xs">Operating Entity Type</Label>
                      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                        {Object.entries(ACCOUNT_TYPES).map(([k, v]) => (
                          <button
                            type="button"
                            key={k}
                            onClick={() => setForm({ ...form, account_type: k })}
                            className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                              form.account_type === k
                                ? "border-primary bg-primary/5 font-semibold text-foreground shadow-xs"
                                : "border-border text-muted-foreground hover:border-primary/40"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.account_type === "expert" && (
                      <div>
                        <Label className="text-xs">Professional Practice Specialty</Label>
                        <select
                          value={form.expert_type}
                          onChange={set("expert_type")}
                          className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                        >
                          {Object.entries(EXPERT_TYPES).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Representative Name</Label>
                        <Input
                          required
                          value={form.full_name}
                          onChange={set("full_name")}
                          placeholder="e.g. Kenji Tanaka"
                          className="mt-1 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">
                          {form.account_type === "expert" ? "Practice / Firm" : "Company Name"}
                        </Label>
                        <Input
                          value={form.company_name}
                          onChange={set("company_name")}
                          placeholder="e.g. Tanaka Precision Ltd."
                          className="mt-1 text-xs"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-xs">Work Email Address</Label>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="tanaka@company.co.jp"
                    className="mt-1 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">Password</Label>
                  <Input
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="••••••••"
                    className="mt-1 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full text-xs mt-2" disabled={busy}>
                  {busy ? "Processing…" : mode === "in" ? "Sign In to Corridor" : "Establish Account"}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          )}
        </div>

        <div className="text-center text-[11px] text-muted-foreground">
          Protected by RBI &amp; MCA Bilateral Compliance Guidelines · Private &amp; Confidential
        </div>
      </div>
    </div>
  );
}
