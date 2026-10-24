import { z } from "zod";

export const SECTIONS = {
  advisors: { title: "Indian tax & compliance professionals", singular: "professional", types: ["Chartered Accountant", "Company Secretary"] },
  "joint-ventures": { title: "Indian joint venture partners", singular: "business", types: [] },
  distributors: { title: "Registered Indian distributors", singular: "distributor", types: [] },
  tutors: { title: "Indian language trainers", singular: "tutor", types: ["Japanese tutor", "Hindi tutor"] },
  surveys: { title: "Indian dealers & vendors", singular: "dealer / vendor", types: [] },
} as const;
export type ProviderSection = keyof typeof SECTIONS;
export function canRegister(section: ProviderSection, account?: string | null) {
  if (section === "advisors" || section === "tutors") return account === "expert";
  if (section === "joint-ventures") return account === "indian_company";
  if (section === "surveys") return account === "dealer";
  return account === "indian_company" || account === "dealer";
}
const required = (max: number) => z.string().trim().min(1, "This field is required").max(max);
export const registrationSchema = z.object({
  section: z.enum(["advisors", "joint-ventures", "distributors", "tutors", "surveys"]),
  country: z.literal("India"), full_name: required(100), organization: z.string().trim().max(150),
  specialization: required(150), experience_years: z.coerce.number().int().min(0).max(80),
  industry: required(150), city: required(100), state: required(100),
  email: z.string().trim().email().max(255), phone: z.string().trim().min(7).max(30).regex(/^[+0-9() -]+$/, "Enter a valid phone number"),
  bio: z.string().trim().min(20, "Add at least 20 characters about your experience").max(4000),
  resume_path: z.string().max(250).nullable(),
}).superRefine((p, ctx) => {
  const options: readonly string[] = SECTIONS[p.section].types;
  if (options.length && !options.includes(p.specialization)) ctx.addIssue({ code: "custom", path: ["specialization"], message: "Select a matching specialization" });
});
export const assessmentSchema = z.object({
  score: z.number().min(0).max(10), summary: z.string().min(1).max(1500),
  strengths: z.array(z.string().max(500)).max(5), gaps: z.array(z.string().max(500)).max(5),
  resume_considered: z.boolean(),
});
export function validateResume(file: { size: number; name: string; type: string }) {
  if (!file.name.toLowerCase().endsWith(".pdf") || file.type !== "application/pdf") throw new Error("Upload a PDF résumé");
  if (file.size > 5 * 1024 * 1024) throw new Error("Your résumé must be 5 MB or smaller");
}