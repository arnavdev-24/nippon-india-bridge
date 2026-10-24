export const AGRI_SOLUTIONS = ["Precision farming", "Smart irrigation", "Water conservation", "Soil health", "Organic farming", "Renewable-energy agriculture", "Agri-waste recycling", "Climate-smart farming"] as const;
export const AGRI_PARTNER_TYPES = ["Agritech startup", "Farm / FPO", "Agri supplier", "Research institution"] as const;
export const CROPS = ["Rice", "Wheat", "Sugarcane", "Cotton", "Vegetables", "Fruits", "Pulses", "Tea", "Spices"] as const;
export const COLLAB = ["Pilot project", "Distribution", "Joint R&D", "Field trials", "Licensing", "Supplier"] as const;

export type AgriPartner = { id: string; name: string; type: string; state: string; city: string; crops: string[]; solutions: string[]; technologies: string[]; capabilities: string[]; collab: string[]; bio: string };

const p = (id: string, name: string, type: string, state: string, city: string, crops: string[], solutions: string[], technologies: string[], capabilities: string[], collab: string[], bio: string): AgriPartner =>
  ({ id, name, type, state, city, crops, solutions, technologies, capabilities, collab, bio });

/** Fictional demo profiles — not real organisations. */
export const AGRI_PARTNERS: AgriPartner[] = [
  p("ag1", "Krishi Drishti Analytics (Demo)", "Agritech startup", "Karnataka", "Bengaluru", ["Rice", "Vegetables"], ["Precision farming", "Climate-smart farming"], ["Drone imaging", "Satellite NDVI"], ["Crop health analytics", "Yield forecasting"], ["Pilot project", "Joint R&D"], "Drone and satellite crop-health monitoring for smallholder clusters."),
  p("ag2", "JalSetu Irrigation (Demo)", "Agritech startup", "Maharashtra", "Nashik", ["Fruits", "Vegetables", "Sugarcane"], ["Smart irrigation", "Water conservation"], ["IoT soil-moisture sensors", "Drip automation"], ["Field installation", "Farmer training"], ["Pilot project", "Distribution"], "Sensor-driven drip irrigation for grape and onion growers."),
  p("ag3", "Punjab Progressive Farmers FPO (Demo)", "Farm / FPO", "Punjab", "Ludhiana", ["Wheat", "Rice"], ["Agri-waste recycling", "Climate-smart farming"], ["Happy seeder", "Direct seeded rice"], ["Field trial land", "1,200 member farmers"], ["Field trials", "Pilot project"], "Farmer producer organisation seeking alternatives to stubble burning."),
  p("ag4", "Suryakhet Solar Pumps (Demo)", "Agri supplier", "Rajasthan", "Jaipur", ["Wheat", "Pulses"], ["Renewable-energy agriculture", "Water conservation"], ["Solar pumps", "Remote monitoring"], ["Manufacturing", "Service network"], ["Supplier", "Distribution"], "Solar water pumps and controllers for arid-zone farms."),
  p("ag5", "Bhoomi Soil Labs (Demo)", "Research institution", "Uttar Pradesh", "Kanpur", ["Wheat", "Sugarcane", "Pulses"], ["Soil health", "Organic farming"], ["Soil spectroscopy", "Bio-fertilisers"], ["Lab testing", "Field research"], ["Joint R&D", "Field trials"], "Soil-testing and bio-input research for the Indo-Gangetic plain."),
  p("ag6", "Nilgiri Organic Collective (Demo)", "Farm / FPO", "Tamil Nadu", "Coonoor", ["Tea", "Spices", "Vegetables"], ["Organic farming", "Soil health"], ["Compost systems", "Traceability"], ["Certified organic acreage", "Export packing"], ["Pilot project", "Supplier"], "Hill-farm cooperative growing certified organic tea and spices."),
  p("ag7", "AgroCycle Biochar (Demo)", "Agritech startup", "Haryana", "Karnal", ["Rice", "Wheat"], ["Agri-waste recycling", "Soil health"], ["Biochar pyrolysis", "Residue baling"], ["Plant operation", "Carbon accounting"], ["Pilot project", "Licensing"], "Converts paddy straw into biochar and pellets."),
  p("ag8", "Godavari Rice Research Station (Demo)", "Research institution", "Andhra Pradesh", "Rajahmundry", ["Rice", "Pulses"], ["Climate-smart farming", "Water conservation"], ["AWD irrigation", "Stress-tolerant varieties"], ["Field research", "Extension services"], ["Joint R&D", "Field trials"], "Research on alternate wetting and drying to cut water and methane."),
  p("ag9", "Kisan Yantra Supplies (Demo)", "Agri supplier", "Gujarat", "Rajkot", ["Cotton", "Pulses"], ["Precision farming", "Smart irrigation"], ["Precision seeders", "Sprayers"], ["Dealer network", "Manufacturing"], ["Distribution", "Supplier"], "Farm equipment distributor with 300 rural dealers."),
  p("ag10", "Bengal Delta Agri Hub (Demo)", "Farm / FPO", "West Bengal", "Bardhaman", ["Rice", "Vegetables"], ["Climate-smart farming", "Renewable-energy agriculture"], ["Solar cold storage"], ["Aggregation", "Field trial land"], ["Field trials", "Pilot project"], "Paddy and vegetable aggregation with solar cold chain needs."),
  p("ag11", "Telangana Agri Data Lab (Demo)", "Agritech startup", "Telangana", "Hyderabad", ["Cotton", "Rice"], ["Precision farming", "Climate-smart farming"], ["Weather AI", "Pest prediction"], ["Advisory app", "Data science"], ["Joint R&D", "Licensing"], "AI-based pest and weather advisories delivered by SMS."),
  p("ag12", "Madhya Organic Inputs (Demo)", "Agri supplier", "Madhya Pradesh", "Indore", ["Pulses", "Wheat"], ["Organic farming", "Soil health"], ["Vermicompost", "Bio-pesticides"], ["Manufacturing", "Dealer network"], ["Supplier", "Distribution"], "Organic inputs manufacturer for soybean and pulse belts."),
];

