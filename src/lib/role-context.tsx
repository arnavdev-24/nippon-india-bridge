import React, { createContext, useContext, useEffect, useState } from "react";
import { useMyProfile, ACCOUNT_TYPES } from "@/lib/profile";

export type AppRole = "japanese_company" | "indian_company" | "expert";

export interface RoleContextValue {
  effectiveRole: AppRole;
  previewRole: AppRole | null;
  setPreviewRole: (role: AppRole | null) => void;
  isOverridden: boolean;
  actualRole: AppRole;
  roleLabel: string;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = "nippon_demo_preview_role";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { data: profile } = useMyProfile();

  // Normalize actual user role
  const rawRole = profile?.account_type;
  const actualRole: AppRole =
    rawRole === "indian_company" || rawRole === "dealer"
      ? "indian_company"
      : rawRole === "expert"
      ? "expert"
      : "japanese_company";

  const [previewRole, setPreviewRoleState] = useState<AppRole | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved === "japanese_company" || saved === "indian_company" || saved === "expert") {
        return saved;
      }
    } catch {
      // ignore storage error
    }
    return null;
  });

  const setPreviewRole = (role: AppRole | null) => {
    setPreviewRoleState(role);
    try {
      if (role) {
        sessionStorage.setItem(STORAGE_KEY, role);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage error
    }
  };

  const effectiveRole: AppRole = previewRole || actualRole;
  const isOverridden = previewRole !== null && previewRole !== actualRole;

  const roleLabel =
    effectiveRole === "japanese_company"
      ? "Japanese SME"
      : effectiveRole === "indian_company"
      ? "Indian Partner"
      : "Expert / Tutor";

  return (
    <RoleContext.Provider
      value={{
        effectiveRole,
        previewRole,
        setPreviewRole,
        isOverridden,
        actualRole,
        roleLabel,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      effectiveRole: "japanese_company" as AppRole,
      previewRole: null,
      setPreviewRole: () => {},
      isOverridden: false,
      actualRole: "japanese_company" as AppRole,
      roleLabel: "Japanese SME",
    };
  }
  return context;
}
