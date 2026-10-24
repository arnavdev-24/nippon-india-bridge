import {
  Factory, Car, HeartPulse, Code2, Cpu, Wheat, Sun, ShoppingBag, Truck, Building2,
  type LucideIcon,
} from "lucide-react";

export type IndustryKey =
  | "manufacturing" | "automotive" | "healthcare" | "it_software" | "electronics"
  | "food_agri" | "renewable" | "consumer_retail" | "logistics" | "other";

export const INDUSTRIES: { key: IndustryKey; name: string; desc: string; icon: LucideIcon }[] = [
  { key: "manufacturing", name: "Manufacturing & Industrial Equipment", desc: "Plant setup, factory compliance and industrial licensing.", icon: Factory },
  { key: "automotive", name: "Automotive & Mobility", desc: "OEM and supplier taxation, homologation and GST.", icon: Car },
  { key: "healthcare", name: "Healthcare & Medical Devices", desc: "CDSCO registration, device rules and healthcare tax.", icon: HeartPulse },
  { key: "it_software", name: "Information Technology & Software", desc: "STPI/SEZ benefits, transfer pricing and export tax.", icon: Code2 },
  { key: "electronics", name: "Electronics & Semiconductors", desc: "PLI schemes, customs duty and import compliance.", icon: Cpu },
  { key: "food_agri", name: "Food & Agriculture", desc: "FSSAI licensing, agri exports and food safety law.", icon: Wheat },
  { key: "renewable", name: "Renewable Energy & Sustainability", desc: "Project finance, carbon credits and energy regulation.", icon: Sun },
  { key: "consumer_retail", name: "Consumer Goods & Retail", desc: "FEMA retail rules, GST and consumer protection.", icon: ShoppingBag },
  { key: "logistics", name: "Logistics & Supply Chain", desc: "Customs, warehousing and e-way bill compliance.", icon: Truck },
  { key: "other", name: "Other Industries", desc: "General India-entry compliance for any sector.", icon: Building2 },
];

export type ServiceKey =
  | "tax_gst" | "incorporation" | "roc_compliance" | "import_export" | "transfer_pricing"
  | "industry_regulatory" | "fema" | "accounting" | "not_sure";

export const SERVICES: { key: ServiceKey; name: string; desc: string }[] = [
  { key: "tax_gst", name: "Taxation & GST", desc: "GST registration, returns and direct tax planning." },
  { key: "incorporation", name: "Company Incorporation in India", desc: "Pvt Ltd, LLP or liaison office setup via MCA." },
  { key: "roc_compliance", name: "Corporate Compliance & ROC Filings", desc: "Annual filings, board governance and secretarial work." },
  { key: "import_export", name: "Import/Export Regulations", desc: "Customs, IEC, duties and trade compliance." },
  { key: "transfer_pricing", name: "Transfer Pricing & International Taxation", desc: "India–Japan DTAA, TP documentation and cross-border tax." },
  { key: "industry_regulatory", name: "Industry-Specific Regulatory Guidance", desc: "Sector licences, standards and approvals." },
  { key: "fema", name: "Foreign Investment & FEMA Compliance", desc: "FDI routes, RBI reporting and FEMA filings." },
  { key: "accounting", name: "Accounting & Financial Reporting", desc: "Bookkeeping, Ind AS and audit support." },
  { key: "not_sure", name: "Not Sure — Help Me Decide", desc: "Tell us your situation and we will guide you." },
];

export const industryName = (k: string) => INDUSTRIES.find((i) => i.key === k)?.name ?? k;
export const serviceName = (k: string) => SERVICES.find((s) => s.key === k)?.name ?? k;

export type Expert = {
  id: string | null; // null = demo profile, not backed by a real account
  demo: boolean;
  name: string;
  designation: "ca" | "cs";
  company: string | null;
  specializations: string[]; // ServiceKey values
  industries: string[]; // IndustryKey values
  languages: string[];
  qualifications: string | null;
  years_experience: number | null;
  verified: boolean;
  offers_online: boolean;
  offers_in_person: boolean;
  office_address: string | null;
  office_city: string | null;
  city: string | null;
  state: string | null;
  rate_inr: number | null;
  bio: string | null;
};

