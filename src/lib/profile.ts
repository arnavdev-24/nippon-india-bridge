import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;

export const ACCOUNT_TYPES = {
  japanese_company: "Japanese company",
  indian_company: "Indian company",
  expert: "Expert (CA / CS / Tutor)",
  dealer: "Dealer / Vendor",
} as const;

export const EXPERT_TYPES = {
  ca: "Chartered Accountant",
  cs: "Company Secretary",
  japanese_tutor: "Japanese tutor",
  hindi_tutor: "Hindi tutor",
} as const;

export const myProfileQuery = queryOptions({
  queryKey: ["my-profile"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const { data, error } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const useMyProfile = () => useQuery(myProfileQuery);

export const isCompany = (p?: Profile | null) =>
  p?.account_type === "japanese_company" || p?.account_type === "indian_company";
