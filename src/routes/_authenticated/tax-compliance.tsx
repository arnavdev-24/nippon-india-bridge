import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StepIndicator } from "@/components/tax-compliance/StepIndicator";
import { IndustryStep } from "@/components/tax-compliance/IndustryStep";
import { RequirementsStep } from "@/components/tax-compliance/RequirementsStep";
import { MatchStep } from "@/components/tax-compliance/MatchStep";
import { BookingStep, type Booking } from "@/components/tax-compliance/BookingStep";
import { DetailsStep, type CompanyDetails } from "@/components/tax-compliance/DetailsStep";
import { Confirmation } from "@/components/tax-compliance/Confirmation";
import { useMyProfile } from "@/lib/profile";
import type { Expert, IndustryKey, ServiceKey } from "@/lib/tax-compliance";

export const Route = createFileRoute("/_authenticated/tax-compliance")({
  head: () => ({
    meta: [
      { title: "Tax & Compliance Connect — nippon2japan" },
      { name: "description", content: "Find the right Indian compliance experts for your industry — guided matching with CAs and CSs." },
      { property: "og:title", content: "Tax & Compliance Connect" },
      { property: "og:description", content: "The right compliance expert for your industry, before you enter the Indian market." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Wizard,
});

function Wizard() {
  const { data: me } = useMyProfile();
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState<IndustryKey | "">("");
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

  return (
    <>
      <PageHeader
        kanji="税"
        title="Tax & Compliance Connect"
        desc="Find the right Indian compliance experts for your industry — before you enter the Indian market."
      />
      <StepIndicator current={step === 5 ? 4 : Math.min(step, 4)} />
      {step === 0 && <IndustryStep value={industry} onChange={setIndustry} onNext={() => setStep(1)} />}
      {step === 1 && (
        <RequirementsStep
          services={services} notes={notes}
          onToggle={(s) => setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))}
          onNotes={setNotes}
          onBack={() => setStep(0)} onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <MatchStep industry={industry} services={services} onBack={() => setStep(1)}
          onBook={(e) => { setExpert(e); setBooking({ mode: "", date: "", time: "", locationNotes: "" }); setStep(3); }} />
      )}
      {step === 3 && expert && (
        <BookingStep expert={expert} booking={booking} onChange={setBooking}
          onBack={() => setStep(2)} onNext={() => setStep(4)} />
      )}
      {step === 4 && expert && (
        <DetailsStep expert={expert} industry={industry} services={services} notes={notes} booking={booking}
          details={detailsValue} onChange={setDetails}
          onBack={() => setStep(3)} onDone={(ref) => { setReference(ref); setStep(5); }} />
      )}
      {step === 5 && expert && <Confirmation reference={reference} expert={expert} booking={booking} />}
    </>
  );
}