export type AgriNeeds = { solution?: string | undefined; crop?: string | undefined; state?: string | undefined; type?: string | undefined; collab?: string | undefined; keyword?: string | undefined };

/** Transparent rule-based score (0-100) with reasons; simulated, not a validation. */
export function agriMatch(pt: AgriPartner, n: AgriNeeds) {
  const checks: [boolean | undefined, string, number][] = [
    [n.solution ? pt.solutions.includes(n.solution) : undefined, `Offers ${n.solution}`, 30],
    [n.crop ? pt.crops.includes(n.crop) : undefined, `Works with ${n.crop}`, 20],
    [n.state ? pt.state === n.state : undefined, `Located in ${n.state}`, 15],
    [n.type ? pt.type === n.type : undefined, `Is a ${n.type}`, 15],
    [n.collab ? pt.collab.includes(n.collab) : undefined, `Open to ${n.collab}`, 20],
  ];
  const kw = n.keyword?.trim().toLowerCase();
  if (kw) checks.push([[...pt.technologies, ...pt.capabilities, pt.bio].join(" ").toLowerCase().includes(kw), `Mentions “${n.keyword}”`, 15]);
  const used = checks.filter((c) => c[0] !== undefined);
  const total = used.reduce((s, c) => s + c[2], 0);
  const got = used.filter((c) => c[0]).reduce((s, c) => s + c[2], 0);
  return { score: total ? Math.round((got / total) * 100) : 0, reasons: used.filter((c) => c[0]).map((c) => c[1]) };
}

