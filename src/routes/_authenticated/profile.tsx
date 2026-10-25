import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ACCOUNT_TYPES, EXPERT_TYPES, useMyProfile } from "@/lib/profile";
import { Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Organization Profile — nippon2bharat" },
      { name: "description", content: "Manage your nippon2bharat enterprise or practice credentials." },
      { property: "og:title", content: "Organization Profile" },
      { property: "og:description", content: "Manage your profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: p } = useMyProfile();
  const qc = useQueryClient();
  const [f, setF] = useState({
    full_name: "",
    company_name: "",
    industry: "",
    city: "",
    state: "",
    bio: "",
    rate_inr: "",
  });

  useEffect(() => {
    if (p) {
      setF({
        full_name: p.full_name ?? "",
        company_name: p.company_name ?? "",
        industry: p.industry ?? "",
        city: p.city ?? "",
        state: p.state ?? "",
        bio: p.bio ?? "",
        rate_inr: p.rate_inr?.toString() ?? "",
      });
    }
  }, [p]);

  if (!p) return null;

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setForm({ ...f, [k]: e.target.value });
  const setForm = setF;

  async function save() {
    const { error } = await supabase
      .from("profiles")
      .update({
        ...f,
        rate_inr: f.rate_inr ? Number(f.rate_inr) : null,
      })
      .eq("id", p!.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved successfully");
    qc.invalidateQueries();
  }

  const roleTitle =
    (ACCOUNT_TYPES[p.account_type as keyof typeof ACCOUNT_TYPES] ?? "Member") +
    (p.expert_type ? ` · ${EXPERT_TYPES[p.expert_type as keyof typeof EXPERT_TYPES]}` : "");

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <PageHeader
        kanji="録"
        title="Organization & Corridor Profile"
        desc={`Credentials and operational details for ${roleTitle}.`}
      />

      <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 shadow-paper">
        <div className="flex items-center justify-between border-b border-border/60 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Verified Entity Details</h2>
              <p className="text-xs text-muted-foreground">{roleTitle}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Active Member
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 text-xs">
          <div>
            <Label className="text-xs">Authorized Representative Name</Label>
            <Input className="mt-1.5 text-xs" value={f.full_name} onChange={set("full_name")} />
          </div>

          <div>
            <Label className="text-xs">
              {p.account_type === "expert" ? "Practice / Firm Name" : "Company Legal Entity"}
            </Label>
            <Input className="mt-1.5 text-xs" value={f.company_name} onChange={set("company_name")} />
          </div>

          <div>
            <Label className="text-xs">Industry / Sector Specialization</Label>
            <Input className="mt-1.5 text-xs" value={f.industry} placeholder="e.g. Precision Engineering, Automotive" onChange={set("industry")} />
          </div>

          {p.account_type === "expert" && (
            <div>
              <Label className="text-xs">Consultation Advisory Rate (₹ / hour)</Label>
              <Input type="number" className="mt-1.5 text-xs" value={f.rate_inr} onChange={set("rate_inr")} />
            </div>
          )}

          <div>
            <Label className="text-xs">City / Municipal Base</Label>
            <Input className="mt-1.5 text-xs" value={f.city} placeholder="e.g. Pune, Tokyo, Bengaluru" onChange={set("city")} />
          </div>

          <div>
            <Label className="text-xs">State / Prefecture</Label>
            <Input className="mt-1.5 text-xs" value={f.state} placeholder="e.g. Maharashtra, Aichi" onChange={set("state")} />
          </div>

          <div className="md:col-span-2">
            <Label className="text-xs">Enterprise Bio &amp; Technical Capabilities</Label>
            <Textarea
              rows={4}
              className="mt-1.5 text-xs leading-relaxed"
              placeholder="Outline your manufacturing capabilities, product catalog, target industrial states, or partnership objectives."
              value={f.bio}
              onChange={set("bio")}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end border-t border-border/60 pt-5">
          <Button onClick={save} className="text-xs shadow-paper">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
