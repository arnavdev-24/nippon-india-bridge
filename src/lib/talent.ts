export const TALENT_INDUSTRIES = ["Semiconductors", "AI", "Green technology", "Electronics", "Software", "Manufacturing"] as const;
export const EXPERIENCE_LEVELS = { Junior: [0, 2], "Mid-level": [3, 5], Senior: [6, 10], Lead: [11, 40] } as const;
export const EDUCATION = ["Diploma", "B.Tech / B.E.", "M.Tech / M.S.", "MBA", "PhD"] as const;
export const JLPT = ["None", "N5", "N4", "N3", "N2", "N1"] as const;
export const EMPLOYMENT = ["Full-time", "Contract", "Remote", "Relocation to Japan"] as const;

export type Candidate = { id: string; name: string; headline: string; industry: string; skills: string[]; education: string; qualifications: string; years: number; location: string; jlpt: string; english: string; salaryLakh: number; availability: string; employment: string[] };

const c = (id: string, name: string, headline: string, industry: string, skills: string[], education: string, qualifications: string, years: number, location: string, jlpt: string, english: string, salaryLakh: number, availability: string, employment: string[]): Candidate =>
  ({ id, name, headline, industry, skills, education, qualifications, years, location, jlpt, english, salaryLakh, availability, employment });

/** Fictional demo candidates — not real people. */
export const CANDIDATES: Candidate[] = [
  c("t1", "Ananya Rao (Demo)", "Analog/mixed-signal IC design engineer", "Semiconductors", ["Analog design", "Cadence Virtuoso", "SPICE", "Layout"], "M.Tech / M.S.", "M.Tech VLSI (self-reported)", 6, "Bengaluru", "N4", "Fluent", 28, "1 month notice", ["Full-time", "Relocation to Japan"]),
  c("t2", "Rohit Verma (Demo)", "Physical design & STA engineer", "Semiconductors", ["Physical design", "STA", "Synopsys ICC2", "Tcl"], "B.Tech / B.E.", "B.Tech ECE (self-reported)", 4, "Hyderabad", "None", "Fluent", 20, "Immediate", ["Full-time", "Remote"]),
  c("t3", "Kavya Menon (Demo)", "Computer-vision ML engineer", "AI", ["Python", "PyTorch", "Computer vision", "MLOps"], "M.Tech / M.S.", "MS Computer Science (self-reported)", 5, "Pune", "N3", "Fluent", 26, "2 months notice", ["Full-time", "Remote", "Relocation to Japan"]),
  c("t4", "Arjun Singh (Demo)", "NLP / LLM engineer", "AI", ["Python", "NLP", "LLM fine-tuning", "LangChain"], "B.Tech / B.E.", "B.Tech CSE (self-reported)", 3, "Noida", "N5", "Fluent", 18, "Immediate", ["Remote", "Contract"]),
  c("t5", "Priya Iyer (Demo)", "AI research scientist, robotics perception", "AI", ["Python", "ROS", "Computer vision", "Research"], "PhD", "PhD Robotics (self-reported)", 8, "Chennai", "N2", "Fluent", 40, "3 months notice", ["Full-time", "Relocation to Japan"]),
  c("t6", "Vikram Patel (Demo)", "Solar EPC project engineer", "Green technology", ["Solar PV design", "PVsyst", "AutoCAD", "Project management"], "B.Tech / B.E.", "B.Tech Electrical (self-reported)", 7, "Ahmedabad", "None", "Good", 16, "1 month notice", ["Full-time", "Contract"]),
  c("t7", "Sneha Kulkarni (Demo)", "Battery systems engineer", "Green technology", ["Battery management systems", "Embedded C", "MATLAB", "Cell testing"], "M.Tech / M.S.", "M.Tech Energy Systems (self-reported)", 5, "Pune", "N4", "Fluent", 22, "Immediate", ["Full-time", "Relocation to Japan"]),
  c("t8", "Mohammed Faiz (Demo)", "Embedded hardware engineer", "Electronics", ["Embedded C", "PCB design", "Altium", "RTOS"], "B.Tech / B.E.", "B.Tech ECE (self-reported)", 6, "Kochi", "N3", "Fluent", 19, "1 month notice", ["Full-time", "Remote"]),
  c("t9", "Divya Sharma (Demo)", "EMS quality & test engineer", "Electronics", ["ATE testing", "Six Sigma", "IPC-A-610", "Root cause analysis"], "Diploma", "Diploma Electronics (self-reported)", 9, "Noida", "N5", "Good", 12, "Immediate", ["Full-time"]),
  c("t10", "Karthik Reddy (Demo)", "Full-stack software engineer", "Software", ["TypeScript", "React", "Node.js", "AWS"], "B.Tech / B.E.", "B.Tech IT (self-reported)", 4, "Hyderabad", "N2", "Fluent", 21, "Immediate", ["Remote", "Full-time", "Relocation to Japan"]),
  c("t11", "Neha Joshi (Demo)", "SAP & ERP consultant", "Software", ["SAP S/4HANA", "SQL", "Business analysis"], "MBA", "MBA Operations (self-reported)", 11, "Mumbai", "N1", "Fluent", 35, "2 months notice", ["Full-time", "Contract"]),
  c("t12", "Suresh Kumar (Demo)", "Production engineer, lean manufacturing", "Manufacturing", ["Lean manufacturing", "Kaizen", "CNC", "5S"], "B.Tech / B.E.", "B.Tech Mechanical (self-reported)", 12, "Chennai", "N3", "Good", 18, "1 month notice", ["Full-time", "Relocation to Japan"]),
  c("t13", "Pooja Nair (Demo)", "Robotics automation engineer", "Manufacturing", ["PLC programming", "Industrial robotics", "Python", "SCADA"], "M.Tech / M.S.", "M.Tech Mechatronics (self-reported)", 5, "Bengaluru", "N4", "Fluent", 20, "Immediate", ["Full-time", "Contract"]),
];

