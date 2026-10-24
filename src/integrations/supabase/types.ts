export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      connection_requests: {
        Row: {
          created_at: string
          from_user: string
          id: string
          kind: string
          message: string | null
          status: string
          to_user: string
        }
        Insert: {
          created_at?: string
          from_user: string
          id?: string
          kind: string
          message?: string | null
          status?: string
          to_user: string
        }
        Update: {
          created_at?: string
          from_user?: string
          id?: string
          kind?: string
          message?: string | null
          status?: string
          to_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_requests_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_requests_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      distributors: {
        Row: {
          categories: string[]
          city: string
          contact_email: string | null
          id: string
          name: string
          phone: string | null
          state: string
          years_active: number | null
        }
        Insert: {
          categories?: string[]
          city: string
          contact_email?: string | null
          id?: string
          name: string
          phone?: string | null
          state: string
          years_active?: number | null
        }
        Update: {
          categories?: string[]
          city?: string
          contact_email?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string
          years_active?: number | null
        }
        Relationships: []
      }
      jv_proposals: {
        Row: {
          created_at: string
          description: string
          id: string
          industry: string | null
          investment_range: string | null
          owner_id: string
          seeking: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          industry?: string | null
          investment_range?: string | null
          owner_id: string
          seeking: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          industry?: string | null
          investment_range?: string | null
          owner_id?: string
          seeking?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "jv_proposals_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_state_popularity: {
        Row: {
          category: string
          id: string
          insight: string | null
          score: number
          state: string
        }
        Insert: {
          category: string
          id?: string
          insight?: string | null
          score: number
          state: string
        }
        Update: {
          category?: string
          id?: string
          insight?: string | null
          score?: number
          state?: string
        }
        Relationships: []
      }
      profile_ai_access_state: {
        Row: {
          id: string
          message: string
          status: number
          updated_at: string
        }
        Insert: {
          id: string
          message: string
          status: number
          updated_at?: string
        }
        Update: {
          id?: string
          message?: string
          status?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string | null
          bio: string | null
          city: string | null
          company_name: string | null
          created_at: string
          expert_type: string | null
          full_name: string | null
          id: string
          industry: string | null
          rate_inr: number | null
          state: string | null
        }
        Insert: {
          account_type?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          expert_type?: string | null
          full_name?: string | null
          id: string
          industry?: string | null
          rate_inr?: number | null
          state?: string | null
        }
        Update: {
          account_type?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          expert_type?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          rate_inr?: number | null
          state?: string | null
        }
        Relationships: []
      }
      provider_listings: {
        Row: {
          assessed_at: string | null
          assessment: Json | null
          bio: string
          city: string
          email: string
          experience_years: number
          full_name: string
          id: string
          industry: string
          organization: string
          phone: string
          resume_path: string | null
          score: number | null
          section: string
          specialization: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessed_at?: string | null
          assessment?: Json | null
          bio: string
          city: string
          email: string
          experience_years: number
          full_name: string
          id?: string
          industry: string
          organization?: string
          phone: string
          resume_path?: string | null
          score?: number | null
          section: string
          specialization: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assessed_at?: string | null
          assessment?: Json | null
          bio?: string
          city?: string
          email?: string
          experience_years?: number
          full_name?: string
          id?: string
          industry?: string
          organization?: string
          phone?: string
          resume_path?: string | null
          score?: number | null
          section?: string
          specialization?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          answers: Json
          created_at: string
          dealer_id: string
          id: string
          paid_at: string | null
          payout_status: string
          survey_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          dealer_id: string
          id?: string
          paid_at?: string | null
          payout_status?: string
          survey_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          dealer_id?: string
          id?: string
          paid_at?: string | null
          payout_status?: string
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          questions: Json
          reward_inr: number
          status: string
          title: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          questions?: Json
          reward_inr?: number
          status?: string
          title: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          questions?: Json
          reward_inr?: number
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "surveys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      save_provider_listing: { Args: { payload: Json }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
