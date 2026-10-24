import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calculator, Handshake, Truck, Languages, ClipboardList, ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LangToggle, useT, type TKey } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "nippon2japan — Helping Japanese SMEs enter India" },
      { name: "description", content: "JETRO platform connecting Japanese SMEs with Indian CAs, JV partners, distributors, language tutors and paid dealer surveys." },
      { property: "og:title", content: "nippon2japan — Helping Japanese SMEs enter India" },
      { property: "og:description", content: "Advisors, joint ventures, distributors, language training and dealer insight — in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features: { icon: typeof Calculator; title: TKey; desc: TKey; n: string }[] = [
  { icon: Calculator, title: "advisors", desc: "advisorsDesc", n: "一" },
  { icon: Handshake, title: "jv", desc: "jvDesc", n: "二" },
  { icon: Truck, title: "distributors", desc: "distDesc", n: "三" },
  { icon: Languages, title: "tutors", desc: "tutorsDesc", n: "四" },
  { icon: ClipboardList, title: "surveys", desc: "surveysDesc", n: "五" },
];

function Index() {
  const { t } = useT();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, []);

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <LangToggle />
          <Button asChild variant={signedIn ? "default" : "ink"} size="sm">
            <Link to={signedIn ? "/dashboard" : "/auth"}>{signedIn ? t("dashboard") : t("signIn")}</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-8 pb-16 md:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="hanko px-2 py-1 text-xs">JETRO × INDIA</span>
          <h1 className="mt-6 text-5xl leading-[1.05] font-extrabold md:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">{t("heroSub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to={signedIn ? "/dashboard" : "/auth"}>
                {t("getStarted")} <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            <div><div className="font-display text-3xl font-bold">1,400+</div><div className="text-muted-foreground">Japanese firms in India</div></div>
            <div><div className="font-display text-3xl font-bold">28</div><div className="text-muted-foreground">States covered</div></div>
          </div>
        </div>
        <img src={hero} alt="Mount Fuji and the Gateway of India joined by a river" width={1600} height={912} className="w-full rounded-lg shadow-paper" />
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="rule-ink w-48" />
          <h2 className="mt-4 text-3xl font-bold">Everything you need to enter India</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="bg-card p-8">
                <div className="flex items-center justify-between">
                  <f.icon className="h-6 w-6 text-primary" />
                  <span className="font-display text-2xl text-muted-foreground/50">{f.n}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{t(f.title)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(f.desc)}</p>
              </div>
            ))}
            <div className="flex flex-col justify-between bg-ink p-8 text-ink-foreground">
              <h3 className="text-xl font-bold">Japanese & Indian companies, experts and dealers — one network.</h3>
              <Button asChild variant="saffron" className="mt-6 self-start">
                <Link to="/auth">{t("getStarted")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} nippon2japan · Supporting Japan–India SME trade
      </footer>
    </div>
  );
}
