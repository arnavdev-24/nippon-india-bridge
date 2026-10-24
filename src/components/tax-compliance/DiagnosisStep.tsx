import { Button } from "@/components/ui/button";
import {
  type Diagnosis,
  type MarketEntryInput,
  FDI_ROUTE_LABEL,
  DISCLAIMER,
} from "@/lib/market-entry";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  FileText,
  Building,
  ArrowRight,
  ExternalLink,
  MapPin,
  Scale,
  Receipt,
  BookOpen,
} from "lucide-react";

interface Props {
  diagnosis: Diagnosis;
  input: MarketEntryInput;
  onBack: () => void;
  onNext: () => void;
}

export function DiagnosisStep({ diagnosis, input, onBack, onNext }: Props) {
  const isAutomatic = diagnosis.fdiRoute === "automatic";
  const isGovt = diagnosis.fdiRoute === "government";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Statutory Compliance Report</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">Market Entry Regulatory Diagnosis</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Bilateral legal, FDI, and taxation analysis based on current Indian statutory frameworks and the India–Japan CEPA framework.
        </p>
      </div>

      {/* 1. FDI Route & Corporate Structuring Card */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-paper space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
              Foreign Direct Investment (FDI) Pathway
            </span>
            <h3 className="text-lg font-bold mt-0.5">FDI Route &amp; Ownership Cap</h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isAutomatic
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                  : isGovt
                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                  : "bg-blue-500/10 text-blue-600 border border-blue-500/30"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isAutomatic ? "bg-emerald-500" : isGovt ? "bg-amber-500" : "bg-blue-500"}`} />
              {FDI_ROUTE_LABEL[diagnosis.fdiRoute]} ({diagnosis.fdiCap}% Permitted)
            </span>
          </div>
        </div>

        <p className="text-xs text-foreground leading-relaxed">{diagnosis.fdiNote}</p>

        <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1">
          <div className="font-semibold text-foreground flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-primary" />
            <span>Corporate Vehicle: {input.entity.toUpperCase()}</span>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">{diagnosis.entityNote}</p>
        </div>

        <div className="text-[10px] font-mono text-muted-foreground">
          Authority Source: {diagnosis.fdiSource} · {diagnosis.entitySource}
        </div>
      </div>

      {/* 2. GST & Taxation Architecture */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-paper space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
              Taxation Architecture
            </span>
            <h3 className="text-lg font-bold mt-0.5">Goods &amp; Services Tax (GST) Assessment</h3>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              diagnosis.gst.mustRegister
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {diagnosis.gst.mustRegister ? "Mandatory GST Registration" : "Optional / Voluntary Registration"}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-lg border border-border/60 p-3 bg-muted/20">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Turnover Threshold</span>
            <div className="font-semibold text-foreground mt-0.5">{diagnosis.gst.threshold}</div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 bg-muted/20">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">State GSTIN Registrations Required</span>
            <div className="font-semibold text-foreground mt-0.5">
              {diagnosis.gst.registrations} separate GSTIN{diagnosis.gst.registrations > 1 ? "s (one per state)" : ""}
            </div>
          </div>
        </div>

        <p className="text-xs text-foreground leading-relaxed">{diagnosis.gst.reason}</p>

        {/* DTAA Card */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-xs space-y-1">
          <div className="font-semibold text-primary flex items-center gap-1.5">
            <Receipt className="h-3.5 w-3.5" />
            <span>India–Japan Double Tax Avoidance Agreement (DTAA) Advantage</span>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">{diagnosis.dtaa.note}</p>
        </div>

        <div className="text-[10px] font-mono text-muted-foreground">
          Authority Source: {diagnosis.gst.source} · {diagnosis.dtaa.source}
        </div>
      </div>

      {/* 3. Statutory Licences Checklist */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-paper space-y-4">
        <div className="border-b border-border/60 pb-3">
          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
            Statutory Clearances
          </span>
          <h3 className="text-lg font-bold mt-0.5">Required Licences &amp; Regulatory Approvals</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Clearance requirements sequenced for your sector ({input.industry}) and target operations.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] font-mono text-muted-foreground uppercase">
                <th className="py-2.5 pr-4 font-medium">Licence / Filing</th>
                <th className="py-2.5 pr-4 font-medium">Regulatory Authority</th>
                <th className="py-2.5 pr-4 font-medium">Statutory Purpose</th>
                <th className="py-2.5 font-medium text-right">Lead Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {diagnosis.licences.map((lic, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 pr-4 font-semibold text-foreground">{lic.name}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{lic.authority}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground leading-relaxed">{lic.why}</td>
                  <td className="py-2.5 text-right font-mono text-primary font-medium whitespace-nowrap">
                    ~{lic.typicalWeeks} wk{lic.typicalWeeks > 1 ? "s" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Target State Cluster Intelligence */}
      {diagnosis.stateNotes.length > 0 && (
        <div className="rounded-xl border border-border/80 bg-card p-6 shadow-paper space-y-4">
          <div className="border-b border-border/60 pb-3">
            <span className="text-[10px] font-mono font-bold tracking-wider text-primary uppercase">
              Location Intelligence
            </span>
            <h3 className="text-lg font-bold mt-0.5">State Industrial Policy &amp; Single-Window Clearances</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {diagnosis.stateNotes.map((st) => (
              <div key={st.state} className="rounded-lg border border-border/70 p-3.5 bg-muted/20 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{st.state}</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{st.note}</p>
                <div className="pt-1 text-[10px] font-mono text-muted-foreground/80">Source: {st.source}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Deployment Timeline & Risk Flags */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Timeline */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-paper space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>Deployment Timeline</span>
            </h4>
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono font-bold text-primary">
              Est. ~{diagnosis.timelineWeeks} Weeks Total
            </span>
          </div>

          <ol className="space-y-2 border-l border-border/80 pl-3.5 text-xs mt-3">
            {diagnosis.steps.map((st, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                <div className="font-semibold text-foreground">{st.label}</div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {st.weeks > 0 ? `Duration: ~${st.weeks} week${st.weeks > 1 ? "s" : ""}` : "Operational Launch"}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Risk Flags */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-paper space-y-3">
          <h4 className="text-sm font-bold flex items-center gap-1.5 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Key Regulatory Critical Paths</span>
          </h4>

          <ul className="space-y-2 text-xs mt-3">
            {diagnosis.riskFlags.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-amber-500 font-bold">!</span>
                <span className="leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
        <Scale className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
        <div>
          <span className="font-semibold text-foreground">Disclaimer: </span>
          {DISCLAIMER} The timelines and clearances generated above reflect current statutory provisions. Consult an ICAI-certified Chartered Accountant or ICSI-certified Company Secretary to execute filings.
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Adjust Parameters
        </Button>
        <Button
          type="button"
          onClick={onNext}
          size="lg"
          className="shadow-paper w-full sm:w-auto"
        >
          <span>Match Chartered Accountants for These Clearances</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
