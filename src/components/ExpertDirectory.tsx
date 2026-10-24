import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EXPERT_TYPES } from "@/lib/profile";
import { Empty } from "@/components/PageHeader";
import { RequestDialog } from "@/components/RequestDialog";

type ET = keyof typeof EXPERT_TYPES;

export function ExpertDirectory({ types, kind }: { types: ET[]; kind: "advisory" | "tutoring" }) {
  const [filter, setFilter] = useState<ET | "all">("all");
  const { data = [], isLoading } = useQuery({
    queryKey: ["experts", types],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("account_type", "expert").in("expert_type", types).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const list = filter === "all" ? data : data.filter((e) => e.expert_type === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", ...types] as const).map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`rounded-full border px-4 py-1.5 text-sm ${filter === t ? "border-ink bg-ink text-ink-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {t === "all" ? "All" : EXPERT_TYPES[t]}
          </button>
        ))}
      </div>
      {isLoading ? null : list.length === 0 ? (
        <Empty>No experts listed yet. Experts can join by signing up as "Expert" — invite your CA or tutor!</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((e) => (
            <div key={e.id} className="rounded-lg border border-border bg-card p-5 shadow-paper">
              <div className="text-xs font-medium tracking-wide text-primary uppercase">{EXPERT_TYPES[e.expert_type as ET]}</div>
              <h3 className="mt-2 text-lg font-bold">{e.full_name ?? "Unnamed"}</h3>
              {e.company_name && <div className="text-sm text-muted-foreground">{e.company_name}</div>}
              {(e.city || e.state) && <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{[e.city, e.state].filter(Boolean).join(", ")}</div>}
              {e.bio && <p className="mt-3 line-clamp-3 text-sm">{e.bio}</p>}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm">{e.rate_inr ? `₹${e.rate_inr.toLocaleString("en-IN")}/hr` : ""}</span>
                <RequestDialog toUser={e.id} toName={e.full_name ?? "expert"} kind={kind} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
