import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Hub = "distribution" | "jv" | "tutoring";
export type HubProfile = Tables<"hub_profiles">;
export const INDUSTRIES = [
  "Automotive",
  "Electronics & IT",
  "Industrial Manufacturing",
  "Healthcare",
  "Food & Beverages",
  "Consumer Goods",
  "Energy",
  "Logistics",
  "Education",
  "Other",
];
export const CATEGORIES = [
  "Networking & IT",
  "Electronics",
  "Musical instruments",
  "Medical imaging",
  "Motors & drives",
  "Robotics",
  "Automotive components",
  "Food products",
  "Consumer goods",
  "Other",
];
export const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Lakshadweep",
  "Dadra and Nagar Haveli and Daman and Diu",
];
export const LANGUAGES = ["Japanese", "Hindi", "English", "Tamil", "Bengali", "Marathi", "Other"];
export const LEVELS = ["Beginner", "Intermediate", "Advanced", "Business"];
export const TECHNOLOGIES = [
  "Robotics",
  "AI",
  "Automation",
  "Advanced manufacturing",
  "Clean energy",
  "IoT",
  "Medical technology",
];
export const STATUS: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  in_discussion: "In Discussion",
  meeting_scheduled: "Meeting Scheduled",
  partnership_established: "Partnership Established",
  completed: "Completed",
  cancelled: "Cancelled",
};
export const split = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
export const DEFAULT_JV_PROFILES: HubProfile[] = [
  {
    id: "jv-yamamoto-cnc",
    owner_id: "00000000-demo-0000-0000-000000000001",
    hub: "jv",
    name: "Yamamoto Precision Machinery Co.",
    industry: "Industrial Manufacturing",
    country: "Japan",
    city: "Kyoto",
    state: "Kansai",
    contact_email: "partnerships@yamamoto-precision.co.jp",
    bio: "Specialized in micro-precision tooling, 5-axis CNC machining, and automated optical inspection systems with 45 years history in Kyoto. Seeking an Indian manufacturing partner to establish localized assembly and service operations.",
    offers: "Proprietary CNC precision engineering IP, operator training curriculum, and Japanese quality control (Kaizen/5S) SOPs.",
    seeking: "Indian partner with Tier-1 automotive/aerospace supply relationships and industrial land in Maharashtra or Gujarat.",
    goals: "Establish an Indo-Japanese joint manufacturing facility under Make in India to serve South Asian markets.",
    technologies: ["Robotics", "Automation", "Advanced manufacturing"],
    categories: [],
    capabilities: ["Precision tooling", "5-axis CNC", "Quality inspection"],
    customers: ["Aerospace", "Automotive", "Medical devices"],
    service_areas: ["Nationwide", "Maharashtra", "Gujarat"],
    experience_years: 45,
    fee_inr: 0,
    levels: [],
    online: true,
    in_person: true,
    pitch_path: null,
    qualification_verified: true,
    qualifications: "ISO 9001, AS9100 Aerospace Certified",
    updated_at: new Date().toISOString(),
  },
  {
    id: "jv-kalyani-auto",
    owner_id: "00000000-demo-0000-0000-000000000002",
    hub: "jv",
    name: "Kalyani Strategic Components",
    industry: "Automotive",
    country: "India",
    city: "Pune",
    state: "Maharashtra",
    contact_email: "corporate.jv@kalyanicomp.in",
    bio: "Precision forging and transmission gearing division of Kalyani Group. World-class IATF 16949 certified facilities in Chakan automotive corridor supplying leading Indian and global OEMs.",
    offers: "Automated forging lines, 80,000 sq.m shop floor, deep supplier ties with Maruti, Hyundai, and Tata Motors.",
    seeking: "Japanese technology partner for electric vehicle reduction drive gearboxes and high-efficiency hybrid transmissions.",
    goals: "Joint venture for localized manufacturing and co-engineering of next-generation EV powertrain components.",
    technologies: ["Automation", "Advanced manufacturing", "Robotics"],
    categories: [],
    capabilities: ["Automated forging", "Heat treatment", "OEM supply chain"],
    customers: ["Manufacturers", "Enterprises"],
    service_areas: ["Nationwide", "Maharashtra"],
    experience_years: 32,
    fee_inr: 0,
    levels: [],
    online: true,
    in_person: true,
    pitch_path: null,
    qualification_verified: true,
    qualifications: "IATF 16949, ISO 14001",
    updated_at: new Date().toISOString(),
  },
  {
    id: "jv-murata-cleantech",
    owner_id: "00000000-demo-0000-0000-000000000003",
    hub: "jv",
    name: "Murata CleanTech & Water Systems",
    industry: "Energy",
    country: "Japan",
    city: "Nagoya",
    state: "Aichi",
    contact_email: "global-ventures@murata-cleantech.jp",
    bio: "Pioneering industrial effluent zero-liquid-discharge (ZLD) and ceramic membrane filtration systems. Active across Japanese chemical, pharmaceutical and semiconductor facilities.",
    offers: "High-recovery membrane technology, patented anti-fouling coatings, and IoT-enabled predictive water purification controllers.",
    seeking: "Indian EPC infrastructure and municipal water treatment companies with state tender track record and execution teams.",
    goals: "Co-bid for industrial park wastewater treatment contracts across Delhi-Mumbai and Chennai-Bengaluru industrial corridors.",
    technologies: ["Clean energy", "IoT", "Advanced manufacturing"],
    categories: [],
    capabilities: ["Membrane filtration", "ZLD systems", "IoT monitoring"],
    customers: ["Enterprises", "Municipalities"],
    service_areas: ["Nationwide", "Tamil Nadu", "Gujarat", "Delhi"],
    experience_years: 28,
    fee_inr: 0,
    levels: [],
    online: true,
    in_person: true,
    pitch_path: null,
    qualification_verified: true,
    qualifications: "METI Environmental Excellence Award, ISO 14001",
    updated_at: new Date().toISOString(),
  },
  {
    id: "jv-shindengen-power",
    owner_id: "00000000-demo-0000-0000-000000000004",
    hub: "jv",
    name: "Shindengen Power Solutions",
    industry: "Electronics & IT",
    country: "Japan",
    city: "Saitama",
    state: "Kanto",
    contact_email: "india-expansion@shindengen-power.co.jp",
    bio: "Power semiconductors, DC-DC converters, and battery management electronics powering Japanese hybrid vehicles and factory automation systems.",
    offers: "Automotive-grade silicon carbide (SiC) power modules and smart battery management systems (BMS) with thermal runaway detection.",
    seeking: "Indian electronics EMS manufacturer with high-speed SMT lines and ARAI certification experience.",
    goals: "Localize smart BMS production for India's 2-wheeler and 3-wheeler EV transition under FAME/EMPS initiatives.",
    technologies: ["IoT", "Clean energy", "AI"],
    categories: [],
    capabilities: ["Power electronics", "SiC semiconductors", "Battery safety"],
    customers: ["Manufacturers"],
    service_areas: ["Nationwide", "Karnataka", "Tamil Nadu"],
    experience_years: 50,
    fee_inr: 0,
    levels: [],
    online: true,
    in_person: true,
    pitch_path: null,
    qualification_verified: true,
    qualifications: "AEC-Q100 Automotive Qualified",
    updated_at: new Date().toISOString(),
  },
  {
    id: "jv-bharat-robotics",
    owner_id: "00000000-demo-0000-0000-000000000005",
    hub: "jv",
    name: "Bharat Heavy Automation & Robotics",
    industry: "Industrial Manufacturing",
    country: "India",
    city: "Bengaluru",
    state: "Karnataka",
    contact_email: "collaborations@bharatrobotics.in",
    bio: "Leading robotic workcell integrator in South India. Specialize in robotic welding, automated guided vehicles (AGV), and 3D computer vision inspection lines for heavy engineering.",
    offers: "120+ robotics and controls engineers, local field integration teams and 24/7 technical service infrastructure across India.",
    seeking: "Japanese collaborative robot (cobot) manufacturer seeking direct Indian industrial integration and application engineering.",
    goals: "Co-brand collaborative robotics packages for Indian electronics, pharmaceutical and FMCG packaging lines.",
    technologies: ["Robotics", "AI", "Automation", "IoT"],
    categories: [],
    capabilities: ["Robotic welding", "Computer vision", "AGV navigation"],
    customers: ["Enterprises", "Manufacturers"],
    service_areas: ["Nationwide", "Karnataka", "Tamil Nadu", "Maharashtra"],
    experience_years: 18,
    fee_inr: 0,
    levels: [],
    online: true,
    in_person: true,
    pitch_path: null,
    qualification_verified: true,
    qualifications: "Robotics Industry Association Member, ISO 9001",
    updated_at: new Date().toISOString(),
  },
  {
    id: "jv-daiki-agri",
    owner_id: "00000000-demo-0000-0000-000000000006",
    hub: "jv",
    name: "Daiki Agri-Mechanics Ltd.",
    industry: "Other",
    country: "Japan",
    city: "Osaka",
    state: "Kansai",
    contact_email: "export@daiki-agri.co.jp",
    bio: "Manufacturer of compact walk-behind multi-crop weeders, paddy transplanters, and raised-bed furrower attachments engineered specifically for smallholder farms.",
    offers: "Field-tested ergonomic agricultural machinery blueprints, lightweight transmission designs, and high-durability Japanese carbon steel rotor blades.",
    seeking: "Indian agri-machinery manufacturer with FMTTI (Budni) test report experience and SMAM DBT subsidy empanelment across states.",
    goals: "Establish an assembly joint venture in Punjab/Haryana to produce affordable mechanization equipment for Indian paddy and horticulture farmers.",
    technologies: ["Advanced manufacturing", "Automation", "Robotics"],
    categories: [],
    capabilities: ["Paddy machinery", "Vibration dampening", "Implement design"],
    customers: ["Retailers", "FPOs / Cooperatives"],
    service_areas: ["Punjab", "Haryana", "Maharashtra", "Tamil Nadu"],
    experience_years: 36,
    fee_inr: 0,
    levels: [],
    online: true,
    in_person: true,
    pitch_path: null,
    qualification_verified: true,
    qualifications: "Japanese Ministry of Agriculture Certified Machinery",
    updated_at: new Date().toISOString(),
  },
  {
    id: "jv-godrej-precision",
    owner_id: "00000000-demo-0000-0000-000000000007",
    hub: "jv",
    name: "Godrej Precision Systems",
    industry: "Industrial Manufacturing",
    country: "India",
    city: "Mumbai",
    state: "Maharashtra",
    contact_email: "strategic.partners@godrejprecision.com",
    bio: "High-precision manufacturing division supplying Indian space research, energy and defense sectors. Specialized in high-temperature superalloy fabrication and electron beam welding.",
    offers: "Cleanroom assembly facilities, AS9100 Rev D aerospace certification, and state-of-the-art CMM precision metrology laboratories.",
    seeking: "Japanese aerospace Tier-2 and precision machinery partners seeking trusted contract manufacturing and co-development in India.",
    goals: "Long-term export-oriented joint manufacturing alliance under Indo-Pacific supply chain resilience initiatives.",
    technologies: ["Advanced manufacturing", "Robotics"],
    categories: [],
    capabilities: ["Electron beam welding", "Superalloys", "Metrology"],
    customers: ["Enterprises", "Manufacturers"],
    service_areas: ["Nationwide", "Maharashtra"],
    experience_years: 40,
    fee_inr: 0,
    levels: [],
    online: true,
    in_person: true,
    pitch_path: null,
    qualification_verified: true,
    qualifications: "AS9100 Rev D, ISO 9001",
    updated_at: new Date().toISOString(),
  },
  {
    id: "jv-munjal-ev",
    owner_id: "00000000-demo-0000-0000-000000000008",
    hub: "jv",
    name: "Munjal Mobility Solutions",
    industry: "Automotive",
    country: "India",
    city: "Gurugram",
    state: "Haryana",
    contact_email: "ventures@munjalmobility.in",
    bio: "Automotive systems division focusing on electric two-wheelers, smart battery swapping stations, and telemetry controllers across North and West India.",
    offers: "Extensive Tier-1 assembly capacity in Haryana and Rajasthan, fleet deployment partnerships with quick-commerce platforms.",
    seeking: "Japanese battery technology company specializing in ultra-safe Lithium Titanate (LTO) or solid-state cells capable of surviving 48°C ambient heat.",
    goals: "Bilateral joint venture to manufacture high-temperature-tolerant battery packs for commercial fleet delivery vehicles in India.",
    technologies: ["Clean energy", "IoT", "AI"],
    categories: [],
    capabilities: ["Battery pack assembly", "Fleet telemetry", "BMS tuning"],
    customers: ["Enterprises", "Retailers"],
    service_areas: ["Delhi", "Haryana", "Rajasthan", "Maharashtra"],
    experience_years: 24,
    fee_inr: 0,
    levels: [],
    online: true,
    in_person: true,
    pitch_path: null,
    qualification_verified: true,
    qualifications: "AIS-156 Phase 2 EV Battery Certified",
    updated_at: new Date().toISOString(),
  },
];