/**
 * Match score: industry expertise is weighted above everything else,
 * then required services, then cross-border language fit, then verification.
 */
export function scoreExpert(e: Expert, industry: IndustryKey | "", services: ServiceKey[]): number {
  let s = 0;
  if (industry && e.industries.includes(industry)) s += 30;
  for (const svc of services) if (svc !== "not_sure" && e.specializations.includes(svc)) s += 10;
  if (e.languages.some((l) => l.toLowerCase().includes("japanese"))) s += 5;
  if (e.verified) s += 3;
  s += Math.min(e.years_experience ?? 0, 20) / 10;
  return s;
}

// Demo profiles shown only when few real experts are listed. Clearly labelled in the UI.
export const DEMO_EXPERTS: Expert[] = [
  {
    id: null, demo: true, name: "Demo — A. Krishnan", designation: "ca", company: "Demo Advisory LLP",
    specializations: ["tax_gst", "transfer_pricing", "fema"], industries: ["automotive", "manufacturing", "electronics"],
    languages: ["English", "Japanese", "Tamil"], qualifications: "FCA, DISA (demo)", years_experience: 18, verified: false,
    offers_online: true, offers_in_person: true, office_address: "MG Road", office_city: "Chennai",
    city: "Chennai", state: "Tamil Nadu", rate_inr: 6000,
    bio: "Demo profile: cross-border tax and GST for Japanese manufacturers entering South India.",
  },
  {
    id: null, demo: true, name: "Demo — R. Sharma", designation: "cs", company: "Demo Corporate Services",
    specializations: ["incorporation", "roc_compliance", "fema"], industries: ["it_software", "consumer_retail", "other"],
    languages: ["English", "Hindi"], qualifications: "FCS (demo)", years_experience: 12, verified: false,
    offers_online: true, offers_in_person: false, office_address: null, office_city: null,
    city: "Gurugram", state: "Haryana", rate_inr: 4500,
    bio: "Demo profile: incorporation and secretarial compliance for foreign-owned entities.",
  },
  {
    id: null, demo: true, name: "Demo — M. Iyer", designation: "ca", company: "Demo & Associates",
    specializations: ["accounting", "tax_gst", "import_export"], industries: ["food_agri", "logistics", "consumer_retail"],
    languages: ["English", "Hindi", "Japanese"], qualifications: "CA (demo)", years_experience: 9, verified: false,
    offers_online: true, offers_in_person: true, office_address: "Bandra Kurla Complex", office_city: "Mumbai",
    city: "Mumbai", state: "Maharashtra", rate_inr: 3500,
    bio: "Demo profile: accounting, GST and import/export support for consumer and food businesses.",
  },
  {
    id: null, demo: true, name: "Demo — S. Verma", designation: "ca", company: "Demo RegAdvisors",
    specializations: ["industry_regulatory", "transfer_pricing", "tax_gst"], industries: ["healthcare", "renewable", "electronics"],
    languages: ["English"], qualifications: "CA, LLB (demo)", years_experience: 14, verified: false,
    offers_online: true, offers_in_person: false, office_address: null, office_city: null,
    city: "Bengaluru", state: "Karnataka", rate_inr: 5500,
    bio: "Demo profile: sector regulation and international tax for healthcare and energy entrants.",
  },
];

// Illustrative slots used only when an expert has not published real availability.
// The UI labels these as demo slots and never treats them as a confirmed booking.
export function demoSlots(): { date: string; slots: string[] }[] {
  const out: { date: string; slots: string[] }[] = [];
  for (let i = 2; out.length < 4; i++) {
    const d = new Date(Date.now() + i * 86400000);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    out.push({ date: d.toISOString().slice(0, 10), slots: ["10:00", "14:00", "16:30"] });
  }
  return out;
}

export const STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "border-saffron/60 bg-saffron/10 text-saffron-foreground" },
  confirmed: { label: "Confirmed", className: "border-success/50 bg-success/10 text-success" },
  completed: { label: "Completed", className: "border-border bg-muted text-muted-foreground" },
  cancelled: { label: "Cancelled", className: "border-destructive/40 bg-destructive/10 text-destructive" },
};
