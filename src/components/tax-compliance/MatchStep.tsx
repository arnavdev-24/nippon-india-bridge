import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DEMO_EXPERTS, INDUSTRIES, SERVICES, scoreExpert,
  type Expert, type IndustryKey, type ServiceKey,
} from "@/lib/tax-compliance";
import { ExpertCard } from "./ExpertCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Empty } from "@/components/PageHeader";

type Filters = {
  designation: "" | "ca" | "cs";
  industry: "" | IndustryKey;
  service: "" | ServiceKey;
  language: string;
  mode: "" | "online" | "in_person";
  maxFee: string;
  availability: "" | "online" | "in_person";
};

const EMPTY_FILTERS: Filters = { designation: "", industry: "", service: "", language: "", mode: "", maxFee: "", availability: "" };

function useExperts() {
  return useQuery({
    queryKey: ["tc-experts"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles").select("*").eq("account_type", "expert").in("expert_type", ["ca", "cs"]);
      if (error) throw error;
      const ids = profiles.map((p) => p.id);
      const { data: details, error: e2 } = ids.length
        ? await supabase.from("expert_profiles").select("*").in("expert_id", ids)
        : { data: [], error: null };
      if (e2) throw e2;
      const byId = new Map((details ?? []).map((d) => [d.expert_id, d]));
      return profiles.map((p): Expert => {
        const d = byId.get(p.id);
        return {
          id: p.id, demo: false, name: p.full_name ?? "Unnamed",
          designation: (p.expert_type === "cs" ? "cs" : "ca"),
          company: p.company_name,
          specializations: d?.specializations ?? [],
          industries: d?.industries ?? (p.industry ? [p.industry] : []),
          languages: d?.languages ?? ["English"],
          qualifications: d?.qualifications ?? null,
          years_experience: d?.years_experience ?? null,
          verified: d?.verified ?? false,
          offers_online: d?.offers_online ?? true,
          offers_in_person: d?.offers_in_person ?? false,
          office_address: d?.office_address ?? null,
          office_city: d?.office_city ?? null,
          city: p.city, state: p.state, rate_inr: p.rate_inr, bio: p.bio,
        };
      });
    },
  });
}

export function MatchStep({ industry, services, onBack, onBook }: {
  industry: IndustryKey | "";
  services: ServiceKey[];
  onBack: () => void;
  onBook: (e: Expert) => void;
}) {
  const { data: realExperts = [], isLoading, isError } = useExperts();
  const [f, setF] = useState<Filters>(EMPTY_FILTERS);

  const experts = useMemo(() => {
    // Demo profiles appear only when real expert data is unavailable.
    const base = realExperts.length >= 3 ? realExperts : [...realExperts, ...DEMO_EXPERTS];
    return [...base].sort((a, b) => scoreExpert(b, industry, services) - scoreExpert(a, industry, services));
  }, [realExperts, industry, services]);

  const filtered = experts.filter((e) => {
    if (f.designation && e.designation !== f.designation) return false;
    if (f.industry && !e.industries.includes(f.industry)) return false;
    if (f.service && !e.specializations.includes(f.service)) return false;
    if (f.language && !e.languages.some((l) => l.toLowerCase().includes(f.language.toLowerCase()))) return false;
    const mode = f.mode || f.availability;
    if (mode === "online" && !e.offers_online) return false;
    if (mode === "in_person" && !e.offers_in_person) return false;
    const max = Number(f.maxFee);
    if (f.maxFee && Number.isFinite(max) && (e.rate_inr == null || e.rate_inr > max)) return false;
    return true;
  });

  const selectCls = "h-9 w-full rounded-md border border-input bg-background px-2 text-sm";

  return (
    <div>
      <h2 className="text-2xl font-bold">Match with industry-specific experts</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Ranked by expertise in {industry ? INDUSTRIES.find((i) => i.key === industry)?.name : "your industry"} first, then your required services.
      </p>

      <div className="mt-6 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><Label>CA / CS</Label>
          <select className={`${selectCls} mt-1`} value={f.designation} onChange={(e) => setF({ ...f, designation: e.target.value as Filters["designation"] })}>
            <option value="">Any</option><option value="ca">Chartered Accountant</option><option value="cs">Company Secretary</option>
          </select></div>
        <div><Label>Industry expertise</Label>
          <select className={`${selectCls} mt-1`} value={f.industry} onChange={(e) => setF({ ...f, industry: e.target.value as Filters["industry"] })}>
            <option value="">Any</option>
            {INDUSTRIES.map((i) => <option key={i.key} value={i.key}>{i.name}</option>)}
          </select></div>
        <div><Label>Required service</Label>
          <select className={`${selectCls} mt-1`} value={f.service} onChange={(e) => setF({ ...f, service: e.target.value as Filters["service"] })}>
            <option value="">Any</option>
            {SERVICES.filter((s) => s.key !== "not_sure").map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
          </select></div>
        <div><Label>Language</Label>
          <select className={`${selectCls} mt-1`} value={f.language} onChange={(e) => setF({ ...f, language: e.target.value })}>
            <option value="">Any</option><option>English</option><option>Japanese</option><option>Hindi</option>
          </select></div>
        <div><Label>Consultation mode</Label>
          <select className={`${selectCls} mt-1`} value={f.mode} onChange={(e) => setF({ ...f, mode: e.target.value as Filters["mode"] })}>
            <option value="">Any</option><option value="online">Online</option><option value="in_person">In person</option>
          </select></div>
        <div><Label>Budget (max ₹/hr)</Label>
          <Input className="mt-1" type="number" min={0} placeholder="e.g. 5000" value={f.maxFee} onChange={(e) => setF({ ...f, maxFee: e.target.value })} /></div>
        <div><Label>Availability</Label>
          <select className={`${selectCls} mt-1`} value={f.availability} onChange={(e) => setF({ ...f, availability: e.target.value as Filters["availability"] })}>
            <option value="">Any</option><option value="online">Online sessions</option><option value="in_person">In-person meetings</option>
          </select></div>
        <div className="flex items-end"><Button variant="ghost" size="sm" onClick={() => setF(EMPTY_FILTERS)}>Clear filters</Button></div>
      </div>

      {isLoading ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">Loading experts…</p>
      ) : isError ? (
        <div className="mt-6"><Empty>Could not load experts. Please try again.</Empty></div>
      ) : filtered.length === 0 ? (
        <div className="mt-6"><Empty>No experts match these filters yet. Try widening your filters.</Empty></div>
      ) : (
        <>
          {realExperts.length < 3 && (
            <p className="mt-6 rounded-md bg-saffron/10 px-3 py-2 text-xs text-saffron-foreground">
              Few verified professionals are listed yet, so demo profiles are shown below for illustration. They are clearly labelled and are not real CAs or CSs.
            </p>
          )}
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((e, i) => <ExpertCard key={e.id ?? `demo-${i}`} expert={e} onBook={onBook} />)}
          </div>
        </>
      )}
      <div className="mt-8"><Button variant="outline" onClick={onBack}>Back</Button></div>
    </div>
  );
}
