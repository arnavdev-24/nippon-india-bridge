import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ExpertDirectory } from "@/components/ExpertDirectory";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/advisors")({
  head: () => ({ meta: [{ title: "Tax & Compliance Advisors — nippon2japan" }, { name: "description", content: "Find Indian CAs and Company Secretaries." }, { property: "og:title", content: "Tax & Compliance Advisors" }, { property: "og:description", content: "CAs and CSs for GST, tax and incorporation in India." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => {
    const { t } = useT();
    return (
      <>
        <PageHeader kanji="税" title={t("advisors")} desc={t("advisorsDesc")} />
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[["GST registration", "Mandatory above ₹40L turnover"], ["Company incorporation", "Pvt Ltd / LLP / Liaison office via MCA"], ["Transfer pricing & DTAA", "India–Japan tax treaty benefits"]].map(([a, b]) => (
            <div key={a} className="rounded-lg bg-accent p-4"><div className="font-bold text-accent-foreground">{a}</div><div className="text-sm text-accent-foreground/80">{b}</div></div>
          ))}
        </div>
        <ExpertDirectory types={["ca", "cs"]} kind="advisory" />
      </>
    );
  },
});
