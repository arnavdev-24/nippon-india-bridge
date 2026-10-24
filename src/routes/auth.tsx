import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { SIGNUP_ACCOUNT_TYPES as ACCOUNT_TYPES, EXPERT_TYPES } from "@/lib/profile";
import { LangToggle } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — nippon2japan" },
      { name: "description", content: "Sign in or create a nippon2japan account for your company, expert practice or dealership." },
      { property: "og:title", content: "Sign in — nippon2japan" },
      { property: "og:description", content: "Join the Japan–India SME business network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    email: "", password: "", full_name: "", company_name: "",
    account_type: "japanese_company", expert_type: "ca",
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

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
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
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-10 text-ink-foreground md:flex">
        <Logo light />
        <div>
          <p className="font-display text-4xl leading-tight font-bold">一期一会<br /><span className="text-saffron">एक अवसर</span></p>
          <p className="mt-4 max-w-sm text-sm opacity-70">Every meeting is a once-in-a-lifetime chance. Build yours across Japan and India.</p>
        </div>
        <span className="text-xs opacity-50">Supported by JETRO</span>
      </div>

      <div className="flex flex-col p-6">
        <div className="flex justify-end"><LangToggle /></div>
        <div className="m-auto w-full max-w-md">
          {sent ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold">Check your email</h1>
              <p className="mt-3 text-muted-foreground">We sent a confirmation link to {form.email}. Click it to activate your account.</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{mode === "in" ? "Welcome back" : "Create your account"}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === "in" ? "New here?" : "Already registered?"}{" "}
                <button className="text-primary underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
                  {mode === "in" ? "Create an account" : "Sign in"}
                </button>
              </p>

              <Button variant="outline" className="mt-6 w-full" onClick={google}>Continue with Google</Button>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={submit} className="space-y-4">
                {mode === "up" && (
                  <>
                    <div>
                      <Label>I am a…</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {Object.entries(ACCOUNT_TYPES).map(([k, v]) => (
                          <button type="button" key={k} onClick={() => setForm({ ...form, account_type: k })}
                            className={`rounded-md border p-3 text-left text-sm transition-colors ${form.account_type === k ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    {form.account_type === "expert" && (
                      <div>
                        <Label>Expertise</Label>
                        <select value={form.expert_type} onChange={set("expert_type")} className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                          {Object.entries(EXPERT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Your name</Label><Input required value={form.full_name} onChange={set("full_name")} className="mt-2" /></div>
                      <div><Label>{form.account_type === "expert" ? "Practice name" : "Company"}</Label><Input value={form.company_name} onChange={set("company_name")} className="mt-2" /></div>
                    </div>
                  </>
                )}
                <div><Label>Email</Label><Input type="email" required value={form.email} onChange={set("email")} className="mt-2" /></div>
                <div><Label>Password</Label><Input type="password" required minLength={6} value={form.password} onChange={set("password")} className="mt-2" /></div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
