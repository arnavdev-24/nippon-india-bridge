import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ExpertDirectory } from "@/components/ExpertDirectory";
import { useT } from "@/lib/i18n";
import { ShieldCheck, Scale, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterAsPartnerDialog } from "@/components/RegisterAsPartnerDialog";

export const Route = createFileRoute("/_authenticated/advisors")({
  head: () => ({
    meta: [
      { title: "Tax & Compliance Advisors — nippon2japan" },
      { name: "description", content: "Connect with vetted Indian Chartered Accountants and Company Secretaries." },
      { property: "og:title", content: "Tax & Compliance Advisors" },
      { property: "og:description", content: "CAs and CSs for GST, tax and incorporation in India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdvisorsPage,
});

function AdvisorsPage() {
  const { t, lang } = useT();

  const compliancePillars = [
    {
      title: "GST Registration & Filing",
      kanji: "税",
      desc: "Mandatory above ₹40L turnover (₹20L for services). Input Tax Credit (ITC) optimization for manufacturing imports.",
      badge: "Statutory Law",
    },
    {
      title: "Corporate Incorporation (MCA)",
      kanji: "法",
      desc: "Wholly Owned Subsidiary (WOS), Joint Venture (JV), or Liaison / Project Office formation with DIN & PAN/TAN.",
      badge: "100% Automatic FDI",
    },
    {
      title: "Transfer Pricing & DTAA",
      kanji: "条",
      desc: "India–Japan Double Tax Avoidance Agreement (DTAA) treaty benefits, withholding tax reduction, and arm's length pricing.",
      badge: "Bilateral Treaty",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <PageHeader
        kanji="税"
        title={t("advisors")}
        desc="Connect with certified Indian Chartered Accountants (CA) and Company Secretaries (CS) specialized in Japanese corporate expansion, GST compliance, and FDI regulations."
        action={
          <div className="flex flex-wrap gap-2"><RegisterAsPartnerDialog section="advisors" /><Button asChild size="sm" className="shadow-paper">
            <Link to="/tax-compliance">
              {lang === "ja" ? "進出診断ウィザード" : "Interactive Diagnostic"}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button></div>
        }
      />

      {/* Regulatory Context Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {compliancePillars.map((p) => (
          <div key={p.title} className="rounded-xl border border-border/80 bg-card p-5 shadow-paper">
            <div className="flex items-center justify-between">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-mono font-medium text-primary">
                {p.badge}
              </span>
              <span className="font-serif text-lg font-bold text-muted-foreground/30">{p.kanji}</span>
            </div>
            <h3 className="mt-3 text-base font-bold text-foreground">{p.title}</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Vetted Experts Directory */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-paper">
        <div className="border-b border-border/60 pb-4 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Vetted Professional Practices</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Profiles list self-declared ICAI / ICSI membership — verify the membership number before engagement.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> Direct Consultation Booking
          </span>
        </div>

        <ExpertDirectory types={["ca", "cs"]} kind="advisory" />
      </div>
    </div>
  );
}
