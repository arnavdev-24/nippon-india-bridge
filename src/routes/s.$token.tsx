import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { ResponseForm } from "@/components/campaigns/ResponseForm";
import type { CustomQuestion } from "@/lib/campaigns";

export const Route = createFileRoute("/s/$token")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dealer Product Evaluation — Japan2Nippon" }, { name: "description", content: "Share your commercial evaluation of a Japanese product for the Indian market." }, { property: "og:title", content: "Dealer Product Evaluation — Japan2Nippon" }, { property: "og:description", content: "Share your commercial evaluation of a Japanese product for the Indian market." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: PublicSurvey,
});

type PublicCampaign = { product_name_en: string; product_name_jp: string; industry: string; description: string; mrp_inr: number | null; deadline: string | null; custom_questions: CustomQuestion[]; open: boolean };

function PublicSurvey() {
  const { token } = Route.useParams();
  const [done, setDone] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["public-campaign", token],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_public_campaign", { _token: token });
      if (error) throw error;
      return data as unknown as PublicCampaign | null;
    },
  });
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4"><Logo /></header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading survey…</p> : !data ? (
          <p className="text-center text-muted-foreground">This survey link is not valid.</p>
        ) : (
          <>
            <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-paper">
              <span className="text-xs text-primary">{data.industry}</span>
              <h1 className="mt-1 text-2xl font-bold">{data.product_name_en}</h1>
              {data.product_name_jp && <p className="text-sm text-muted-foreground">{data.product_name_jp}</p>}
              {data.description && <p className="mt-3 text-sm">{data.description}</p>}
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                {data.mrp_inr != null && <span>Proposed MRP: ₹{data.mrp_inr.toLocaleString("en-IN")}</span>}
                {data.deadline && <span>Closes: {data.deadline}</span>}
              </div>
            </div>
            {!data.open ? <p className="text-center text-muted-foreground">This survey is no longer accepting responses.</p>
              : done ? (
                <div className="rounded-lg border border-success/40 bg-card p-10 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
                  <h2 className="mt-3 text-xl font-bold">Thank you — your evaluation was submitted.</h2>
                  <button className="mt-4 text-sm text-primary underline" onClick={() => setDone(false)}>Submit another response</button>
                </div>
              ) : (
                <>
                  <h2 className="mb-4 text-lg font-bold">Submit Ground-Truth Commercial Evaluation</h2>
                  <ResponseForm questions={data.custom_questions ?? []} onSubmit={async (r) => {
                    const { contact_name, phone, email, ...rest } = r;
                    const { error } = await supabase.rpc("submit_public_response", { _token: token, payload: { ...rest, contact_name, phone, email } });
                    if (error) { toast.error(error.message); return false; }
                    setDone(true);
                    return true;
                  }} />
                </>
              )}
          </>
        )}
      </main>
    </div>
  );
}
