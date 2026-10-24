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

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Your profile — nippon2japan" }, { name: "description", content: "Edit your nippon2japan profile." }, { property: "og:title", content: "Your profile" }, { property: "og:description", content: "Edit your profile." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: p } = useMyProfile();
  const qc = useQueryClient();
  const [f, setF] = useState({ full_name: "", company_name: "", industry: "", city: "", state: "", bio: "", rate_inr: "" });
  useEffect(() => {
    if (p) setF({ full_name: p.full_name ?? "", company_name: p.company_name ?? "", industry: p.industry ?? "", city: p.city ?? "", state: p.state ?? "", bio: p.bio ?? "", rate_inr: p.rate_inr?.toString() ?? "" });
  }, [p]);
  if (!p) return null;
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  async function save() {
    const { error } = await supabase.from("profiles").update({ ...f, rate_inr: f.rate_inr ? Number(f.rate_inr) : null }).eq("id", p!.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved");
    qc.invalidateQueries();
  }
  return (
    <div className="max-w-2xl">
      <PageHeader kanji="人" title="Your profile"
        desc={`${ACCOUNT_TYPES[p.account_type as keyof typeof ACCOUNT_TYPES] ?? ""}${p.expert_type ? " · " + EXPERT_TYPES[p.expert_type as keyof typeof EXPERT_TYPES] : ""}`} />
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>Name</Label><Input className="mt-1" value={f.full_name} onChange={set("full_name")} /></div>
        <div><Label>Company / practice</Label><Input className="mt-1" value={f.company_name} onChange={set("company_name")} /></div>
        <div><Label>Industry</Label><Input className="mt-1" value={f.industry} onChange={set("industry")} /></div>
        {p.account_type === "expert" && <div><Label>Rate (₹ / hour)</Label><Input type="number" className="mt-1" value={f.rate_inr} onChange={set("rate_inr")} /></div>}
        <div><Label>City</Label><Input className="mt-1" value={f.city} onChange={set("city")} /></div>
        <div><Label>State</Label><Input className="mt-1" value={f.state} onChange={set("state")} /></div>
        <div className="md:col-span-2"><Label>About</Label><Textarea rows={4} className="mt-1" value={f.bio} onChange={set("bio")} /></div>
      </div>
      <Button className="mt-6" onClick={save}>Save</Button>
    </div>
  );
}