export const AGRI_REGIONS: { state: string; crops: string; need: string; tech: string }[] = [
  { state: "Punjab", crops: "Wheat, rice", need: "Stubble burning, groundwater depletion", tech: "Residue recycling, DSR" },
  { state: "Haryana", crops: "Rice, wheat", need: "Crop residue, water tables", tech: "Biochar, smart irrigation" },
  { state: "Rajasthan", crops: "Pulses, millets", need: "Water scarcity", tech: "Solar pumps, drip" },
  { state: "Gujarat", crops: "Cotton, groundnut", need: "Input efficiency", tech: "Precision seeding" },
  { state: "Maharashtra", crops: "Sugarcane, grapes, onion", need: "Irrigation demand", tech: "Drip automation" },
  { state: "Madhya Pradesh", crops: "Soybean, pulses", need: "Soil fertility", tech: "Organic inputs" },
  { state: "Uttar Pradesh", crops: "Sugarcane, wheat", need: "Soil degradation", tech: "Soil testing, bio-inputs" },
  { state: "West Bengal", crops: "Rice, vegetables", need: "Post-harvest loss", tech: "Solar cold storage" },
  { state: "Telangana", crops: "Cotton, rice", need: "Pest pressure", tech: "Weather & pest AI" },
  { state: "Andhra Pradesh", crops: "Rice, aquaculture", need: "Water & methane", tech: "AWD irrigation" },
  { state: "Karnataka", crops: "Millets, vegetables", need: "Climate variability", tech: "Drone monitoring" },
  { state: "Tamil Nadu", crops: "Tea, spices, rice", need: "Organic certification", tech: "Compost, traceability" },
];

export type AgriPilot = { id: string; title: string; theme: string; state: string; problem: string; budgetLakh: number; status: "open" | "partner_selected"; proposals: { id: string; partner: string; summary: string; costLakh: number; weeks: number }[]; selected?: string;
  impact: { waterKl: number; energyKwh: number; wasteT: number; co2T: number } };

export const SEED_AGRI_PILOTS: AgriPilot[] = [
  { id: "ap1", title: "Cut irrigation water on grape farms by 25%", theme: "Water usage", state: "Maharashtra", problem: "Flood irrigation on 200 acres; want sensor-based scheduling.", budgetLakh: 12, status: "partner_selected", selected: "pr1", proposals: [{ id: "pr1", partner: "JalSetu Irrigation (Demo)", summary: "Soil-moisture sensors + drip automation on 50-acre trial.", costLakh: 10, weeks: 16 }], impact: { waterKl: 18000, energyKwh: 9500, wasteT: 0, co2T: 7 } },
  { id: "ap2", title: "Turn paddy straw into value instead of burning", theme: "Crop waste", state: "Punjab", problem: "3,000 t straw per season burnt across FPO villages.", budgetLakh: 25, status: "open", proposals: [{ id: "pr2", partner: "AgroCycle Biochar (Demo)", summary: "Mobile baling + biochar unit for 500 t pilot.", costLakh: 22, weeks: 20 }], impact: { waterKl: 0, energyKwh: 0, wasteT: 500, co2T: 650 } },
  { id: "ap3", title: "Restore soil organic carbon in sugarcane belt", theme: "Soil degradation", state: "Uttar Pradesh", problem: "Declining yields; soil organic carbon below 0.4%.", budgetLakh: 8, status: "open", proposals: [], impact: { waterKl: 2000, energyKwh: 0, wasteT: 120, co2T: 40 } },
];

export const IMPACT_KEYS = [["waterKl", "Water saved", "kL"], ["energyKwh", "Energy reduced", "kWh"], ["wasteT", "Agri waste recycled", "t"], ["co2T", "Emissions avoided", "t CO₂e"]] as const;
export function impactTotals(pilots: AgriPilot[], onlyActive = true) {
  const list = onlyActive ? pilots.filter((x) => x.status === "partner_selected") : pilots;
  return { waterKl: 0, energyKwh: 0, wasteT: 0, co2T: 0, ...Object.fromEntries(IMPACT_KEYS.map(([k]) => [k, list.reduce((s, x) => s + x.impact[k], 0)])) } as AgriPilot["impact"];
}