export type Requirements = { industry?: string | undefined; skills: string[]; level?: keyof typeof EXPERIENCE_LEVELS | undefined; education?: string | undefined; location?: string | undefined; jlpt?: string | undefined; employment?: string | undefined; salaryMax?: number | undefined };

export const allSkills = () => [...new Set(CANDIDATES.flatMap((x) => x.skills))].sort();

/** Simulated, transparent score. Weights: skills 45, experience 20, language 15, industry 10, other 10. */
export function matchCandidate(cd: Candidate, r: Requirements) {
  const matching = r.skills.filter((s) => cd.skills.includes(s));
  const missing = r.skills.filter((s) => !cd.skills.includes(s));
  let exp: "Matches" | "Below" | "Above" | "Any" = "Any";
  if (r.level) { const [lo, hi] = EXPERIENCE_LEVELS[r.level]; exp = cd.years < lo ? "Below" : cd.years > hi ? "Above" : "Matches"; }
  const need = r.jlpt ? JLPT.indexOf(r.jlpt as (typeof JLPT)[number]) : 0;
  const has = JLPT.indexOf(cd.jlpt as (typeof JLPT)[number]);
  const lang = !r.jlpt || r.jlpt === "None" ? "Any" : has >= need ? "Meets" : "Below";
  const parts: [number, number][] = [
    [r.skills.length ? matching.length / r.skills.length : 1, 45],
    [exp === "Matches" || exp === "Any" ? 1 : exp === "Above" ? 0.8 : 0.3, 20],
    [lang === "Below" ? Math.max(0, has) / Math.max(1, need) * 0.7 : 1, 15],
    [!r.industry || r.industry === cd.industry ? 1 : 0, 10],
    [[!r.education || r.education === cd.education, !r.location || cd.location === r.location, !r.employment || cd.employment.includes(r.employment), r.salaryMax === undefined || cd.salaryLakh <= r.salaryMax].filter(Boolean).length / 4, 10],
  ];
  const score = Math.round(parts.reduce((s, [v, w]) => s + v * w, 0));
  return { score, matching, missing, exp, lang };
}
