import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StepIndicator } from "@/components/tax-compliance/StepIndicator";
import { IndustryStep } from "@/components/tax-compliance/IndustryStep";
import { ProfileStep } from "@/components/tax-compliance/ProfileStep";
import { DiagnosisStep } from "@/components/tax-compliance/DiagnosisStep";
import { MatchStep } from "@/components/tax-compliance/MatchStep";
import { BookingStep, type Booking } from "@/components/tax-compliance/BookingStep";
import { DetailsStep, type CompanyDetails } from "@/components/tax-compliance/DetailsStep";
import { Confirmation } from "@/components/tax-compliance/Confirmation";
import { useMyProfile } from "@/lib/profile";
import type { Expert, IndustryKey, ServiceKey } from "@/lib/tax-compliance";
import { diagnose, type EntityType, type MarketEntryInput } from "@/lib/market-entry";

export const Route = createFileRoute("/_authenticated/tax-compliance")({
  head: () => ({
    meta: [
      { title: "Market Entry Diagnostic — nippon2bharat" },
      { name: "description", content: "Statutory FDI route check, GST assessment, and licence requirements for Japanese companies entering India." },
      { property: "og:title", content: "Market Entry Diagnostic" },
      { property: "og:description", content: "Statutory FDI, GST and regulatory diagnosis paired with accredited Chartered Accountants." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Wizard,
});

function Wizard() {
  const { data: me } = useMyProfile();
  const [step, setStep] = useState(0);

  // Inputs
  const [industry, setIndustry] = useState<IndustryKey | "">("");
  const [states, setStates] = useState<string[]>(["Tamil Nadu"]);
  const [entity, setEntity] = useState<EntityType>("wos");
  const [investmentInrCr, setInvestmentInrCr] = useState<number>(5);
  const [expectedTurnoverInrLakh, setExpectedTurnoverInrLakh] = useState<number>(100);
  const [sellsGoods, setSellsGoods] = useState<boolean>(true);
  const [importsGoods, setImportsGoods] = useState<boolean>(true);

  // Services & Matching
  const [services, setServices] = useState<ServiceKey[]>([]);
  const [notes, setNotes] = useState("");
  const [expert, setExpert] = useState<Expert | null>(null);
  const [booking, setBooking] = useState<Booking>({ mode: "", date: "", time: "", locationNotes: "" });
  const [details, setDetails] = useState<CompanyDetails | null>(null);
  const [reference, setReference] = useState("");

  const detailsValue: CompanyDetails = details ?? {
    companyName: me?.company_name ?? "",
    country: "Japan",
    contactName: me?.full_name ?? "",
    email: "",
  };

  const currentInput: MarketEntryInput = {
    industry: (industry || "manufacturing") as IndustryKey,
    states,
    entity,
    investmentInrCr,
    expectedTurnoverInrLakh,
    sellsGoods,
    importsGoods,
  };

  const diagnosis = diagnose(currentInput);

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <PageHeader
        kanji="税"
        title="Market Entry Diagnostic & Compliance"
        desc="Deterministic statutory analysis of your FDI route, GST thresholds, and mandatory regulatory licences — paired with accredited Indian Chartered Accountants."
      />
      <StepIndicator current={step === 6 ? 5 : Math.min(step, 5)} />

      {/* Step 0: Industry */}
      {step === 0 && (
        <IndustryStep
          value={industry}
          onChange={setIndustry}
          onNext={() => setStep(1)}
        />
      )}

      {/* Step 1: Corporate Profile & Operating States */}
      {step === 1 && (
        <ProfileStep
          states={states}
          onStatesChange={setStates}
          entity={entity}
          onEntityChange={setEntity}
          investmentInrCr={investmentInrCr}
          onInvestmentChange={setInvestmentInrCr}
          expectedTurnoverInrLakh={expectedTurnoverInrLakh}
          onTurnoverChange={setExpectedTurnoverInrLakh}
          sellsGoods={sellsGoods}
          onSellsGoodsChange={setSellsGoods}
          importsGoods={importsGoods}
          onImportsGoodsChange={setImportsGoods}
          onBack={() => setStep(0)}
          onNext={() => {
            // Pre-select recommended services from the diagnosis
            if (services.length === 0 && diagnosis.recommendedServices.length > 0) {
              setServices(diagnosis.recommendedServices);
            }
            setStep(2);
          }}
        />
      )}

      {/* Step 2: Statutory Diagnosis Report */}
      {step === 2 && (
        <DiagnosisStep
          diagnosis={diagnosis}
          input={currentInput}
          onBack={() => setStep(1)}
          onNext={() => {
            if (services.length === 0 && diagnosis.recommendedServices.length > 0) {
              setServices(diagnosis.recommendedServices);
            }
            setStep(3);
          }}
        />
      )}

      {/* Step 3: Match Chartered Accountants */}
      {step === 3 && (
        <MatchStep
          industry={industry}
          services={services.length > 0 ? services : diagnosis.recommendedServices}
          onBack={() => setStep(2)}
          onBook={(e) => {
            setExpert(e);
            setBooking({ mode: "", date: "", time: "", locationNotes: "" });
            setStep(4);
          }}
        />
      )}

      {/* Step 4: Schedule Consultation */}
      {step === 4 && expert && (
        <BookingStep
          expert={expert}
          booking={booking}
          onChange={setBooking}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      )}

      {/* Step 5: Enterprise Details */}
      {step === 5 && expert && (
        <DetailsStep
          expert={expert}
          industry={industry}
          services={services.length > 0 ? services : diagnosis.recommendedServices}
          notes={notes}
          booking={booking}
          details={detailsValue}
          onChange={setDetails}
          onBack={() => setStep(4)}
          onDone={(ref) => {
            setReference(ref);
            setStep(6);
          }}
        />
      )}

      {/* Step 6: Confirmation */}
      {step === 6 && expert && (
        <Confirmation
          reference={reference}
          expert={expert}
          booking={booking}
        />
      )}
    </div>
  );
}
