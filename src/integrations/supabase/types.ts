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
      consultation_requests: {
        Row: {
          company_id: string
          company_name: string
          contact_name: string
          country: string
          created_at: string
          email: string
          expert_id: string | null
          expert_name: string
          fee_inr: number | null
          id: string
          industry: string
          location_notes: string | null
          mode: string
          preferred_date: string | null
          preferred_time: string | null
          problem_description: string | null
          reference: string
          services: string[]
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          company_name: string
          contact_name: string
          country: string
          created_at?: string
          email: string
          expert_id?: string | null
          expert_name: string
          fee_inr?: number | null
          id?: string
          industry: string
          location_notes?: string | null
          mode: string
          preferred_date?: string | null
          preferred_time?: string | null
          problem_description?: string | null
          reference?: string
          services?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          company_name?: string
          contact_name?: string
          country?: string
          created_at?: string
          email?: string
          expert_id?: string | null
          expert_name?: string
          fee_inr?: number | null
          id?: string
          industry?: string
          location_notes?: string | null
          mode?: string
          preferred_date?: string | null
          preferred_time?: string | null
          problem_description?: string | null
          reference?: string
          services?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_requests_expert_id_fkey"
            columns: ["expert_id"]
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
      expert_availability: {
        Row: {
          available_date: string
          expert_id: string
          id: string
          mode: string
          slots: string[]
        }
        Insert: {
          available_date: string
          expert_id: string
          id?: string
          mode?: string
          slots?: string[]
        }
        Update: {
          available_date?: string
          expert_id?: string
          id?: string
          mode?: string
          slots?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "expert_availability_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_profiles: {
        Row: {
          expert_id: string
          industries: string[]
          languages: string[]
          offers_in_person: boolean
          offers_online: boolean
          office_address: string | null
          office_city: string | null
          qualifications: string | null
          specializations: string[]
          updated_at: string
          verified: boolean
          years_experience: number | null
        }
        Insert: {
          expert_id: string
          industries?: string[]
          languages?: string[]
          offers_in_person?: boolean
          offers_online?: boolean
          office_address?: string | null
          office_city?: string | null
          qualifications?: string | null
          specializations?: string[]
          updated_at?: string
          verified?: boolean
          years_experience?: number | null
        }
        Update: {
          expert_id?: string
          industries?: string[]
          languages?: string[]
          offers_in_person?: boolean
          offers_online?: boolean
          office_address?: string | null
          office_city?: string | null
          qualifications?: string | null
          specializations?: string[]
          updated_at?: string
          verified?: boolean
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_profiles_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          request_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          request_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          request_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "hub_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_profiles: {
        Row: {
          bio: string
          capabilities: string[]
          categories: string[]
          city: string
          contact_email: string
          country: string
          customers: string[]
          experience_years: number
          fee_inr: number
          goals: string
          hub: string
          id: string
          in_person: boolean
          industry: string
          levels: string[]
          name: string
          offers: string
          online: boolean
          owner_id: string
          pitch_path: string | null
          qualification_verified: boolean
          qualifications: string
          seeking: string
          service_areas: string[]
          state: string
          technologies: string[]
          updated_at: string
        }
        Insert: {
          bio?: string
          capabilities?: string[]
          categories?: string[]
          city?: string
          contact_email?: string
          country?: string
          customers?: string[]
          experience_years?: number
          fee_inr?: number
          goals?: string
          hub: string
          id?: string
          in_person?: boolean
          industry?: string
          levels?: string[]
          name: string
          offers?: string
          online?: boolean
          owner_id: string
          pitch_path?: string | null
          qualification_verified?: boolean
          qualifications?: string
          seeking?: string
          service_areas?: string[]
          state?: string
          technologies?: string[]
          updated_at?: string
        }
        Update: {
          bio?: string
          capabilities?: string[]
          categories?: string[]
          city?: string
          contact_email?: string
          country?: string
          customers?: string[]
          experience_years?: number
          fee_inr?: number
          goals?: string
          hub?: string
          id?: string
          in_person?: boolean
          industry?: string
          levels?: string[]
          name?: string
          offers?: string
          online?: boolean
          owner_id?: string
          pitch_path?: string | null
          qualification_verified?: boolean
          qualifications?: string
          seeking?: string
          service_areas?: string[]
          state?: string
          technologies?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_profiles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_requests: {
        Row: {
          created_at: string
          details: Json
          from_user: string
          hub: string
          id: string
          meeting_at: string | null
          meeting_location: string | null
          meeting_mode: string | null
          message: string
          profile_id: string
          slot_id: string | null
          status: string
          subject: string
          to_user: string
        }
        Insert: {
          created_at?: string
          details?: Json
          from_user: string
          hub: string
          id?: string
          meeting_at?: string | null
          meeting_location?: string | null
          meeting_mode?: string | null
          message: string
          profile_id: string
          slot_id?: string | null
          status?: string
          subject: string
          to_user: string
        }
        Update: {
          created_at?: string
          details?: Json
          from_user?: string
          hub?: string
          id?: string
          meeting_at?: string | null
          meeting_location?: string | null
          meeting_mode?: string | null
          message?: string
          profile_id?: string
          slot_id?: string | null
          status?: string
          subject?: string
          to_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_requests_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "hub_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_requests_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "tutor_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_requests_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      tutor_slots: {
        Row: {
          duration_minutes: number
          id: string
          mode: string
          starts_at: string
          tutor_id: string
        }
        Insert: {
          duration_minutes?: number
          id?: string
          mode?: string
          starts_at: string
          tutor_id: string
        }
        Update: {
          duration_minutes?: number
          id?: string
          mode?: string
          starts_at?: string
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_slots_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "hub_profiles"
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
