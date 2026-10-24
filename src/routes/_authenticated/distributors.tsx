import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Empty } from "@/components/PageHeader";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/distributors")({
  head: () => ({ meta: [{ title: "Find Distributors — nippon2japan" }, { name: "description", content: "See which Indian states your product sells best in and find distributors there." }, { property: "og:title", content: "Find Distributors" }, { property: "og:description", content: "Product → state → distributor." }] }),
  component: Distributors,
});

function Distributors() {
  const { t } = useT();
  const [category, setCategory] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);

  const { data: pop = [] } = useQuery({
    queryKey: ["popularity"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_state_popularity").select("*").order("score", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const categories = [...new Set(pop.map((p) => p.category))];
  const states = pop.filter((p) => p.category === category);

  const { data: dists = [] } = useQuery({
    queryKey: ["distributors", category, state],
    enabled: !!category && !!state,
    queryFn: async () => {
      const { data, error } = await supabase.from("distributors").select("*").eq("state", state!).contains("categories", [category!]);
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <PageHeader kanji="販" title={t("distributors")} desc={t("distDesc")} />
      <Step n="1" title="Which product do you sell?">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => { setCategory(c); setState(null); }}
              className={`rounded-md border px-4 py-2 text-sm ${category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-foreground/30"}`}>{c}</button>
          ))}
        </div>
      </Step>

      {category && (
        <Step n="2" title={`Where ${category} is most popular`}>
          <div className="grid gap-3 md:grid-cols-2">
            {states.map((s, i) => (
              <button key={s.id} onClick={() => setState(s.state)}
                className={`rounded-lg border p-4 text-left transition-colors ${state === s.state ? "border-primary bg-primary/5" : "border-border bg-card hover:border-foreground/30"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold">{i + 1}. {s.state}</span>
                  <span className="text-sm font-bold text-primary">{s.score}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-saffron" style={{ width: `${s.score}%` }} /></div>
                <p className="mt-2 text-xs text-muted-foreground">{s.insight}</p>
              </button>
            ))}
          </div>
        </Step>
      )}

      {category && state && (
        <Step n="3" title={`Distributors in ${state}`}>
          {dists.length === 0 ? <Empty>No distributors listed for this combination yet.</Empty> : (
            <div className="grid gap-4 md:grid-cols-2">
              {dists.map((d) => (
                <div key={d.id} className="rounded-lg border border-border bg-card p-5 shadow-paper">
                  <h3 className="text-lg font-bold">{d.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{d.city}, {d.state} · {d.years_active} yrs active</div>
                  <div className="mt-3 flex flex-wrap gap-1">{d.categories.map((c) => <span key={c} className="rounded bg-accent px-2 py-0.5 text-xs text-accent-foreground">{c}</span>)}</div>
                  <div className="mt-4 space-y-1 text-sm">
                    {d.contact_email && <a href={`mailto:${d.contact_email}`} className="flex items-center gap-2 text-primary hover:underline"><Mail className="h-4 w-4" />{d.contact_email}</a>}
                    {d.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{d.phone}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Step>
      )}
    </>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-sm text-ink-foreground">{n}</span>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