export const DEFAULT_HUB_PROFILES: Record<Hub, HubProfile[]> = {
  jv: DEFAULT_JV_PROFILES,
  distribution: [],
  tutoring: [],
};

export const hubProfilesQuery = (hub: Hub) =>
  queryOptions({
    queryKey: ["hub-profiles", hub],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hub_profiles")
        .select("*")
        .eq("hub", hub)
        .order("updated_at", { ascending: false });
      if (error) {
        console.warn("Could not fetch hub profiles from Supabase, using defaults:", error.message);
        return DEFAULT_HUB_PROFILES[hub] ?? [];
      }
      const list = data ?? [];
      const existingNames = new Set(list.map((p) => p.name.toLowerCase()));
      const defaults = (DEFAULT_HUB_PROFILES[hub] ?? []).filter((d) => !existingNames.has(d.name.toLowerCase()));
      return [...list, ...defaults];
    },
  });
export const slotsQuery = queryOptions({
  queryKey: ["tutor-slots"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("tutor_slots")
      .select("*")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at");
    if (error) throw error;
    return data;
  },
});
export const requestsQuery = queryOptions({
  queryKey: ["hub-requests"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("hub_requests")
      .select(
        "*, from:profiles!hub_requests_from_user_fkey(full_name,company_name), to:profiles!hub_requests_to_user_fkey(full_name,company_name)",
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});
export type MatchNeeds = {
  industry?: string | undefined;
  category?: string | undefined;
  states?: string[] | undefined;
  customers?: string[] | undefined;
  capabilities?: string[] | undefined;
  technologies?: string[] | undefined;
  language?: string | undefined;
  level?: string | undefined;
  budget?: number | undefined;
  mode?: string | undefined;
};
export function matchReasons(
  p: Pick<
    HubProfile,
    | "industry"
    | "categories"
    | "service_areas"
    | "customers"
    | "capabilities"
    | "technologies"
    | "levels"
    | "fee_inr"
    | "online"
    | "in_person"
  >,
  n: MatchNeeds,
) {
  const reasons: string[] = [];
  if (n.industry && p.industry === n.industry) reasons.push("Industry expertise");
  if (n.category && p.categories.includes(n.category)) reasons.push("Product expertise");
  if (n.states?.some((s) => p.service_areas.includes(s) || p.service_areas.includes("Nationwide")))
    reasons.push("Target region coverage");
  if (n.customers?.some((s) => p.customers.includes(s))) reasons.push("Target customers");
  if (n.capabilities?.some((s) => p.capabilities.includes(s)))
    reasons.push("Distribution capabilities");
  if (n.technologies?.some((s) => p.technologies.includes(s))) reasons.push("Technology fit");
  if (n.language && p.categories.includes(n.language)) reasons.push("Language match");
  if (n.level && p.levels.includes(n.level)) reasons.push("Proficiency level");
  if (n.budget !== undefined && p.fee_inr <= n.budget) reasons.push("Within budget");
  return reasons;
}
export function allowedStatuses(hub: Hub, status: string, recipient: boolean) {
  if (status === "pending") return recipient ? ["accepted", "declined"] : ["cancelled"];
  if (["declined", "cancelled", "completed", "partnership_established"].includes(status)) return [];
  return hub === "tutoring"
    ? ["meeting_scheduled", "completed", "cancelled"]
    : ["in_discussion", "meeting_scheduled", "partnership_established", "cancelled"];
}
export const BUSINESS_EXAMPLES = [
  {
    name: "Nippon Enterprises South",
    city: "Chennai",
    industry: "Electronics & IT",
    categories: ["Musical instruments", "Medical imaging"],
    service_areas: ["Nationwide", "Tamil Nadu"],
    customers: [],
    capabilities: ["Dealer network", "After-sales service"],
    technologies: [],
    levels: [],
    fee_inr: 0,
    online: false,
    in_person: false,
    bio: "Musical instruments, pro audio and imaging distribution. The company reports 400+ dealers nationwide; medical imaging distribution and service in Tamil Nadu.",
    source: "https://nipponenterprises.in/",
  },
  {
    name: "Dataforce",
    city: "Mumbai, Pune & Ahmedabad",
    industry: "Electronics & IT",
    categories: ["Networking & IT"],
    service_areas: ["Maharashtra", "Gujarat"],
    customers: [],
    capabilities: ["Dealer network"],
    technologies: [],
    levels: [],
    fee_inr: 0,
    online: false,
    in_person: false,
    bio: "Networking products, wireless and switching equipment, structured cabling and rack-management solutions, focused on western India.",
    source: "https://dataforce.in/",
  },
  {
    name: "Win Win Distribution",
    city: "Southern India",
    industry: "Industrial Manufacturing",
    categories: ["Motors & drives"],
    service_areas: ["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu"],
    customers: [],
    capabilities: [],
    technologies: [],
    levels: [],
    fee_inr: 0,
    online: false,
    in_person: false,
    bio: "Industrial electromechanical products including motors, VFDs, pumps and gearboxes across four southern states.",
    source: "https://winwindistribution.in/",
  },
];
