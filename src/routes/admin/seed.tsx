import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/seed")({ component: SeedPage });

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeedState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

function useSeed(fn: () => Promise<void>) {
  const [state, setState] = useState<SeedState>({
    loading: false,
    success: false,
    error: null,
  });

  const run = async () => {
    setState({ loading: true, success: false, error: null });
    try {
      await fn();
      setState({ loading: false, success: true, error: null });
    } catch (err) {
      setState({
        loading: false,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return { ...state, run };
}

// ─── Seeders ──────────────────────────────────────────────────────────────────

async function seedExpertProfiles() {
  const { error } = await supabase.from("profiles").upsert(
    [
      {
        id: "00000000-0001-0000-0000-000000000001",
        full_name: "Priya Sharma",
        company_name: "Sharma & Associates",
        city: "Mumbai",
        state: "Maharashtra",
        bio: "ICAI-certified CA with 12 years specializing in FDI compliance, GST advisory, and Transfer Pricing for Japanese corporates entering India.",
        expert_type: "ca",
        account_type: "expert",
        rate_inr: 3500,
      },
      {
        id: "00000000-0002-0000-0000-000000000002",
        full_name: "Rajiv Menon",
        company_name: "Menon Corporate Services",
        city: "Bengaluru",
        state: "Karnataka",
        bio: "Company Secretary with expertise in WOS incorporation, RBI compliance, FEMA regulations, and India–Japan joint venture structuring.",
        expert_type: "cs",
        account_type: "expert",
        rate_inr: 4000,
      },
      {
        id: "00000000-0003-0000-0000-000000000003",
        full_name: "Yuki Tanaka",
        company_name: "Nihongo Bridge",
        city: "Delhi",
        state: "Delhi",
        bio: "Native Japanese-English-Hindi trilingual trainer. 8 years delivering business Japanese for Indian executives and Japanese corporates expanding to India.",
        expert_type: "japanese_tutor",
        account_type: "expert",
        rate_inr: 2500,
      },
    ],
    { onConflict: "id", ignoreDuplicates: false },
  );
  if (error) throw new Error(error.message);
}

async function seedHubProfiles() {
  const PLACEHOLDER_OWNER = "00000000-ffff-0000-0000-000000000001";
  const { error } = await supabase.from("hub_profiles").upsert(
    [
      // ── Distributors ──────────────────────────────────────────────────────────
      {
        id: "00000000-a001-0000-0000-000000000001",
        owner_id: PLACEHOLDER_OWNER,
        hub: "distribution",
        name: "Bharat Electronics Distribution Co.",
        industry: "Electronics & IT",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        service_areas: ["Maharashtra", "Goa", "Gujarat"],
        categories: ["Electronics", "Networking & IT"],
        capabilities: ["Warehousing", "Dealer network", "Import support"],
        customers: ["Retailers", "Enterprises"],
        bio: "Pan-western India distributor with 200+ dealer touchpoints and ISO-certified bonded warehouses in Pune MIDC.",
        qualifications: "",
        offers: "",
        seeking: "",
        goals: "",
      },
      {
        id: "00000000-a002-0000-0000-000000000002",
        owner_id: PLACEHOLDER_OWNER,
        hub: "distribution",
        name: "MedEquip South India",
        industry: "Healthcare",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        service_areas: ["Tamil Nadu", "Andhra Pradesh", "Karnataka", "Telangana"],
        categories: ["Medical imaging"],
        capabilities: ["After-sales service", "Import support"],
        customers: ["Hospitals"],
        bio: "Exclusive medical equipment distributor with CDSCO import licenses. Covers 800+ hospitals across South India.",
        qualifications: "",
        offers: "",
        seeking: "",
        goals: "",
      },
      {
        id: "00000000-a003-0000-0000-000000000003",
        owner_id: PLACEHOLDER_OWNER,
        hub: "distribution",
        name: "AutoParts North Hub",
        industry: "Automotive",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        service_areas: ["Delhi", "Uttar Pradesh", "Haryana", "Rajasthan", "Punjab"],
        categories: ["Automotive components", "Motors & drives"],
        capabilities: ["Warehousing", "Dealer network"],
        customers: ["Manufacturers"],
        bio: "North India's largest Japanese auto-component distributor. Tier-1 supplier to Maruti, Hero, and Bajaj.",
        qualifications: "",
        offers: "",
        seeking: "",
        goals: "",
      },
      // ── JV Profiles ───────────────────────────────────────────────────────────
      {
        id: "00000000-b001-0000-0000-000000000001",
        owner_id: PLACEHOLDER_OWNER,
        hub: "jv",
        name: "Tata Advanced Systems Ltd.",
        industry: "Industrial Manufacturing",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        service_areas: ["Nationwide"],
        categories: [],
        capabilities: [],
        customers: [],
        bio: "Defence & aerospace JV division. Seeking Japanese precision-engineering partners for co-development under Make in India.",
        qualifications: "",
        offers: "Co-development under Make in India",
        seeking: "Japanese precision-engineering partners",
        goals: "Defence & aerospace joint development",
        technologies: ["Precision engineering", "Aerospace"],
      },
      {
        id: "00000000-b002-0000-0000-000000000002",
        owner_id: PLACEHOLDER_OWNER,
        hub: "jv",
        name: "Greenko Energy Ventures",
        industry: "Energy",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        service_areas: ["Nationwide"],
        categories: [],
        capabilities: [],
        customers: [],
        bio: "India's largest renewable energy developer. Open to JV on hydrogen fuel-cells, energy storage, and solar panel manufacturing with Japanese technology partners.",
        qualifications: "",
        offers: "Manufacturing JV, technology transfer",
        seeking: "Japanese technology partners for hydrogen & solar",
        goals: "Clean energy joint ventures",
        technologies: ["Hydrogen fuel-cells", "Energy storage", "Solar"],
      },
    ],
    { onConflict: "id", ignoreDuplicates: false },
  );
  if (error) throw new Error(error.message);
}

async function seedProviderListings() {
  const PLACEHOLDER_USER = "00000000-ffff-0000-0000-000000000002";
  const now = new Date().toISOString();
  const { error } = await supabase.from("provider_listings").upsert(
    [
      {
        id: "00000000-c001-0000-0000-000000000001",
        user_id: PLACEHOLDER_USER,
        section: "advisors",
        full_name: "Ananya Iyer",
        organization: "Iyer & Partners LLP",
        specialization: "Chartered Accountant",
        experience_years: 10,
        industry: "Finance & Compliance",
        city: "Mumbai",
        state: "Maharashtra",
        email: "ananya.iyer@demo.com",
        phone: "+91 98200 11111",
        bio: "Senior CA specializing in Japan–India cross-border tax structuring, DTAA treaty applications, and FDI compliance under FEMA.",
        score: 8.2,
        assessed_at: now,
        assessment: {
          summary:
            "Strong ICAI credentials with demonstrated Japan-specific engagements. Excellent GST and transfer pricing track record.",
          strengths: [
            "ICAI-certified with 10+ years of FDI advisory",
            "Active DTAA and withholding tax engagements",
            "Trilingual: English, Hindi, Tamil",
          ],
          gaps: ["Limited WOS incorporation case studies"],
          resume_considered: false,
        },
      },
      {
        id: "00000000-c002-0000-0000-000000000002",
        user_id: PLACEHOLDER_USER,
        section: "joint-ventures",
        full_name: "Rajan Nair",
        organization: "Indo-Nippon Ventures Pvt. Ltd.",
        specialization: "Joint Venture Partner",
        experience_years: 15,
        industry: "Industrial Manufacturing",
        city: "Pune",
        state: "Maharashtra",
        email: "rajan.nair@demo.com",
        phone: "+91 98200 22222",
        bio: "Founder of Indo-Nippon Ventures. 15 years managing Japan–India manufacturing JVs. Open to equity partnerships in precision components and auto-ancillary sectors.",
        score: 7.5,
        assessed_at: now,
        assessment: {
          summary:
            "Credible JV track record with two active Japan-India partnerships. Strong manufacturing base and export experience.",
          strengths: [
            "Active JV with Yamaha supplier",
            "ISO-certified manufacturing plant",
            "Fluent in business Japanese",
          ],
          gaps: ["No renewable energy JV experience", "Limited IT sector exposure"],
          resume_considered: false,
        },
      },
      {
        id: "00000000-c003-0000-0000-000000000003",
        user_id: PLACEHOLDER_USER,
        section: "distributors",
        full_name: "Sunita Kapoor",
        organization: "Kapoor Industrial Supplies",
        specialization: "Regional Distributor",
        experience_years: 12,
        industry: "Automotive",
        city: "Gurugram",
        state: "Haryana",
        email: "sunita.kapoor@demo.com",
        phone: "+91 98200 33333",
        bio: "Established distributor of Japanese automotive tools and precision instruments across North India. Covers 300+ dealers from Delhi-NCR to Chandigarh.",
        score: 7.5,
        assessed_at: now,
        assessment: {
          summary:
            "Well-networked distributor with deep auto-component dealer access in North India.",
          strengths: [
            "300+ dealer network in NCR & Punjab",
            "ISO 9001 warehouse in Manesar",
            "Direct OEM relationships with Maruti & Hero",
          ],
          gaps: ["No cold-chain capability", "Limited South India coverage"],
          resume_considered: false,
        },
      },
      {
        id: "00000000-c004-0000-0000-000000000004",
        user_id: PLACEHOLDER_USER,
        section: "tutors",
        full_name: "Keiko Yamamoto",
        organization: "Sakura Language Institute",
        specialization: "Japanese tutor",
        experience_years: 9,
        industry: "Education & Training",
        city: "Bangalore",
        state: "Karnataka",
        email: "keiko.yamamoto@demo.com",
        phone: "+91 98200 44444",
        bio: "JLPT N1 certified trainer with 9 years of corporate Japanese instruction. Specializes in business Japanese for engineers and executives working with Japanese MNCs in India.",
        score: 9.1,
        assessed_at: now,
        assessment: {
          summary:
            "Exceptional language credentials. Highly recommended for corporate immersion programs.",
          strengths: [
            "JLPT N1 — native-level Japanese",
            "9 years corporate training at Infosys, Wipro",
            "Business Japanese curriculum author",
          ],
          gaps: ["Hindi instruction limited"],
          resume_considered: false,
        },
      },
    ],
    { onConflict: "id", ignoreDuplicates: false },
  );
  if (error) throw new Error(error.message);
}

// ─── Seeder Button ────────────────────────────────────────────────────────────

function SeederButton({
  label,
  description,
  onRun,
}: {
  label: string;
  description: string;
  onRun: () => Promise<void>;
}) {
  const { loading, success, error, run } = useSeed(onRun);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-paper">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-foreground">{label}</h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <Button
          size="sm"
          className="shrink-0 shadow-paper"
          disabled={loading}
          onClick={run}
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <svg
                className="h-3.5 w-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
              Seeding…
            </span>
          ) : (
            "Seed"
          )}
        </Button>
      </div>
      {success && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
          <span aria-hidden="true">✓</span> Seeded successfully
        </p>
      )}
      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-destructive">
          <span aria-hidden="true">✗</span> {error}
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function SeedPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      {/* Warning banner */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-950/40">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          ⚠ Admin seeder — development use only
        </p>
        <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
          This page injects demo data into the live database. Do not share this URL publicly.
        </p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Demo Data Seeder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inject realistic demo data for the hackathon presentation. All records use fixed UUIDs so
          re-seeding is safe.
        </p>
      </div>

      <div className="space-y-4">
        <SeederButton
          label="Seed Expert Profiles"
          description="Inserts 3 expert profiles (CA Priya Sharma, CS Rajiv Menon, Tutor Yuki Tanaka) into the profiles table. Uses fixed UUIDs — safe to re-run."
          onRun={seedExpertProfiles}
        />
        <SeederButton
          label="Seed Hub Profiles"
          description="Inserts 3 distribution hub profiles (Electronics, Healthcare, Automotive) and 2 JV profiles (Tata Advanced Systems, Greenko Energy) into hub_profiles. Safe to re-run."
          onRun={seedHubProfiles}
        />
        <SeederButton
          label="Seed Provider Listings"
          description="Inserts 4 provider listings (1 advisor, 1 JV partner, 1 distributor, 1 tutor) with AI assessment scores into provider_listings. Safe to re-run."
          onRun={seedProviderListings}
        />
      </div>
    </div>
  );
}
