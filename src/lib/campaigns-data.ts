import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { CustomQuestion, ResponseRow } from "@/lib/campaigns";

export type Campaign = Tables<"survey_campaigns">;
export const questionsOf = (c: Pick<Campaign, "custom_questions">) => (Array.isArray(c.custom_questions) ? (c.custom_questions as unknown as CustomQuestion[]) : []);

export const INDUSTRIES = ["Agri-machinery", "Automotive & Mobility", "Consumer Goods & Retail", "Electronics", "Food & Beverage", "Healthcare & Medical Devices", "Industrial Equipment", "Footwear & Apparel", "Other"];
export const INDIAN_STATES = ["Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Haryana", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];

export async function fetchCampaign(id: string) {
  const { data, error } = await supabase.from("survey_campaigns").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchResponses(campaignId: string) {
  const { data, error } = await supabase.from("campaign_responses").select("*").eq("campaign_id", campaignId).order("created_at");
  if (error) throw error;
  return data.map((r) => ({ ...r, answers: (r.answers ?? {}) as Record<string, unknown> })) as (ResponseRow & { source: string; created_at: string })[];
}

/** Returns contacts only where policy allows (vendor always; SME after delivery). */
export async function fetchContacts(campaignId: string) {
  const { data } = await supabase.from("campaign_response_contacts").select("*").eq("campaign_id", campaignId);
  return new Map((data ?? []).map((c) => [c.response_id, c]));
}

export async function photoUrl(path: string | null) {
  if (!path) return null;
  const { data } = await supabase.storage.from("campaign-photos").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}

export const surveyLink = (token: string) => (typeof window === "undefined" ? "" : `${window.location.origin}/s/${token}`);

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function downloadSheet(rows: (string | number)[][], sheet: string, filename: string) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = (rows[0] ?? []).map(() => ({ wch: 26 }));
  XLSX.utils.book_append_sheet(wb, ws, sheet);
  const out = XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
  downloadBlob(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), filename);
}

export async function readSheet(file: File) {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const name = wb.SheetNames.find((n) => (XLSX.utils.sheet_to_json(wb.Sheets[n]!) as unknown[]).length > 0) ?? wb.SheetNames[0]!;
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[name]!, { defval: "" });
}
